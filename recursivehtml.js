const hmtlout = ''

const testJSONTAG = () => {
  const createChild = elm => {
    let _elm = elm

    if (_elm.child) {
      //ELM
      if (_elm.type === 'text') {
        console.log(`${_elm.child}`);
      } else {
        console.log(`<${_elm.type}></${_elm.type}>`);
      }
      for (var i = 0; i < _elm.child.length; i++) {
        createChild(_elm.child[i])
      }

    }
  }

  const _html = {
    target: 'htmltest',
    elm: {
      type: 'div',
      child: [{
        type: 'div',
        child: [{
          type: 'text',
          child: 'hola',
        },{
          type: 'div',
          child: [{
            type: 'p',
            child: [{
              type: 'text',
              child: 'text',
            }],
          }]
        }]
      }]
    }
  }
  // let out = fn._(_html.target)
  let html = _html.elm
  // let htmlOut = fn.create(html.type)

  createChild(html)

}

testJSONTAG()
