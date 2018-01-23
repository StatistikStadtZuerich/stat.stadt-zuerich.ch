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
      <http://ld.stadt-zuerich.ch/statistics/property/ADM> ?adm;
      <http://ld.stadt-zuerich.ch/statistics/property/ADV> ?adv;
      <http://ld.stadt-zuerich.ch/statistics/property/ELK> <http://ld.stadt-zuerich.ch/statistics/code/ELK0001>;
      <http://ld.stadt-zuerich.ch/statistics/property/RAUM> ?raum;
      <http://ld.stadt-zuerich.ch/statistics/property/ZEIT> ?zeit .

    ?obs ?property ?value .

    # Get Labels and Notations
    OPTIONAL { ?value rdfs:label ?label . }
    OPTIONAL { ?value skos:notation ?notation . }

    # notations for filters
    ?adm skos:notation ?admNotation .
    ?adv skos:notation ?advNotation .
    ?elk skos:notation ?elkNotation .
    ?raum skos:notation ?raumNotation .

    # filters
    ${typeof adm !== 'undefined' ? 'FILTER (?admNotation IN (' + (adm.join ? adm.map(v => v.toCanonical()).join() : adm.toCanonical()) + '))' : ''}
    ${typeof adv !== 'undefined' ? 'FILTER (?advNotation IN (' + (adv.join ? adv.map(v => v.toCanonical()).join() : adv.toCanonical()) + '))' : ''}
    ${typeof raum !== 'undefined' ? 'FILTER (?raumNotation IN (' + (raum.join ? raum.map(v => v.toCanonical()).join() : raum.toCanonical()) + '))' : ''}

    # time range filter
    ${typeof from !== 'undefined' ? 'FILTER (?zeit >= xsd:datetime("' + from + '"))':''}
    ${typeof to !== 'undefined' ? 'FILTER (?zeit <= xsd:datetime("' + to + '"))':''}
  }
} ORDER BY ?zeit