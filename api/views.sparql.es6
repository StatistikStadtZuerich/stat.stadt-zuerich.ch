PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX qb: <http://purl.org/linked-data/cube#>
PREFIX hydra: <http://www.w3.org/ns/hydra/core#>
PREFIX schema: <http://schema.org/>
PREFIX ssz-schema: <http://ld.stadt-zuerich.ch/schema/>
PREFIX stip-schema: <http://stat.stadt-zuerich.ch/schema/>

CONSTRUCT {
    ?root a hydra:Collection .
    ?root hydra:member ?view .
    ?view rdfs:label ?label .

} WHERE { GRAPH <https://linked.opendata.swiss/graph/zh/statistics> {

SELECT DISTINCT ?root ?view ?label WHERE {
{
  BIND(BNODE('neverUseThisUri') AS ?root)
  {

    ?view a <http://purl.org/linked-data/cube#SliceKey> ;
      rdfs:label ?label ;
      ${typeof tag !== 'undefined' ? 'ssz-schema:viewStructure/qb:component/qb:dimension <'+ tag.value + '> .' : ''}

  }
}}}}