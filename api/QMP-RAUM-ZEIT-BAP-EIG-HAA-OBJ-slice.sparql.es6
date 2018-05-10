PREFIX qb: <http://purl.org/linked-data/cube#>
PREFIX ldprop: <http://ld.stadt-zuerich.ch/statistics/property/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX sh: <http://www.w3.org/ns/shacl#>
PREFIX cube: <http://purl.org/linked-data/cube#>

CONSTRUCT {
  <http://stat.stadt-zuerich.ch/dataset/QMP-RAUM-ZEIT-BAP-EIG-HAA-OBJ/slice> a qb:Slice ;
    qb:observation ?observation .
  ?observation a qb:Observation ;
    ?property ?value .
} WHERE {
  {
    GRAPH <https://linked.opendata.swiss/graph/zh/statistics> {
      # observations
      ?observation a qb:Observation ;
        qb:dataSet <http://ld.stadt-zuerich.ch/statistics/dataset/QMP-RAUM-ZEIT-BAP-EIG-HAA-OBJ> ;
        ?property ?value.

      # dimensions
      ?observation
        <http://ld.stadt-zuerich.ch/statistics/property/BAP> ?bap;
        <http://ld.stadt-zuerich.ch/statistics/property/EIG> <http://ld.stadt-zuerich.ch/statistics/code/EIG1204>;
        <http://ld.stadt-zuerich.ch/statistics/property/HAA> <http://ld.stadt-zuerich.ch/statistics/code/HAA0001>;
        <http://ld.stadt-zuerich.ch/statistics/property/OBJ> <http://ld.stadt-zuerich.ch/statistics/code/OBJ1300>;
        <http://ld.stadt-zuerich.ch/statistics/property/RAUM> ?raum;
        <http://ld.stadt-zuerich.ch/statistics/property/ZEIT> ?zeit .

      # notations for filters
      ?bap skos:notation ?bapNotation .
      ?raum skos:notation ?raumNotation .

      # filters
      ${typeof bap !== 'undefined' ? 'FILTER (?bapNotation IN (' + (bap.join ? bap.map(v => v.toCanonical()).join() : bap.toCanonical()) + '))' : ''}
      ${typeof raum !== 'undefined' ? 'FILTER (?raumNotation IN (' + (raum.join ? raum.map(v => v.toCanonical()).join() : raum.toCanonical()) + '))' : ''}

      # time range filter
      ${typeof from !== 'undefined' ? 'FILTER (?zeit >= xsd:date("' + (from.value.length === 4 ? from.value + '-01-01' : from.value) + '"))':''}
      ${typeof to !== 'undefined' ? 'FILTER (?zeit <= xsd:date("' + (to.value.length === 4 ? to.value + '-12-31' : to.value) + '"))':''}
    }
  }
}
