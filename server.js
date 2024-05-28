const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (error) => {
  console.log('Error Name : ', error.name);
  console.log('Error Message : ', error.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app.js');
const DB = process.env.DATABASE_lOCAL;
const serverConfigurationOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};
mongoose
  .connect(DB, serverConfigurationOptions)
  .then(() => {
    console.log('DB Connected Successfully!');
  })
  .catch((error) => {
    console.log(error);
  });

const port = process.env.PORT || 8000;
const server = app.listen(port, '127.0.0.1', () => {
  console.log('Server Started On Port 8000');
});

process.on('unhandledRejection', (error) => {
  console.log('Error Name : ', error.name);
  console.log('Error Message : ', error.message);
  server.close(() => {
    process.exit(1);
  });
});


