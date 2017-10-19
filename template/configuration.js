const { ipcRenderer } = require('electron')
const fn = require('../static/functions')
const consumer = require('../static/consumer')
const NAV = require('./parts/nav')

const initDom = token => {
  // actions
  fn._('nav').innerHTML = NAV('../static/logo.png', 'configuration')
}

const init = () => {
  window.ipc = window.ipc || {};

  // Events
  fn._('btn').addEventListener('click', event => {
    event.preventDefault()
    ipcRenderer.send('save:token', fn._('token').value, fn._('project_id').value)
  })

  ipcRenderer.on('token:reply', (event, arg, project_id) => {
    console.log(arg, project_id)
  })
  ipcRenderer.on('token:init', (event, arg, project_id) => {
    if (arg !== '') {
      initDom(arg, project_id)
    }
    fn._('token').value = arg
    fn._('project_id').value = project_id
  })

  ipcRenderer.send('index:init')
}


init()
