# SSZ API

## Terminology

SSZ _Views_ are currently based on `Referenznummer`in SSZ Data. They map a certain observation to a group of observations that share the same combination of `GRUPPEN`. In [RDF Data Cube Vocabulary](https://www.w3.org/TR/vocab-data-cube/), each of these groups is called a [dimension](https://www.w3.org/TR/vocab-data-cube/#dsd-dimensions). There are two dimensions (groups) that should be assigned to all observations: [RAUM](https://ld.stadt-zuerich.ch/statistics/property/RAUM) & [ZEIT](https://ld.stadt-zuerich.ch/statistics/property/ZEIT). All other dimensions might or might not be used in a view, depending on what is measured. A unique combination of (useful) dimensions is called a [Data Set](https://www.w3.org/TR/vocab-data-cube/#cubes-model-datasets). The data set links to all other relevant metadata structures and as mentioned above, an observation typically [links](https://www.w3.org/TR/vocab-data-cube/#ref_qb_dataSet_LC) to its primary Data Set.

Each of these unique `Referenznummer` entities has an URI as well, for example https://stat.stadt-zuerich.ch/view/BEV001, in RDF Data Cubes these views are called [Slices](https://www.w3.org/TR/vocab-data-cube/#cubes-slices). A slice can lock a certain dimension to a certain value, as an example, it could state that the dimension [SEX](https://ld.stadt-zuerich.ch/statistics/property/SEX) is locked to [female](https://ld.stadt-zuerich.ch/statistics/code/SEX0002). In fact most current views do state that due to the nature of how `Referenznummer` is used so far in SSZ. This will most probably change in a way that new views will be introduced that would for example _not_ lock the dimension SEX to a certain value. Like this one could plot both male and female observations in the same diagram.

In case one does not want to have any locks, querying all dimensions attached to a `qb:DataSet`would return the correct set of all dimensions. However, in the current SSZ DataSet this would still not give a unified view, as many of those related tables are defined as two different Data Sets right now.

Note that the Data Cube definition of `dimension` does _not_ align with the use of the word in the [SSZ D3 API](https://sszvis-components.netlify.com/#/api-specs?a=dimensions-all-possible-subsets) description. As explained this would be a `Slice`or more general a `DataSet`in RDF Data Cube.

## API

There are currently three different API calls available. All of them are listed on the API entry page at https://stat.stadt-zuerich.ch/api.

### Tags

The tag API returns possible *Views* (*Slices* in RDF Data Cubes and *Dimensions* in SSZ D3 API) for a certain keyword.

### Metadata for the Views



### Data for the Views





