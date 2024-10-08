const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const routes = require('./src/routes');
const morgan = require('morgan');
const cors = require('cors');

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGO_URI, {

})
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('Erro ao conectar ao MongoDB:', error));

app.use(cors()); 
app.use(morgan('dev')); 
app.use(express.json());

app.use('/api', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
