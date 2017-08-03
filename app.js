// const electron = require('electron')
const {app, ipcMain, BrowserWindow, Menu} = require('electron')
// Module to control application life.
//const app = electron.app
// Module to create native browser window.
// const BrowserWindow = electron.BrowserWindow
//
// const Menu = electron.Menu
let mainWindow
// ipcMain.on('asynchronous-message', (event, arg) => {
//   console.log(arg)  // prints "ping"
//   event.sender.send('asynchronous-reply', 'pong')
// })

const desktopPath = app.getPath('desktop');
ipcMain.on('needDesktop', (event, arg) => {
  mainWindow.webContents.send('desktopPath', desktopPath);
})

ipcMain.on('synchronous-message', (event, arg) => {
  if(arg.id){
    mainWindow.webContents.send('channel3', arg)//channel for layer edits
  }else if(arg.ready){
    mainWindow.webContents.send('channel4', arg)
  }else if(arg.export){
    mainWindow.webContents.send('channel5', arg)
  }else{
    mainWindow.webContents.send('channel2', arg)//channel for map edits
  }

})
ipcMain.on('message_workers', (event, arg) => {
    console.log('worker reporting', arg);
})
function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
    app.quit()

  })

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
