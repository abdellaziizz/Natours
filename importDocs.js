import mongoose from 'mongoose';
import Tour from '/run/media/ahmedabdelaziz/Data/Coding/Node JS/complete-node-bootcamp-master/4-natours/starter/models/tourModels.js';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: 'config.env' });
const DB = process.env.DATABASE;
const tour = JSON.parse(
  fs.readFileSync(`dev-data/data/tours-simple.json`, 'utf-8'),
);
const importTours = async () => {
  try {
    await Tour.create(tour);
    console.log('data inserted Successfully');
  } catch (err) {
    console.log(err.message);
  }
};
const deleteDocuments = async () => {
  try {
    await Tour.deleteMany();
    console.log('data deleted Successfully');
  } catch (err) {
    console.log(err.message);
  }
};
const run = async () => {
  try {
    await mongoose.connect(DB).then(() => {
      console.log('DB connection Success');
    });
    await deleteDocuments();
    await importTours();
  } catch (err) {}
};
run();
