PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX qb: <http://purl.org/linked-data/cube#>
PREFIX sh: <http://www.w3.org/ns/shacl#>
PREFIX hydra: <http://www.w3.org/ns/hydra/core#>
PREFIX schema: <http://schema.org/>
PREFIX ssz-schema: <http://ld.stadt-zuerich.ch/schema/>
PREFIX stip-schema: <http://stat.stadt-zuerich.ch/schema/>
PREFIX shacl: <http://www.w3.org/ns/shacl#>

CONSTRUCT {
    ?root a hydra:Collection .
    ?root hydra:member ?datasetApi .

    ?datasetApi rdfs:label ?datasetLabel .

} WHERE { GRAPH <https://linked.opendata.swiss/graph/zh/statistics>

# =============================
# BEGIN reusable templates

${(() => {this.tmplDatasetSubquery = () => {
    return `{
      SELECT DISTINCT ?dataset ?datasetApi ?datasetLabel ?shape WHERE {
        ?dataset a qb:DataSet .
        ?dataset owl:sameAs ?datasetApi .
        ?dataset rdfs:label ?datasetLabel .
        ?dataset qb:slice ?defaultSlice .
      
        ?defaultSlice a ssz-schema:DefaultSlice .
        ?defaultSlice shacl:shapesGraph ?shape .
      
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
    }`
};
return ''})()}

${(() => {this.tmplWrapInAttributeValueFilter = (accumulator, currentValue) => {
  return `
  SELECT DISTINCT ?dataset ?datasetApi ?datasetLabel ?shape WHERE {
    {
      ${accumulator}
    }

    # filter for Merkmalsauspraegung '${currentValue.value.trim()}'
    ?shape shacl:property/shacl:in ?auspraegung .
    ?auspraegung rdfs:label ?auspraegungLabel .
    FILTER (regex(ENCODE_FOR_URI(lcase(?auspraegungLabel)), '^${currentValue.value.trim().toLowerCase()}'))    
  }`
};
return ''})()}

# END reusable templates
# =============================

{

SELECT DISTINCT * WHERE 
{

  BIND(BNODE('shapeResult') AS ?root)

  {
    ${typeof attributeValue !== 'undefined' ?
    (attributeValue.join ?
      attributeValue.reduce(this.tmplWrapInAttributeValueFilter, this.tmplDatasetSubquery())
      : [attributeValue].reduce(this.tmplWrapInAttributeValueFilter, this.tmplDatasetSubquery()))
    : this.tmplDatasetSubquery()}
  }

  UNION {
    # matches if filter contains datasets
    
    ?dataset a qb:DataSet .
    ?dataset owl:sameAs ?datasetApi .
    ?dataset rdfs:label ?datasetLabel .

    ${typeof topic !== 'undefined'?
        'FILTER (?dataset IN (' + (topic.join ?
            topic.map(v => '<' + v.value + '>').join(',') 
            : '<' + topic.value + '>') + '))'
        : 'FILTER (?dataset IN ())'}
  }

}}}