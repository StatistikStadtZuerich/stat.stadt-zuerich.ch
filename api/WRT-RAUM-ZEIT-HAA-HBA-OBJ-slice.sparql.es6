PREFIX qb: <http://purl.org/linked-data/cube#>
PREFIX ldprop: <http://ld.stadt-zuerich.ch/statistics/property/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX sh: <http://www.w3.org/ns/shacl#>
PREFIX cube: <http://purl.org/linked-data/cube#>

CONSTRUCT {
  <http://stat.stadt-zuerich.ch/dataset/WRT-RAUM-ZEIT-HAA-HBA-OBJ/slice> a qb:Slice ;
    qb:observation ?observation .
  ?observation a qb:Observation ;
    ?property ?value .
} WHERE {
  {
    GRAPH <https://linked.opendata.swiss/graph/zh/statistics> {
      # observations
      ?observation a qb:Observation ;
        qb:dataSet <http://ld.stadt-zuerich.ch/statistics/dataset/WRT-RAUM-ZEIT-HAA-HBA-OBJ> ;
        ?property ?value.

      # dimensions
      ?observation
        <http://ld.stadt-zuerich.ch/statistics/property/HAA> ?haa;
        <http://ld.stadt-zuerich.ch/statistics/property/HBA> ?hba;
        <http://ld.stadt-zuerich.ch/statistics/property/OBJ> ?obj;
        <http://ld.stadt-zuerich.ch/statistics/property/RAUM> ?raum;
        <http://ld.stadt-zuerich.ch/statistics/property/ZEIT> ?zeit .

      # notations for filters
      ?haa skos:notation ?haaNotation .
      ?hba skos:notation ?hbaNotation .
      ?obj skos:notation ?objNotation .
      ?raum skos:notation ?raumNotation .

      # filters
      ${typeof haa !== 'undefined' ? 'FILTER (?haaNotation IN (' + (haa.join ? haa.map(v => v.toCanonical()).join() : haa.toCanonical()) + '))' : ''}
      ${typeof hba !== 'undefined' ? 'FILTER (?hbaNotation IN (' + (hba.join ? hba.map(v => v.toCanonical()).join() : hba.toCanonical()) + '))' : ''}
      ${typeof obj !== 'undefined' ? 'FILTER (?objNotation IN (' + (obj.join ? obj.map(v => v.toCanonical()).join() : obj.toCanonical()) + '))' : ''}
      ${typeof raum !== 'undefined' ? 'FILTER (?raumNotation IN (' + (raum.join ? raum.map(v => v.toCanonical()).join() : raum.toCanonical()) + '))' : ''}

      # time range filter
      ${typeof from !== 'undefined' ? 'FILTER (?zeit >= xsd:date("' + (from.value.length === 4 ? from.value + '-01-01' : from.value) + '"))':''}
      ${typeof to !== 'undefined' ? 'FILTER (?zeit <= xsd:date("' + (to.value.length === 4 ? to.value + '-12-31' : to.value) + '"))':''}
    }
  }
}
