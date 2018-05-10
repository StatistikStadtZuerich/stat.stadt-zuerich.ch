PREFIX qb: <http://purl.org/linked-data/cube#>
PREFIX ldprop: <http://ld.stadt-zuerich.ch/statistics/property/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX sh: <http://www.w3.org/ns/shacl#>
PREFIX cube: <http://purl.org/linked-data/cube#>

CONSTRUCT {
  <http://stat.stadt-zuerich.ch/dataset/ZIM-RAUM-ZEIT-WHA-ZON/slice> a qb:Slice ;
    qb:observation ?observation .
  ?observation a qb:Observation ;
    ?property ?value .
} WHERE {
  {
    GRAPH <https://linked.opendata.swiss/graph/zh/statistics> {
      # observations
      ?observation a qb:Observation ;
        qb:dataSet <http://ld.stadt-zuerich.ch/statistics/dataset/ZIM-RAUM-ZEIT-WHA-ZON> ;
        ?property ?value.

      # dimensions
      ?observation
        <http://ld.stadt-zuerich.ch/statistics/property/RAUM> <http://ld.stadt-zuerich.ch/statistics/code/R30000>;
        <http://ld.stadt-zuerich.ch/statistics/property/WHA> ?wha;
        <http://ld.stadt-zuerich.ch/statistics/property/ZEIT> ?zeit;
        <http://ld.stadt-zuerich.ch/statistics/property/ZON> ?zon .

      # notations for filters
      ?wha skos:notation ?whaNotation .
      ?zon skos:notation ?zonNotation .

      # filters
      ${typeof wha !== 'undefined' ? 'FILTER (?whaNotation IN (' + (wha.join ? wha.map(v => v.toCanonical()).join() : wha.toCanonical()) + '))' : ''}
      ${typeof zon !== 'undefined' ? 'FILTER (?zonNotation IN (' + (zon.join ? zon.map(v => v.toCanonical()).join() : zon.toCanonical()) + '))' : ''}

      # time range filter
      ${typeof from !== 'undefined' ? 'FILTER (?zeit >= xsd:date("' + (from.value.length === 4 ? from.value + '-01-01' : from.value) + '"))':''}
      ${typeof to !== 'undefined' ? 'FILTER (?zeit <= xsd:date("' + (to.value.length === 4 ? to.value + '-12-31' : to.value) + '"))':''}
    }
  }
}
