This repository presents both a service for fetching data from Instagram via
the facebook graph API, and the posterior analysis on said data.

The data fetching service is to be used generically, adding your own instagram/facebook
configuration file will allow you to use the service, considering you have all the requirements needed
to use said API.

For more information regarding FB API please see: https://developers.facebook.com/docs/graph-api/

This repository will be split into two at some later date, a REST API for consuming
instagram services, and a consumer which will read said data, store it in csv files and analyse the data using statistical tools.

The only requirement is:
- Node version >= 14
