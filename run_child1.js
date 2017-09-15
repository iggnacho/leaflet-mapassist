var fs = require("fs");
const parseMe = require("./GeoParse.js");

function parseStart(type, pathAndName, options) {
  try {
    //here do the parsing and the send the result

    process.send(data);
  } catch (e) {
    process.send("error: " + e.message);
  }
}
