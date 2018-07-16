PREFIX qb: <http://purl.org/linked-data/cube#>
PREFIX ldprop: <http://ld.stadt-zuerich.ch/statistics/property/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX sh: <http://www.w3.org/ns/shacl#>
PREFIX cube: <http://purl.org/linked-data/cube#>

CONSTRUCT {
  <http://stat.stadt-zuerich.ch/dataset/BES-RAUM-ZEIT-0HE-0SE-1-BE/slice> a qb:Slice ;
    qb:observation ?observation .
  ?observation a qb:Observation ;
    ?property ?value .
} WHERE {
  {
    GRAPH <https://linked.opendata.swiss/graph/zh/statistics> {
      # observations
      ?observation a qb:Observation ;
        qb:dataSet <http://ld.stadt-zuerich.ch/statistics/dataset/BES-RAUM-ZEIT-0HE-0SE-1-BE> ;
        ?property ?value.

      # dimensions
      ?observation
        <http://ld.stadt-zuerich.ch/statistics/property/0HE> ?0he;
        <http://ld.stadt-zuerich.ch/statistics/property/0SE> <http://ld.stadt-zuerich.ch/statistics/code/0SEX000>;
        <http://ld.stadt-zuerich.ch/statistics/property/1> <http://ld.stadt-zuerich.ch/statistics/code/1>;
        <http://ld.stadt-zuerich.ch/statistics/property/BE> ?be;
        <http://ld.stadt-zuerich.ch/statistics/property/RAUM> <http://ld.stadt-zuerich.ch/statistics/code/R30000>;
        <http://ld.stadt-zuerich.ch/statistics/property/ZEIT> ?zeit .

      # notations for filters
      ?0he skos:notation ?0heNotation .
      ?be skos:notation ?beNotation .

      # filters
      ${typeof 0he !== 'undefined' ? 'FILTER (?0heNotation IN (' + (0he.join ? 0he.map(v => v.toCanonical()).join() : 0he.toCanonical()) + '))' : ''}
      ${typeof be !== 'undefined' ? 'FILTER (?beNotation IN (' + (be.join ? be.map(v => v.toCanonical()).join() : be.toCanonical()) + '))' : ''}

      # time range filter
      ${typeof from !== 'undefined' ? 'FILTER (?zeit >= xsd:date("' + (from.value.length === 4 ? from.value + '-01-01' : from.value) + '"))':''}
      ${typeof to !== 'undefined' ? 'FILTER (?zeit <= xsd:date("' + (to.value.length === 4 ? to.value + '-12-31' : to.value) + '"))':''}
    }
  }
}
