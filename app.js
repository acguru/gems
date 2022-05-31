const express = require("express");
require("express-async-errors");

const helmet = require("helmet");
const xss = require("xss-clean");

const cors = require("cors");
const gemsSchema = require("./routers/gems");
const userSchema = require("./routers/user");
const folderSchema = require("./routers/folder");
const app = express();
app.set("trust proxy", 1);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(gemsSchema);
app.use(userSchema);
app.use(folderSchema);

module.exports = app;
