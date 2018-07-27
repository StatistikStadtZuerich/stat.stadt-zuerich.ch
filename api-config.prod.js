module.exports = {
  endpointUrl: 'https://lindas-data.ch:8443/lindas/query',
  user: 'public',
  password: 'public',
  
  apiStub: 'hydra-api-stub.prod.json',
  shapeContextStub: 'shape.context.prod.jsonld',

  outDir: 'api_prod',

  viewFilter: view => {
    const blacklist = [
      'BES-RAUM-ZEIT-0',
      'GEB-RAUM-ZEIT-NAF-NAM-SEX'
    ];

    const notation = view.notation.value;    
    for (i = 0; i < blacklist.length; i++) {
      if (notation.startsWith(blacklist[i])) {
        console.log(`blacklisted & skipped: ${notation}`);
        return false;
      }
    }

    return true;
  }
}
