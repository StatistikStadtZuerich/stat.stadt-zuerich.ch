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
        # qb:dataSet <http://ld.stadt-zuerich.ch/statistics/dataset/BEV012> ;
        ?property ?value.

      # dimensions
      ?obs
        <http://ld.stadt-zuerich.ch/statistics/property/AUA> ?aua;
        <http://ld.stadt-zuerich.ch/statistics/property/HEL> ?hel;
        <http://ld.stadt-zuerich.ch/statistics/property/RAUM> ?raum;
        <http://ld.stadt-zuerich.ch/statistics/property/SEX> ?sex;
        <http://ld.stadt-zuerich.ch/statistics/property/ZEIT> ?zeit .

      ?observation ?property ?value .

      # Get Labels and Notations
      OPTIONAL { ?value rdfs:label ?label . }
      OPTIONAL { ?value skos:notation ?notation . }

      # notations for filters
      ?aua skos:notation ?auaNotation .
      ?hel skos:notation ?helNotation .
      ?raum skos:notation ?raumNotation .
      ?sex skos:notation ?sexNotation .

      # filters
      ${typeof aua !== 'undefined' ? 'FILTER (?auaNotation IN (' + (aua.join ? aua.map(v => v.toCanonical()).join() : aua.toCanonical()) + '))' : ''}
      ${typeof hel !== 'undefined' ? 'FILTER (?helNotation IN (' + (hel.join ? hel.map(v => v.toCanonical()).join() : hel.toCanonical()) + '))' : ''}
      ${typeof raum !== 'undefined' ? 'FILTER (?raumNotation IN (' + (raum.join ? raum.map(v => v.toCanonical()).join() : raum.toCanonical()) + '))' : ''}
      ${typeof sex !== 'undefined' ? 'FILTER (?sexNotation IN (' + (sex.join ? sex.map(v => v.toCanonical()).join() : sex.toCanonical()) + '))' : ''}

      # time range filter
      ${typeof from !== 'undefined' ? 'FILTER (?zeit >= xsd:datetime("' + from + '"))':''}
      ${typeof to !== 'undefined' ? 'FILTER (?zeit <= xsd:datetime("' + to + '"))':''}
    }
  }

  BIND(BNODE('slice') AS ?slice)
}