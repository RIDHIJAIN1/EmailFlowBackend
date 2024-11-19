const { Project } = require("../models");
const List = require("../models/List");
const Mail = require("../models/Mail");
// const Mapping = require("../models/Mapping");
const { sendSuccess, sendError } = require("../utils/response");
const Agenda = require("agenda");
// controllers/email.controller.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
// Create Project
const create = async (req, res) => {
  try {
    const { name } = req.body;

    const project = new Project({
      name,
      user_id: req.userId, // Automatically set from `isAuthenticated` middleware
      sequance_id: null, // Initially blank
    });

    await project.save();

    return sendSuccess(res, "Project created successfully", project);
  } catch (error) {
    console.error("Error creating project:", error);
    return sendError(res, "Failed to create project", error, 500);
  }
};

// Edit Project
const edit = async (req, res) => {
  try {
    const { id } = req.params; // Project ID from URL params
    const { name } = req.body;

    const project = await Project.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    if (!project) {
      return sendError(res, "Project not found", null, 404);
    }

    return sendSuccess(res, "Project updated successfully", project);
  } catch (error) {
    console.error("Error updating project:", error);
    return sendError(res, "Failed to update project", error, 500);
  }
};

// List All Projects
// const index = async (req, res) => {
//     try {
//         const projects = await Project.find({ user_id: req.userId }); // Filter projects by user
//         return sendSuccess(res, 'Projects retrieved successfully', projects);
//     } catch (error) {
//         console.error('Error fetching projects:', error);
//         return sendError(res, 'Failed to fetch projects', error, 500);
//     }
// };
// List All Projects with Pagination
const projectById = async (req, res) => {
  try {
    const { id } = req.params; // Extract listId from request parameters
    console.log(req.user);
    //   console.log(projectId)
    // Fetch the list by its ID
    const project = await Project.findById(id);

    if (!project) {
      return sendError(res, "Project not found", null, 404);
    }

    return sendSuccess(res, "Project details fetched successfully", project);
  } catch (error) {
    console.error(error);
    return sendError(res, "Error fetching project details", error);
  }
};
const start = async (req, res) => {
  try {
    console.log(process.env.EMAIL_USER);
    const agenda = new Agenda({
      db: { address: process.env.MONGODB_URI, collection: "emailseq" },
    });

    // Define the job
    agenda.define("send scheduled email", async (job) => {
      const { project } = job.attrs.data;

      const sequences = project.sequence.sequences;
      const lists = project.sequence.lists;

      let delay = 1; // Default delay of 1hr

      for (const sequence of sequences) {
        if (sequence.type === "mail") {
          const mail = await Mail.findById(sequence.id);
          if (!mail) throw new Error(`Mail with ID ${sequence.id} not found`);
          const mailSubject = mail.subject;
          const mailTemplate = Buffer.from(mail.template, "base64").toString(
            "utf-8"
          );
          for (const listId of lists) {
            const listData = await List.findById(listId);
            if (!listData) continue;
            for (const user of listData.file_data){
              const mailOptions = {
                from: `"Future Blink" <${process.env.EMAIL_USER}>`,
                to: user.email,
                subject: mailSubject,
                html: `
                  <h1>Hello ${user.first_name},</h1>
                  <p>${mailTemplate}</p>
                  <p>Best regards,<br>Your Company</p>
                `,
              };
              // Send email
              setTimeout(() => {
                transporter.sendMail(mailOptions).catch((err) => {
                  console.error("Email sending failed:", err);
                });
              }, delay * 1000);
            }
          }
        }

        if (sequence.type === "wait") {
          const waitTime =
            sequence.waitType === "Minutes"
              ? sequence.waitFor * 60
              : sequence.waitType === "Hours"
              ? sequence.waitFor * 60 * 60
              : sequence.waitType === "Days"
              ? sequence.waitFor * 60 * 60 * 24
              : 0;
          delay += waitTime;
        }
      }
    });

    // Starts from here
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) return sendError(res, "Project not found", null, 404);

    await agenda.start();
    await agenda.schedule(new Date(), "send scheduled email", { project });

    agenda.on("start", (job) => {
      console.log(`Job ${job.attrs.name} starting`);
    });

    agenda.on("complete", (job) => {
      console.log(`Job ${job.attrs.name} finished`);
    });

    agenda.on("fail", (err, job) => {
      console.error(`Job ${job.attrs.name} failed:`, err);
    });

    return sendSuccess(res, "Sequences started successfully!", project);
  } catch (error) {
    console.error(error);
    return sendError(res, "Error scheduling emails", error);
  }
};

const index = async (req, res) => {
  try {
    // Extract pagination parameters from query
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 items

    const options = {
      page: parseInt(page), // Convert to integer
      limit: parseInt(limit), // Convert to integer
    };

    // Fetch projects with pagination
    const projects = await Project.find({ user_id: req.userId })
      .skip((options.page - 1) * options.limit) // Skip based on page and limit
      .limit(options.limit); // Limit the number of results

    // Count the total number of projects for pagination purposes
    const totalProjects = await Project.countDocuments({ user_id: req.userId });

    // Send the paginated result along with the total count
    return sendSuccess(res, "Projects retrieved successfully", {
      projects,
      totalProjects,
      currentPage: options.page,
      totalPages: Math.ceil(totalProjects / options.limit),
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return sendError(res, "Failed to fetch projects", error, 500);
  }
};

// Delete Project with Cascade
const remove = async (req, res) => {
  try {
    const { id } = req.params; // Project ID from URL params

    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return sendError(res, "Project not found", null, 404);
    }

    // // Cascade delete: Remove related sequance
    // await Sequance.deleteMany({ _id: project.sequance_id });

    return sendSuccess(res, "Project deleted successfully");
  } catch (error) {
    console.error("Error deleting project:", error);
    return sendError(res, "Failed to delete project", error, 500);
  }
};

const updateSequence = async (req, res) => {
  try {
    const { id } = req.params; // Project ID from URL params
    const { sequence } = req.body; // The new sequence data
    // Validate that the sequence structure is valid
    if (!sequence) {
      return sendError(res, "Invalid sequence data", null, 400);
    }

    // Find the project by ID without changing the name or other fields
    const project = await Project.findByIdAndUpdate(
      id,
      { sequence }, // Only update the sequence field
      { new: true, fields: { name: 1, sequence: 1 } } // Ensure 'name' remains unchanged
    );

    if (!project) {
      return sendError(res, "Project not found", null, 404);
    }

    return sendSuccess(res, "Project sequence updated successfully", project);
  } catch (error) {
    console.error("Error updating project sequence:", error);
    return sendError(res, "Failed to update project sequence", error, 500);
  }
};

// -------------------------------SEND MAIL API-----------------------------

module.exports = {
  create,
  edit,
  index,
  remove,
  updateSequence,
  projectById,
  start,
};
