const buildViewsHydraApiDoc = require('./build-views-hydra-api-doc')
const buildViewsJsonldContext = require('./build-views-jsonld-context')
const buildViewsQueryTemplates = require('./build-views-query-templates')
const fs = require('fs')
const path = require('path')
const fetchProperties = require('./fetch-properties')
const fetchViews = require('./fetch-views')
const shell = require('shelljs')
const Promise = require('bluebird')

const config = configFromArguments();

Promise.all([
  fetchViews(config).then((views) => {
    shell.mkdir('-p', config.outDir)

    return Promise.all([
      buildViewsQueryTemplates(views, config),
      buildViewsHydraApiDoc(views,config)
    ]).spread((queryTemplates, api) => {
      fs.writeFileSync(path.join(config.outDir, 'api.jsonld'), JSON.stringify(api, null, '  '))
    })
  }),
  fetchProperties(config).then((properties) => {
    return buildViewsJsonldContext(properties, config)
  })
]).catch((err) => {
  console.error(err.stack || err.message)
})

function configFromArguments() {
  const args = process.argv.slice(2);
  const configFile = args[0];
  console.log(`Using config-file: ${configFile}`);
  return require(`../${configFile}`);
}
