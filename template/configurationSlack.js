const { ipcRenderer } = require('electron')
const fn = require('../static/functions')
const consumer = require('../static/consumer')
const NAV = require('./parts/nav')

const initDom = slack_token => {
  // actions
  fn._('nav').innerHTML = NAV('../static/logo.png', 'configurationSlack')
}

const init = () => {
  window.ipc = window.ipc || {};

  // Events
  fn._('btn').addEventListener('click', event => {
    event.preventDefault()
    ipcRenderer.send('save:slack_token', fn._('slack-token').value, fn._('channel-id').value)
  })

  ipcRenderer.on('slack_token:reply', (event, slack_token, channel_id) => {
    console.log(slack_token, channel_id)
  })
  ipcRenderer.on('slack_token:init', (event, slack_token, channel_id) => {
    if (slack_token !== '' && channel_id !== '') {
      initDom(slack_token, channel_id)
    }
    fn._('slack-token').value = slack_token
    fn._('channel-id').value = channel_id
  })

  ipcRenderer.send('slack_index:init')
}


init()
