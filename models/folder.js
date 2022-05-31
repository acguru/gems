let mongoose = require("mongoose");
let schema = mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: "folder",
    },
    items: [
      {
        text: {
          type: String,
        },
        path: {
          type: String,
          unique: true,
          sparse: true,
        },
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Folder = mongoose.model("Folder", schema);
module.exports = Folder;
