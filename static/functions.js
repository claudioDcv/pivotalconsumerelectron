const _ = id => document.getElementById(id)
const create = name => document.createElement(name)
const text = text => document.createTextNode(text)
const add = (parent, child) => parent.appendChild(child)

const remove = elm => {
  let n = elm
  while (n.firstChild) {
      n.removeChild(n.firstChild);
  }
  return n
}

const stateToCSS = state => {
  const defaultobj = { css: 'bg-success', txt: state }
  const obj = {
    accepted: { css: 'bg-success', txt: 'Aceptada' },
    delivered: { css: 'bg-warning', txt: 'Entregado' },
    unstarted: { css: 'bg-secondary', txt: 'No Iniciada' },
    unscheduled: { css: 'bg-danger', txt: 'Sin Planificar' },
    finished: { css: 'bg-success', txt: 'Finalizada' },
    started: { css: 'bg-success', txt: 'Iniciada' },
  }
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

module.exports = {
  _,
  create,
  text,
  add,
  stateToCSS,
  remove,
  render,
}
