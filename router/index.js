const express = require("express");
const app = express();
const jwtHelper = require("../utils/jwtHelper.js");
const fs = require("fs");
const path = require("path");

function getAllFiles(dir, allFilesList = []) {
  const files = fs.readdirSync(dir);
  files.map((file) => {
    const name = dir + "/" + file;
    if (fs.statSync(name).isDirectory()) {
      // check if subdirectory is present
      getAllFiles(name, allFilesList); // Do recursive execution for subdirectory
    } else if (!name.includes("/index")) {
      // Ignore index routes
      allFilesList.push(name); // Push filename into the array
    }
  });
  return allFilesList;
}

// Subdirectories from this folder inwards
const dirPath = path.resolve(__dirname, "../controllers");
const allRoutesFiles = getAllFiles(dirPath);

// Import all routes
allRoutesFiles.map((file) => {
  const route = require(file);
  app[route.method](route.route, jwtHelper.verifyJwtToken, route.controller);
});

module.exports = app;