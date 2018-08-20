# Trifid stat.stadt-zuerich.ch

[![pipeline status](https://gitlab.zazuko.com/docker/stat.stadt-zuerich.ch/badges/master/pipeline.svg)](https://gitlab.zazuko.com/docker/stat.stadt-zuerich.ch/commits/master)

# API Update

Part of the Hydra API is generated based on the data in the triplestore. As data may vary between environments, also
the generated API may vary and therefore API generation is triggered manually an selective for an environment. 

Generate API for *integ*: `npm run update-api`
Generated files for *integ* end up in *api* directory.

Generate API for *prod*: `npm run update-api-prod`
Generated files for *prod* end up in *api_prod* directory.

For doing modifications on the API itself, the following might come in handy:
```
$ npm run update-api-apidev
$ npm run start-apidev
```

# Continuous Integration and Deployment

Commits pushed to `master` are automatically deployed to:

- [stat.integ.stadt-zuerich.ch](https://stat.integ.stadt-zuerich.ch/)

Tags pushed are automatically deployed to:

- [stat.stadt-zuerich.ch](https://stat.stadt-zuerich.ch)

# License (3-Clause BSD)

Copyright 2018 Statistik Stadt Zürich

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

https://opensource.org/licenses/BSD-3-Clause 
