PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX qb: <http://purl.org/linked-data/cube#>
PREFIX sh: <http://www.w3.org/ns/shacl#>
PREFIX stip-schema: <http://stat.stadt-zuerich.ch/schema/>
PREFIX ssz-schema: <http://ld.stadt-zuerich.ch/schema/>
PREFIX sdmx-attribute: <http://purl.org/linked-data/sdmx/2009/attribute#>

CONSTRUCT {
  <http://stat.stadt-zuerich.ch/dataset/WHG-RAUM-ZEIT-ARA-ZIM-ZON> a qb:DataSet ;
    rdfs:label ?datasetLabel ;
    sdmx-attribute:unitMeasure ?unit ;
    <http://stat.stadt-zuerich.ch/schema/data> ?sliceApi ;
    qb:slice ?slice ;
    qb:slice ?defaultSlice .

  ?defaultSlice ?defaultSliceP ?defaultSliceO .

  ?slice ?sliceP ?sliceO .

  ?shape a sh:NodeShape ;
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

  ?b_property sh:minInclusive ?min ;
    sh:maxInclusive ?max .

  ?unit rdfs:label ?unitlabel ;
    skos:notation ?unitnotation .

} WHERE {
  GRAPH <https://linked.opendata.swiss/graph/zh/statistics> {
    <http://ld.stadt-zuerich.ch/statistics/dataset/WHG-RAUM-ZEIT-ARA-ZIM-ZON> a qb:DataSet ;
      qb:slice ?defaultSlice ;
      qb:slice ?slice ;
      sdmx-attribute:unitMeasure ?unit ;
      rdfs:label ?datasetLabel .

    ?defaultSlice sh:shapesGraph ?shape ;
      ?defaultSliceP ?defaultSliceO .

    ?shape sh:targetNode ?sliceApi .

    ?slice ?sliceP ?sliceO .

    ?shape sh:property ?b_property .

    ?unit rdfs:label ?unitlabel ;
      skos:notation ?unitnotation .

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
