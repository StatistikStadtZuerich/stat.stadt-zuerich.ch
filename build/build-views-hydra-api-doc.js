const fs = require('fs')
const path = require('path')
const u = require('./utils')
const Promise = require('bluebird')

function attachSupportedClass (view, api) {
  const supportedClass = {
    '@id': 'http://stat.stadt-zuerich.ch/api/schema/' + view.notation,
    '@type': ['Class', 'Collection'],
    search: {
      '@id': 'http://stat.stadt-zuerich.ch/api/schema/' + view.notation + '#search'
    },
    supportedOperation: [{
      '@id': 'http://stat.stadt-zuerich.ch/api/schema/' + view.notation + '#get',
      '@type': [
        'Operation',
        'http://example.org/hv/HydraView'
      ],
      method: 'GET',
      'http://example.org/hv/variables': {
        '@id': 'http://stat.stadt-zuerich.ch/api/schema/' + view.notation + '#search'
      },
      'http://example.org/hv/code': {
        '@type': 'http://example.org/hv/SparqlQuery',
        'http://example.org/hv/source': {
          '@id': view.notation + '.sparql.es6'
        }
      },
      'http://example.org/hv/returnFrame': {
        '@id': 'context.json'
      },
      'expects': 'http://stat.stadt-zuerich.ch/api/schema/' + view.notation + '#input',
      'returns': 'http://stat.stadt-zuerich.ch/api/schema/Result'
    }]
  }

  api['@graph'][0].supportedClass.push(supportedClass)
}

function attachInputClass (view, api, variables) {
  const inputClass = {
    '@id': 'http://stat.stadt-zuerich.ch/api/schema/' + view.notation + '#input',
    '@type': 'Class',
    supportedProperty: Object.keys(variables).map((iri) => {
      return {
        property: iri
      }
    })
  }

  api['@graph'].push(inputClass)
}

function attachIriTemplate (view, api, variables) {
  const iriTemplate = {
    '@id': 'http://stat.stadt-zuerich.ch/api/schema/' + view.notation + '#search',
    '@type': 'IriTemplate',
    template: '/api/' + view.notation + '/{?' + Object.values(variables) + '}',
    variableRepresentation: 'BasicRepresentation',
    mapping: Object.keys(variables).map((iri) => {
      const variable = variables[iri]

      return {
        '@type': 'IriTemplateMapping',
        variable: variable,
        property: iri
      }
    })
  }

  api['@graph'].push(iriTemplate)
}

function attachReference (view, api) {
  const reference = {
    '@id': 'http://stat.stadt-zuerich.ch/api/' + view.notation + '/',
    '@type': 'http://stat.stadt-zuerich.ch/api/schema/' + view.notation
  }

  api['@graph'].push(reference)
}

function buildViewHydraApiDoc (view, api) {
  // select all dimensions which don't have a fixed value
  const variables = Object.keys(view.dimensions).filter(d => !view.dimensions[d]).reduce((variables, dimension) => {
    if (u.isZeit(dimension)) {
      variables['http://stat.stadt-zuerich.ch/api/' + view.notation + '/property/ZEIT/FROM'] = 'from'
      variables['http://stat.stadt-zuerich.ch/api/' + view.notation + '/property/ZEIT/TO'] = 'to'
    } else {
      const variable = u.variableName(dimension)

      variables['http://stat.stadt-zuerich.ch/api/' + view.notation + '/property/' + variable.toUpperCase()] = variable
    }

    return variables
  }, {})

  attachSupportedClass(view, api)
  attachInputClass(view, api, variables)
  attachIriTemplate(view, api, variables)
  attachReference(view, api)
}

function buildViewsHydraApiDoc (views) {
  const api = JSON.parse(fs.readFileSync(path.join(__dirname, 'support/hydra-api-stub.json')).toString())

  return Promise.mapSeries(Object.keys(views).sort(), (viewIri) => {
    return buildViewHydraApiDoc(views[viewIri], api)
  }).then(() => api)
}

module.exports = buildViewsHydraApiDoc
