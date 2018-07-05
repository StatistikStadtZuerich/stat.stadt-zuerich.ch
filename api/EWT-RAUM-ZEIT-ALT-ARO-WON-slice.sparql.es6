PREFIX qb: <http://purl.org/linked-data/cube#>
PREFIX ldprop: <http://ld.stadt-zuerich.ch/statistics/property/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX sh: <http://www.w3.org/ns/shacl#>
PREFIX cube: <http://purl.org/linked-data/cube#>

CONSTRUCT {
  <http://stat.stadt-zuerich.ch/dataset/EWT-RAUM-ZEIT-ALT-ARO-WON/slice> a qb:Slice ;
    qb:observation ?observation .
  ?observation a qb:Observation ;
    ?property ?value .
} WHERE {
  {
    GRAPH <https://linked.opendata.swiss/graph/zh/statistics> {
      # observations
      ?observation a qb:Observation ;
        qb:dataSet <http://ld.stadt-zuerich.ch/statistics/dataset/EWT-RAUM-ZEIT-ALT-ARO-WON> ;
        ?property ?value.

      # dimensions
      ?observation
        <http://ld.stadt-zuerich.ch/statistics/property/ALT> ?alt;
        <http://ld.stadt-zuerich.ch/statistics/property/ARO> ?aro;
        <http://ld.stadt-zuerich.ch/statistics/property/RAUM> <http://ld.stadt-zuerich.ch/statistics/code/R30000>;
        <http://ld.stadt-zuerich.ch/statistics/property/WON> ?won;
        <http://ld.stadt-zuerich.ch/statistics/property/ZEIT> ?zeit .

      # notations for filters
      ?alt skos:notation ?altNotation .
      ?aro skos:notation ?aroNotation .
      ?won skos:notation ?wonNotation .

      # filters
      ${typeof alt !== 'undefined' ? 'FILTER (?altNotation IN (' + (alt.join ? alt.map(v => v.toCanonical()).join() : alt.toCanonical()) + '))' : ''}
      ${typeof aro !== 'undefined' ? 'FILTER (?aroNotation IN (' + (aro.join ? aro.map(v => v.toCanonical()).join() : aro.toCanonical()) + '))' : ''}
      ${typeof won !== 'undefined' ? 'FILTER (?wonNotation IN (' + (won.join ? won.map(v => v.toCanonical()).join() : won.toCanonical()) + '))' : ''}

      # time range filter
      ${typeof from !== 'undefined' ? 'FILTER (?zeit >= xsd:date("' + (from.value.length === 4 ? from.value + '-01-01' : from.value) + '"))':''}
      ${typeof to !== 'undefined' ? 'FILTER (?zeit <= xsd:date("' + (to.value.length === 4 ? to.value + '-12-31' : to.value) + '"))':''}
    }
  }
}
