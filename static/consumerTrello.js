const baseUrl = 'https://api.trello.com'
const version = '1'
const boards = (token, key, idBoard) => `${baseUrl}/${version}/boards/${idBoard}?fields=id&lists=open&list_fields=id,name&key=${key}&token=${token}`
const cards = (token, key, idBoard) => `${baseUrl}/${version}/boards/${idBoard}/cards/?fields=name,idBoard,idList,url&members=true&member_fields=fullName&key=${key}&token=${token}`

const encodeQueryData = data => {
   let ret = [];
   for (let d in data)
     ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
   return ret.join('&');
};

console.log(boards, cards);
const misCabeceras = new Headers()


const get = (token, key, idBoard, cb) => {
  // misCabeceras.set('X-TrackerToken', token)
  const miInit = { method: 'GET',
               headers: misCabeceras,
               mode: 'cors',
               cache: 'default' };

  fetch(boards(token, key, idBoard), miInit)
  .then( function(response){
    response.json().then(function(json) {
      const obj = {
        name: '',
        value: json,
      }
      cb(obj)
    });
  })
}

const getCards = (token, key, idBoard, cb) => {
  // misCabeceras.set('X-TrackerToken', token)
  const miInit = { method: 'GET',
               headers: misCabeceras,
               mode: 'cors',
               cache: 'default' };

  fetch(cards(token, key, idBoard), miInit)
  .then( function(response){
    response.json().then(function(json) {
      const obj = {
        name: '',
        value: json,
      }
      cb(obj)
    });
  })
}

module.exports = {
  get,
  getCards,
}
