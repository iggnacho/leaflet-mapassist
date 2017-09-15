const {dialog,BrowserWindow,Menu, MenuItem} = require('electron').remote;
const {ipcRenderer} = require('electron');
const remote = require('electron').remote;
const parseMe = require('./GeoParse.js');
let window1 = remote.getCurrentWindow();
ipcRenderer.on('pinging', (event, message) => {//get file directory and the file type
      ipcRenderer.send('message_workers', message);
      window1.close();
    })
