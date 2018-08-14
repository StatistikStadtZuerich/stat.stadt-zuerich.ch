module.exports = {
  endpointUrl: 'http://data.zazuko.com:80/ssz/query',
  user: 'ssz-read',
  password: process.env.SPARQL_ENDPOINT_PASSWORD,

  apiStub: 'hydra-api-stub.json',
  shapeContextStub: 'shape.context.jsonld',

  outDir: 'api_apidev',

  viewFilter: view => {
    const notation = view.notation.value;
    
    const whitelist = [
      'BEW-RAUM-ZEIT-HEL'
    ];

    return whitelist.includes(notation);
  }
}
