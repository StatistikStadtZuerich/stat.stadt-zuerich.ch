PREFIX qb: <http://purl.org/linked-data/cube#>
PREFIX ldprop: <http://ld.stadt-zuerich.ch/statistics/property/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX sh: <http://www.w3.org/ns/shacl#>
PREFIX cube: <http://purl.org/linked-data/cube#>

CONSTRUCT {
      ?obs a qb:Observation .
      ?obs ?property ?value .
      ?value rdfs:label ?label .
      ?value skos:notation ?notation .
} WHERE {
  GRAPH <https://linked.opendata.swiss/graph/zh/statistics> {

    ?obs a qb:Observation ;
       # qb:dataSet <,> ;
       ?property ?value.

    # dimensions
    ?obs
      <http://ld.stadt-zuerich.ch/statistics/property/ELK> ?elk;
      <http://ld.stadt-zuerich.ch/statistics/property/GBR> <http://ld.stadt-zuerich.ch/statistics/code/GBR0001>;
      <http://ld.stadt-zuerich.ch/statistics/property/HEL> ?hel;
      <http://ld.stadt-zuerich.ch/statistics/property/PSA> <http://ld.stadt-zuerich.ch/statistics/code/PSA4101>;
      <http://ld.stadt-zuerich.ch/statistics/property/RAUM> ?raum;
      <http://ld.stadt-zuerich.ch/statistics/property/ZEIT> ?zeit .

    ?obs ?property ?value .

    # Get Labels and Notations
    OPTIONAL { ?value rdfs:label ?label . }
    OPTIONAL { ?value skos:notation ?notation . }

    # notations for filters
    ?elk skos:notation ?elkNotation .
    ?gbr skos:notation ?gbrNotation .
    ?hel skos:notation ?helNotation .
    ?psa skos:notation ?psaNotation .
    ?raum skos:notation ?raumNotation .

    # filters
    ${typeof elk !== 'undefined' ? 'FILTER (?elkNotation IN (' + (elk.join ? elk.map(v => v.toCanonical()).join() : elk.toCanonical()) + '))' : ''}
    ${typeof hel !== 'undefined' ? 'FILTER (?helNotation IN (' + (hel.join ? hel.map(v => v.toCanonical()).join() : hel.toCanonical()) + '))' : ''}
    ${typeof raum !== 'undefined' ? 'FILTER (?raumNotation IN (' + (raum.join ? raum.map(v => v.toCanonical()).join() : raum.toCanonical()) + '))' : ''}

    # time range filter
    ${typeof from !== 'undefined' ? 'FILTER (?zeit >= xsd:datetime("' + from + '"))':''}
    ${typeof to !== 'undefined' ? 'FILTER (?zeit <= xsd:datetime("' + to + '"))':''}
  }
} ORDER BY ?zeit