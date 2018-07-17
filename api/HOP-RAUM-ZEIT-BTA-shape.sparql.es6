PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX qb: <http://purl.org/linked-data/cube#>
PREFIX sh: <http://www.w3.org/ns/shacl#>
PREFIX stip-schema: <http://stat.stadt-zuerich.ch/schema/>
PREFIX ssz-schema: <http://ld.stadt-zuerich.ch/schema/>
PREFIX sdmx-attribute: <http://purl.org/linked-data/sdmx/2009/attribute#>
PREFIX qudt: <http://qudt.org/schema/qudt#>

CONSTRUCT {
  <http://stat.stadt-zuerich.ch/dataset/HOP-RAUM-ZEIT-BTA> a qb:DataSet ;
    rdfs:label ?datasetLabel ;
    sdmx-attribute:unitMeasure ?unit ;
    <http://stat.stadt-zuerich.ch/schema/data> ?sliceApi ;
    qb:slice ?slice ;
    <http://purl.org/dc/terms/license> ?license ;
    qb:slice ?defaultSlice .

  ?defaultSlice ?defaultSliceP ?defaultSliceO .

  ?slice ?sliceP ?sliceO .

  ?shape a sh:NodeShape ;
    sh:property ?b_property .

  ?shape ssz-schema:lastUpdate ?lastupdate ;
    ssz-schema:nextUpdate ?nextupdate .

  ?b_property sh:in ?propertyValue ;
    rdfs:seeAlso ?dimension .

  ?b_property rdfs:label ?dimensionLabel ;
    skos:notation ?dimensionNotation ;
    skos:scopeNote ?dimensionScopeNote .

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
    <http://ld.stadt-zuerich.ch/statistics/dataset/HOP-RAUM-ZEIT-BTA> a qb:DataSet ;
      qb:slice ?defaultSlice ;
      qb:slice ?slice ;
      sdmx-attribute:unitMeasure ?unit ;
      rdfs:label ?datasetLabel .

    OPTIONAL { <http://ld.stadt-zuerich.ch/statistics/dataset/HOP-RAUM-ZEIT-BTA> <http://purl.org/dc/terms/license> ?license }

    ?slice a qb:Slice .
    ?defaultSlice a ssz-schema:DefaultSlice .

    ?defaultSlice sh:shapesGraph ?shape ;
      ?defaultSliceP ?defaultSliceO .

    ?shape a sh:NodeShape .
    ?shape sh:targetNode ?sliceApi .

    ?slice ?sliceP ?sliceO .

    ?shape sh:property ?b_property .

    OPTIONAL {
      ?shape ssz-schema:lastUpdate ?lastupdate ;
        ssz-schema:nextUpdate ?nextupdate .
    }

    ?unit a qudt:Unit .
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

      OPTIONAL { ?dimension skos:scopeNote ?dimensionScopeNote }

    } UNION {
      ?b_property sh:minInclusive ?min ;
        sh:maxInclusive ?max .
    }
  }
}
