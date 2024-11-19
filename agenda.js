import Agenda from 'agenda';
import { config } from 'dotenv';
import { connectdb } from '../data/database.js';
import sendEmails from '../controller/email.controller.js';


config();

// Initialize Agenda
const agenda = new Agenda({
  db: { address: process.env.MONGODB_URI, collection: 'emailJobs' },
});

// Define the job
agenda.define('send scheduled email', async (job) => {
  const { recipients, subject, content, threadIds, delay } = job.attrs.data;

  if (!Array.isArray(recipients) || recipients.length === 0) {
    console.error("No recipients found, cannot send email.");
    return;
  }


  try {
    console.log("Sending email with data:", job.attrs.data);
    await start({ recipients, subject, content, threadIds, delay });
    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error);
  }
});

(async function () {
  try {
    await connectdb();
    await agenda.start();
    console.log("Agenda started successfully.");
  } catch (error) {
    console.error("Error starting Agenda:", error);
  }
})();

export default agenda;
