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
        # qb:dataSet <http://ld.stadt-zuerich.ch/statistics/dataset/BEV023> ;
        ?property ?value.

      # dimensions
      ?obs
        <http://ld.stadt-zuerich.ch/statistics/property/ALF> ?alf;
        <http://ld.stadt-zuerich.ch/statistics/property/ALM> ?alm;
        <http://ld.stadt-zuerich.ch/statistics/property/GGH> <http://ld.stadt-zuerich.ch/statistics/code/GGH2100>;
        <http://ld.stadt-zuerich.ch/statistics/property/RAUM> ?raum;
        <http://ld.stadt-zuerich.ch/statistics/property/ZEIT> ?zeit .

      ?observation ?property ?value .

      # Get Labels and Notations
      OPTIONAL { ?value rdfs:label ?label . }
      OPTIONAL { ?value skos:notation ?notation . }

      # notations for filters
      ?alf skos:notation ?alfNotation .
      ?alm skos:notation ?almNotation .
      ?ggh skos:notation ?gghNotation .
      ?raum skos:notation ?raumNotation .

      # filters
      ${typeof alf !== 'undefined' ? 'FILTER (?alfNotation IN (' + (alf.join ? alf.map(v => v.toCanonical()).join() : alf.toCanonical()) + '))' : ''}
      ${typeof alm !== 'undefined' ? 'FILTER (?almNotation IN (' + (alm.join ? alm.map(v => v.toCanonical()).join() : alm.toCanonical()) + '))' : ''}
      ${typeof raum !== 'undefined' ? 'FILTER (?raumNotation IN (' + (raum.join ? raum.map(v => v.toCanonical()).join() : raum.toCanonical()) + '))' : ''}

      # time range filter
      ${typeof from !== 'undefined' ? 'FILTER (?zeit >= xsd:datetime("' + from + '"))':''}
      ${typeof to !== 'undefined' ? 'FILTER (?zeit <= xsd:datetime("' + to + '"))':''}
    }
  }

  BIND(BNODE('slice') AS ?slice)
}
