const { dialog, BrowserWindow, Menu, MenuItem } = require("electron").remote;
const { ipcRenderer } = require("electron");
const shell = require("electron").shell;
const remote = require("electron").remote;
var settingchange = document.getElementById("formsetting"),
  ttform = document.getElementById("tooltipform"),
  ppform = document.getElementById("popupform"),
  mccheck = document.getElementById("mclusterRadio"),
  outbtn = document.getElementById("outlinebutton"),
  fillbtn = document.getElementById("fillbutton"),
  outlinevalue = document.getElementById("outlinefill"),
  fillvalue = document.getElementById("fillcolor"),
  outlineopacity = document.getElementById("outlineopacity"),
  fillopacity = document.getElementById("fillopacity"),
  titlechange = document.getElementById("title"),
  colorbx = document.getElementById("colorbox"),
  urlParams = new URLSearchParams(window.location.search);
let window2 = remote.getCurrentWindow();
var settingObject = {
  bindpopupset: "",
  bindtooltipset: "",
  markercluster: false,
  id: urlParams.get("id"),
  fillcolor: undefined,
  fillopacity: undefined,
  strokecolor: undefined,
  strokeopacity: undefined
};
var send = false;
console.log(settingObject);
titlechange.innerHTML = `${settingObject.id}`;

closebutton.addEventListener("click", function(event) {
  console.log("close");
  window2.close();
});

outbtn.addEventListener("click", function(event) {
  event.preventDefault();
  outlinevalue.value = colorbx.value;
    console.log(fillopacity.value);
});

fillbtn.addEventListener("click", function(event) {
  event.preventDefault();
  console.log(colorbx.value, outlineopacity.value);
  console.log(outlineopacity.value);
  fillvalue.value = colorbx.value;
});

mccheck.addEventListener("click", function(event) {
  event.preventDefault();

  console.log(mccheck.toggled); //if false then remove clustering, if true then cluster, if null value never updated then nothing
  if (mccheck.toggled) {
    settingObject.markercluster = true;
  } else {
    settingObject.markercluster = false;
  }
  send = true;
});

settingchange.addEventListener("submit", function(event) {
  event.preventDefault();
  if (fillvalue.value) {settingObject.fillcolor = fillvalue.value;send= true;}
  if (outlinevalue.value){settingObject.strokecolor = outlinevalue.value;send= true;}
  if (fillopacity.value){settingObject.fillopacity = fillopacity.value;send= true;}
  if (outlineopacity.value){settingObject.strokeopacity = outlineopacity.value;send= true;}
console.log(event);
  let stringarraytt = event.target[6].value; //.split(" ");
  let stringarraypp = event.target[7].value; //.split(" ");

  if (stringarraytt.trim().length > 0) {
    settingObject.bindtooltipset = stringarraytt.trim();
    send = true;
  }
  if (stringarraypp.trim().length > 0) {
    settingObject.bindpopupset = stringarraypp.trim();
    send = true;
  }
  //send the message to main to send to main renderer the settings
  //console.log(settingObject);
  if (send) ipcRenderer.send("layer-message", settingObject);
 window2.close(); //IN
});
