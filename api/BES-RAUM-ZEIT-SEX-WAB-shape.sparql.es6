PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX qb: <http://purl.org/linked-data/cube#>
PREFIX sh: <http://www.w3.org/ns/shacl#>
PREFIX stip-schema: <http://stat.stadt-zuerich.ch/schema/>
PREFIX ssz-schema: <http://ld.stadt-zuerich.ch/schema/>

CONSTRUCT {
  <http://stat.stadt-zuerich.ch/api/dataset/BES-RAUM-ZEIT-SEX-WAB> a qb:DataSet ;
#    rdfs:label ?datasetLabel ;
    qb:slice ?sliceApi .

#  ?sliceApi rdfs:label ?sliceLabel .
  ?sliceApi a ssz-schema:DefaultSlice .

  <http://stat.stadt-zuerich.ch/api/dataset/BES-RAUM-ZEIT-SEX-WAB/shape> a sh:NodeShape ;
    sh:property ?b_property .

  ?b_property sh:in ?propertyValue ;
    rdfs:seeAlso ?dimension .

  ?b_property rdfs:label ?dimensionLabel ;
    skos:notation ?dimensionNotation .

  ?propertyValue rdfs:label ?label .

  # all the list fun
  ?b_property sh:path ?b_list .

  ?b_list rdf:first qb:observation ;
    rdf:rest ?b_nil .

  ?b_nil rdf:first ?dimension ;
    rdf:rest rdf:nil .

  # min/max
  ?b_property sh:minInclusive ?min ;
    sh:maxInclusive ?max .
} WHERE {
  GRAPH <https://linked.opendata.swiss/graph/zh/statistics> {
    <http://ld.stadt-zuerich.ch/statistics/dataset/BES-RAUM-ZEIT-SEX-WAB> a qb:DataSet ;
      qb:slice ?slice .
#      rdfs:label ?datasetLabel .

    ?slice a ssz-schema:DefaultSlice .
#      rdfs:label ?sliceLabel .
    ?slice sh:shapesGraph ?shape .

    ?shape sh:property ?b_property .

    {
      ?b_property sh:in ?propertyValue .

      OPTIONAL {
        ?propertyValue rdfs:label ?label .
      }

      FILTER(isIRI(?propertyValue))
    } UNION {
      ?b_property sh:path ?b_list .

      ?b_list rdf:first qb:observation ;
        rdf:rest ?b_nil .

      ?b_nil rdf:first ?dimension ;
        rdf:rest rdf:nil .

      ?dimension rdfs:label ?dimensionLabel ;
        skos:notation ?dimensionNotation .
    } UNION {
      ?b_property sh:minInclusive ?min ;
        sh:maxInclusive ?max .
    }
  }
}
