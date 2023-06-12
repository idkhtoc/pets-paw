const express = require('express');
const cors = require('cors');
const config = require('config');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');

const appRoutes = require('./routes');


const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));
app.use(cookieParser());

app.use('/api', appRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = config.get('port') || 8080;

const start = async () => {
  try {
    await mongoose.connect(config.get('mongoUri'));

    app.listen(PORT, () => console.log(`Server started at port: ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
