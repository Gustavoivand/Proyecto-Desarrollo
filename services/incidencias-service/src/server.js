require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`PC5 incidencias-service listening on port ${PORT}`);
});
