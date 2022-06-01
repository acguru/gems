const Folder = require("../models/folder");
const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const Gem = require("../models/gems");

/**
 * @route POST folder/createupdate
 * @desc Create a new folder
 * @param {String} req.body.text - Folder name
 * @param {String} req.body.offlineID - Folder's offline ID, in case it was created while offline
 * @returns {Folder} Newly created folder
 */
router.post("/folder/createupdate", auth, async (req, res) => {
  const params = req.body;
  let newdata = new Folder();
  if (params.status) {
    newdata.status = params.status;
  }
  if (params.text) {
    newdata.text = params.text;
  }
  if (params.offlineID) {
    newdata._id = params.offlineID;
  }
  newdata.items = [];
  await newdata.save();

  return res.send(newdata);
});

/**
 * @route POST folder/rename
 * @desc Rename a folder
 * @param {String} req.body.id - Folder id
 * @param {String} req.body.text - Folder new name
 * @returns {Folder} Updated folder
 */
router.post("/folder/rename", async (req, res) => {
  const params = req.body;
  let newdata = await Folder.findById(params.id).exec();
  newdata.text = params.text;
  await newdata.save();
  return res.send(newdata);
});

/**
 * @route POST file/rename
 * @desc Rename a file
 * @param {String} req.body.id - id of the folder in which the file is located
 * @param {String} req.body.text - file new name
 * @param {String} req.body.previousname - file previous name
 * @returns {Object} Updated folder
 * @returns {String} message - error message if file name already exists
 */
router.post("/file/rename", async (req, res) => {
  const params = req.body;

  // if file name is already in use, return error message
  const count = await Folder.countDocuments({
    "items.path": `/${params.newname.split(" ").join("").toLowerCase()}`,
  }).exec();
  if (count > 0) {
    return res.json({ message: "This file name already exists." });
  }

  // if file name is not in use, rename file
  let newdata = await Folder.findById(params.id).exec();
  newdata.items.map(async (e) => {
    if (e.text === params.previousname) {
      e.text = params.newname;
      e.path = `/${params.newname.split(" ").join("").toLowerCase()}`;
      await newdata.save();
    }
  });

  // move gems to new file by changing their globe.path
  let gems = await Gem.find({ folder: params.id }).exec();
  for (let i = 0; i < gems.length; i++) {
    for (let j = 0; j < gems[i].globe.length; j++) {
      if (
        gems[i].globe[j].path ===
        `/${params.previousname.split(" ").join("").toLowerCase()}`
      ) {
        gems[i].globe[j].path = `/${params.newname
          .split(" ")
          .join("")
          .toLowerCase()}`;
        await gems[i].save();
      }
    }
  }

  return res.send(newdata);
});

/**
 * @route POST file/createupdate
 * @desc Create a new file
 * @param {String} req.body.id - Parent folder id
 * @param {String} req.body.text - File name
 * @param {String} req.body.offlineID - File's offline ID, in case it was created while offline
 * @returns {Folder} Updated folder
 * @returns {String} message - error message if file name is already in use
 */
router.post("/file/createupdate", auth, async (req, res) => {
  const params = req.body;

  // if file name is already in use, return error message
  const count = await Folder.countDocuments({
    "items.path": `/${params.filename.split(" ").join("").toLowerCase()}`,
  }).exec();

  if (count > 0) {
    return res.json({ message: "This file name already exists." });
  }

  // if file name is not in use, create file
  let newdata = await Folder.findById(params.id).exec();
  if (params.status) {
    newdata.status = params.status;
  }
  if (params.text) {
    newdata.text = params.text;
  }
  let obj = {
    text: params.filename,
    path: `/${params.filename.split(" ").join("").toLowerCase()}`,
  };
  if (params.offlineID) {
    obj._id = params.offlineID;
  }
  newdata.items.push(obj);
  await newdata.save();

  return res.send(newdata);
});

/**
 * @route GET folder/list
 * @desc Get all folders
 * @returns {Folder[]} All folders
 */
router.get("/folder/list", auth, async (req, res) => {
  const items = await Folder.find({}).lean({ virtuals: true }).exec();
  return res.send(items);
});

/**
 * @route POST folder/delete
 * @desc Delete a folder
 * @param {String} req.body.id - Folder id
 * @returns {responseStatus} response status
 * @returns {String} message - error message if folder with id doesn't exist
 */
router.post("/folder/delete", auth, async (req, res) => {
  const folder = await Folder.findById(req.body.id);
  if (!folder)
    return res.json({ message: "Folder not found." });
  await folder.remove();
  return res.sendStatus(200);
});

/**
 * @route POST file/delete
 * @desc Delete a file
 * @param {String} req.body.id - Parent folder id
 * @param {String} req.body.filename - File name
 * @returns {responseStatus} response status
 */
router.post("/file/delete", auth, async (req, res) => {
  Folder.updateMany(
    { _id: req.body.id },
    { $pull: { items: { text: req.body.filename } } },
    { safe: true, multi: true },
    function (err, obj) {
      if (obj) {
        Gem.updateMany(
          {
            "globe.path": `/${req.body.filename
              .split(" ")
              .join("")
              .toLowerCase()}`,
          },
          {
            $pull: {
              globe: {
                path: `/${req.body.filename.split(" ").join("").toLowerCase()}`,
              },
            },
          },
          { safe: true, multi: true },
          function (err, obj) {
            //do something smart
            if (obj) {
              return res.sendStatus(200);
            }
          }
        );
      }
    }
  );
});

/**
 * @route POST folder/listgems/:path
 * @desc Get all gems in a file
 * @param {String} req.params.path - File path
 * @returns {Gem[]} All gems in the file
 */
router.get("/folder/listgems/:path", auth, async (req, res) => {
  const folder = await Folder.findOne({
    "items.path": `/${req.params.path}`,
  }).exec();
  const folderid = folder.id;
  const gems = await Gem.find({
    folder: folderid,
    "globe.path": `/${req.params.path}`,
    isSold: false,
  }).exec();
  return res.send(gems);
});

/**
 * @route POST file/move
 * @desc Move a file to a new folder
 * @param {Object} req.body.file - File object: {id: "", text: "", path: ""}
 * @param {Object} req.body.fromFolder - From folder object: {id: "", text: ""}
 * @param {Object} req.body.toFolder - To folder object: {id: "", text: ""}
 * @returns {Folder} Folder object the file was moved to
 * @returns {String} message - error message if any of the file or folders don't exist
 */
router.post("/file/move", auth, async (req, res) => {

  // if file or folders don't exist, return error message
  let fromFolder = await Folder.findById(req.body.fromFolder.id).exec();
  let file = await Folder.find({ "items.id": req.body.file.id }).exec();
  let toFolder = await Folder.findById(req.body.toFolder.id).exec();

  if (!file || !fromFolder || !toFolder)
    return res.json({ message: "Please enter a valid folder name." });

  // create new file object
  const obj = {
    text: req.body.file.text,
    path: req.body.file.path,
  };

  // remove file from old folder
  await Folder.updateMany(
    { _id: fromFolder.id },
    { $pull: { items: { path: req.body.file.path } } },
    { safe: true, multi: true }
  );

  // add file to new folder
  toFolder.items.push(obj);

  // save new folder
  await toFolder.save();

  // push gems to new folder
  await Gem.updateMany(
    { folder: { _id: fromFolder.id }, "globe.path": req.body.file.path },
    { $push: { folder: toFolder.id } },
    { safe: true, multi: true }
  );

  // remove gems from old folder
  await Gem.updateMany(
    { folder: { _id: fromFolder.id }, "globe.path": req.body.file.path },
    { $pull: { folder: fromFolder.id } },
    { safe: true, multi: true }
  );

  // return the new folder the file was moved to
  return res.send(toFolder);
});

module.exports = router;