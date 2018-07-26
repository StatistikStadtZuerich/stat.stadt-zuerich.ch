PREFIX qb: <http://purl.org/linked-data/cube#>
PREFIX ldprop: <http://ld.stadt-zuerich.ch/statistics/property/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX sh: <http://www.w3.org/ns/shacl#>
PREFIX cube: <http://purl.org/linked-data/cube#>

CONSTRUCT {
  <http://stat.stadt-zuerich.ch/dataset/BRW-RAUM-ZEIT-EBA-HEA-HEL/slice> a qb:Slice ;
    qb:observation ?observation .
  ?observation a qb:Observation ;
    ?property ?value .
} WHERE {
  {
    GRAPH <https://linked.opendata.swiss/graph/zh/statistics> {
      # observations
      ?observation a qb:Observation ;
        qb:dataSet <http://ld.stadt-zuerich.ch/statistics/dataset/BRW-RAUM-ZEIT-EBA-HEA-HEL> ;
        ?property ?value.

      # dimensions
      ?observation
        <http://ld.stadt-zuerich.ch/statistics/property/EBA> ?eba;
        <http://ld.stadt-zuerich.ch/statistics/property/HEA> ?hea;
        <http://ld.stadt-zuerich.ch/statistics/property/HEL> <http://ld.stadt-zuerich.ch/statistics/code/HEL1000>;
        <http://ld.stadt-zuerich.ch/statistics/property/RAUM> <http://ld.stadt-zuerich.ch/statistics/code/R30000>;
        <http://ld.stadt-zuerich.ch/statistics/property/ZEIT> ?zeit .

      # notations for filters
      ?eba skos:notation ?ebaNotation .
      ?hea skos:notation ?heaNotation .

      # filters
      ${typeof eba !== 'undefined' ? 'FILTER (?ebaNotation IN (' + (eba.join ? eba.map(v => v.toCanonical()).join() : eba.toCanonical()) + '))' : ''}
      ${typeof hea !== 'undefined' ? 'FILTER (?heaNotation IN (' + (hea.join ? hea.map(v => v.toCanonical()).join() : hea.toCanonical()) + '))' : ''}

      # time range filter
      ${typeof from !== 'undefined' ? 'FILTER (?zeit >= xsd:date("' + (from.value.length === 4 ? from.value + '-01-01' : from.value) + '"))':''}
      ${typeof to !== 'undefined' ? 'FILTER (?zeit <= xsd:date("' + (to.value.length === 4 ? to.value + '-12-31' : to.value) + '"))':''}
    }
  }
}
