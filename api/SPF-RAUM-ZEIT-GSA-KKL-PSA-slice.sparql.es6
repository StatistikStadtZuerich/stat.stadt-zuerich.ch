PREFIX qb: <http://purl.org/linked-data/cube#>
PREFIX ldprop: <http://ld.stadt-zuerich.ch/statistics/property/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX sh: <http://www.w3.org/ns/shacl#>
PREFIX cube: <http://purl.org/linked-data/cube#>

CONSTRUCT {
  <http://stat.stadt-zuerich.ch/dataset/SPF-RAUM-ZEIT-GSA-KKL-PSA/slice> a qb:Slice ;
    qb:observation ?observation .
  ?observation a qb:Observation ;
    ?property ?value .
} WHERE {
  {
    GRAPH <https://linked.opendata.swiss/graph/zh/statistics> {
      # observations
      ?observation a qb:Observation ;
        qb:dataSet <http://ld.stadt-zuerich.ch/statistics/dataset/SPF-RAUM-ZEIT-GSA-KKL-PSA> ;
        ?property ?value.

      # dimensions
      ?observation
        <http://ld.stadt-zuerich.ch/statistics/property/GSA> ?gsa;
        <http://ld.stadt-zuerich.ch/statistics/property/KKL> ?kkl;
        <http://ld.stadt-zuerich.ch/statistics/property/PSA> <http://ld.stadt-zuerich.ch/statistics/code/PSA2000>;
        <http://ld.stadt-zuerich.ch/statistics/property/RAUM> <http://ld.stadt-zuerich.ch/statistics/code/R30000>;
        <http://ld.stadt-zuerich.ch/statistics/property/ZEIT> ?zeit .

      # notations for filters
      ?gsa skos:notation ?gsaNotation .
      ?kkl skos:notation ?kklNotation .

      # filters
      ${typeof gsa !== 'undefined' ? 'FILTER (?gsaNotation IN (' + (gsa.join ? gsa.map(v => v.toCanonical()).join() : gsa.toCanonical()) + '))' : ''}
      ${typeof kkl !== 'undefined' ? 'FILTER (?kklNotation IN (' + (kkl.join ? kkl.map(v => v.toCanonical()).join() : kkl.toCanonical()) + '))' : ''}

      # time range filter
      ${typeof from !== 'undefined' ? 'FILTER (?zeit >= xsd:date("' + (from.value.length === 4 ? from.value + '-01-01' : from.value) + '"))':''}
      ${typeof to !== 'undefined' ? 'FILTER (?zeit <= xsd:date("' + (to.value.length === 4 ? to.value + '-12-31' : to.value) + '"))':''}
    }
  }
}
