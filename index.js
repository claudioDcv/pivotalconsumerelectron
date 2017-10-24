const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
const store = require('./core/appStore.js');
const events = require('./core/event.js');

let mainWindow
let createWindow = () => {

  const { width, height } = store.get('windowBounds');
  mainWindow = new BrowserWindow({
    width,
    height,
    backgroundColor: '#FFFFFF',
  })

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'template', 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  events.mainWindowEvent(store, mainWindow)
}

events.mainEvent(store)
events.appEvent(app, createWindow)
