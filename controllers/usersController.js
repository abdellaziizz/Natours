import express from 'express';
import fs from 'fs';
const getAllUsers = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'this route is not handled yet' });
};
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
