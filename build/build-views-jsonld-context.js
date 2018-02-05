const fs = require('fs')
const path = require('path')
const u = require('./utils')

function buildViewsJsonldContext (properties) {
  const context = JSON.parse(fs.readFileSync(path.join(__dirname, 'support/slice.context.jsonld')).toString())

  properties.forEach((property) => {
    const key = (property.iri.startsWith('http://ld.stadt-zuerich.ch/statistics/measure/') ? 'm' : 'd') + property.notation

    context['@context'][key] = {
      '@id': property.iri
    }

    if (u.isNotZeit(property.iri)) {
      context['@context'][key]['@type'] = property.datatype || '@id'
    }
  })

  fs.writeFileSync(path.join(__dirname, '../api/slice.context.jsonld'), JSON.stringify(context, null, '  '))

  return Promise.resolve(context)
}

module.exports = buildViewsJsonldContext
