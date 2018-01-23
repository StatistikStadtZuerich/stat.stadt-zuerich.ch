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
       # qb:dataSet <http://ld.stadt-zuerich.ch/statistics/dataset/KUL002> ;
       ?property ?value.

    # dimensions
    ?obs
      <http://ld.stadt-zuerich.ch/statistics/property/BTA> <http://ld.stadt-zuerich.ch/statistics/code/BTA1901>;
      <http://ld.stadt-zuerich.ch/statistics/property/EAP> ?eap;
      <http://ld.stadt-zuerich.ch/statistics/property/RAUM> ?raum;
      <http://ld.stadt-zuerich.ch/statistics/property/TIG> ?tig;
      <http://ld.stadt-zuerich.ch/statistics/property/ZEIT> ?zeit;
      <http://ld.stadt-zuerich.ch/statistics/property/ZSA> <http://ld.stadt-zuerich.ch/statistics/code/ZSA0001> .

    ?obs ?property ?value .

    # Get Labels and Notations
    OPTIONAL { ?value rdfs:label ?label . }
    OPTIONAL { ?value skos:notation ?notation . }

    # notations for filters
    ?bta skos:notation ?btaNotation .
    ?eap skos:notation ?eapNotation .
    ?raum skos:notation ?raumNotation .
    ?tig skos:notation ?tigNotation .
    ?zsa skos:notation ?zsaNotation .

    # filters
    ${typeof eap !== 'undefined' ? 'FILTER (?eapNotation IN (' + (eap.join ? eap.map(v => v.toCanonical()).join() : eap.toCanonical()) + '))' : ''}
    ${typeof raum !== 'undefined' ? 'FILTER (?raumNotation IN (' + (raum.join ? raum.map(v => v.toCanonical()).join() : raum.toCanonical()) + '))' : ''}
    ${typeof tig !== 'undefined' ? 'FILTER (?tigNotation IN (' + (tig.join ? tig.map(v => v.toCanonical()).join() : tig.toCanonical()) + '))' : ''}

    # time range filter
    ${typeof from !== 'undefined' ? 'FILTER (?zeit >= xsd:datetime("' + from + '"))':''}
    ${typeof to !== 'undefined' ? 'FILTER (?zeit <= xsd:datetime("' + to + '"))':''}
  }
} ORDER BY ?zeit