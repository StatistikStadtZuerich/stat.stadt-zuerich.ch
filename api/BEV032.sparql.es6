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
       # qb:dataSet <http://ld.stadt-zuerich.ch/statistics/dataset/EINHEIT/GESAMTCODE/KENNZAHL/NAF/NAM/RAUM/SEX/WERT/ZEIT> ;
       ?property ?value.

    # dimensions
    ?obs
      <http://ld.stadt-zuerich.ch/statistics/property/RAUM> ?raum;
      <http://ld.stadt-zuerich.ch/statistics/property/ZEIT> ?zeit;
      <http://ld.stadt-zuerich.ch/statistics/property/SEX> <http://ld.stadt-zuerich.ch/statistics/code/SEX0002>;
      <http://ld.stadt-zuerich.ch/statistics/property/NAF> <http://ld.stadt-zuerich.ch/statistics/code/NAF0001>;
      <http://ld.stadt-zuerich.ch/statistics/property/NAM> ?nam .

    ?obs ?property ?value .

    # Get Labels and Notations
    OPTIONAL { ?value rdfs:label ?label . }
    OPTIONAL { ?value skos:notation ?notation . }

    # notations for filters
    ?raum skos:notation ?raumNotation .
    ?sex skos:notation ?sexNotation .
    ?naf skos:notation ?nafNotation .
    ?nam skos:notation ?namNotation .

    # filters
    ${typeof raum !== 'undefined' ? 'FILTER (?raumNotation IN (' + (raum.join ? raum.map(v => v.toCanonical()).join() : raum.toCanonical()) + '))' : ''}
    ${typeof nam !== 'undefined' ? 'FILTER (?namNotation IN (' + (nam.join ? nam.map(v => v.toCanonical()).join() : nam.toCanonical()) + '))' : ''}

    # time range filter
    ${typeof from !== 'undefined' ? 'FILTER (?zeit >= xsd:datetime("' + from + '"))':''}
    ${typeof to !== 'undefined' ? 'FILTER (?zeit <= xsd:datetime("' + to + '"))':''}
  }
} ORDER BY ?zeit