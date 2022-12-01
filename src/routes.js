const controller = require('./controller');

module.exports = function init(app) {
  app.get('/*', async (req, res) => {
    const path = req.params ? req.params[0] : null;
  
    try {
      const data = await controller.getFileSystemContents(app.locals.rootDir, path);
    
      res.send(data);
    } catch (error) {
      const status = error.status || 500;
  
      res.status(status).send({ error: error.message });
    }
  });
}
