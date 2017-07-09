const {dialog,BrowserWindow,Menu, MenuItem} = require('electron').remote;
const {ipcRenderer} = require('electron')
const shell = require('electron').shell
const remote = require('electron').remote;
var settingchange = document.getElementById('formsetting')
var ttform = document.getElementById('tooltipform')
var ppform = document.getElementById('popupform')
var mccheck = document.getElementById('mcbox')
var titlechange = document.getElementById('title')
var urlParams = new URLSearchParams(window.location.search);
console.log(urlParams.get('id'));
  let window2 = remote.getCurrentWindow();
var settingObject = {
  "bindpopupset": '',
  "bindtooltipset": '',
  "markercluster": false,
  "id": urlParams.get('id')
};
console.log(settingObject);
titlechange.innerHTML = `${settingObject.id}`

settingchange.addEventListener("submit", function(event){
      let send = false;
      //start default every time it is submitted
      settingObject = {
        "bindpopupset": '',
        "bindtooltipset": '',
        "markercluster": false,
        "id": urlParams.get('id')
      };
    event.preventDefault();
    console.log(event);
    //check for any plugins checkboxes
    if (event.target[2].checked) {settingObject.markercluster= true; send=true;}
    let stringarraytt = (event.target[0].value);//.split(" ");
    let stringarraypp = (event.target[1].value);//.split(" ");

    if ((stringarraytt.trim()).length>0)
      {
        settingObject.bindtooltipset= stringarraytt.trim();
        send=true;
      }
    if ((stringarraypp.trim()).length>0)
      {
        settingObject.bindpopupset= stringarraypp.trim();
        send=true;
      }
    //send the message to main to send to main renderer the settings
    console.log(settingObject);
    if (send) ipcRenderer.send('synchronous-message', settingObject);
	window2.close();
});


closebutton.addEventListener("click", function(event){
    console.log('close')
    window2.close();
});
