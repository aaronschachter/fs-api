const express = require('express');

const app = express();
const port = 3000;

// Set the root directory to our command line argument.
app.locals.rootDir = process.argv[2];

require('./src/routes')(app);

app.listen(port, () => {
  console.log(`Running on port ${port} with rootDir ${app.locals.rootDir}`);
});
