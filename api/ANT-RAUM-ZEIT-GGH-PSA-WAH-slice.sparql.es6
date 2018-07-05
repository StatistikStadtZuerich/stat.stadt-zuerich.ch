PREFIX qb: <http://purl.org/linked-data/cube#>
PREFIX ldprop: <http://ld.stadt-zuerich.ch/statistics/property/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX sh: <http://www.w3.org/ns/shacl#>
PREFIX cube: <http://purl.org/linked-data/cube#>

CONSTRUCT {
  <http://stat.stadt-zuerich.ch/dataset/ANT-RAUM-ZEIT-GGH-PSA-WAH/slice> a qb:Slice ;
    qb:observation ?observation .
  ?observation a qb:Observation ;
    ?property ?value .
} WHERE {
  {
    GRAPH <https://linked.opendata.swiss/graph/zh/statistics> {
      # observations
      ?observation a qb:Observation ;
        qb:dataSet <http://ld.stadt-zuerich.ch/statistics/dataset/ANT-RAUM-ZEIT-GGH-PSA-WAH> ;
        ?property ?value.

      # dimensions
      ?observation
        <http://ld.stadt-zuerich.ch/statistics/property/GGH> ?ggh;
        <http://ld.stadt-zuerich.ch/statistics/property/PSA> ?psa;
        <http://ld.stadt-zuerich.ch/statistics/property/RAUM> <http://ld.stadt-zuerich.ch/statistics/code/R30000>;
        <http://ld.stadt-zuerich.ch/statistics/property/WAH> <http://ld.stadt-zuerich.ch/statistics/code/WAH1101>;
        <http://ld.stadt-zuerich.ch/statistics/property/ZEIT> ?zeit .

      # notations for filters
      ?ggh skos:notation ?gghNotation .
      ?psa skos:notation ?psaNotation .

      # filters
      ${typeof ggh !== 'undefined' ? 'FILTER (?gghNotation IN (' + (ggh.join ? ggh.map(v => v.toCanonical()).join() : ggh.toCanonical()) + '))' : ''}
      ${typeof psa !== 'undefined' ? 'FILTER (?psaNotation IN (' + (psa.join ? psa.map(v => v.toCanonical()).join() : psa.toCanonical()) + '))' : ''}

      # time range filter
      ${typeof from !== 'undefined' ? 'FILTER (?zeit >= xsd:date("' + (from.value.length === 4 ? from.value + '-01-01' : from.value) + '"))':''}
      ${typeof to !== 'undefined' ? 'FILTER (?zeit <= xsd:date("' + (to.value.length === 4 ? to.value + '-12-31' : to.value) + '"))':''}
    }
  }
}
