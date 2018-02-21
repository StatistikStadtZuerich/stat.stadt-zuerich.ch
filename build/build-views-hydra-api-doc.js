const fs = require('fs')
const path = require('path')
const u = require('./utils')
const Promise = require('bluebird')

function attachSupportedClass (view, api) {
  const supportedClass = {
    '@id': 'http://stat.stadt-zuerich.ch/api/schema/dataset/' + view.notation,
    '@type': 'Class',
    supportedProperty: [{
      property: {
        '@id': 'http://stat.stadt-zuerich.ch/api/schema/dataset/' + view.notation + '#slice',
        search: {
          '@id': 'http://stat.stadt-zuerich.ch/api/schema/dataset/' + view.notation + '#search'
        },
        supportedOperation: [{
          '@id': 'http://stat.stadt-zuerich.ch/api/schema/dataset/' + view.notation + '#slice-get',
          '@type': [
            'Operation',
            'http://hydra-box.org/schema/View'
          ],
          method: 'GET',
          'http://hydra-box.org/schema/variables': {
            '@id': 'http://stat.stadt-zuerich.ch/api/schema/dataset/' + view.notation + '#search'
          },
          'http://hydra-box.org/schema/code': {
            '@type': 'http://hydra-box.org/schema/SparqlQuery',
            'http://hydra-box.org/schema/source': {
              '@id': view.notation + '-slice.sparql.es6'
            }
          },
          'http://hydra-box.org/schema/returnFrame': {
            '@id': 'slice.context.jsonld'
          },
          'expects': 'http://stat.stadt-zuerich.ch/api/schema/dataset/' + view.notation + '#slice-input',
          'returns': 'http://purl.org/linked-data/cube#Slice'
        }]
      }
    }, {
      property: {
        '@id': 'http://stat.stadt-zuerich.ch/api/schema/dataset/' + view.notation + '#dataset',
        supportedOperation: [
          {
            '@id': 'http://stat.stadt-zuerich.ch/api/schema/dataset/' + view.notation + '#dataset-get',
            '@type': [
              'Operation',
              'http://hydra-box.org/schema/View'
            ],
            method: 'GET',
            'http://hydra-box.org/schema/code': {
              '@type': 'http://hydra-box.org/schema/SparqlQuery',
              'http://hydra-box.org/schema/source': {
                '@id':  view.notation + '-shape.sparql.es6'
              }
            },
            'http://hydra-box.org/schema/returnFrame': {
              '@id': 'shape.context.jsonld'
            },
            expects: null,
            returns: 'http://www.w3.org/ns/shacl#NodeShape'
          }
        ]
      }
    }]
  }

  api['@graph'][0].supportedClass.push(supportedClass)
}

function attachInputClass (view, api, variables) {
  const inputClass = {
    '@id': 'http://stat.stadt-zuerich.ch/api/schema/dataset/' + view.notation + '#slice-input',
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
    '@id': 'http://stat.stadt-zuerich.ch/api/schema/dataset/' + view.notation + '#search',
    '@type': 'IriTemplate',
    template: '/api/dataset/' + view.notation + '/slice{?' + Object.keys(variables).map(k => variables[k]) + ',other}',
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
    '@id': 'http://stat.stadt-zuerich.ch/api/dataset/' + view.notation,
    '@type': [
      'http://stat.stadt-zuerich.ch/api/schema/dataset/' + view.notation,
      'http://purl.org/linked-data/cube#DataSet'
    ]
  }

  reference['http://stat.stadt-zuerich.ch/api/schema/dataset/' + view.notation + '#slice'] = {
    '@id': 'http://stat.stadt-zuerich.ch/api/dataset/' + view.notation + '/slice'
  }

  reference['http://stat.stadt-zuerich.ch/api/schema/dataset/' + view.notation + '#dataset'] = {
    '@id': 'http://stat.stadt-zuerich.ch/api/dataset/' + view.notation
  }

  api['@graph'].push(reference)
}

function buildViewHydraApiDoc (view, api) {
  // select all dimensions which don't have a fixed value
  const variables = Object.keys(view.dimensions).sort().filter(d => !view.dimensions[d]).reduce((variables, dimension) => {
    if (u.isZeit(dimension)) {
      variables['http://stat.stadt-zuerich.ch/api/schema/dataset/' + view.notation + '/property/ZEIT/FROM'] = 'from'
      variables['http://stat.stadt-zuerich.ch/api/schema/dataset/' + view.notation + '/property/ZEIT/TO'] = 'to'
    } else {
      const variable = u.variableName(dimension)

      variables['http://stat.stadt-zuerich.ch/api/schema/dataset/' + view.notation + '/property/' + variable.toUpperCase()] = variable
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
