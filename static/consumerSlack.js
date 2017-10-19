const fn = require('../static/functions')

const api = 'https://slack.com/api'
const misCabeceras = new Headers()

const publish = (slack_token, channel_id, text, endpoint, cb) => {

  var data = `token=${slack_token}&channel=${channel_id}&text=${encodeURI(text)}`
  var xhr = new XMLHttpRequest()
  xhr.withCredentials = true

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      console.log(this.responseText);
      const obj = {
        name: endpoint,
        value: JSON.parse(this.responseText),
      }
      cb(obj)
    }
  })

  xhr.open('POST', `${api}/chat.postMessage`)
  xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded")
  xhr.setRequestHeader("cache-control", "no-cache")

  xhr.send(data);

}


module.exports = {
  publish,
}
