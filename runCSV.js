const {dialog,BrowserWindow,Menu, MenuItem} = require('electron').remote;
const {ipcRenderer} = require('electron');
const remote = require('electron').remote;
let window1 = remote.getCurrentWindow();
var settingchange = document.getElementById('formsetting')
var latchange = document.getElementById('latform')
var lonchange = document.getElementById('lonform')
var delimchange = document.getElementById('delimiterform')
var closebutton = document.getElementById('closebutton')

window1.webContents.on('crashed', event => {Console.error( `Window "${this.name}" crashed: ${event}` );});
window1.on('unresponsive',  event => {Console.error( `Window "${this.name}" crashed: ${event}` );});

var settingObject = {
    "lat": undefined,
    "lon": undefined,
    "ready": undefined,
    "delimiter": undefined,
    "urlcheck": undefined
  };

  settingchange.addEventListener("submit", function(event){
  event.preventDefault();
  let send = false;
  settingObject = {
    "lat": undefined,
    "lon": undefined,
    "ready": undefined,
    "delimiter": undefined,
    "urlcheck": undefined
  };

  if ((latchange.value.trim()).length > 0){send = true; settingObject.lat = latchange.value.trim()}
  if ((lonchange.value.trim()).length > 0){send = true; settingObject.lon = lonchange.value.trim()}
  if ((delimchange.value.trim()).length > 0){send = true; settingObject.delimiter = delimchange.value.trim()}

  console.log(settingObject);
  if (send) settingObject.ready =true;ipcRenderer.send('csv-message', settingObject);
  window1.close();
});


closebutton.addEventListener("click", function(event){
    console.log('close')
    window1.close();
});
