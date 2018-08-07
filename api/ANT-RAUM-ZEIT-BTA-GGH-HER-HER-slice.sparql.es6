PREFIX qb: <http://purl.org/linked-data/cube#>
PREFIX ldprop: <https://ld.stadt-zuerich.ch/statistics/property/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX sh: <http://www.w3.org/ns/shacl#>
PREFIX cube: <http://purl.org/linked-data/cube#>

CONSTRUCT {
  <https://stat.stadt-zuerich.ch/dataset/ANT-RAUM-ZEIT-BTA-GGH-HER-HER/slice> a qb:Slice ;
    qb:observation ?observation .
  ?observation a qb:Observation ;
    ?property ?value .
} WHERE {
  {
    GRAPH <https://linked.opendata.swiss/graph/zh/statistics> {
      # observations
      ?observation a qb:Observation ;
        qb:dataSet <https://ld.stadt-zuerich.ch/statistics/dataset/ANT-RAUM-ZEIT-BTA-GGH-HER-HER> ;
        ?property ?value.

      # dimensions
      ?observation
        <https://ld.stadt-zuerich.ch/statistics/property/BTA> <https://ld.stadt-zuerich.ch/statistics/code/BTA5100>;
        <https://ld.stadt-zuerich.ch/statistics/property/GGH> <https://ld.stadt-zuerich.ch/statistics/code/GGH3501>;
        <https://ld.stadt-zuerich.ch/statistics/property/HER> ?her;
        <https://ld.stadt-zuerich.ch/statistics/property/RAUM> ?raum;
        <https://ld.stadt-zuerich.ch/statistics/property/ZEIT> ?zeit .

      # notations for filters
      ?her skos:notation ?herNotation .
      ?raum skos:notation ?raumNotation .

      # filters
      ${typeof her !== 'undefined' ? 'FILTER (?herNotation IN (' + (her.join ? her.map(v => v.toCanonical()).join() : her.toCanonical()) + '))' : ''}
      ${typeof raum !== 'undefined' ? 'FILTER (?raumNotation IN (' + (raum.join ? raum.map(v => v.toCanonical()).join() : raum.toCanonical()) + '))' : ''}

      # time range filter
      ${typeof from !== 'undefined' ? 'FILTER (?zeit >= xsd:date("' + (from.value.length === 4 ? from.value + '-01-01' : from.value) + '"))':''}
      ${typeof to !== 'undefined' ? 'FILTER (?zeit <= xsd:date("' + (to.value.length === 4 ? to.value + '-12-31' : to.value) + '"))':''}
    }
  }
}
