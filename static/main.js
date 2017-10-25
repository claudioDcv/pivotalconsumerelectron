const fn = require('../static/functions')

const hmtlout = ''

const _ = id => document.getElementById(id)
const create = name => document.createElement(name)
const text = text => document.createTextNode(text)
const add = (parent, child) => parent.appendChild(child)
const kebakToCamel = str => {
  return str.replace(/-([a-z])/g, g => g[1].toUpperCase());
}
const camelToKebak = str => str.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase();
const addListener = (elm, name, fn) => {
  elm.addEventListener(name, fn, false)
}

const props = (elm, _props) => {
  if (_props) {
    Object.keys(_props).forEach(prop => {
      if (_props[prop] instanceof Function) {
        addListener(elm, prop, _props[prop])
      } else if (_props[prop] instanceof Object) {
        elm[prop] = null
        Object.keys(_props[prop]).forEach(style => {
          elm[prop][style] = _props[prop][style]
        })
      } else {
        elm[prop] = _props[prop]
      }
    });
  }
}
const createChild = (elm, out) => {
  let _elm = elm
  let main = null
  if (_elm.child) {
    if (_elm.type === 'text') {
      main = text(_elm.child)
      add(out, main)
    } else {
      main = create(_elm.type)
      props(main, _elm.props)
      add(out, main)
    }
    for (var i = 0; i < _elm.child.length; i++) {
      createChild(_elm.child[i], main)
    }
  } else {
    if (_elm.type) {
      main = create(_elm.type)
      props(main, _elm.props)
      add(out, main)
      createChild([], main)
    }
  }
}




window.data = {};
window.data.message = []
window.data.changedStories = {}

const optionsCreator = (currentState) => {
  let dom = ''
  Object.keys(fn.states).forEach(elem => {
    if (elem === currentState) {
      dom += `<option selected value="${elem}">${fn.stateToCSS(elem).txt}`
    } else {
      dom += `<option value="${elem}">${fn.stateToCSS(elem).txt}`
    }
  });
  return dom
}


const templatesBtnDangerClick = event => console.log(event.target);

const toNumber = n => isNaN(n) ? 0 : n


const labelsCreate = labels => {
  let dom = ''
  labels.forEach(elm => {
    dom += `<span class="badge mx-1 badge-success" id="label-${elm.id}">${elm.name}</span>`
  });
  return dom
}


const mergeElements = data => {

  console.log(_('only-me').checked);
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
    let isStories = false
    if (!_('only-me').checked || data.me.value.id === parseInt(storyMember)) {
      const obj = storiesMember[storyMember]

      dom += `<div class="member-box">
      <h4>
        <span class="added-action-icon">
          <i
           data-action-select class="icono-plus"
           data-type="member" data-member-id="${obj.member.person.id}"></i>
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
          isStories = true
          dom += `<li class="epic-name">
            <span class="added-action-icon">
              <i
               data-action-select
               class="icono-plus"
               data-type="epic"
               data-epic-id="${idEpic}"
               data-epic-estimate="${epic.estimate}"
               data-member-id="${obj.member.person.id}"
              ></i></span>${epic.name} - ${epic.estimate}pts
          </li>`
        }
        dom += '<table class="table table-hover table-sm table-responsive table-dark"><tbody>'
        epic.stories = epic.stories.sort((a,b) => {
          if (a.current_state < b.current_state)
            return -1;
          if (a.current_state > b.current_state)
            return 1;
          return 0;
        })
        epic.stories.forEach(story => {
          const labels = labelsCreate(story.labels)
          dom += `<tr class="stories story-${story.id}">`
          dom += `<td>
            <select
              style="width:125px"
              class="form-control"
              data-action-change
              data-type="change-state"
              data-epic-id="${idEpic}"
              data-epic-estimate="${epic.estimate}"
              data-story-id="${story.id}"
              data-story-estimate="${story.estimate}"
              data-member-id="${obj.member.person.id}"
            >
              ${optionsCreator(story.current_state)}
            </select>
          </td>`
          dom += `<td>
            <div class="mark ${fn.stateToCSS(story.current_state).css}">
            </div>
             ${story.name} - ${story.estimate}pts -
             <a target="new" href="${story.url}">#${story.id}</a>
           </td>`

           dom += `
            <td>
              ${labels}
            </td>
           `

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
      // if (!isStories) {
      //   dom = ''
      // }
      dom += '</div>'
    }
  });
  fn._('stories').innerHTML = dom
}

const templatesStringDom = tstring => {
  createChild({
    type: 'table',
    props: {
      className: 'table table-sm table-responsive table-dark',
    },
    child: [{
      type: 'tbody',
      child: tstring.map(elm => ({
          type: 'tr',
          child: [{
            type: 'td',
            child: [{
              type: 'span',
              props: { className: 'added-action-icon' },
              child: [{
                type: 'i',
                props: {
                  dataset: {
                    actionSelect: '',
                    type: 'template',
                    templateText: elm.text,
                    templateId: elm.id,
                  },
                  className: 'icono-plus',
                }
              }]
            }]
          },
          {
            type: 'td',
            props: { style: { paddingTop: '10px' } },
            child: [{ type: 'text', child: elm.text }],
          },
          {
          type: 'td',
          child: [{
            type: 'button',
            props: {
              className: 'btn btn-sm btn-danger',
              dataset: {
                actionSelect: '',
                type: 'template:removebyid',
                templateId: elm.id,
              },
              style: { textAlign: 'right' },
              click: templatesBtnDangerClick,
            },
            child: [0].map(e => ({ type: 'text', child: '×' })),
          }]
        }]
        }))
    }]
  }, fn.remove(fn._('templates')))
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
