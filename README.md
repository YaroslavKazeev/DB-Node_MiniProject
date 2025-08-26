# NodeJS Test application starter code

This project contains a template for creating the REST API required in the exam.

The project has the following structure:

- **index.js** - The entry point of the server. It starts the expressJS server.
- **app.js** - The expressJS application.
- **Routes** - Defining the supported HTTP methods and paths. Routes do not contain any logic.
- **Controllers** - Contain the logic of the application. They handle the request and send back the correct response.
- **Tests** - Contains Unit tests
- **dummy-data.json** - Contains a list of 100 random items. It is not required to use it but it may be useful.

You are free to modify this project as you wish.

## Setup instructions

Please run `npm install`

## Run instructions

`node index.js`, `npm start` or `npm run dev`

## Run tests

`npm test`

## Run acceptance tests

`npm run test-acceptance`
