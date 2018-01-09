const fs = require('fs')
const path = require('path')
const u = require('./utils')

function buildViewQueryTemplate (view, template) {
  const filename = path.join('api', view.notation + '.sparql.es6')

  const patterns = Object.keys(view.dimensions).map((dimensionIri) => {
    const variable = u.variableName(dimensionIri)
    const value = view.dimensions[dimensionIri]

    return '<' + dimensionIri + '> ' + (value ? '<' + value + '>' : '?' + variable)
  }).join(';\n      ')

  const notationPatterns = Object.keys(view.dimensions).filter(u.isNotZeit).map((dimensionIri) => {
    const variable = u.variableName(dimensionIri)

    return '?' + variable + ' skos:notation ' + '?' + variable + 'Notation .'
  }).join('\n    ')

  const filters = Object.keys(view.dimensions).filter(d => !view.dimensions[d]).filter(u.isNotZeit).map((dimensionIri) => {
    const variable = u.variableName(dimensionIri)

    return '${typeof ' + variable + ' !== \'undefined\' ? \'FILTER (?' + variable + 'Notation IN (\' + (' + variable + '.join ? ' + variable + '.map(v => v.toCanonical()).join() : ' + variable + '.toCanonical()) + \'))\' : \'\'}'
  }).join('\n    ')

  const query = template
    .split('%%DATASET%%').join(view.dataset)
    .split('%%PATTERNS%%').join(patterns)
    .split('%%NOTATION_PATTERNS%%').join(notationPatterns)
    .split('%%FILTERS%%').join(filters)

  fs.writeFileSync(filename, query)

  return query
}

function buildViewQueryTemplates (views) {
  const template = fs.readFileSync(path.join(__dirname, 'support/hydra-view-operation.sparql.es6')).toString()

  return Object.keys(views).sort().map((viewIri) => {
    return buildViewQueryTemplate(views[viewIri], template)
  })
}

module.exports = buildViewQueryTemplates
