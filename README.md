Overview
--------
Isidro Razo, 49, was the latest bike rider to die on his way to work in Durham on May 25th on Angier Avenue. That makes four bike-related victims in the past 6 months in Durham. Despite deadly and risky biking conditions in Durham, the transition to a more bike-friendly community is slow and infrastructure budgets are not being accelerated. Policy makers need good data to know where to prioritize new bike plan infrastructure to make roadways safer. Bikers and would-be bikers need to know the safest routes and danger zones as they begin to bike more often to more places.

The goal of the application is to create color-coded bike routes based on relative risk of accidents, number of crashes, time of day, etc. using the NC bike crash database and bike reported incidents. The application will also highlight troublesome intersections.


A snapshot of the master branch is [on heroku](http://bikesafetee.herokuapp.com/). This has been continuous integration server setup with Heroku - ping @dsummersl if its not working for you!

TODO
====

[![Stories in Ready](https://badge.waffle.io/bikesafety/bikesafety.svg?label=ready&title=Ready)](http://waffle.io/bikesafety/bikesafety)

Overview
========

The project uses [Angular]() and [Express]() for the frontend and backend respectively. 

The project uses NPM to manage server side dependences and bower for angular dependencies. The `npm install` will install both of these dependencies for you.

**Frontend**

**Server**

**Database**: The database is hosted on [Firebase](http://firebase.com). Our Database [is this link](https://bikesafety.firebaseio.com/).

Run
===

You only need [Node.js](http://nodejs.org) to develop this platform. Install that:

    npm install
    npm start

`npm start` will open a server on port 3000 of your computer. Go there to view the app.

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

