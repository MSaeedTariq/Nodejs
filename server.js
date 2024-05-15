const mongoose = require('mongoose');
const dotenv = require('dotenv');
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
app.listen(port, '127.0.0.1', () => {
  console.log('Server Started On Port 8000');
});
