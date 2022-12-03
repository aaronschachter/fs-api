const express = require('express');

const util = require('./src/util');

const app = express();
const port = 3000;

app.locals.rootDir = util.getRootDirInput();

require('./src/routes')(app);

app.listen(port, () => {
  console.log(`Running on port ${port} with rootDir ${app.locals.rootDir}`);
});
