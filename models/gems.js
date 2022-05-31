const mongoose = require("mongoose");

const gemsSchema = new mongoose.Schema(
  {
    ID: {
      type: String,
    },
    Category: {
      type: String,
    },
    TypeofGem: {
      type: String,
      default: "",
    },
    othertypeofgem: {
      type: String,
      default: "",
    },
    Formation: {
      type: String,
      default: "",
    },
    otherformation: {
      type: String,
      default: "",
    },
    Shape: {
      type: String,
      default: "",
    },
    Weight: {
      type: String,
    },
    Color: {
      type: String,
      default: "",
    },
    othercolor: {
      type: String,
      default: "",
    },
    Shades: {
      type: String,
      default: "",
    },
    Clarity: {
      type: String,
      default: "",
    },
    Length: {
      type: String,
    },
    Width: {
      type: String,
    },
    Depth: {
      type: String,
    },
    Costperpiece: {
      type: String,
    },
    Costpercarat: {
      type: String,
    },
    TotalCost: {
      type: String,
    },
    MineSource: {
      type: String,
    },
    Priceperpiece: {
      type: String,
    },
    Pricepercarat: {
      type: String,
    },
    TotalPrice: {
      type: String,
    },
    Enhancement: {
      type: String,
    },
    QualityGrade: {
      type: String,
      default: "",
    },
    Description: {
      type: String,
      default: "",
    },
    Quantity: {
      type: String,
    },
    StockNumber: {
      type: String,
    },
    specifyshape: {
      type: String,
      default: "",
    },
    oldeushape: {
      type: String,
      default: "",
    },
    facetedshape: {
      type: String,
      default: "",
    },
    otherfacetedshape: {
      type: String,
      default: "",
    },
    otheroldeushape: {
      type: String,
      default: "",
    },
    fancyshape: {
      type: String,
      default: "",
    },
    othercategory: {
      type: String,
      default: "",
    },
    roughtypeofgem: {
      type: String,
      default: "",
    },
    selectroughtypeofgem: {
      type: String,
      default: "",
    },
    otherroughtypeofgem: {
      type: String,
      default: "",
    },
    cabochonshape: {
      type: String,
      default: "",
    },
    othercabochonshape: {
      type: String,
      default: "",
    },
    otherpearlsshape: {
      type: String,
      default: "",
    },
    specificsource: {
      type: String,
      default: "",
    },
    otherminesource: {
      type: String,
      default: "",
    },
    ColorIntensity: {
      type: String,
      default: "",
    },
    Size: {
      type: String,
      default: "",
    },
    othercolorintensity: {
      type: String,
      default: "",
    },
    otherclarity: {
      type: String,
      default: "",
    },
    othershades: {
      type: String,
      default: "",
    },
    listshades: {
      type: String,
      default: "",
    },
    specificshades: {
      type: String,
      default: "",
    },
    selectminesource: {
      type: String,
      default: "",
    },
    price: {
      type: String,
      default: "",
    },
    cost: {
      type: String,
      default: "",
    },
    isSold: {
      type: Boolean,
      default: false,
    },
    globe: [
      {
        path: {
          type: String,
          default: "",
        },
      },
    ],
    folder: [{ type: mongoose.Schema.ObjectId, ref: "folder", default: [] }],
  },
  {
    timestamps: true,
  }
);
gemsSchema.index({ "$**": "text" });
const Gem = mongoose.model("Gem", gemsSchema);

module.exports = Gem;
