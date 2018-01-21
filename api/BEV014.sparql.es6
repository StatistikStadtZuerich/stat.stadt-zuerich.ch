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
      <http://ld.stadt-zuerich.ch/statistics/property/ALT> <http://ld.stadt-zuerich.ch/statistics/code/ALT9015>;
      <http://ld.stadt-zuerich.ch/statistics/property/HEL> ?hel;
      <http://ld.stadt-zuerich.ch/statistics/property/RAUM> ?raum;
      <http://ld.stadt-zuerich.ch/statistics/property/SEX> ?sex;
      <http://ld.stadt-zuerich.ch/statistics/property/SPK> ?spk;
      <http://ld.stadt-zuerich.ch/statistics/property/WSI> <http://ld.stadt-zuerich.ch/statistics/code/WSI0001>;
      <http://ld.stadt-zuerich.ch/statistics/property/ZEIT> ?zeit .

    ?obs ?property ?value .

    # Get Labels and Notations
    OPTIONAL { ?value rdfs:label ?label . }
    OPTIONAL { ?value skos:notation ?notation . }

    # notations for filters
    ?alt skos:notation ?altNotation .
    ?hel skos:notation ?helNotation .
    ?raum skos:notation ?raumNotation .
    ?sex skos:notation ?sexNotation .
    ?spk skos:notation ?spkNotation .
    ?wsi skos:notation ?wsiNotation .

    # filters
    ${typeof hel !== 'undefined' ? 'FILTER (?helNotation IN (' + (hel.join ? hel.map(v => v.toCanonical()).join() : hel.toCanonical()) + '))' : ''}
    ${typeof raum !== 'undefined' ? 'FILTER (?raumNotation IN (' + (raum.join ? raum.map(v => v.toCanonical()).join() : raum.toCanonical()) + '))' : ''}
    ${typeof sex !== 'undefined' ? 'FILTER (?sexNotation IN (' + (sex.join ? sex.map(v => v.toCanonical()).join() : sex.toCanonical()) + '))' : ''}
    ${typeof spk !== 'undefined' ? 'FILTER (?spkNotation IN (' + (spk.join ? spk.map(v => v.toCanonical()).join() : spk.toCanonical()) + '))' : ''}

    # time range filter
    ${typeof from !== 'undefined' ? 'FILTER (?zeit >= xsd:datetime("' + from + '"))':''}
    ${typeof to !== 'undefined' ? 'FILTER (?zeit <= xsd:datetime("' + to + '"))':''}
  }
} ORDER BY ?zeit