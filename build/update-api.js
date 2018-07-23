const buildViewsHydraApiDoc = require('./build-views-hydra-api-doc')
const buildViewsJsonldContext = require('./build-views-jsonld-context')
const buildViewsQueryTemplates = require('./build-views-query-templates')
const fs = require('fs')
const fetchProperties = require('./fetch-properties')
const fetchViews = require('./fetch-views')
const shell = require('shelljs')
const Promise = require('bluebird')

const config = require('../api-config')

Promise.all([
  fetchViews(config).then((views) => {
    shell.mkdir('-p', 'api')

    return Promise.all([
      buildViewsQueryTemplates(views),
      buildViewsHydraApiDoc(views)
    ]).spread((queryTemplates, api) => {
      fs.writeFileSync('api/api.jsonld', JSON.stringify(api, null, '  '))
    })
  }),
  fetchProperties(config).then((properties) => {
    return buildViewsJsonldContext(properties)
  })
]).catch((err) => {
  console.error(err.stack || err.message)
})
