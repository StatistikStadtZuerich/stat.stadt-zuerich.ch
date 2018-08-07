PREFIX qb: <http://purl.org/linked-data/cube#>
PREFIX ldprop: <https://ld.stadt-zuerich.ch/statistics/property/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX sh: <http://www.w3.org/ns/shacl#>
PREFIX cube: <http://purl.org/linked-data/cube#>

CONSTRUCT {
  <https://stat.stadt-zuerich.ch/dataset/ANT-RAUM-ZEIT-ALF-ALM-GGH/slice> a qb:Slice ;
    qb:observation ?observation .
  ?observation a qb:Observation ;
    ?property ?value .
} WHERE {
  {
    GRAPH <https://linked.opendata.swiss/graph/zh/statistics> {
      # observations
      ?observation a qb:Observation ;
        qb:dataSet <https://ld.stadt-zuerich.ch/statistics/dataset/ANT-RAUM-ZEIT-ALF-ALM-GGH> ;
        ?property ?value.

      # dimensions
      ?observation
        <https://ld.stadt-zuerich.ch/statistics/property/ALF> ?alf;
        <https://ld.stadt-zuerich.ch/statistics/property/ALM> ?alm;
        <https://ld.stadt-zuerich.ch/statistics/property/GGH> ?ggh;
        <https://ld.stadt-zuerich.ch/statistics/property/RAUM> <https://ld.stadt-zuerich.ch/statistics/code/R30000>;
        <https://ld.stadt-zuerich.ch/statistics/property/ZEIT> ?zeit .

      # notations for filters
      ?alf skos:notation ?alfNotation .
      ?alm skos:notation ?almNotation .
      ?ggh skos:notation ?gghNotation .

      # filters
      ${typeof alf !== 'undefined' ? 'FILTER (?alfNotation IN (' + (alf.join ? alf.map(v => v.toCanonical()).join() : alf.toCanonical()) + '))' : ''}
      ${typeof alm !== 'undefined' ? 'FILTER (?almNotation IN (' + (alm.join ? alm.map(v => v.toCanonical()).join() : alm.toCanonical()) + '))' : ''}
      ${typeof ggh !== 'undefined' ? 'FILTER (?gghNotation IN (' + (ggh.join ? ggh.map(v => v.toCanonical()).join() : ggh.toCanonical()) + '))' : ''}

      # time range filter
      ${typeof from !== 'undefined' ? 'FILTER (?zeit >= xsd:date("' + (from.value.length === 4 ? from.value + '-01-01' : from.value) + '"))':''}
      ${typeof to !== 'undefined' ? 'FILTER (?zeit <= xsd:date("' + (to.value.length === 4 ? to.value + '-12-31' : to.value) + '"))':''}
    }
  }
}
