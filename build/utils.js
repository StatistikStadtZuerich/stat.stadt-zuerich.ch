function isNotZeit (iri) {
  return !isZeit(iri)
}

function isZeit (iri) {
  return iri === 'https://ld.stadt-zuerich.ch/statistics/property/ZEIT'
}

function variableName (iri) {
  return iri.split('/').pop().toLowerCase()
}

module.exports = {
  isNotZeit,
  isZeit,
  variableName
}
