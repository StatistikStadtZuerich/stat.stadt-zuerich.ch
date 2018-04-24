PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX qb: <http://purl.org/linked-data/cube#>
PREFIX sh: <http://www.w3.org/ns/shacl#>
PREFIX hydra: <http://www.w3.org/ns/hydra/core#>
PREFIX schema: <http://schema.org/>
PREFIX ssz-schema: <http://ld.stadt-zuerich.ch/schema/>
PREFIX stip-schema: <http://stat.stadt-zuerich.ch/schema/>

CONSTRUCT {
    ?root a hydra:Collection .
    ?root hydra:member ?datasetApi .

    ?datasetApi rdfs:label ?datasetLabel .

    ?datasetApi stip-schema:data ?sliceApi .

#    ?datasetApi qb:slice ?slice .
#    ?slice rdfs:label ?sliceLabel .
#    ?slice ?sP ?sO .
#    ?slice a ssz-schema:DefaultSlice .

} WHERE { GRAPH <https://linked.opendata.swiss/graph/zh/statistics>
{

SELECT DISTINCT * WHERE 
{

  BIND(BNODE('shapeResult') AS ?root)

  {
    ?dataset a qb:DataSet .
    ?dataset owl:sameAs ?datasetApi .

#    ?dataset qb:slice ?slice .
    ?dataset rdfs:label ?datasetLabel .

#    ?slice a ssz-schema:DefaultSlice .
#    ?slice rdfs:label ?sliceLabel .
#    ?slice ?sP ?sO .
#    ?slice sh:shapesGraph ?shape .

#    ?shape sh:targetNode ?sliceApi .
#    ?shape owl:sameAs ?shapeApi .

    # filter on dimension
    ?dataset ${typeof dimension !== 'undefined' ?
         ( dimension.join ? 
            dimension.map(t => { return 'qb:structure/qb:component/qb:dimension <' + t.value + '> ;'}).join('\n') : 
            'qb:structure/qb:component/qb:dimension <'+ dimension.value + '> ;'
         ) : ''}
      rdfs:label ?label .

    # datasets must be reachable from topics following a 'skos:narrower' path
    ${typeof topic !== 'undefined'?
        ( topic.join ? 
            topic.map(t => { return '<' + t.value + '> skos:narrower* ?dataset .'}).join('\n') : 
            '<'+ topic.value + '> skos:narrower* ?dataset .'
        ) : ''}
  }

UNION {
    # matches if filter contains datasets
    
    ?dataset a qb:DataSet .
    ?dataset owl:sameAs ?datasetApi .
    ?dataset rdfs:label ?datasetLabel .

    ${typeof topic !== 'undefined'?
        'FILTER (?dataset IN (' + (topic.join ?
            topic.map(v => '<' + v.value + '>').join() 
            : '<' + topic.value + '>') + '))'
        : 'FILTER (?dataset IN ())'}

}

}}}