const app = require('./app');

const server = app.listen(4000, () => {
  console.log(`Express is running on port ${server.address().port}`);
});
