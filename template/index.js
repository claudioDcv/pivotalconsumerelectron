const { ipcRenderer } = require('electron')
const consumer = require('../static/consumer')
const consumerSlack = require('../static/consumerSlack')
const NAV = require('./parts/nav')

fn._('nav').innerHTML = NAV('../static/logo.png', 'index')

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
        const epic = data.storiesMember[dataset.memberId].epics[dataset.epicId]
        const format = `EPIC - ${epic.name} - ${epic.estimate}pts`
        addTextLine(format)
        console.log(epic)

      } else if(dataset.type === 'story') {
        const stories = data.storiesMember[dataset.memberId].epics[dataset.epicId].stories
        stories.forEach(story => {
          if (story.id === parseInt(dataset.storyId)) {
            const formatStory = `- ${story.name} - [#${story.id}](${story.url}) - ${story.current_state}`
            addTextLine(formatStory)
            console.log(story)
          }
        });
      } else if(dataset.type === 'member') {
        const member = data.storiesMember[dataset.memberId].member
        const formatMember = `## ${member.person.name}`
        addTextLine(formatMember)
      }

    }
  })
}

document.addEventListener('click', handlerOnClick, false)
