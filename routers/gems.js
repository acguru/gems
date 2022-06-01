const express = require("express");
const router = new express.Router();
const Gem = require("../models/gems");
const Folder = require("../models/folder");
const auth = require("../middleware/auth");

/**
 * @route POST data
 * @desc Create a new Gem or update an existing one
 * @param {Object} req.body - Gem data
 * @returns {Gem} Newly created or updated Gem
 */
router.post("/data", auth, async (req, res) => {
  const params = req.body;
  let newdata = new Gem();

  if (params._id && params._id.length > 1) {
    // if _id exists, update existing Gem
    newdata = await Gem.findById(params._id).exec();
  } else if (params.offlineID) {
    // if offlineID exists, insert new gem with offlineID
    newdata._id = params.offlineID;
  }
  
  if (params.ID) {
    newdata.ID = params.ID;
  }
  
  if (params.Category) {
    newdata.Category = params.Category;
  }
  
  newdata.TypeofGem = params.TypeofGem;
  
  newdata.Formation = params.Formation;
  
  if (params.Shape) {
    newdata.Shape = params.Shape;
  }
  
  if (params.Weight) {
    newdata.Weight = params.Weight;
  }

  newdata.Color = params.Color;

  newdata.Shades = params.Shades;

  newdata.Clarity = params.Clarity;

  if (params.Length) {
    newdata.Length = params.Length;
  }
  if (params.othercategory) {
    newdata.othercategory = params.othercategory;
  }
  if (params.Width) {
    newdata.Width = params.Width;
  }
  if (params.Depth) {
    newdata.Depth = params.Depth;
  }
  if (params.Costperpiece) {
    newdata.Costperpiece = params.Costperpiece;
  }

  if (params.Costpercarat) {
    newdata.Costpercarat = params.Costpercarat;
  }

  if (params.specifyshape) {
    newdata.specifyshape = params.specifyshape;
  }

  if (params.TotalCost) {
    newdata.TotalCost = params.TotalCost;
  }

  if (params.Priceperpiece) {
    newdata.Priceperpiece = params.Priceperpiece;
  }

  if (params.Pricepercarat) {
    newdata.Pricepercarat = params.Pricepercarat;
  }

  if (params.TotalPrice) {
    newdata.TotalPrice = params.TotalPrice;
  }

  if (params.Enhancement) {
    newdata.Enhancement = params.Enhancement;
  }

  if (params.oldeushape) {
    newdata.oldeushape = params.oldeushape;
  }

  if (params.fancyshape) {
    newdata.fancyshape = params.fancyshape;
  }

  if (params.facetedshape) {
    newdata.facetedshape = params.facetedshape;
  }

  newdata.QualityGrade = params.QualityGrade;

  if (params.Description) {
    newdata.Description = params.Description;
  }

  if (params.Quantity) {
    newdata.Quantity = params.Quantity;
  }

  if (params.StockNumber) {
    newdata.StockNumber = params.StockNumber;
  }

  if (params.MineSource) {
    newdata.MineSource = params.MineSource;
  }

  if (params.othercolor) {
    newdata.othercolor = params.othercolor;
  }

  if (params.otherformation) {
    newdata.otherformation = params.otherformation;
  }

  if (params.othertypeofgem) {
    newdata.othertypeofgem = params.othertypeofgem;
  }

  if (params.otherfacetedshape) {
    newdata.otherfacetedshape = params.otherfacetedshape;
  }

  if (params.otheroldeushape) {
    newdata.otheroldeushape = params.otheroldeushape;
  }

  if (params.otherroughtypeofgem) {
    newdata.otherroughtypeofgem = params.otherroughtypeofgem;
  }

  if (params.roughtypeofgem) {
    newdata.roughtypeofgem = params.roughtypeofgem;
  }

  if (params.selectroughtypeofgem) {
    newdata.selectroughtypeofgem = params.selectroughtypeofgem;
  }

  if (params.othercabochonshape) {
    newdata.othercabochonshape = params.othercabochonshape;
  }

  if (params.cabochonshape) {
    newdata.cabochonshape = params.cabochonshape;
  }

  if (params.otherpearlsshape) {
    newdata.otherpearlsshape = params.otherpearlsshape;
  }

  if (params.specificsource) {
    newdata.specificsource = params.specificsource;
  }

  if (params.otherminesource) {
    newdata.otherminesource = params.otherminesource;
  }

  if (params.othercolorintensity) {
    newdata.othercolorintensity = params.othercolorintensity;
  }

  if (params.ColorIntensity) {
    newdata.ColorIntensity = params.ColorIntensity;
  }

  if (params.otherclarity) {
    newdata.otherclarity = params.otherclarity;
  }

  if (params.othershades) {
    newdata.othershades = params.othershades;
  }

  if (params.Size) {
    newdata.Size = params.Size;
  }

  if (params.listshades) {
    newdata.listshades = params.listshades;
  }

  if (params.specificshades) {
    newdata.specificshades = params.specificshades;
  }

  if (params.selectminesource) {
    newdata.selectminesource = params.selectminesource;
  }

  if (params.cost) {
    newdata.cost = params.cost;
  }

  if (params.price) {
    newdata.price = params.price;
  }

  // save new Gem
  await newdata.save();

  newdata = await Gem.findById(newdata._id).exec();

  // if created inside a file, add gem to file
  if (params.folderID && params.globe) {
    newdata.folder.push(params.folderID);
    const obj = {
      path: params.globe,
    };
    newdata.globe.push(obj);
    await newdata.save();
  }

  // find and return new Gem
  newdata = await Gem.findById(newdata._id).exec();
  return res.send(newdata);
});

/**
 * @route GET getgems
 * @desc Get all gems
 * @returns {Gems[]} Gems
 */
router.get("/getgems", auth, async (req, res) => {
  const items = await Gem.find().exec();
  try {
    res.status(201).send(items);
  } catch (e) {
    res.status(400).send(e);
  }
});

/**
 * @route POST sellgem
 * @desc Sell gem
 * @param {string} req.body.id - ID of gem to sell
 * @returns {Gem} Sold gem
 */
router.post("/sellgem", auth, async (req, res) => {
  let gem = await Gem.findById(req.body.id).exec();
  if (!gem) {
    return res.status(404).send("Gem not found");
  }
  gem.isSold = true;
  await gem.save();
  return res.status(200).send(gem);
});

/**
 * @route POST undosale
 * @desc Undo sale of gem
 * @param {string} req.body.id - ID of gem to undo sale
 * @returns {Gem} Gem
 */
router.post("/undosale", auth, async (req, res) => {
  let gem = await Gem.findById(req.body.id).exec();
  if (!gem) {
    return res.status(404).send("Gem not found");
  }
  gem.isSold = false;
  await gem.save();
  return res.status(200).send(gem);
});

/**
 * @route POST removeGem
 * @desc Delete gem
 * @param {string} req.body.id - ID of gem to delete
 * @returns {Gem} Deleted gem
 */
router.post("/removeGem", auth, async (req, res) => {
  const id = req.body.id;
  Gem.findById(id, (err, data) => {
    if (err) return res.status(400).send(err);
    if (!data) return res.json("Data not found");
    data.remove(function (error) {
      if (error) return res.status(400).send(err);
      return res.status(200).send(data);
    });
  });
});

/**
 * @route POST removeGem/file
 * @desc Delete gem from specific file
 * @param {string} req.body.id - ID of gem to delete
 * @param {string} req.body.path - Path of file to delete gem from
 * @returns {Gem} Deleted gem
 * @returns {string} message - error message if params missing
 * @returns {string} message - error message if gem or folder not found
 */
router.post("/removeGem/file", auth, async (req, res) => {
  const id = req.body.id;
  const path = req.body.path;
  if (!id || !path) return res.status(400).send("Invalid data");
  const folder = await Folder.findOne({ "items.path": path });
  const gem = await Gem.findOne({ _id: id });
  if (!gem || !folder) return res.status(400).send("Gem or folder not found");
  // remove gem.globe where path is the same as the path of the file
  gem.globe = gem.globe.filter((globe) => {
    return globe.path !== path;
  });
  // remove the folder id from the gem
  gem.folder = gem.folder.filter((folder) => {
    return folder !== folder._id;
  });
  // save the gem and return
  await gem.save((err, data) => {
    if (err) return res.status(400).send(err);
    return res.status(200).send(data);
  });
});

/**
 * @function
 * @name escapeStringRegexp
 * @description Escape string for use in regex
 * @param {string} string - String to escape
 * @returns {string} - Escaped string
 * @returns {TypeError} - Error not a string
 */
function escapeStringRegexp(string) {
  if (typeof string !== "string") {
    throw new TypeError("Expected a string");
  }

  // Escape characters with special meaning either inside or outside character sets.
  // Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
  return string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}

/**
 * @route POST search
 * @desc Search for gem
 * @param {string} req.body.keyword - Regex Keyword to search for
 * @param {string} req.body.path - Path of file to search in
 * @returns {Gem[]} Gems
 */
router.post("/search", auth, async (req, res) => {
  const { keyword, path } = req.body;
  const $regex = escapeStringRegexp(keyword);
  let items;
  if (path === "/gems") {
    items = await Gem.find({ $text: { $search: $regex } }).exec();
  } else {
    items = await Gem.find({
      $text: { $search: $regex },
      "globe.path": path,
    }).exec();
  }

  return res.status(200).send(items);
});

/**
 * @route POST gems/folder
 * @desc Export gems to new file/folder
 * @param {string} req.body.folderName - Name of folder to export from
 * @param {string} req.body.path - Path of file to export to
 * @param {Object[]} req.body.gems - Gems to export
 * @returns {responseStatus} responseStatus
 * @returns {string} message - error message if data is empty
 * @returns {string} message - error message if folder not found
 */
router.post("/gems/folder", auth, async (req, res) => {

  const folderName = req.body.folderName;
  const filename = req.body.filename;
  const data = req.body.data;
  if (!data) {
    return res.json({ message: "No data selected for export." });
  }

  const folder = await Folder.findOne({ text: folderName }).exec();
  if (!folder) return res.json({ message: "No folder with that name." });
  
  for (let i = 0; i < data.length; i++) {
    const gem = await Gem.findById(data[i]._id).exec();
    gem.folder.push(folder.id);
    let obj = {
      path: filename,
    };
    gem.globe.push(obj);
    await gem.save();
  }
  return res.send(200);
});

/**
 * @route POST move
 * @desc Move gem to new file/folder without removing it from old folder
 * @param {string} req.body.folderName - Name of folder to move from
 * @param {string} req.body.newPath - Path of file to move to
 * @param {string} req.body.currPath - Path of file to move from
 * @param {Object[]} req.body.gems - Gems to move
 * @returns {responseStatus} responseStatus
 * @returns {string} message - error message if data is empty
 * @returns {string} message - error message if any of the folders not found
 */
router.post("/move", auth, async (req, res) => {
  const folderName = req.body.folderName;
  const data = req.body.data;
  const newPath = req.body.newPath;
  const currPath = req.body.currPath;

  if (!data) return res.json({ message: "No data selected for export." });

  const newFolder = await Folder.findOne({ text: folderName }).exec();
  if (!newFolder) return res.json({ message: "No folder with that name." });

  const currFolder = await Folder.findOne({ "items.path": currPath }).exec();
  if (!currFolder)
    return res.json({ message: "Could not find current folder." });

  for (let i = 0; i < data.length; i++) {
    const gem = await Gem.findById(data[i]._id).exec();

    gem.folder = gem.folder.filter((folder) => {
      return folder !== currFolder.id;
    });

    gem.globe = gem.globe.filter((globe) => {
      return globe.path !== currPath;
    });

    gem.folder.push(newFolder.id);
    let obj = {
      path: newPath,
    };
    gem.globe.push(obj);

    await gem.save();
  }
  return res.send(200);
});

module.exports = router;