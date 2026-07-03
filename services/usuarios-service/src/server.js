require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`PC5 usuarios-service listening on port ${PORT}`);
});
