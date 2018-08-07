PREFIX qb: <http://purl.org/linked-data/cube#>
PREFIX ldprop: <https://ld.stadt-zuerich.ch/statistics/property/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX sh: <http://www.w3.org/ns/shacl#>
PREFIX cube: <http://purl.org/linked-data/cube#>

CONSTRUCT {
  <https://stat.stadt-zuerich.ch/dataset/GBD-RAUM-ZEIT-ARA-BEB-GBA/slice> a qb:Slice ;
    qb:observation ?observation .
  ?observation a qb:Observation ;
    ?property ?value .
} WHERE {
  {
    GRAPH <https://linked.opendata.swiss/graph/zh/statistics> {
      # observations
      ?observation a qb:Observation ;
        qb:dataSet <https://ld.stadt-zuerich.ch/statistics/dataset/GBD-RAUM-ZEIT-ARA-BEB-GBA> ;
        ?property ?value.

      # dimensions
      ?observation
        <https://ld.stadt-zuerich.ch/statistics/property/ARA> ?ara;
        <https://ld.stadt-zuerich.ch/statistics/property/BEB> <https://ld.stadt-zuerich.ch/statistics/code/BEB1003>;
        <https://ld.stadt-zuerich.ch/statistics/property/GBA> ?gba;
        <https://ld.stadt-zuerich.ch/statistics/property/RAUM> ?raum;
        <https://ld.stadt-zuerich.ch/statistics/property/ZEIT> ?zeit .

      # notations for filters
      ?ara skos:notation ?araNotation .
      ?gba skos:notation ?gbaNotation .
      ?raum skos:notation ?raumNotation .

      # filters
      ${typeof ara !== 'undefined' ? 'FILTER (?araNotation IN (' + (ara.join ? ara.map(v => v.toCanonical()).join() : ara.toCanonical()) + '))' : ''}
      ${typeof gba !== 'undefined' ? 'FILTER (?gbaNotation IN (' + (gba.join ? gba.map(v => v.toCanonical()).join() : gba.toCanonical()) + '))' : ''}
      ${typeof raum !== 'undefined' ? 'FILTER (?raumNotation IN (' + (raum.join ? raum.map(v => v.toCanonical()).join() : raum.toCanonical()) + '))' : ''}

      # time range filter
      ${typeof from !== 'undefined' ? 'FILTER (?zeit >= xsd:date("' + (from.value.length === 4 ? from.value + '-01-01' : from.value) + '"))':''}
      ${typeof to !== 'undefined' ? 'FILTER (?zeit <= xsd:date("' + (to.value.length === 4 ? to.value + '-12-31' : to.value) + '"))':''}
    }
  }
}
