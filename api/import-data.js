const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config({ path: './config.env' });
const Tour = require('./../models/tourModel');

const tourData = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, './../api/tour.json'), 'utf-8'),
);

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

const importData = async () => {
  try {
    await Tour.create(tourData);
    console.log('Data Imported Successfully!');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data Deleted Successfully!');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '--importData') {
  importData();
}
if (process.argv[2] === '--deleteData') {
  deleteData();
}
