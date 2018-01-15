PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX qb: <http://purl.org/linked-data/cube#>
PREFIX hydra: <http://www.w3.org/ns/hydra/core#>
PREFIX schema: <http://schema.org/>
PREFIX ssz-schema: <http://ld.stadt-zuerich.ch/schema/>

CONSTRUCT {

    <http://nirvana> a schema:ItemList ;
        schema:itemListElement [
            a schema:ListItem ;
            a ?entityType ;
            schema:item ?view 
            #schema:position> 1 ;
        ] .
    ?view rdfs:label ?label .

} WHERE { GRAPH <https://linked.opendata.swiss/graph/zh/statistics> {
  
  {
  
  ?view a <http://purl.org/linked-data/cube#SliceKey> ;
  	ssz-schema:viewStructure/qb:component/qb:dimension ?dimension .
  
  ?dimension a <http://purl.org/linked-data/cube#DimensionProperty> .
  ?dimension rdfs:label ?label .
  
  ${typeof query !== 'undefined' ? 'FILTER regex(?label, "' + query + '*")' : ''}
  BIND(ssz-schema:DimensionEntity AS ?entityType)

  }
  
  UNION
  
  {
  
  ?view a <http://purl.org/linked-data/cube#SliceKey> ;
  	rdfs:label ?label ;
  
  ${typeof query !== 'undefined' ? 'FILTER regex(?label, "' + query + '*")' : ''}
  BIND(ssz-schema:TopicEntity AS ?entityType)

  }
}}