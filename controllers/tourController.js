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
    //Execute Query
    const query = Tour.find(JSON.parse(querystr));
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
