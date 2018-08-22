module.exports = {
  endpointUrl: 'https://lindas-data.ch:8443/lindas/query',
  user: 'public',
  password: 'public',
  
  apiStub: 'hydra-api-stub.prod.json',
  shapeContextStub: 'shape.context.prod.jsonld',

  outDir: 'api_prod',

  // *** WHITELISTING ***
  viewFilter: view => {
    const notation = view.notation.value;

    const whitelist = [
      'BES-RAUM-ZEIT-BTA-SEX',
      'BES-RAUM-ZEIT-BTA',
      'ZUS-RAUM-ZEIT-BTA-HEL',
      'ZUS-RAUM-ZEIT-BTA-SEX',
      'ZUS-RAUM-ZEIT-BTA',
      'SCH-RAUM-ZEIT-BTA-SST',
      'SCH-RAUM-ZEIT-BTA',
      'AST-RAUM-ZEIT-BEW-BTA'
    ];

    return whitelist.includes(notation);
  }

  // *** BLACKLISTING ***
  // viewFilter: view => {
  //   const blacklist = [
  //     'AST-RAUM-ZEIT-BTA',
  //     'BES-RAUM-ZEIT-0',
  //     'GEB-RAUM-ZEIT-NAF-NAM-SEX'
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
