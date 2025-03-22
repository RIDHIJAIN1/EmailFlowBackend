const { List } = require('../models');
const fs = require('fs');
const path = require('path');
const {Readable} = require('stream')
const csvParser = require('csv-parser');
const { sendSuccess, sendError } = require('../utils/response');

// Create List (Upload CSV)
const createList = async (req, res) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return sendError(res, 'No file uploaded');
    }
    
    // Convert the file buffer to a readable stream
    const readableStream = Readable.from(req.file.buffer);
    let fileData = [];
    
    readableStream
      .pipe(csvParser({
        mapHeaders: ({ header }) => header.trim().toLowerCase() // Clean and standardize headers
      }))
      .on('data', (row) => {
        fileData.push(row); // Add CSV data to the array
        console.log(row);
      })
      .on('end', async () => {
        // Validate that each row contains the required fields
        const missingFields = fileData.filter(row => 
          !row.email || !row.first_name || !row.last_name
        );

        if (missingFields.length > 0) {
          return sendError(res, 'Some entries are missing required fields: ', missingFields);
        }

        // Save the parsed data to the database
        const newList = new List({
          user_id: req.userId, // Assuming the user ID is available in the request
          name: req.body.name,
          file_data: fileData,
        });

        console.log('Parsed CSV data:', fileData);
        await newList.save();
        return sendSuccess(res, 'List created successfully!', newList);
      })
      .on('error', (error) => {
        console.error('Error parsing CSV:', error);
        return sendError(res, 'Error parsing CSV file', error);
      });
  } catch (error) {
    console.error('Error in createList:', error);
    return sendError(res, 'Error creating list', error);
  }
};

// Get all Lists
const getLists = async (req, res) => {
  try {
    const lists = await List.find({ user_id: req.userId }).select('name _id'); // Fetch lists specific to the user
    return sendSuccess(res, 'Lists fetched successfully', lists);
  } catch (error) {
    console.error(error);
    return sendError(res, 'Error fetching lists', error);
  }
};

// Get a single list details
const getListDetails = async (req, res) => {
  try {
    const { listId } = req.params; // Extract listId from request parameters

    // Fetch the list by its ID
    const list = await List.findById(listId);

    if (!list) {
      return sendError(res, 'List not found', null, 404);
    }

    return sendSuccess(res, 'List details fetched successfully', list);
  } catch (error) {
    console.error(error);
    return sendError(res, 'Error fetching list details', error);
  }
};

// Edit List (Update name and possibly CSV file)
const editList = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Find the list to be updated
    const list = await List.findById(id);

    if (!list) {
      return sendError(res, 'List not found', null, 404);
    }

    // If a CSV file is uploaded, parse it and update the file_data field
    let fileData = list.file_data; // Keep the existing file data unless a new file is uploaded

    if (req.file) {
      // Parse the new CSV file from the memory buffer
      fileData = [];
      const buffer = req.file.buffer;

      buffer
        .toString('utf-8') // Convert buffer to string
        .split('\n') // Split into lines
        .forEach((line, index) => {
          if (index > 0) { // Skip the header row
            const columns = line.split(','); // Split by comma (or use custom logic for CSV format)
            fileData.push({
              column1: columns[0], // Adjust based on CSV structure
              column2: columns[1], // Adjust based on CSV structure
              // Add more columns as needed
            });
          }
        });
    }

    // Update the list with the new name and possibly updated file_data
    list.name = name || list.name; // Keep the existing name unless a new name is provided
    list.file_data = fileData;

    // Save the updated list
    await list.save();

    return sendSuccess(res, 'List updated successfully', list);
  } catch (error) {
    console.error(error);
    return sendError(res, 'Error updating list', error);
  }
};

// Delete List
const deleteList = async (req, res) => {
  try {
    const { id } = req.params;
    const list = await List.findByIdAndDelete(id);

    if (!list) {
      return sendError(res, 'List not found', null, 404);
    }

    return sendSuccess(res, 'List deleted successfully');
  } catch (error) {
    console.error(error);
    return sendError(res, 'Error deleting list', error);
  }
};

module.exports = {
  createList,
  getLists,
  getListDetails,
  editList,
  deleteList,
};
