PREFIX qb: <http://purl.org/linked-data/cube#>
PREFIX ldprop: <http://ld.stadt-zuerich.ch/statistics/property/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX sh: <http://www.w3.org/ns/shacl#>
PREFIX cube: <http://purl.org/linked-data/cube#>

CONSTRUCT {
  <http://stat.stadt-zuerich.ch/dataset/GSF-RAUM-ZEIT-EGV-HAA/slice> a qb:Slice ;
    qb:observation ?observation .
  ?observation a qb:Observation ;
    ?property ?value .
} WHERE {
  {
    GRAPH <https://linked.opendata.swiss/graph/zh/statistics> {
      # observations
      ?observation a qb:Observation ;
        qb:dataSet <http://ld.stadt-zuerich.ch/statistics/dataset/GSF-RAUM-ZEIT-EGV-HAA> ;
        ?property ?value.

      # dimensions
      ?observation
        <http://ld.stadt-zuerich.ch/statistics/property/EGV> ?egv;
        <http://ld.stadt-zuerich.ch/statistics/property/HAA> ?haa;
        <http://ld.stadt-zuerich.ch/statistics/property/RAUM> <http://ld.stadt-zuerich.ch/statistics/code/R30000>;
        <http://ld.stadt-zuerich.ch/statistics/property/ZEIT> ?zeit .

      # notations for filters
      ?egv skos:notation ?egvNotation .
      ?haa skos:notation ?haaNotation .

      # filters
      ${typeof egv !== 'undefined' ? 'FILTER (?egvNotation IN (' + (egv.join ? egv.map(v => v.toCanonical()).join() : egv.toCanonical()) + '))' : ''}
      ${typeof haa !== 'undefined' ? 'FILTER (?haaNotation IN (' + (haa.join ? haa.map(v => v.toCanonical()).join() : haa.toCanonical()) + '))' : ''}

      # time range filter
      ${typeof from !== 'undefined' ? 'FILTER (?zeit >= xsd:date("' + (from.value.length === 4 ? from.value + '-01-01' : from.value) + '"))':''}
      ${typeof to !== 'undefined' ? 'FILTER (?zeit <= xsd:date("' + (to.value.length === 4 ? to.value + '-12-31' : to.value) + '"))':''}
    }
  }
}
