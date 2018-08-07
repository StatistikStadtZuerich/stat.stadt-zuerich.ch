PREFIX qb: <http://purl.org/linked-data/cube#>
PREFIX ldprop: <https://ld.stadt-zuerich.ch/statistics/property/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX sh: <http://www.w3.org/ns/shacl#>
PREFIX cube: <http://purl.org/linked-data/cube#>

CONSTRUCT {
  <https://stat.stadt-zuerich.ch/dataset/WRT-RAUM-ZEIT-BEB-HAA-HEV-OBJ/slice> a qb:Slice ;
    qb:observation ?observation .
  ?observation a qb:Observation ;
    ?property ?value .
} WHERE {
  {
    GRAPH <https://linked.opendata.swiss/graph/zh/statistics> {
      # observations
      ?observation a qb:Observation ;
        qb:dataSet <https://ld.stadt-zuerich.ch/statistics/dataset/WRT-RAUM-ZEIT-BEB-HAA-HEV-OBJ> ;
        ?property ?value.

      # dimensions
      ?observation
        <https://ld.stadt-zuerich.ch/statistics/property/BEB> <https://ld.stadt-zuerich.ch/statistics/code/BEB1002>;
        <https://ld.stadt-zuerich.ch/statistics/property/HAA> ?haa;
        <https://ld.stadt-zuerich.ch/statistics/property/HEV> ?hev;
        <https://ld.stadt-zuerich.ch/statistics/property/OBJ> <https://ld.stadt-zuerich.ch/statistics/code/OBJ1100>;
        <https://ld.stadt-zuerich.ch/statistics/property/RAUM> <https://ld.stadt-zuerich.ch/statistics/code/R30000>;
        <https://ld.stadt-zuerich.ch/statistics/property/ZEIT> ?zeit .

      # notations for filters
      ?haa skos:notation ?haaNotation .
      ?hev skos:notation ?hevNotation .

      # filters
      ${typeof haa !== 'undefined' ? 'FILTER (?haaNotation IN (' + (haa.join ? haa.map(v => v.toCanonical()).join() : haa.toCanonical()) + '))' : ''}
      ${typeof hev !== 'undefined' ? 'FILTER (?hevNotation IN (' + (hev.join ? hev.map(v => v.toCanonical()).join() : hev.toCanonical()) + '))' : ''}

      # time range filter
      ${typeof from !== 'undefined' ? 'FILTER (?zeit >= xsd:date("' + (from.value.length === 4 ? from.value + '-01-01' : from.value) + '"))':''}
      ${typeof to !== 'undefined' ? 'FILTER (?zeit <= xsd:date("' + (to.value.length === 4 ? to.value + '-12-31' : to.value) + '"))':''}
    }
  }
}
