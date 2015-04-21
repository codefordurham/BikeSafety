[![Stories in Ready](https://badge.waffle.io/BikeSafety/BikeSafety.png?label=ready&title=Ready)](https://waffle.io/BikeSafety/BikeSafety)
Overview
--------

A [demo is here](http://desolate-garden-4742.herokuapp.com/).

TODO
====

[![Stories in Ready](https://badge.waffle.io/bikesafety/bikesafety.svg?label=ready&title=Ready)](http://waffle.io/bikesafety/bikesafety)

Run
===

    npm install
    npm start

Test
====

    npm test

Under development you might want to rerun tests when files change:

    npm run-script start-test

TopoJSON
========

The frontend application uses [TopoJSON](https://github.com/mbostock/topojson)
to render paths. If the source geojson is updated then the topojson needs to be
updated too.

To convert the geojson file to topojson:

    ./node_modules/.bin/topojson -p BIKE_FACIL --id-property OBJECTID_12 html/src/data/durham-bike-lanes.geojson > html/src/data/durham-bike-lanes.topojson

