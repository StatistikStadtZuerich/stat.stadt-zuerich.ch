PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX qb: <http://purl.org/linked-data/cube#>
PREFIX hydra: <http://www.w3.org/ns/hydra/core#>
PREFIX schema: <http://schema.org/>
PREFIX ssz-schema: <http://ld.stadt-zuerich.ch/schema/>
PREFIX stip-schema: <http://stat.stadt-zuerich.ch/schema/>

CONSTRUCT {

    ?root a hydra:Collection ;
      hydra:member ?result .
    ?result a ?entityType ;
      rdfs:label ?label .

} WHERE { GRAPH <https://linked.opendata.swiss/graph/zh/statistics> {

SELECT DISTINCT ?root ?result ?entityType ?label WHERE 
{
  BIND(BNODE('neverUseThisUri') AS ?root)

  {
  
  ?view a qb:DataSet ;
    qb:structure/qb:component/(qb:dimension|qb:measure) ?dimension .
  
  ?dimension a <http://purl.org/linked-data/cube#DimensionProperty> .
  ?dimension rdfs:label ?label .
  
  ${typeof query !== 'undefined' ? 'FILTER regex(lcase(?label), "^' + query.value.trim().toLowerCase() + '")' : ''}
  BIND(stip-schema:DimensionEntity AS ?entityType)
  BIND(?dimension as ?result)

  }
  
  UNION
  
  {
  
  ?view a qb:DataSet ;
    rdfs:label ?label ;
  
  ${typeof query !== 'undefined' ? 'FILTER regex(lcase(?label), "^' + query.value.trim().toLowerCase() + '")' : ''}
  BIND(stip-schema:TopicEntity AS ?entityType)
  BIND(?view AS ?result)

  }

}
}}