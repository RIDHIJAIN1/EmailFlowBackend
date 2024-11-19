const { sendSuccess, sendError } = require('../utils/response');
const Wait = require('../models/Wait');

// Create Wait (POST)
const createWait = async (req, res) => {
  try {
    const { type, value } = req.body;

    // Create new Wait document
    const newWait = new Wait({ type, value });
    await newWait.save();

    return sendSuccess(res, 'Wait created successfully', newWait);
  } catch (error) {
    console.error('Error creating wait:', error);
    return sendError(res, 'Failed to create wait', error, 500);
  }
};

// Get Waits (GET) - with pagination
const getWaits = async (req, res) => {
  try {
    // Fetch all Wait documents with pagination (if provided)
    const { page = 1, limit = 10 } = req.query; // Default page=1 and limit=10
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
    };

    const result = await Wait.aggregatePaginate(Wait.find(), options);
    return sendSuccess(res, 'Waits fetched successfully', result);
  } catch (error) {
    console.error('Error fetching waits:', error);
    return sendError(res, 'Failed to fetch waits', error, 500);
  }
};

// Get Wait by ID (GET)
const getWaitById = async (req, res) => {
  try {
    const { id } = req.params;
    const wait = await Wait.findById(id);

    if (!wait) {
      return sendError(res, 'Wait not found', null, 404);
    }

    return sendSuccess(res, 'Wait retrieved successfully', wait);
  } catch (error) {
    console.error('Error fetching wait by ID:', error);
    return sendError(res, 'Failed to fetch wait', error, 500);
  }
};

// Update Wait (PUT)
const updateWait = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, value } = req.body;

    const wait = await Wait.findByIdAndUpdate(
      id,
      { type, value },
      { new: true } // Return the updated document
    );

    if (!wait) {
      return sendError(res, 'Wait not found', null, 404);
    }

    return sendSuccess(res, 'Wait updated successfully', wait);
  } catch (error) {
    console.error('Error updating wait:', error);
    return sendError(res, 'Failed to update wait', error, 500);
  }
};

// Delete Wait (DELETE)
const deleteWait = async (req, res) => {
  try {
    const { id } = req.params;

    const wait = await Wait.findByIdAndDelete(id);

    if (!wait) {
      return sendError(res, 'Wait not found', null, 404);
    }

    return sendSuccess(res, 'Wait deleted successfully');
  } catch (error) {
    console.error('Error deleting wait:', error);
    return sendError(res, 'Failed to delete wait', error, 500);
  }
};

module.exports = { createWait, getWaits, getWaitById, updateWait, deleteWait };
