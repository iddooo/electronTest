// Modules to control application life and create native browser window
const { app, BrowserWindow, shell, ipcMain } = require('electron')
const path = require('path')
const StaticServer = require('./server')
new StaticServer().start()
function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 960,
    height: 590,
    useContentSize: true,
    resizable: false,
    maximizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  // Open the DevTools.
  mainWindow.webContents.openDevTools({
    mode: 'bottom'
  });
  mainWindow.on('closed', function () {
    mainWindow = null
  })
  // and load the index.html of the app.
  mainWindow.loadURL('http://127.0.0.1:3600/index.html')
  // mainWindow.loadFile('./src/index.html')
  ipcMain.on('resize', (event, { width, height }) => {
    mainWindow.setContentSize(width, height)
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('open-url', (event, url) => {
  shell.openExternal(url);
});
