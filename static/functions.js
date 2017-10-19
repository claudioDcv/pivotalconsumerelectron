const _ = id => document.getElementById(id)

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

module.exports = {
  _,
  stateToCSS,
}
