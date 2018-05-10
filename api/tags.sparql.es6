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

# =============================
# BEGIN reusable templates
${(() => {this.tmplRegex = (varName) => {
    return `regex(lcase(${varName}), "^${query.value.trim().toLowerCase()}")`
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
            ) : '## dimension is undefined in request'}
    
        # datasets must be reachable from topics following a 'skos:narrower' path
        ${typeof topic !== 'undefined'?
            ( topic.join ? 
                topic.map(t => { return `<${t.value}> skos:narrower* ?dataSet .`}).join('\n') : 
                `<${topic.value}> skos:narrower* ?dataSet .`
            ) : '## topic is undefined in request'}

        ${removeDatasetsInTopic && (typeof topic !== 'undefined') ?
          `# remove datasets that are already part of the search filter topics
          FILTER (?dataSet NOT IN (${topic.join ? topic.map(t => { return `<${t.value}>`}).join(',\n') : `<${topic.value}>`}))`          
          : ''}
      }
    }`
  };
return ''})()}

${(() => {this.tmplFilterInTopics = (varName) => {
  return `FILTER (${varName} IN (${topic.join ? topic.map(t => { return `<${t.value}>`}).join(',\n') : `<${topic.value}>`}))`
};
return ''})()}

${(() => {this.tmplFilterInDimensions = (varName) => {
  return `FILTER (${varName} IN (${dimension.join ? dimension.map(d => { return `<${d.value}>`}).join(',\n') : `<${dimension.value}>`}))`
};
return ''})()}

${(() => {this.tmplExcludeBroaderTopics = (varName) => {
  return (typeof topic !== 'undefined') ?
      `MINUS {
          ${topic.join ?
            topic.map(t => { return `{${varName} skos:narrower* <${t.value}>}`}).join('\nUNION ') :
                                    `${varName} skos:narrower* <${topic.value}>`}
        }
      `
      : "## topic is undefined in request"
};
return ''})()}

${(() => {this.funcFooBar = () => {return '#test'}; return ''})()}

# END reusable templates
# =============================

SELECT DISTINCT ?root ?result ?entityType ?label WHERE 
{
  BIND(BNODE('neverUseThisUri') AS ?root)

  {
    ###### DIMENSIONEN ######
    ?dimension a qb:DimensionProperty;
               rdfs:label ?label ;
               skos:notation ?notation .
    ?dataSet qb:structure/qb:component/(qb:dimension|qb:measure) ?dimension .
    
    ${typeof query !== 'undefined' ? `FILTER (${this.tmplRegex("?label")} || ${this.tmplRegex("?notation")})` : ''}
    
    BIND(?dimension AS ?result)
    BIND(stip-schema:DimensionEntity AS ?entityType)

    ${this.tmplDatasetSubquery()}
  }

  UNION

  {
    ###### THEMENBAUM THEMA ######
    ?thema a skos:Concept, <http://ld.stadt-zuerich.ch/schema/Category> ;
           rdfs:label ?label;
           skos:narrower+ ?dataSet .
    ${typeof query !== 'undefined' ? `FILTER (${this.tmplRegex("?label")})` : ''}

    # assert ?thema is refinement: we exclude the solution if a node further down in the topic-tree is part of the search filter
    ${this.tmplExcludeBroaderTopics("?thema")}
    
    BIND(stip-schema:TopicEntity AS ?entityType)
    BIND(?thema AS ?result)

    ${this.tmplDatasetSubquery("removeDatasetsInTopic")}
  }

  UNION
  
  {
    ###### THEMENBAUM STUFE-1 ######
    ?thema a skos:Concept, <http://ld.stadt-zuerich.ch/schema/Category> ;
           skos:narrower ?stufe1 .
    ?stufe1 a skos:Concept;
            rdfs:label ?label;
            (skos:narrower/skos:narrower)|(skos:narrower/skos:narrower/skos:narrower)|(skos:narrower/skos:narrower/skos:narrower/skos:narrower) ?dataSet .
    ${typeof query !== 'undefined' ? `FILTER (${this.tmplRegex("?label")})` : ''}
    
    # assert ?stufe1 is refinement: we exclude the solution if a node further down in the topic-tree is part of the search filter
    ${this.tmplExcludeBroaderTopics("?stufe1")}

    BIND(stip-schema:TopicEntity AS ?entityType)
    BIND(?stufe1 AS ?result)

    ${this.tmplDatasetSubquery("removeDatasetsInTopic")}
  }

  UNION
  
  {
    ###### THEMENBAUM STUFE-2 ######
    ?thema a skos:Concept, <http://ld.stadt-zuerich.ch/schema/Category> ;
           skos:narrower/skos:narrower ?stufe2 .
    ?stufe2 a skos:Concept;
            rdfs:label ?label;
            (skos:narrower/skos:narrower)|(skos:narrower/skos:narrower/skos:narrower) ?dataSet .
    ${typeof query !== 'undefined' ? `FILTER (${this.tmplRegex("?label")})` : ''}
    
    # assert ?stufe2 is refinement: we exclude the solution if a node further down in the topic-tree is part of the search filter
    ${this.tmplExcludeBroaderTopics("?stufe2")}
    
    BIND(stip-schema:TopicEntity AS ?entityType)
    BIND(?stufe2 AS ?result)

    ${this.tmplDatasetSubquery("removeDatasetsInTopic")}
  }

  UNION
  
  {
    ###### THEMENBAUM STUFE-3 ######
    ?thema a skos:Concept, <http://ld.stadt-zuerich.ch/schema/Category> ;
           skos:narrower/skos:narrower/skos:narrower ?stufe3 .
    ?stufe3 a skos:Concept;
            rdfs:label ?label;
            skos:narrower/skos:narrower ?dataSet .
    ${typeof query !== 'undefined' ? `FILTER (${this.tmplRegex("?label")})` : ''}

    # assert ?stufe3 is refinement: we exclude the solution if a node further down in the topic-tree is part of the search filter
    ${this.tmplExcludeBroaderTopics("?stufe3")}

    BIND(stip-schema:TopicEntity AS ?entityType)
    BIND(?stufe3 AS ?result)

    ${this.tmplDatasetSubquery("removeDatasetsInTopic")}
  }
  
  UNION

  {
    ####### REFERENZTABELLEN ######
    ?reftab a skos:Concept, <http://ld.stadt-zuerich.ch/schema/Topic> ;
            skos:narrower ?dataSet ;
            rdfs:label ?label ;
            skos:notation ?notation .
    
    ${typeof query !== 'undefined' ? `FILTER (${this.tmplRegex("?label")} || ${this.tmplRegex("?notation")})` : ''}

    # assert ?reftab is refinement: we exclude the solution if a node further down in the topic-tree is part of the search filter
    ${this.tmplExcludeBroaderTopics("?reftab")}
    
    BIND(stip-schema:TopicEntity AS ?entityType)
    BIND(?reftab AS ?result)

    ${this.tmplDatasetSubquery("removeDatasetsInTopic")}
  }

  UNION
  
  {  
    ###### DATASETS ######
    ?dataSet rdfs:label ?label ;
          skos:notation ?notation.
    
    ${typeof query !== 'undefined' ? `FILTER (${this.tmplRegex("?label")} || ${this.tmplRegex("?notation")})` : ''}
    BIND(stip-schema:TopicEntity AS ?entityType)
    BIND(?dataSet AS ?result)

    ${this.tmplDatasetSubquery()}
  }

  ${typeof topic !== 'undefined'?
    `
      UNION
      {
        ###### THEMA IN TOPICS: topics contained in the Request-Parameters are always included in the result ######
        ?thema a skos:Concept ;
              rdfs:label ?label.
        ${this.tmplFilterInTopics("?thema")}
        BIND(?thema AS ?result)
        BIND(stip-schema:TopicEntity AS ?entityType)
      }
      UNION
      {
        ###### DATASETS IN TOPICS: topics contained in the Request-Parameters are always included in the result ######
        ?dataSet a qb:DataSet ;
             rdfs:label ?label ;
        ${this.tmplFilterInTopics("?dataSet")}
        BIND(?dataSet AS ?result)
        BIND(stip-schema:TopicEntity AS ?entityType)
      }
    `
    : `
      ## THEMA IN TOPICS: topic is undefined in request
      ## DATASET IN TOPICS: topic is undefined in request
    `
  }

  ${typeof dimension !== 'undefined' ?
    `
      UNION
      {
        ###### DIMENSION IN DIMENSIONS: dimensions contained in the Request-Parameters are always included in the result ######
        ?dimension a qb:DimensionProperty;
                  rdfs:label ?label ;
        ${this.tmplFilterInDimensions("?dimension")}
        BIND(?dimension AS ?result)
        BIND(stip-schema:DimensionEntity AS ?entityType)
      }
    `
    : `
      ## DIMENSION IN DIMENSIONS: dimension is undefined in request
    `
  }

}
}}