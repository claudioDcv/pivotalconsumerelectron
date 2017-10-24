# pivotalconsumerelectron

## instruction

- `npm install`
- `npm run start`

## features

- support templates string
- config project pivotal
  - required `project id`, `api token`
- config slackboot
  - required `channel id`, `slackboot token`
- view list all user with epics and stories

## Caracteristicas
- Integración con Trello
  - se muestran `boards` con sus `cards` y sus `members`
- Integración con Slack
  - vinculación con `boot` para publicar en Slack en formator `markdown`
- Integración con Pivotal Tracker
  - se espera un `api token` y un `project id`
  - filtra por `labels`
  - filtra por usuario que agrega sus credenciales
  - Se ordena los `epics` por `member`, se muestran agrupadas las `stories` dentro de los `epics`
  - se muestran `labels` de cada `story`
- Sistema de publicación
  - se puede generar un post desde `pivotal` para publicar en `slack`
