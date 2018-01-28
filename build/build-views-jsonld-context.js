const fs = require('fs')
const path = require('path')

function buildViewsJsonldContext () {
  const context = JSON.parse(fs.readFileSync(path.join(__dirname, 'support/slice.context.jsonld')).toString())
  const kennzahlen = fs.readFileSync(path.join(__dirname, 'support/kennzahlen.csv')).toString().split('\n').slice(1).filter(l => l)

  kennzahlen.forEach((kennzahl) => {
    context['@context']['ssz-measure:' + kennzahl] = {
      '@id': 'ssz-measure:' + kennzahl,
      '@type': 'http://www.w3.org/2001/XMLSchema#double'
    }
  })

  fs.writeFileSync(path.join(__dirname, '../api/slice.context.jsonld'), JSON.stringify(context, null, '  '))

  return Promise.resolve(context)
}

module.exports = buildViewsJsonldContext
