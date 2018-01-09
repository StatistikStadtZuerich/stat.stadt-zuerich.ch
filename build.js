const buildViewsHydraApiDoc = require('./build/build-views-hydra-api-doc')
const buildViewsQueryTemplates = require('./build/build-views-query-templates')
const fs = require('fs')
const fetchViews = require('./build/fetch-views')
const shell = require('shelljs')
const Promise = require('bluebird')

const config = {
  endpointUrl: 'http://data.zazuko.com:5820/ssz/query',
  user: 'ssz-read',
  password: 'coo2aiw6itiT'
}

fetchViews(config).then((views) => {
  shell.mkdir('-p', 'api')

  return Promise.all([
    buildViewsQueryTemplates(views),
    buildViewsHydraApiDoc(views)
  ]).spread((queryTemplates, api) => {
    fs.writeFileSync('api/api.jsonld', JSON.stringify(api, null, '  '))
  })
}).catch((err) => {
  console.error(err.stack || err.message)
})
