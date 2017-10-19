const { ipcMain } = require('electron')
win = {}

const mainEvent = store => {

  ipcMain.on('main:init', (event, arg)=> {
    event.sender.send(
      'auth:init',
      {
        pivotal_token: store.get('pivotal-token'),
        project_id: store.get('project_id'),
        slack_token: store.get('slack_token'),
        channel_id: store.get('channel_id')
      }
    )
  })

  ipcMain.on('index:init', (event, arg)=> {
    event.sender.send(
      'token:init',
      store.get('pivotal-token'),
      store.get('project_id')
    )
  })

  ipcMain.on('save:token', (event, arg, project_id)=> {
    console.log(arg, project_id)
    store.set('pivotal-token', arg)
    store.set('project_id', project_id)
    event.sender.send(
      'token:reply',
      store.get('pivotal-token'),
      store.get('project_id')
    )
  })

//SLACK
  ipcMain.on('slack_index:init', (event, arg)=> {
    event.sender.send(
      'slack_token:init',
      store.get('slack_token'),
      store.get('channel_id')
    )
  })

  ipcMain.on('save:slack_token', (event, slack_token, channel_id)=> {
    console.log(slack_token, channel_id)
    store.set('slack_token', slack_token)
    store.set('channel_id', channel_id)
    event.sender.send(
      'slack_token:reply',
      store.get('slack_token'),
      store.get('channel_id')
    )
  })
}

const appEvent = (app, createWindow) => {
  app.on('ready', createWindow)

  app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow()
    }
  })
}

const mainWindowEvent = (store, mainWindow) => {
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('resize', () => {
    const { width, height } = mainWindow.getBounds();
    store.set('windowBounds', { width, height });
  });
}

module.exports = {
  mainEvent,
  appEvent,
  mainWindowEvent,
};
