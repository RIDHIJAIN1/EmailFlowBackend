const { default: mongoose } = require('mongoose');
const { Mapping } = require('../models');
const { sendSuccess, sendError } = require('../utils/response');

// Create multiple Mappings
const createMapping = async (req, res) => {
  try {
    const mappingsData = req.body; // Expected: Array of [list_id, variable_name, column_index]

    // Map through each entry and create Mappings
    const newMappings = await Mapping.insertMany(
      mappingsData.map(({list_id, variable_name, column_index}) => ({
        list_id,
        variable_name,
        column_index,
      }))
    );

    return sendSuccess(res, 'Mappings created successfully!', newMappings);
  } catch (error) {
    console.error(error);
    return sendError(res, 'Error creating mappings', error);
  }
};

// Get Mappings of a particular List (with pagination)
const getMappings = async (req, res) => {
  try {
    const { list_id } = req.params; // Get list_id from URL
    const { page = 1, limit = 10 } = req.query; // Default pagination: 1 page, 10 items per page

    // Ensure list_id exists
    if (!list_id) {
      return sendError(res, 'No list_id provided', null, 400);
    }

    // Convert list_id to ObjectId
    const listObjectId = new mongoose.Types.ObjectId(list_id);

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
    };

    // Build aggregation pipeline
    const pipeline = [{ $match: { list_id: listObjectId } }]; // Use ObjectId for matching

    // Use aggregatePaginate with the pipeline
    const mappings = await Mapping.aggregatePaginate(Mapping.aggregate(pipeline), options);

    if (!mappings || mappings.docs.length === 0) {
      return sendError(res, 'No mappings found for this list_id', null, 404);
    }

    return sendSuccess(res, 'Mappings fetched successfully', mappings);
  } catch (error) {
    console.error(error);
    return sendError(res, 'Error fetching mappings', error);
  }
};

// Update Mappings for a specific List (Delete existing and add new entries)
const updateMappings = async (req, res) => {
  try {
    const { list_id } = req.params; // Get list_id from URL
    const mappingsData = req.body;  // Expected: Array of [variable_name, column_index]

    // Delete all existing mappings for the specific list_id
    await Mapping.deleteMany({ list_id });

    // Create new mappings for this list_id
    const newMappings = await Mapping.insertMany(
      mappingsData.map(([variable_name, column_index]) => ({
        list_id,
        variable_name,
        column_index,
      }))
    );

    return sendSuccess(res, 'Mappings updated successfully!', newMappings);
  } catch (error) {
    console.error(error);
    return sendError(res, 'Error updating mappings', error);
  }
};

module.exports = {
  createMapping,
  getMappings,
  updateMappings,
};
