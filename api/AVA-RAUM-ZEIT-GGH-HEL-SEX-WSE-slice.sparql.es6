PREFIX qb: <http://purl.org/linked-data/cube#>
PREFIX ldprop: <https://ld.stadt-zuerich.ch/statistics/property/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX sh: <http://www.w3.org/ns/shacl#>
PREFIX cube: <http://purl.org/linked-data/cube#>

CONSTRUCT {
  <https://stat.stadt-zuerich.ch/dataset/AVA-RAUM-ZEIT-GGH-HEL-SEX-WSE/slice> a qb:Slice ;
    qb:observation ?observation .
  ?observation a qb:Observation ;
    ?property ?value .
} WHERE {
  {
    GRAPH <https://linked.opendata.swiss/graph/zh/statistics> {
      # observations
      ?observation a qb:Observation ;
        qb:dataSet <https://ld.stadt-zuerich.ch/statistics/dataset/AVA-RAUM-ZEIT-GGH-HEL-SEX-WSE> ;
        ?property ?value.

      # dimensions
      ?observation
        <https://ld.stadt-zuerich.ch/statistics/property/GGH> <https://ld.stadt-zuerich.ch/statistics/code/GGH2100>;
        <https://ld.stadt-zuerich.ch/statistics/property/HEL> ?hel;
        <https://ld.stadt-zuerich.ch/statistics/property/RAUM> <https://ld.stadt-zuerich.ch/statistics/code/R30000>;
        <https://ld.stadt-zuerich.ch/statistics/property/SEX> ?sex;
        <https://ld.stadt-zuerich.ch/statistics/property/WSE> <https://ld.stadt-zuerich.ch/statistics/code/WSE0000>;
        <https://ld.stadt-zuerich.ch/statistics/property/ZEIT> ?zeit .

      # notations for filters
      ?hel skos:notation ?helNotation .
      ?sex skos:notation ?sexNotation .

      # filters
      ${typeof hel !== 'undefined' ? 'FILTER (?helNotation IN (' + (hel.join ? hel.map(v => v.toCanonical()).join() : hel.toCanonical()) + '))' : ''}
      ${typeof sex !== 'undefined' ? 'FILTER (?sexNotation IN (' + (sex.join ? sex.map(v => v.toCanonical()).join() : sex.toCanonical()) + '))' : ''}

      # time range filter
      ${typeof from !== 'undefined' ? 'FILTER (?zeit >= xsd:date("' + (from.value.length === 4 ? from.value + '-01-01' : from.value) + '"))':''}
      ${typeof to !== 'undefined' ? 'FILTER (?zeit <= xsd:date("' + (to.value.length === 4 ? to.value + '-12-31' : to.value) + '"))':''}
    }
  }
}
