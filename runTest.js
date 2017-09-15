const {dialog,BrowserWindow,Menu, MenuItem} = require('electron').remote;
const {ipcRenderer} = require('electron')
const shell = require('electron').shell
const remote = require('electron').remote;
  let window1 = remote.getCurrentWindow();
const exLinksBtn = document.getElementById('aproviderlink')
var settingchange = document.getElementById('formsetting')
var providerchange = document.getElementById('providername')
var mapextentchange = document.getElementById('extentbox')
var zoomminchange = document.getElementById('minzoominput')
var zoommaxchange = document.getElementById('maxzooominput')


window1.webContents.on('crashed', event => {
      Console.error( `Window "${this.name}" crashed: ${event}` );
    });
window1.on('unresponsive',  event => {
      Console.error( `Window "${this.name}" crashed: ${event}` );
    });

var settingObject = {
  "provider": '',
  "mapextent": false,
  "zoommin": '',
  "zoommax": ''
};
settingchange.addEventListener("submit", function(event){

  event.preventDefault();
  let send = false;
  settingObject = {
    "provider": '',
    "mapextent": false,
    "zoommin": '',
    "zoommax": ''
  };

if ((providerchange.value.trim()).length > 0){send = true;console.log('change provider'); settingObject.provider = providerchange.value.trim()}
if ((zoomminchange.value.trim()).length > 0 && parseInt(zoomminchange.value.trim())>=0 ){send = true;console.log('change min'); settingObject.zoommin = zoomminchange.value.trim()}
if ((zoommaxchange.value.trim()).length > 0 && parseInt(zoommaxchange.value.trim())<=20){send = true;console.log('change max'); settingObject.zoommax = zoommaxchange.value.trim()}
if (mapextentchange.checked){console.log('change extent'); settingObject.mapextent = true;send = true; }

if (send) ipcRenderer.send('map-message', settingObject);
  window1.close();
});
closebutton.addEventListener("click", function(event){

    console.log('close')
    window1.close();
});
exLinksBtn.addEventListener('click', function (event) {
  shell.openExternal('https://leaflet-extras.github.io/leaflet-providers/preview/')
})
