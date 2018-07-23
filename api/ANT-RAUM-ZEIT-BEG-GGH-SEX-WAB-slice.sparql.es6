PREFIX qb: <http://purl.org/linked-data/cube#>
PREFIX ldprop: <http://ld.stadt-zuerich.ch/statistics/property/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX sh: <http://www.w3.org/ns/shacl#>
PREFIX cube: <http://purl.org/linked-data/cube#>

CONSTRUCT {
  <http://stat.stadt-zuerich.ch/dataset/ANT-RAUM-ZEIT-BEG-GGH-SEX-WAB/slice> a qb:Slice ;
    qb:observation ?observation .
  ?observation a qb:Observation ;
    ?property ?value .
} WHERE {
  {
    GRAPH <https://linked.opendata.swiss/graph/zh/statistics> {
      # observations
      ?observation a qb:Observation ;
        qb:dataSet <http://ld.stadt-zuerich.ch/statistics/dataset/ANT-RAUM-ZEIT-BEG-GGH-SEX-WAB> ;
        ?property ?value.

      # dimensions
      ?observation
        <http://ld.stadt-zuerich.ch/statistics/property/BEG> ?beg;
        <http://ld.stadt-zuerich.ch/statistics/property/GGH> <http://ld.stadt-zuerich.ch/statistics/code/GGH3200>;
        <http://ld.stadt-zuerich.ch/statistics/property/RAUM> <http://ld.stadt-zuerich.ch/statistics/code/R30000>;
        <http://ld.stadt-zuerich.ch/statistics/property/SEX> <http://ld.stadt-zuerich.ch/statistics/code/SEX0001>;
        <http://ld.stadt-zuerich.ch/statistics/property/WAB> ?wab;
        <http://ld.stadt-zuerich.ch/statistics/property/ZEIT> ?zeit .

      # notations for filters
      ?beg skos:notation ?begNotation .
      ?wab skos:notation ?wabNotation .

      # filters
      ${typeof beg !== 'undefined' ? 'FILTER (?begNotation IN (' + (beg.join ? beg.map(v => v.toCanonical()).join() : beg.toCanonical()) + '))' : ''}
      ${typeof wab !== 'undefined' ? 'FILTER (?wabNotation IN (' + (wab.join ? wab.map(v => v.toCanonical()).join() : wab.toCanonical()) + '))' : ''}

      # time range filter
      ${typeof from !== 'undefined' ? 'FILTER (?zeit >= xsd:date("' + (from.value.length === 4 ? from.value + '-01-01' : from.value) + '"))':''}
      ${typeof to !== 'undefined' ? 'FILTER (?zeit <= xsd:date("' + (to.value.length === 4 ? to.value + '-12-31' : to.value) + '"))':''}
    }
  }
}