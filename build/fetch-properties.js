const fetch = require('node-fetch')
const fs = require('fs')
const path = require('path')
const SparqlHttp = require('sparql-http-client')

SparqlHttp.fetch = fetch

function fetchProperties (config) {
  const query = fs.readFileSync(path.join(__dirname, 'support/properties.sparql')).toString()

  const client = new SparqlHttp({endpointUrl: config.endpointUrl})

  return client.selectQuery(query, {headers: {
    authorization: 'Basic ' + Buffer.from(config.user + ':' + config.password).toString('base64')
  }}).then((res) => {
    if (res.status !== 200) {
      return Promise.reject(new Error('status code: ' + res.status))
    }

    return res.json()
  }).then((result) => {
    return result.results.bindings.map((row) => {
      return {
        iri: row.property.value,
        notation: row.notation.value,
        datatype: row.datatype && row.datatype.value
      }
    })
  })
}

module.exports = fetchProperties
