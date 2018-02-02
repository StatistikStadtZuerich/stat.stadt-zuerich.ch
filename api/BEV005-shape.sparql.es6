PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX sh: <http://www.w3.org/ns/shacl#>

CONSTRUCT {
  <http://stat.stadt-zuerich.ch/api/dataset/BEV005/shape> a sh:NodeShape .
  <http://stat.stadt-zuerich.ch/api/dataset/BEV005/shape> sh:property ?property .
  ?property ?p ?o .
  ?o rdfs:label ?label .
} WHERE {
  GRAPH <https://linked.opendata.swiss/graph/zh/statistics> {
    <http://stat.stadt-zuerich.ch/view/BEV005/shape> sh:property ?property .
    ?property ?p ?o .

    OPTIONAL {
      ?o rdfs:label ?label .
    }
  }
}
