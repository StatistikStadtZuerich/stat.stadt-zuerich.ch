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
    ?root hydra:member ?shape .
    ?shape ?shapeP ?shapeO .
    ?shapeO ?shapeP2 ?shapeO2 .
    ?shapeO2 ?shapeP3 ?shapeO3 .
    ?shape sh:targetNode ?sliceApi ;
       ssz-schema:dataSet ?dataset .
    ?dataset rdfs:label ?label .
    ?dataset qb:slice ?slice .
    ?slice ?sliceP ?sliceO .
    ?sliceKey ?sliceKeyP ?sliceKeyO.

} WHERE { GRAPH <https://linked.opendata.swiss/graph/zh/statistics> {

SELECT DISTINCT * WHERE {
{

  BIND(BNODE('shapeResult') AS ?root)

  {
    ?dataset a qb:DataSet ;
      ${typeof dimension !== 'undefined' ?
         ( dimension.join ? 
            dimension.map(t => { return 'qb:structure/qb:component/qb:dimension <' + t.value + '> ;'}).join('\n') : 
            'qb:structure/qb:component/qb:dimension <'+ dimension.value + '> ;'
         ) : ''}
      rdfs:label ?label .

    ?dataset qb:slice ?slice .
    ?slice ?sliceP ?sliceO .
    ?slice qb:sliceStructure ?sliceKey .
    ?sliceKey ?sliceKeyP ?sliceKeyO .
    OPTIONAL {
      ?sliceKey sh:shapesGraph ?shape .
      ?shape sh:targetNode ?sliceApi .
      ?shape owl:sameAs ?shapeApi .
      ?shape ?shapeP ?shapeO .
      ?shapeO ?shapeP2 ?shapeO2 .
      ?shapeO2 ?shapeP3 ?shapeO3 .
    }

    ${typeof topic !== 'undefined'? 'FILTER (?dataset IN (' + (topic.join ? topic.map(v => '<' + v.value + '>').join() : '<' + topic.value + '>') + '))' : ''}
  }

}}}}