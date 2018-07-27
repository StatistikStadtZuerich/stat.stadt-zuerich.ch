module.exports = {
  endpointUrl: 'http://data.zazuko.com:80/ssz/query',
  user: 'ssz-read',
  password: 'coo2aiw6itiT',

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
