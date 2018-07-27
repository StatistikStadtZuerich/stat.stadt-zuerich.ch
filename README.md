# Trifid stat.stadt-zuerich.ch

[![pipeline status](https://gitlab.zazuko.com/docker/stat.stadt-zuerich.ch/badges/master/pipeline.svg)](https://gitlab.zazuko.com/docker/stat.stadt-zuerich.ch/commits/master)

# Update API

Part of the Hydra API is generated based on the data in the triplestore. As data may vary between environments, also
the generated API may vary and therefore API generation is triggered manually an selective for an environment. 

Generate API for integ: `npm run update-api`

Generate API for prod: `npm run update-api-prod`



# Continuous Integration and Deployment

Commits pushed to `master` are automatically deployed to:

- [stat.integ.stadt-zuerich.ch](http://stat.integ.stadt-zuerich.ch/)

Tags pushed are automatically deployed to:

- [stat.stadt-zuerich.ch](http://stat.stadt-zuerich.ch)
