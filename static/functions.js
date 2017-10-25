const _ = id => document.getElementById(id)
const create = name => document.createElement(name)
const text = text => document.createTextNode(text)
const add = (parent, child) => parent.appendChild(child)

const remove = elm => {
  let n = elm
  if (!n) {
    return n
  }
  while (n.firstChild) {
      n.removeChild(n.firstChild);
  }
  return n
}

const states = {
  accepted: { css: 'bg-success', txt: 'Aceptada' },
  delivered: { css: 'bg-warning', txt: 'Entregado' },
  unstarted: { css: 'bg-secondary', txt: 'No Iniciada' },
  unscheduled: { css: 'bg-danger', txt: 'Sin Planificar' },
  finished: { css: 'bg-success', txt: 'Finalizada' },
  started: { css: 'bg-success', txt: 'Iniciada' },
}

const stateToCSS = state => {
  const defaultobj = { css: 'bg-success', txt: state }
  const obj = states
  return obj[state] || defaultobj
}

/*
var template = '<p>Hello, my name is <%this.name%>. I\'m <%this.profile.age%> years old.</p>';
console.log(render(template, {
    name: "Krasimir Tsonev",
    profile: { age: 29 }
}));
*/
const render = (html, options) => {
	var re = /{{(.+?)}}/g,
		reExp = /(^( )?(var|if|for|else|switch|case|break|{|}|;))(.*)?/g,
		code = 'with(obj) { var r=[];\n',
		cursor = 0,
		result,
	    	match;
	var add = function(line, js) {
		js? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
			(code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
		return add;
	}
	while(match = re.exec(html)) {
		add(html.slice(cursor, match.index))(match[1], true);
		cursor = match.index + match[0].length;
	}
	add(html.substr(cursor, html.length - cursor));
	code = (code + 'return r.join(""); }').replace(/[\r\t\n]/g, ' ');
	try { result = new Function('obj', code).apply(options, [options]); }
	catch(err) { console.error("'" + err.message + "'", " in \n\nCode:\n", code, "\n"); }
	return result;
}

var template = 'My name is {{this.name}} {{this.profile.age}} years old.'
console.log(render(template, {
    name: "Krasimir Tsonev",
    profile: { age: 29 }
}));

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



module.exports = {
  _,
  create,
  text,
  add,
  stateToCSS,
  remove,
  render,
  createChild,
  kebakToCamel,
  camelToKebak,
  addListener,
  states,
}
