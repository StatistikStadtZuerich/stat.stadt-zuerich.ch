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
