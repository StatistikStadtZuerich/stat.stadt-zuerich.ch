PREFIX qb: <http://purl.org/linked-data/cube#>
PREFIX ldprop: <http://ld.stadt-zuerich.ch/statistics/property/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX sh: <http://www.w3.org/ns/shacl#>
PREFIX cube: <http://purl.org/linked-data/cube#>

CONSTRUCT {
  <http://stat.stadt-zuerich.ch/api/dataset/AVA-RAUM-ZEIT-GGH-SEX-WSE-ZIV/slice> a qb:Slice ;
    qb:observation ?observation .
  ?observation a qb:Observation ;
    ?property ?value .
} WHERE {
  {
    GRAPH <https://linked.opendata.swiss/graph/zh/statistics> {
      # observations
      ?observation a qb:Observation ;
        qb:dataSet <http://ld.stadt-zuerich.ch/statistics/dataset/AVA-RAUM-ZEIT-GGH-SEX-WSE-ZIV> ;
        ?property ?value.

      # dimensions
      ?observation
        <http://ld.stadt-zuerich.ch/statistics/property/GGH> <http://ld.stadt-zuerich.ch/statistics/code/GGH2100>;
        <http://ld.stadt-zuerich.ch/statistics/property/RAUM> <http://ld.stadt-zuerich.ch/statistics/code/R30000>;
        <http://ld.stadt-zuerich.ch/statistics/property/SEX> ?sex;
        <http://ld.stadt-zuerich.ch/statistics/property/WSE> <http://ld.stadt-zuerich.ch/statistics/code/WSE0000>;
        <http://ld.stadt-zuerich.ch/statistics/property/ZEIT> ?zeit;
        <http://ld.stadt-zuerich.ch/statistics/property/ZIV> ?ziv .

      # notations for filters
      ?sex skos:notation ?sexNotation .
      ?ziv skos:notation ?zivNotation .

      # filters
      ${typeof sex !== 'undefined' ? 'FILTER (?sexNotation IN (' + (sex.join ? sex.map(v => v.toCanonical()).join() : sex.toCanonical()) + '))' : ''}
      ${typeof ziv !== 'undefined' ? 'FILTER (?zivNotation IN (' + (ziv.join ? ziv.map(v => v.toCanonical()).join() : ziv.toCanonical()) + '))' : ''}

      # time range filter
      ${typeof from !== 'undefined' ? 'FILTER (?zeit >= xsd:date("' + (from.value.length === 4 ? from.value + '-01-01' : from.value) + '"))':''}
      ${typeof to !== 'undefined' ? 'FILTER (?zeit <= xsd:date("' + (to.value.length === 4 ? to.value + '-12-31' : to.value) + '"))':''}
    }
  }
}
