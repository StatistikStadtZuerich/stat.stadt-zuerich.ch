module.exports = {
  endpointUrl: 'http://data.zazuko.com:80/ssz/query',
  user: 'ssz-read',
  password: 'coo2aiw6itiT',

  apiStub: 'hydra-api-stub.json',
  shapeContextStub: 'shape.context.jsonld',

  outDir: 'api',

  viewFilter: view => {
    const blacklist = [
      'BES-RAUM-ZEIT-0',
      // 'GEB-RAUM-ZEIT-NAF-NAM-SEX'
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
