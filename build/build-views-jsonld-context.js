const fs = require('fs')
const path = require('path')
const u = require('./utils')

function buildPropertiesContext (properties, stubFilename, outputFilename, short) {
  const context = JSON.parse(fs.readFileSync(stubFilename).toString())

  properties.forEach((property) => {
    const key = (property.iri.startsWith('http://ld.stadt-zuerich.ch/statistics/measure/') ? 'm' : 'd') + property.notation

    if (short) {
      context['@context'][key] = property.iri
    } else {
      context['@context'][key] = {
        '@id': property.iri
      }

      if (u.isNotZeit(property.iri)) {
        context['@context'][key]['@type'] = property.datatype || '@id'
      }
    }
  })

  fs.writeFileSync(outputFilename, JSON.stringify(context, null, '  '))

  return Promise.resolve(context)
}

function buildViewsSliceJsonldContext (properties) {
  return buildPropertiesContext(properties,
    path.join(__dirname, 'support/slice.context.jsonld'),
    path.join(__dirname, '../api/slice.context.jsonld'))
}

function buildViewsShapeJsonldContext (properties) {
  return buildPropertiesContext(properties,
    path.join(__dirname, 'support/shape.context.jsonld'),
    path.join(__dirname, '../api/shape.context.jsonld'), true)
}

function buildViewsJsonldContext (properties) {
  return Promise.all([
    buildViewsSliceJsonldContext(properties),
    buildViewsShapeJsonldContext(properties)
  ])
}

module.exports = buildViewsJsonldContext
