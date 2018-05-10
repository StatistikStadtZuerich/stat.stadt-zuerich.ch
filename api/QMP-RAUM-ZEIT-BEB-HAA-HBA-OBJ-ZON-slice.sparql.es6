PREFIX qb: <http://purl.org/linked-data/cube#>
PREFIX ldprop: <http://ld.stadt-zuerich.ch/statistics/property/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX sh: <http://www.w3.org/ns/shacl#>
PREFIX cube: <http://purl.org/linked-data/cube#>

CONSTRUCT {
  <http://stat.stadt-zuerich.ch/dataset/QMP-RAUM-ZEIT-BEB-HAA-HBA-OBJ-ZON/slice> a qb:Slice ;
    qb:observation ?observation .
  ?observation a qb:Observation ;
    ?property ?value .
} WHERE {
  {
    GRAPH <https://linked.opendata.swiss/graph/zh/statistics> {
      # observations
      ?observation a qb:Observation ;
        qb:dataSet <http://ld.stadt-zuerich.ch/statistics/dataset/QMP-RAUM-ZEIT-BEB-HAA-HBA-OBJ-ZON> ;
        ?property ?value.

      # dimensions
      ?observation
        <http://ld.stadt-zuerich.ch/statistics/property/BEB> <http://ld.stadt-zuerich.ch/statistics/code/BEB1001>;
        <http://ld.stadt-zuerich.ch/statistics/property/HAA> <http://ld.stadt-zuerich.ch/statistics/code/HAA0001>;
        <http://ld.stadt-zuerich.ch/statistics/property/HBA> <http://ld.stadt-zuerich.ch/statistics/code/HBA1000>;
        <http://ld.stadt-zuerich.ch/statistics/property/OBJ> <http://ld.stadt-zuerich.ch/statistics/code/OBJ1100>;
        <http://ld.stadt-zuerich.ch/statistics/property/RAUM> ?raum;
        <http://ld.stadt-zuerich.ch/statistics/property/ZEIT> ?zeit;
        <http://ld.stadt-zuerich.ch/statistics/property/ZON> ?zon .

      # notations for filters
      ?raum skos:notation ?raumNotation .
      ?zon skos:notation ?zonNotation .

      # filters
      ${typeof raum !== 'undefined' ? 'FILTER (?raumNotation IN (' + (raum.join ? raum.map(v => v.toCanonical()).join() : raum.toCanonical()) + '))' : ''}
      ${typeof zon !== 'undefined' ? 'FILTER (?zonNotation IN (' + (zon.join ? zon.map(v => v.toCanonical()).join() : zon.toCanonical()) + '))' : ''}

      # time range filter
      ${typeof from !== 'undefined' ? 'FILTER (?zeit >= xsd:date("' + (from.value.length === 4 ? from.value + '-01-01' : from.value) + '"))':''}
      ${typeof to !== 'undefined' ? 'FILTER (?zeit <= xsd:date("' + (to.value.length === 4 ? to.value + '-12-31' : to.value) + '"))':''}
    }
  }
}
