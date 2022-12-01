const express = require('express');

const util = require('./util');

const app = express();
const port = 3000;

app.locals.rootDir = process.argv[2];

app.get('/*', async (req, res) => {
  const path = req.params ? req.params[0] : null;

  try {
    const data = await util.getFileSystemContents(app.locals.rootDir, path);
  
    res.send(data);
  } catch (error) {
    const status = error.status || 500;

    res.status(status).send({ status, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Running on port ${port} with rootDir ${app.locals.rootDir}`);
});
