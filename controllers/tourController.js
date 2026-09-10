import express from 'express';
import Tour from '../models/tourModels.js';

const postTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(200).json({ stats: 'success', data: { newTour } });
  } catch (err) {
    res.status(400).json({ stats: 'fail', data: { message: err.message } });
  }
};
const getAllTours = async (req, res) => {
  try {
    const queryObject = { ...req.query }; //DESTRUCTUREING
    const execludedFields = ['sort', 'limit', 'page', 'fields'];
    execludedFields.forEach((el) => {
      delete queryObject[el];
    });
    let queryStrng = JSON.stringify(queryObject);

    let querystr = queryStrng.replace(
      /\b(gte|gt|lt|lte)\b/g,
      (match) => `$${match}`,
    );

    //Sorting
    let query = Tour.find(JSON.parse(querystr));
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' '); //To add more than value to sort with
      query = query.sort(req.query.sort);
    } else {
      query = query.sort('-createdAt'); // Default sorting with createdAt
    }
    //Limiting Fields
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-_v');
    }
    //Pagination
    //page=2 & limit = 10
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const skipValue = (page - 1) * limit;

    query.skip(skip).limit(limit);
    //Execute Query
    const tours = await query;

    res
      .status(200)
      .json({ stats: 'success', results: tours.length, data: { tours } });
  } catch (err) {
    res.status(400).json({ stats: 'fail', message: err.message });
  }
};

const getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({ stats: 'success', data: { tour } });
  } catch (err) {
    res.status(400).json({ stats: 'fail', message: err.message });
  }
};
const updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ stats: 'success', data: { tour: updatedTour } });
  } catch (err) {
    res.status(400).json({ stats: 'fail', message: err.message });
  }
};

const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res.status(400).json({ stats: 'fail', message: err.message });
  }
};
export default { getAllTours, postTour, getTourById, deleteTour, updateTour };
