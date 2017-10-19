const fn = require('../static/functions')
window.data = {};
window.data.message = []
const toNumber = n => isNaN(n) ? 0 : n

const mergeElements = data => {

  const stories = data.stories.value
  const epics = data.epics.value
  const orderEpics = {}
  const storiesMember = {}

  data.memberships.value.forEach(member => {
    const personId = member.person.id
    storiesMember[personId] = {
      member: member,
      epics: {},
    }
  })

  epics.forEach(epic => {
    const ep = epic
    ep.stories = []
    orderEpics[epic.label.id] = ep
  });

  Object.keys(orderEpics).forEach(e => {
    if (orderEpics[e]) {
      orderEpics[e].estimate = 0
      stories.forEach(story => {
        if (story.labels.some(i => i.id === orderEpics[e].label.id)) {
          orderEpics[e].stories.push(story)
        }
      })
    }
  })

  const clearOrderEpics = {}
  Object.keys(orderEpics).forEach(id => {
    if (orderEpics[id].stories.length > 0) {
      clearOrderEpics[id] = orderEpics[id]
    }
  })

  Object.keys(storiesMember).forEach(personId => {
    const epics = clearOrderEpics
    Object.keys(epics).forEach(epic => {
      storiesMember[personId].epics[epic] = {
        estimate: epics[epic].estimate,
        name: epics[epic].name,
        stories: [],
      }
      epics[epic].stories.forEach(story => {
        if (story.owner_ids.some(id => id === parseInt(personId))) {
          storiesMember[personId].epics[epic].stories.push(story)
        }
      })
      let estimate = 0
      storiesMember[personId].epics[epic].stories.forEach(story => {
        story.estimate = toNumber(story.estimate)
        estimate += story.estimate
      });
      storiesMember[personId].epics[epic].estimate = estimate
    })

  });

  window.data.storiesMember = storiesMember
  console.log(storiesMember)
  //DOM ACTIONS
  let dom = ''

  Object.keys(storiesMember).forEach(storyMember => {
    const obj = storiesMember[storyMember]
    dom += `<div class="member-box">
    <h4>
      <span class="added-action-icon">
        <i
         data-action-select
         class="icono-plus"
         data-type="member"
         data-member-id="${obj.member.person.id}"
        ></i>
      </span>
      <i
        class="avatar"
        style="background-color:#${obj.member.project_color}"
      >${obj.member.person.initials}</i>
      ${obj.member.person.name}
    </h4>`
    Object.keys(obj.epics).forEach(idEpic => {
      const epic = obj.epics[idEpic]
      if (epic.stories.length > 0) {
        dom += `<li class="epic-name">
          <span class="added-action-icon">
            <i
             data-action-select
             class="icono-plus"
             data-type="epic"
             data-epic-id="${idEpic}"
             data-epic-estimate="${epic.estimate}"
             data-member-id="${obj.member.person.id}"
            ></i></span>${epic.name} - ${epic.estimate}
        </li>`
      }
      dom += '<table class="table table-hover table-sm table-responsive"><tbody>'
      epic.stories.forEach(story => {
        dom += '<tr class="stories">'
        dom += `<td>
          <div class="mark ${fn.stateToCSS(story.current_state).css}">
          </div>
          <strong>${fn.stateToCSS(story.current_state).txt}</strong>
           ${story.name} - ${story.estimate} -
           <a target="new" href="${story.url}">#${story.id}</a>
         </td>`
         dom += `<td>
           <span class="added-action-icon">
             <i
              data-action-select
              class="icono-plus"
              data-type="story"
              data-epic-id="${idEpic}"
              data-epic-estimate="${epic.estimate}"
              data-story-id="${story.id}"
              data-story-estimate="${story.estimate}"
              data-member-id="${obj.member.person.id}"
             ></i></span>
          </td>`
          dom += '</tr>'
      })
      dom += '</tbody></table>'
    });
    dom += '</div>'
  });

  fn._('stories').innerHTML = dom
}

const templatesStringDom = templatesString => {
  let dom = '<ul>'
  templatesString.forEach(e => {
    dom += `
      <li>
        <span class="added-action-icon">
          <i
           data-action-select
           class="icono-plus"
           data-type="template"
           data-template-text="${e}"
          ></i>
        </span>${e}</li>
    `
  })
  dom += '</ul>'
  fn._('templates').innerHTML = dom
}


function initDom(args) {
  const token = args.pivotal_token
  const project_id = args.project_id
  window.data.token = token
  window.data.project_id = project_id

  window.data.slack_token = args.slack_token
  window.data.channel_id = args.channel_id
  window.data.templates_string = args.templates_string


  consumer.getMe(token, project_id, 'me', obj => {
    window.data.me = obj
  })

  consumer.get(token, project_id, 'memberships', obj => {
    window.data.memberships = obj
  })

  consumer.get(token, project_id, 'labels', obj => {
    window.data.labels = obj
    let n = ''
    for (var i = 0; i < obj.value.length; i++) {
      n += `<option value="${obj.value[i].name}">${obj.value[i].name}</option>`
    }
    fn._('labels').innerHTML = n
  })

  consumer.get(token, project_id, 'epics', obj => {
    window.data.epics = obj
    let n = ''
    for (var i = 0; i < obj.value.length; i++) {
      n += `<option value="${obj.value[i].id}">${obj.value[i].name}</option>`
    }
    fn._('epics').innerHTML = n
  })

  templatesStringDom(data.templates_string)
}

const init = () => {
  const { ipcRenderer } = require('electron')
  window.ipc = window.ipc || {};

  ipcRenderer.on('auth:init', (event, arg) => {
    if (arg !== '') {
      console.log(arg);
      initDom(arg)
    }
  })

  ipcRenderer.send('main:init')

  ipcRenderer.on('getall:template-string', (event, templatesString) => {
    fn._('template-string').value = ''
    templatesStringDom(templatesString)
  })
}


init()
