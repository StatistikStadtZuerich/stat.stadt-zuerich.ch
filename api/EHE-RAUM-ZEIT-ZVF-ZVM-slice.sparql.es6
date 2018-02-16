PREFIX qb: <http://purl.org/linked-data/cube#>
PREFIX ldprop: <http://ld.stadt-zuerich.ch/statistics/property/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX sh: <http://www.w3.org/ns/shacl#>
PREFIX cube: <http://purl.org/linked-data/cube#>

CONSTRUCT {
  <http://stat.stadt-zuerich.ch/api/dataset/EHE-RAUM-ZEIT-ZVF-ZVM/slice> a qb:Slice ;
    qb:observation ?observation .
  ?observation a qb:Observation ;
    ?property ?value .
} WHERE {
  {
    GRAPH <https://linked.opendata.swiss/graph/zh/statistics> {
      # observations
      ?observation a qb:Observation ;
        qb:dataSet <http://ld.stadt-zuerich.ch/statistics/dataset/EHE-RAUM-ZEIT-ZVF-ZVM> ;
        ?property ?value.

      # dimensions
      ?observation
        <http://ld.stadt-zuerich.ch/statistics/property/RAUM> <http://ld.stadt-zuerich.ch/statistics/code/R30000>;
        <http://ld.stadt-zuerich.ch/statistics/property/ZEIT> ?zeit;
        <http://ld.stadt-zuerich.ch/statistics/property/ZVF> ?zvf;
        <http://ld.stadt-zuerich.ch/statistics/property/ZVM> ?zvm .

      # notations for filters
      ?zvf skos:notation ?zvfNotation .
      ?zvm skos:notation ?zvmNotation .

      # filters
      ${typeof zvf !== 'undefined' ? 'FILTER (?zvfNotation IN (' + (zvf.join ? zvf.map(v => v.toCanonical()).join() : zvf.toCanonical()) + '))' : ''}
      ${typeof zvm !== 'undefined' ? 'FILTER (?zvmNotation IN (' + (zvm.join ? zvm.map(v => v.toCanonical()).join() : zvm.toCanonical()) + '))' : ''}

      # time range filter
      ${typeof from !== 'undefined' ? 'FILTER (?zeit >= xsd:date("' + (from.value.length === 4 ? from.value + '-01-01' : from.value) + '"))':''}
      ${typeof to !== 'undefined' ? 'FILTER (?zeit <= xsd:date("' + (to.value.length === 4 ? to.value + '-12-31' : to.value) + '"))':''}
    }
  }
}