const fetch = require('node-fetch')
const fs = require('fs')
const path = require('path')
const shell = require('shelljs')
const Promise = require('bluebird')
const SparqlHttp = require('sparql-http-client')

SparqlHttp.fetch = fetch

const config = {
  endpointUrl: 'http://data.zazuko.com:5820/ssz/query',
  user: 'anonymous',
  password: 'anonymous'
}

function variableName (iri) {
  return iri.split('/').pop().toLowerCase()
}

function notZeit (iri) {
  return iri !== 'http://stat.stadt-zuerich.ch/statistics/property/ZEIT'
}

function fetchViews (config) {
  const client = new SparqlHttp({endpointUrl: config.endpointUrl})

  const query = fs.readFileSync('scripts/views-dimensions.sparql').toString()

  return client.selectQuery(query, {headers: {
    authorization: 'Basic ' + Buffer.from(config.user + ':' + config.password).toString('base64')
  }}).then((res) => {
    if (res.status !== 200) {
      return Promise.reject(new Error('status code: ' + res.status))
    }

    return res.json()
  }).then((result) => {
    return result.results.bindings.reduce((views, row) => {
      const viewIri = row.view.value

      views[viewIri] = views[viewIri] || {
        iri: viewIri,
        notation: row.notation.value,
        dataset: row.dataset.value,
        dimensions: {}
      }

      views[viewIri].dimensions[row.dimension.value] = row.lock ? row.lock.value : undefined

      return views
    }, {})
  })
}

function buildQuery (view, template) {
  const filename = path.join('api', view.notation + '.sparql.es6')

  const patterns = Object.keys(view.dimensions).map((dimensionIri) => {
    const variable = variableName(dimensionIri)
    const value = view.dimensions[dimensionIri]

    return '<' + dimensionIri + '> ' + (value ? '<' + value + '>' : '?' + variable)
  }).join(';\n      ')

  const notationPatterns = Object.keys(view.dimensions).filter(notZeit).map((dimensionIri) => {
    const variable = variableName(dimensionIri)

    return '?' + variable + ' skos:notation ' + '?' + variable + 'Notation .'
  }).join('\n    ')

  const filters = Object.keys(view.dimensions).filter(d => !view.dimensions[d]).filter(notZeit).map((dimensionIri) => {
    const variable = variableName(dimensionIri)

    return '${typeof ' + variable + ' !== \'undefined\' ? \'FILTER (?' + variable + 'Notation IN (\' + (' + variable + '.join ? ' + variable + '.map(v => v.toCanonical()).join() : ' + variable + '.toCanonical()) + \'))\' : \'\'}'
  }).join('\n    ')

  const query = template
    .split('%%DATASET%%').join(view.dataset)
    .split('%%PATTERNS%%').join(patterns)
    .split('%%NOTATION_PATTERNS%%').join(notationPatterns)
    .split('%%FILTERS%%').join(filters)

  fs.writeFileSync(filename, query)
}

function attachApi (view, api) {
  const supportedClass = {
    '@id': 'http://stat.stadt-zuerich.ch/api/schema/statistics/' + view.notation,
    '@type': ['Class', 'Collection'],
    search: {
      '@id': 'http://stat.stadt-zuerich.ch/api/schema/statistics/' + view.notation + '#search'
    },
    supportedOperation: [{
      '@id': 'http://stat.stadt-zuerich.ch/api/schema/statistics/' + view.notation + '#get',
      '@type': [
        'Operation',
        'http://example.org/hv/HydraView'
      ],
      method: 'GET',
      'http://example.org/hv/variables': {
        '@id': 'http://stat.stadt-zuerich.ch/api/schema/statistics/' + view.notation + '#search'
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
      'expects': 'http://stat.stadt-zuerich.ch/api/schema/statistics/' + view.notation + '#input',
      'returns': 'http://stat.stadt-zuerich.ch/api/schema/Result'
    }]
  }

  api['@graph'][0].supportedClass.push(supportedClass)

  return api
}

fetchViews(config).then((views) => {
  shell.mkdir('-p', 'api')

  const queryTemplate = fs.readFileSync('scripts/hydra-view-operation.sparql.es6').toString()
  const api = JSON.parse(fs.readFileSync('scripts/hydra-api-stub.json').toString())

  const viewIris = Object.keys(views).sort()

  return Promise.all([
    viewIris.map((viewIri) => {
      return buildQuery(views[viewIri], queryTemplate)
    }),
    Promise.mapSeries(viewIris, (viewIri) => {
      return attachApi(views[viewIri], api)
    })
  ]).then(() => {
    fs.writeFileSync('api/api.jsonld', JSON.stringify(api, null, '  '))
  })
}).catch((err) => {
  console.error(err.stack || err.message)
})
