const { app, BrowserWindow } = require('electron')

const path = require('path')
const isDev = require('electron-is-dev')

const Store = require('electron-store')

Store.initRenderer()

require('@electron/remote/main').initialize()

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    movable: true,
    maximizable: true,
    closable: true,
    autoHideMenuBar: true,
    enableLargerThanScreen: false,
    backgroundColor: 'rgb(240,240,240)',
    darkTheme: true,
    allowRunningInsecureContent: true,
    width: 800,
    height: 600,
    center: true,
    minWidth: 300,
    minHeight: 200,
    title: 'Traktbox',
    backgroundColor: 'rgb(0,0,0)',
    icon: path.join(__dirname, '../public/icon/png/512.png'),
    allowRunningInsecureContent: true,

    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })

  if (isDev) {
    win.loadURL('http://localhost:3000')
    win.webContents.openDevTools()
  } else {
    win.loadURL(`file://${path.join(__dirname, '../build/index.html')}`)
  }
}

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
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
