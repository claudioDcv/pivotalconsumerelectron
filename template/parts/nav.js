const NAV = (logo, active) => `
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <a class="navbar-brand" href="#">
    <img src="${logo}" width="30" height="30" class="d-inline-block align-top" alt="">
    Pivotal Consumer
  </a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item ${active === 'index' && 'active'}">
        <a class="nav-link" href="index.html">index</a>
      </li>
      <li class="nav-item ${active === 'configuration' && 'active'}">
        <a class="nav-link" href="configuration.html">configuration</a>
      </li>
      <li class="nav-item ${active === 'configurationSlack' && 'active'}">
        <a class="nav-link" href="configurationSlack.html">Slack configuration</a>
      </li>
      <li class="nav-item ${active === 'configurationTrello' && 'active'}">
        <a class="nav-link" href="configurationTrello.html">Trello configuration</a>
      </li>
    </ul>
  </div>
</nav>
`
module.exports = NAV
