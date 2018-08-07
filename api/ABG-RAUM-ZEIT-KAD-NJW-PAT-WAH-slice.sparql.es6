PREFIX qb: <http://purl.org/linked-data/cube#>
PREFIX ldprop: <https://ld.stadt-zuerich.ch/statistics/property/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX sh: <http://www.w3.org/ns/shacl#>
PREFIX cube: <http://purl.org/linked-data/cube#>

CONSTRUCT {
  <https://stat.stadt-zuerich.ch/dataset/ABG-RAUM-ZEIT-KAD-NJW-PAT-WAH/slice> a qb:Slice ;
    qb:observation ?observation .
  ?observation a qb:Observation ;
    ?property ?value .
} WHERE {
  {
    GRAPH <https://linked.opendata.swiss/graph/zh/statistics> {
      # observations
      ?observation a qb:Observation ;
        qb:dataSet <https://ld.stadt-zuerich.ch/statistics/dataset/ABG-RAUM-ZEIT-KAD-NJW-PAT-WAH> ;
        ?property ?value.

      # dimensions
      ?observation
        <https://ld.stadt-zuerich.ch/statistics/property/KAD> ?kad;
        <https://ld.stadt-zuerich.ch/statistics/property/NJW> ?njw;
        <https://ld.stadt-zuerich.ch/statistics/property/PAT> ?pat;
        <https://ld.stadt-zuerich.ch/statistics/property/RAUM> ?raum;
        <https://ld.stadt-zuerich.ch/statistics/property/WAH> <https://ld.stadt-zuerich.ch/statistics/code/WAH1001>;
        <https://ld.stadt-zuerich.ch/statistics/property/ZEIT> ?zeit .

      # notations for filters
      ?kad skos:notation ?kadNotation .
      ?njw skos:notation ?njwNotation .
      ?pat skos:notation ?patNotation .
      ?raum skos:notation ?raumNotation .

      # filters
      ${typeof kad !== 'undefined' ? 'FILTER (?kadNotation IN (' + (kad.join ? kad.map(v => v.toCanonical()).join() : kad.toCanonical()) + '))' : ''}
      ${typeof njw !== 'undefined' ? 'FILTER (?njwNotation IN (' + (njw.join ? njw.map(v => v.toCanonical()).join() : njw.toCanonical()) + '))' : ''}
      ${typeof pat !== 'undefined' ? 'FILTER (?patNotation IN (' + (pat.join ? pat.map(v => v.toCanonical()).join() : pat.toCanonical()) + '))' : ''}
      ${typeof raum !== 'undefined' ? 'FILTER (?raumNotation IN (' + (raum.join ? raum.map(v => v.toCanonical()).join() : raum.toCanonical()) + '))' : ''}

      # time range filter
      ${typeof from !== 'undefined' ? 'FILTER (?zeit >= xsd:date("' + (from.value.length === 4 ? from.value + '-01-01' : from.value) + '"))':''}
      ${typeof to !== 'undefined' ? 'FILTER (?zeit <= xsd:date("' + (to.value.length === 4 ? to.value + '-12-31' : to.value) + '"))':''}
    }
  }
}
