const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
require('dotenv').config();
require('./models/associations');

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

sequelize.sync()
  .then(() => console.log('Banco de dados sincronizado'))
  .catch((error) => console.error('Erro ao sincronizar banco de dados:', error));

const chainIdRoutes = require('./routes/chainIDRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api', chainIdRoutes);
app.use('/auth', authRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
