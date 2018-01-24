PREFIX qb: <http://purl.org/linked-data/cube#>
PREFIX ldprop: <http://ld.stadt-zuerich.ch/statistics/property/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX sh: <http://www.w3.org/ns/shacl#>
PREFIX cube: <http://purl.org/linked-data/cube#>

CONSTRUCT {
  ?slice a qb:Slice ;
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
        # qb:dataSet <http://ld.stadt-zuerich.ch/statistics/dataset/BEV008> ;
        ?property ?value.

      # dimensions
      ?observation
        <http://ld.stadt-zuerich.ch/statistics/property/HEL> <http://ld.stadt-zuerich.ch/statistics/code/HEL1000>;
        <http://ld.stadt-zuerich.ch/statistics/property/HEO> ?heo;
        <http://ld.stadt-zuerich.ch/statistics/property/RAUM> ?raum;
        <http://ld.stadt-zuerich.ch/statistics/property/SEX> ?sex;
        <http://ld.stadt-zuerich.ch/statistics/property/ZEIT> ?zeit .

      # notations for filters
      ?heo skos:notation ?heoNotation .
      ?raum skos:notation ?raumNotation .
      ?sex skos:notation ?sexNotation .

      # Get Labels and Notations
      OPTIONAL { ?value rdfs:label ?label . }
      OPTIONAL { ?value skos:notation ?notation . }

      # filters
      ${typeof heo !== 'undefined' ? 'FILTER (?heoNotation IN (' + (heo.join ? heo.map(v => v.toCanonical()).join() : heo.toCanonical()) + '))' : ''}
      ${typeof raum !== 'undefined' ? 'FILTER (?raumNotation IN (' + (raum.join ? raum.map(v => v.toCanonical()).join() : raum.toCanonical()) + '))' : ''}
      ${typeof sex !== 'undefined' ? 'FILTER (?sexNotation IN (' + (sex.join ? sex.map(v => v.toCanonical()).join() : sex.toCanonical()) + '))' : ''}

      # time range filter
      ${typeof from !== 'undefined' ? 'FILTER (?zeit >= xsd:datetime("' + from + '"))':''}
      ${typeof to !== 'undefined' ? 'FILTER (?zeit <= xsd:datetime("' + to + '"))':''}
    }
  }

  BIND(BNODE('slice') AS ?slice)
}
