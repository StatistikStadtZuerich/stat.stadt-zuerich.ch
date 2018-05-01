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

# -----------------------------
# BEGIN reusable templates
${(() => {this.tmplRegex = (varName) => {
    return `regex(lcase(?${varName}), "^${query.value.trim().toLowerCase()}")`
  };
return ''})()}

${(() => {this.tmplDatasetSubquery = (removeDatasetsInTopic) => {
    return `{
      SELECT DISTINCT ?dataSet WHERE {
        ?dataSet a qb:DataSet .

        # filter on dimension
        ${typeof dimension !== 'undefined' ?
            ( dimension.join ? 
              dimension.map(t => { return `?dataSet qb:structure/qb:component/qb:dimension <${t.value}> .`}).join('\n') : 
              `?dataSet qb:structure/qb:component/qb:dimension <${dimension.value}> .`
            ) : '## dimension is UNDEFINED in request'}
    
        # datasets must be reachable from topics following a 'skos:narrower' path
        ${typeof topic !== 'undefined'?
            ( topic.join ? 
                topic.map(t => { return `<${t.value}> skos:narrower* ?dataSet .`}).join('\n') : 
                `<${topic.value}> skos:narrower* ?dataSet .`
            ) : '## topic is UNDEFINED in request'}

        ${removeDatasetsInTopic && (typeof topic !== 'undefined') ?
          `# remove datasets that are already part of the search filter topics
          FILTER (?dataSet NOT IN (${topic.join ? topic.map(t => { return `<${t.value}>`}).join(',\n') : `<${topic.value}>`}))`          
          : ''}
      }
    }`
  };
return ''})()}

${(() => {this.funcFooBar = () => {return '#test'}; return ''})()}

# END reusable templates
# -----------------------------

SELECT DISTINCT ?root ?result ?entityType ?label WHERE 
{
  BIND(BNODE('neverUseThisUri') AS ?root)

  {
    ###### DIMENSIONEN ######
    ?dimension a qb:DimensionProperty;
               rdfs:label ?label ;
               skos:notation ?notation .
    ?dataSet qb:structure/qb:component/(qb:dimension|qb:measure) ?dimension .

    ${(typeof dimension !== 'undefined') || (typeof query !== 'undefined') ? 'FILTER (' : ''}
    ${typeof dimension !== 'undefined' ?
    `# remove dimensions that are already part of the search filter dimensions
    ?dimension NOT IN (${dimension.join ? dimension.map(d => { return `<${d.value}>`}).join(',\n') : `<${dimension.value}>`})
    `
    : ''}
    ${typeof query !== 'undefined' ? `&& (${this.tmplRegex("label")} || ${this.tmplRegex("notation")})` : ''}
    ${(typeof dimension !== 'undefined') || (typeof query !== 'undefined') ? ')' : ''}
    BIND(?dimension AS ?result)
    BIND(stip-schema:DimensionEntity AS ?entityType)

    ${this.tmplDatasetSubquery()}
  }
  
  UNION
  
  {  
    ###### DATASETS ######
    ?dataSet rdfs:label ?label ;
          skos:notation ?notation.
    
    ${typeof query !== 'undefined' ? `FILTER (${this.tmplRegex("label")} || ${this.tmplRegex("notation")})` : ''}
    BIND(stip-schema:TopicEntity AS ?entityType)
    BIND(?dataSet AS ?result)

    ${this.tmplDatasetSubquery(true)}
  }

}
}}