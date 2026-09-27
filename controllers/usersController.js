import fs from 'fs';
import express from 'express';
import catchAsync from './../utils/catchAsync.js';
import APIFeatures from '../utils/APIFeature.js';
import User from '../models/userModels.js';

const getAllUsers = catchAsync(async (req, res, next) => {
  //Execute Query

  const users = await User.find();

  res
    .status(200)
    .json({ stats: 'success', results: users.length, data: { users } });
});
const postUsers = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'this route is not handled yet' });
};
const updateUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'this route is not handled yet' });
};
const deleteUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'this route is not handled yet' });
};
const getUsersById = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'this route is not handled yet' });
};
export default { getAllUsers, postUsers, updateUser, deleteUser, getUsersById };
