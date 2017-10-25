const { ipcRenderer } = require('electron')
const fn = require('../static/functions')
const consumerTrello = require('../static/consumerTrello')
const NAV = require('./parts/nav')

const MemberBadge = g => {
  return ({
    type: 'span',
    props: { className: 'badge badge-success' },
    child: [{ type: 'text', child: g.fullName }]
  })
}

const Board = f => {
  return ({
    type: 'div',
      props: { className: 'card text-white bg-dark' },
      child: [{
      	type: 'div',
      	props: { className: 'card-body' },
      	child: [{ type: 'text', child: f.name,}, {
      		type: 'div',
      		child: f.members.map(g => MemberBadge(g))
      	}]
      }]
    })
}

const initDom = (trelloServerToken, trelloKey, trelloIdBoard) => {
  // actions
  fn._('nav').innerHTML = NAV('../static/logo.png', 'configurationTrello')

  consumerTrello.get(trelloServerToken, trelloKey, trelloIdBoard, boards => {
      consumerTrello.getCards(trelloServerToken, trelloKey, trelloIdBoard, cards => {
        const _boards = {}
        boards.value.lists.forEach(elem => {
          elem.cards = []
          _boards[elem.id] = elem
        });
        cards.value.forEach(elem => {
          if (_boards[elem.idList]) {
            const b = _boards[elem.idList]
            b.cards.push(elem)
          }
        });

        const arrBoards = []
        Object.keys(_boards).forEach(elem => {
          arrBoards.push(_boards[elem])
        });

        fn.createChild({
          type: 'div',
          props: {
            style: {
              width: `${(320 * arrBoards.length)}px`
            },
            className: 'boards',
          },
          child: arrBoards.map(e => ({
            type: 'div',
            props: { className: 'board' },
            child: [{
              type: 'h2',
              child: [{ type: 'text', child: e.name }]
            },{
              type: 'div',
              props: { className: 'cards' },
              child: e.cards.map(f => Board(f)),
            }]
          }))
        }, fn._('boards'))

      })
  })

}

const init = () => {
  window.ipc = window.ipc || {};
  console.log(1);

  fn._('btn').addEventListener('click', event => {
    event.preventDefault()
    ipcRenderer.send('save:trelloCredentials',
      fn._('trelloServerToken').value,
      fn._('trelloKey').value,
      fn._('trelloIdBoard').value
    )
  })

  ipcRenderer.on('reply:trelloCredentials', (event, trelloServerToken, trelloKey, trelloIdBoard) => {
    console.log(trelloServerToken, trelloKey, trelloIdBoard)
  })

  ipcRenderer.on('init:trelloCredentials', (event, trelloServerToken, trelloKey, trelloIdBoard) => {
    initDom(trelloServerToken, trelloKey, trelloIdBoard)
    fn._('trelloServerToken').value = trelloServerToken
    fn._('trelloKey').value = trelloKey
    fn._('trelloIdBoard').value = trelloIdBoard
  })

  ipcRenderer.send('init:trelloCredentials')
}


init()
