const fn = require('../static/functions')

const api = 'https://www.pivotaltracker.com/services/v5'
const misCabeceras = new Headers()

const getMe = (token, project_id, endpoint, cb) => {
  misCabeceras.set('X-TrackerToken', token)
  const miInit = { method: 'GET',
               headers: misCabeceras,
               mode: 'cors',
               cache: 'default' };

  fetch(`${api}/${endpoint}`,miInit)
  .then( function(response){
    response.json().then(function(json) {
      const obj = {
        name: endpoint,
        value: json,
      }
      cb(obj)
    });
  })
}

const get = (token, project_id, endpoint, cb) => {
  misCabeceras.set('X-TrackerToken', token)
  const miInit = { method: 'GET',
               headers: misCabeceras,
               mode: 'cors',
               cache: 'default' };

  fetch(`${api}/projects/${project_id}/${endpoint}`,miInit)
  .then( function(response){
    response.json().then(function(json) {
      const obj = {
        name: endpoint,
        value: json,
      }
      cb(obj)
    });
  })
}

const getStories = (token, project_id, endpoint, cb) => {
  const domNode = fn._(endpoint)
  const labels = fn._('labels').value
  misCabeceras.set('X-TrackerToken', token)

  const miInit = { method: 'GET',
               headers: misCabeceras,
               mode: 'cors',
               cache: 'default',
            };

  fetch(`${api}/projects/${project_id}/${endpoint}?with_label=${labels}`,miInit)
  .then( function(response){
    response.json().then(function(json) {
      const obj = {
        name: endpoint,
        value: json,
        node: domNode,
      }
      cb(obj)
    });
  })
}

const updateStory = (token, project_id, story, cb) => {
  const s = story
  const id = s.id
  delete s.id
  misCabeceras.set('X-TrackerToken', token)

  const fd = new FormData()
  fd.append('current_state', s.current_state)
  const miInit = { method: 'PUT',
               headers: misCabeceras,
               mode: 'cors',
               cache: 'default',
               body: fd,
             };

  fetch(`${api}/projects/${project_id}/stories/${id}`,miInit)
  .then( function(response){
    response.json().then(function(json) {
      const obj = {
        name: 'story',
        value: json,
      }
      cb(obj)
    });
  })
}

module.exports = {
  getMe,
  get,
  getStories,
  updateStory,
}
