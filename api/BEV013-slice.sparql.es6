PREFIX qb: <http://purl.org/linked-data/cube#>
PREFIX ldprop: <http://ld.stadt-zuerich.ch/statistics/property/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX sh: <http://www.w3.org/ns/shacl#>
PREFIX cube: <http://purl.org/linked-data/cube#>

CONSTRUCT {
  <http://stat.stadt-zuerich.ch/api/dataset/BEV013/slice> a qb:Slice ;
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
        # qb:dataSet <http://ld.stadt-zuerich.ch/statistics/dataset/BEV013> ;
        ?property ?value.

      # dimensions
      ?observation
        <http://ld.stadt-zuerich.ch/statistics/property/ALT> <http://ld.stadt-zuerich.ch/statistics/code/ALT9015>;
        <http://ld.stadt-zuerich.ch/statistics/property/RAUM> ?raum;
        <http://ld.stadt-zuerich.ch/statistics/property/SPR> ?spr;
        <http://ld.stadt-zuerich.ch/statistics/property/WSI> <http://ld.stadt-zuerich.ch/statistics/code/WSI0001>;
        <http://ld.stadt-zuerich.ch/statistics/property/ZEIT> ?zeit .

      # notations for filters
      ?raum skos:notation ?raumNotation .
      ?spr skos:notation ?sprNotation .

      # Get Labels and Notations
      OPTIONAL { ?value rdfs:label ?label . }
      OPTIONAL { ?value skos:notation ?notation . }

      # filters
      ${typeof raum !== 'undefined' ? 'FILTER (?raumNotation IN (' + (raum.join ? raum.map(v => v.toCanonical()).join() : raum.toCanonical()) + '))' : ''}
      ${typeof spr !== 'undefined' ? 'FILTER (?sprNotation IN (' + (spr.join ? spr.map(v => v.toCanonical()).join() : spr.toCanonical()) + '))' : ''}

      # time range filter
      ${typeof from !== 'undefined' ? 'FILTER (?zeit >= xsd:datetime("' + from + '"))':''}
      ${typeof to !== 'undefined' ? 'FILTER (?zeit <= xsd:datetime("' + to + '"))':''}
    }
  }
}
