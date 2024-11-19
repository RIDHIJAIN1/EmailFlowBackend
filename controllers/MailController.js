const { sendSuccess, sendError } = require('../utils/response');
const Mail = require('../models/Mail');
const List = require('../models/List'); // Assuming 'List' model exists

// Create a Mail
const createMail = async (req, res) => {
  try {
    const { template, subject , name} = req.body;
    const user_id = req.userId

    // Validate list_id
   
    // Create a new Mail document
    const newMail = new Mail({
      user_id,
      template,
      subject,
      name
    });

    // Save the new Mail
    await newMail.save();
    return sendSuccess(res, 'Mail created successfully', newMail);
  } catch (error) {
    console.error('Error creating mail:', error);
    return sendError(res, 'Failed to create mail', error, 500);
  }
};

// Get all Mails with Pagination
const getMails = async (req, res) => {
  try {
    const mails = await Mail.find({ user_id: req.userId }).select('name _id');
    return sendSuccess(res, 'Mails fetched successfully', mails);
  } catch (error) {
    console.error('Error fetching mails:', error);
    return sendError(res, 'Failed to fetch mails', error, 500);
  }
};

// Get a specific Mail
const getMail = async (req, res) => {
  try {
    const { id } = req.params;

    const mail = await Mail.findById(id);
    if (!mail) {
      return sendError(res, 'Mail not found', null, 404);
    }

    return sendSuccess(res, 'Mail retrieved successfully', mail);
  } catch (error) {
    console.error('Error fetching mail:', error);
    return sendError(res, 'Failed to fetch mail', error, 500);
  }
};

// Edit a Mail (Update template and/or subject)
const editMail = async (req, res) => {
  try {
    const { id } = req.params;
    const { template, subject } = req.body;

    // Find the Mail to update
    const mail = await Mail.findById(id);
    if (!mail) {
      return sendError(res, 'Mail not found', null, 404);
    }

    // Update the fields
    mail.template = template || mail.template;
    mail.subject = subject || mail.subject;

    // Save the updated Mail
    await mail.save();

    return sendSuccess(res, 'Mail updated successfully', mail);
  } catch (error) {
    console.error('Error updating mail:', error);
    return sendError(res, 'Failed to update mail', error, 500);
  }
};

// Delete a Mail
const deleteMail = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the Mail
    const mail = await Mail.findByIdAndDelete(id);
    if (!mail) {
      return sendError(res, 'Mail not found', null, 404);
    }

    return sendSuccess(res, 'Mail deleted successfully');
  } catch (error) {
    console.error('Error deleting mail:', error);
    return sendError(res, 'Failed to delete mail', error, 500);
  }
};

module.exports = {
  createMail,
  getMails,
  getMail,
  editMail,
  deleteMail,
};
