module.exports = {
  endpointUrl: 'http://data.zazuko.com:80/ssz/query',
  user: 'ssz-read',
  password: process.env.SPARQL_ENDPOINT_PASSWORD,

  apiStub: 'hydra-api-stub.json',
  shapeContextStub: 'shape.context.jsonld',

  outDir: 'api_apidev',
  

  // *** WHITELISTING ***
  viewFilter: view => {
    const notation = view.notation.value;
    
    const whitelist = [
      // OK 
      'BEW-RAUM-ZEIT-HEL',
      
      // FAILING
      // 'BES-RAUM-ZEIT-0-0HE-BE'
    ];

    return whitelist.includes(notation);
  }


  // *** BLACKLISTING ***
  // viewFilter: view => {
  //   const blacklist = [
  //     'BES-RAUM-ZEIT-0'
  //   ];

  //   const notation = view.notation.value;    
  //   for (i = 0; i < blacklist.length; i++) {
  //     if (notation.startsWith(blacklist[i])) {
  //       console.log(`blacklisted & skipped: ${notation}`);
  //       return false;
  //     }
  //   }

  //   return true;
  // }

}
