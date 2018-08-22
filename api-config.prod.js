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
      'ABL-RAUM-ZEIT',
      'ABL-RAUM-ZEIT-ALT-HEL',
      'ABL-RAUM-ZEIT-HEL',
      'ADA-RAUM-ZEIT-BTA',
      'ANT-RAUM-ZEIT-GGH-HEL',
      'AST-RAUM-ZEIT-BEW-BTA',
      // **EXCLUDED** 'AST-RAUM-ZEIT-BTA',
      'AUF-RAUM-ZEIT-BTA',
      'AUL-RAUM-ZEIT-BTA',
      'AUL-RAUM-ZEIT-BTA-MEA',
      'AVA-RAUM-ZEIT',
      'AVA-RAUM-ZEIT-GGH-HEL',
      'AVA-RAUM-ZEIT-GGH-HEL-SEX',
      'AVA-RAUM-ZEIT-GGH-SEX',
      'BES-RAUM-ZEIT-BTA',
      'BES-RAUM-ZEIT-BTA-SEX',
      'BEW-RAUM-ZEIT',
      // **EXCLUDED** 'BEW-RAUM-ZEIT-ALT',
      // **EXCLUDED** 'BEW-RAUM-ZEIT-ALT-HEL',
      // **EXCLUDED** 'BEW-RAUM-ZEIT-ALT-HEL-SEX',
      'BEW-RAUM-ZEIT-ALT-SEX',
      'BEW-RAUM-ZEIT-AUA-HEL',
      'BEW-RAUM-ZEIT-HEL',
      'BEW-RAUM-ZEIT-HEL-KON',
      'BEW-RAUM-ZEIT-HEL-KON-SEX',
      // **EXCLUDED** 'BEW-RAUM-ZEIT-HEL-SEX',
      'BEW-RAUM-ZEIT-KON',
      'BEW-RAUM-ZEIT-SEX',
      'BST-RAUM-ZEIT',
      'BST-RAUM-ZEIT-HEL',
      'BST-RAUM-ZEIT-HEL-SEX',
      'BST-RAUM-ZEIT-HEL-SEX-ZIV',
      'BST-RAUM-ZEIT-HEL-ZIV',
      'BST-RAUM-ZEIT-SEX',
      'BST-RAUM-ZEIT-SEX-ZIV',
      'BST-RAUM-ZEIT-ZIV',
      'FAU-RAUM-ZEIT-BTA',
      'GEB-RAUM-ZEIT',
      'GEB-RAUM-ZEIT-HEL',
      'GES-RAUM-ZEIT',
      'GES-RAUM-ZEIT-HEL',
      'HBR-RAUM-ZEIT-BTA',
      'MED-RAUM-ZEIT-BTA',
      'MED-RAUM-ZEIT-BTA-MEA',
      'NAF-RAUM-ZEIT-BTA',
      'PFI-RAUM-ZEIT-BTA',
      'PLA-RAUM-ZEIT-BTA',
      'PLB-RAUM-ZEIT-BTA',
      'PLB-RAUM-ZEIT-BTA-VSA',
      'PUB-RAUM-ZEIT-BTA-SGR',
      'SAB-RAUM-ZEIT',
      'SCH-RAUM-ZEIT-BTA',
      'SCH-RAUM-ZEIT-BTA-SST',
      'SNB-RAUM-ZEIT',
      'SNB-RAUM-ZEIT-HEL',
      'STF-RAUM-ZEIT',
      // **EXCLUDED** 'STF-RAUM-ZEIT-BBA',
      // **EXCLUDED** 'STF-RAUM-ZEIT-BBA-ZON',
      // **EXCLUDED** 'STF-RAUM-ZEIT-EIG',
      // **EXCLUDED** 'STF-RAUM-ZEIT-ZON',
      'SUB-RAUM-ZEIT',
      'SWB-RAUM-ZEIT',
      'SWB-RAUM-ZEIT-HEL',
      'TIA-RAUM-ZEIT-BTA',
      'TIA-RAUM-ZEIT-BTA-TIG',
      'TII-RAUM-ZEIT-BTA',
      'TII-RAUM-ZEIT-BTA-TIG',
      'TXA-RAUM-ZEIT-BTA',
      'VER-RAUM-ZEIT-BTA',
      'VER-RAUM-ZEIT-BTA-PRA',
      'VER-RAUM-ZEIT-BTA-VSA',
      'WEZ-RAUM-ZEIT',
      'WEZ-RAUM-ZEIT-HEL',
      'WRT-RAUM-ZEIT-BTA-EAP',
      'ZUS-RAUM-ZEIT-BTA',
      'ZUS-RAUM-ZEIT-BTA-HEL',
      'ZUS-RAUM-ZEIT-BTA-PRA',
      'ZUS-RAUM-ZEIT-BTA-SEX',
      'ZUS-RAUM-ZEIT-BTA-VSA',
      'ZUS-RAUM-ZEIT-BTA-VSA-ZSA',
      'ZUS-RAUM-ZEIT-BTA-ZSA',
      'ZUT-RAUM-ZEIT-BTA',
      'ZUV-RAUM-ZEIT-BTA',
      'ZUZ-RAUM-ZEIT',
      'ZUZ-RAUM-ZEIT-HEL',
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
