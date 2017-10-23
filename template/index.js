const { ipcRenderer } = require('electron')
const consumer = require('../static/consumer')
const consumerSlack = require('../static/consumerSlack')
const NAV = require('./parts/nav')

fn._('nav').innerHTML = NAV('../static/logo.png', 'index')

const messageAlert = (txt, time) => {
  const elm = fn.remove(fn._('message-alert'))
  elm.innerHTML = txt
  elm.style.display = 'block'
  setTimeout(() => {
    elm.style.display = 'none'
  }, time || 1000);
}

//Add template

fn._('btn-add-template').addEventListener('click', event => {
  event.preventDefault()
  fn._('template-string').focus()
  const text = fn._('template-string').value
  if (text) {
    messageAlert(`added add:template-string`)
    ipcRenderer.send('add:template-string', text)
  }
})

fn._('btn-remove-templates').addEventListener('click', event => {
  event.preventDefault()
  ipcRenderer.send('removeall:template-string')
})

fn._('btn-remove-templates').addEventListener('click', event => {
  event.preventDefault()
  ipcRenderer.send('removeall:template-string')
})


fn._('getStories').addEventListener('click', () => {
  const project_id = window.data.project_id
  const token = window.data.token
  consumer.getStories(token, project_id, 'stories', obj => {
    window.data.stories = obj
    mergeElements(window.data)
  })
})

fn._('test-slack').addEventListener('click', () => {
  const text = fn._('slack-text').value
  if (text) {
    const textBackTicks = `\`\`\`${text}\`\`\``
    const slack_token = window.data.slack_token
    const channel_id = window.data.channel_id
    consumerSlack.publish(slack_token, channel_id, textBackTicks, 'chat.postMessage', obj => {
      window.data.message.push(obj)
      console.log(data);
      fn._('slack-text').value = ''
    })
  } else {
    console.log('slack-test is empty')
  }
})

//Listener all document
const addTextLine = text => {
  let prevText = fn._('slack-text').value
  // debugger selectionStart
  fn._('slack-text').value += `${text}\n`
  return {
    prevText,
    currentText: fn._('slack-text').value,
  }
}

const handlerOnClick = event => {
  let isActionSelect = false
  Object.keys(event.target.dataset).forEach(key => {
    if (key === 'actionSelect') {
      isActionSelect = true
      const dataset = event.target.dataset

      if (dataset.type === 'epic') {
        messageAlert(`added ${dataset.type}`)
        const epic = data.storiesMember[dataset.memberId].epics[dataset.epicId]
        const format = `EPIC - ${epic.name} - ${epic.estimate}pts`
        addTextLine(format)
        console.log(epic)

      } else if(dataset.type === 'story') {
        messageAlert(`added ${dataset.type}`)
        const stories = data.storiesMember[dataset.memberId].epics[dataset.epicId].stories
        stories.forEach(story => {
          if (story.id === parseInt(dataset.storyId)) {
            const formatStory = `- ${story.name} - [#${story.id}](${story.url}) - ${story.current_state} - ${story.estimate}pts`
            addTextLine(formatStory)
            console.log(story)
          }
        });
      } else if(dataset.type === 'member') {
        messageAlert(`added ${dataset.type}`)
        const member = data.storiesMember[dataset.memberId].member
        const formatMember = `## ${member.person.name}`
        addTextLine(formatMember)
      } else if(dataset.type === 'template') {
        messageAlert(`added ${dataset.type}`)
        addTextLine(dataset.templateText)
      } else if(dataset.type === 'template:removebyid') {
        messageAlert(`remove ${dataset.type}`)
        const id = dataset.templateId
        console.log(id);
        ipcRenderer.send('removebyid:template-string', id)
      }

    }
  })
}

document.addEventListener('click', handlerOnClick, false)
