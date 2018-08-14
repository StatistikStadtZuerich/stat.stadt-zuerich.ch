module.exports = {
  endpointUrl: 'http://data.zazuko.com:80/ssz/query',
  user: 'ssz-read',
  password: process.env.SPARQL_ENDPOINT_PASSWORD,

  apiStub: 'hydra-api-stub.json',
  shapeContextStub: 'shape.context.jsonld',

  outDir: 'api',

  // *** WHITELISTING ***
  viewFilter: view => {
    const notation = view.notation.value;

    const whitelist = [
      // landing page
      'WRT-RAUM-ZEIT-ARA-OBJ',
      'GBF-RAUM-ZEIT-ARA',
      'GBD-RAUM-ZEIT-ARA',

      // verwandte statistiken
      'AVA-RAUM-ZEIT-GGH-SEX',
      'AVA-RAUM-ZEIT-HEL-SEX',
      'AVA-RAUM-ZEIT-HEL-PSA',
      'AVA-RAUM-ZEIT-ELK-HEL-PSA',
      'GES-RAUM-ZEIT-HEL-SEX',
      'GES-RAUM-ZEIT-ALT',
      'GES-RAUM-ZEIT-HEL',
      'GES-RAUM-ZEIT-ALT-TOU',
      'GES-RAUM-ZEIT-SEX-TOU',
      'SNB-RAUM-ZEIT-HEL',
      'SWB-RAUM-ZEIT-HEO',

      // for simple shakedown
      'BEW-RAUM-ZEIT-HEL',

      // for testing observations with NaN 
      'ZUS-RAUM-ZEIT-BTA-VSA',
      'WHG-RAUM-ZEIT-ZIM'
    ];

    return whitelist.includes(notation);
  }

  // *** BLACKLISTING ***
  // viewFilter: view => {
  //   const blacklist = [
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
