const fetch = require('node-fetch')
const fs = require('fs')
const path = require('path')
const SparqlHttp = require('sparql-http-client')

SparqlHttp.fetch = fetch

function fetchViews (config) {
  const query = fs.readFileSync(path.join(__dirname, 'support/views-dimensions.sparql')).toString()

  const client = new SparqlHttp({endpointUrl: config.endpointUrl})

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

module.exports = fetchViews
