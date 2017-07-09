const {dialog,BrowserWindow,Menu, MenuItem} = require('electron').remote;
const {ipcRenderer} = require('electron')
const shell = require('electron').shell
const remote = require('electron').remote;
const chooseN = document.getElementById('choose-name')
const chooseD = document.getElementById('choose-directory')
const chooseReflect = document.getElementById('pathofDt')
const submitform = document.getElementById('formsetting')
const closeform = document.getElementById('closeform')
  let window2 = remote.getCurrentWindow();
var settings = {
  export: true,
  maptitle: undefined,
  mapdest: undefined
};
let send = false;
chooseD.addEventListener("click", function(event){
    event.preventDefault();
    dialog.showOpenDialog({
        properties: ['openDirectory']
      },
      (pathNames) => {
        if (pathNames === undefined) {
          alert('No Folder Selected');
        } else {
          console.log(pathNames);
          chooseReflect.innerHTML = pathNames[0];
          settings.mapdest = pathNames[0];
        }
      });
});
submitform.addEventListener("submit", function(event){
    event.preventDefault();
    if(chooseN.value)settings.maptitle = chooseN.value;
    console.log("submitted")
    ipcRenderer.send('synchronous-message', settings);
    window2.close();
});
closeform.addEventListener("click", function(event){
    event.preventDefault();
    window2.close();
});
