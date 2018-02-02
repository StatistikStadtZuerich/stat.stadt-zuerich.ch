PREFIX qb: <http://purl.org/linked-data/cube#>
PREFIX ldprop: <http://ld.stadt-zuerich.ch/statistics/property/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX sh: <http://www.w3.org/ns/shacl#>
PREFIX cube: <http://purl.org/linked-data/cube#>

CONSTRUCT {
  <http://stat.stadt-zuerich.ch/api/dataset/KUL001/slice> a qb:Slice ;
    qb:observation ?observation .
  ?observation a qb:Observation ;
    ?property ?value .
  ?value
    rdfs:label ?label ;
    skos:notation ?notation .
} WHERE {
  {
    GRAPH <https://linked.opendata.swiss/graph/zh/statistics> {
      # observations
      ?observation a qb:Observation ;
        # qb:dataSet <http://ld.stadt-zuerich.ch/statistics/dataset/KUL001> ;
        ?property ?value.

      # dimensions
      ?observation
        <http://ld.stadt-zuerich.ch/statistics/property/BTA> ?bta;
        <http://ld.stadt-zuerich.ch/statistics/property/PRA> ?pra;
        <http://ld.stadt-zuerich.ch/statistics/property/RAUM> ?raum;
        <http://ld.stadt-zuerich.ch/statistics/property/VSA> ?vsa;
        <http://ld.stadt-zuerich.ch/statistics/property/ZEIT> ?zeit .

      # notations for filters
      ?bta skos:notation ?btaNotation .
      ?pra skos:notation ?praNotation .
      ?raum skos:notation ?raumNotation .
      ?vsa skos:notation ?vsaNotation .

      # Get Labels and Notations
      OPTIONAL { ?value rdfs:label ?label . }
      OPTIONAL { ?value skos:notation ?notation . }

      # filters
      ${typeof bta !== 'undefined' ? 'FILTER (?btaNotation IN (' + (bta.join ? bta.map(v => v.toCanonical()).join() : bta.toCanonical()) + '))' : ''}
      ${typeof pra !== 'undefined' ? 'FILTER (?praNotation IN (' + (pra.join ? pra.map(v => v.toCanonical()).join() : pra.toCanonical()) + '))' : ''}
      ${typeof raum !== 'undefined' ? 'FILTER (?raumNotation IN (' + (raum.join ? raum.map(v => v.toCanonical()).join() : raum.toCanonical()) + '))' : ''}
      ${typeof vsa !== 'undefined' ? 'FILTER (?vsaNotation IN (' + (vsa.join ? vsa.map(v => v.toCanonical()).join() : vsa.toCanonical()) + '))' : ''}

      # time range filter
      ${typeof from !== 'undefined' ? 'FILTER (?zeit >= xsd:datetime("' + from + '"))':''}
      ${typeof to !== 'undefined' ? 'FILTER (?zeit <= xsd:datetime("' + to + '"))':''}
    }
  }
}
