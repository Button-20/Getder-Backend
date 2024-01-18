const express = require("express");
const app = express();
const jwtHelper = require("../utils/jwtHelper.js");
const fs = require("fs");
const path = require("path");

const excludedFolders = ["message"]; // Add the names of folders to be excluded

function getAllFiles(dir, allFilesList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      if (!excludedFolders.includes(file)) {
        getAllFiles(name, allFilesList);
      }
    } else if (!name.includes("/index")) {
      allFilesList.push(name);
    }
  });
  return allFilesList;
}
const dirPath = path.resolve(__dirname, "../controllers");
const allRoutesFiles = getAllFiles(dirPath);

// Import all routes dynamically using require
allRoutesFiles.forEach((file) => {
  try {
    const route = require(file);
    app[route.method](route.route, jwtHelper.verifyJwtToken, route.controller);
  } catch (error) {
    console.error(`Error importing route from ${file}:`, error);
  }
});

module.exports = app;
