# EmailFlow Backend

The backend for the **EmailFlow** project is responsible for handling user authentication, managing projects, storing email templates, processing email flows, and handling the sending of emails. It communicates with the frontend and connects to a database to store and retrieve user data and email flow configurations.

## Prerequisites:
Make sure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** (Node Package Manager)
- **MongoDB** (locally or use MongoDB Atlas)

## Setup Instructions:

### 1. Clone the Repository:
First, clone the repository to your local machine:
```bash

cd emailflow/backend
2. Install Dependencies:
Install the required dependencies using npm:

bash
Copy code
npm install
3. Set Up Environment Variables:
Create a .env file in the root of the backend folder and configure the following environment variables:

makefile
Copy code
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret_key>
EMAIL_SERVICE=<your_email_service_provider>  # e.g., SendGrid, Nodemailer
EMAIL_USER=<your_email_service_username>
EMAIL_PASS=<your_email_service_password>
PORT=---
MONGO_URI: Connection string for MongoDB. If you're using MongoDB Atlas, you can get the URI from your MongoDB cluster.
JWT_SECRET: A secret key for signing JWT tokens used in authentication.
EMAIL_SERVICE, EMAIL_USER, EMAIL_PASS: Credentials for the email service provider that will be used to send emails.
PORT: Port to run the backend server on (default is 3002).
4. Start the Backend Server:
Run the following command to start the backend server:

bash
Copy code
npm run dev
The backend should now be running on http://localhost:3002.

5. API Endpoints:
The backend provides the following API endpoints for user authentication, project management, and email flow operations:

POST /signup: User signup

Request body: { "name:"<user_name>", "email": "<user_email>", "password": "<user_password>" }
Returns: JWT token on successful signup.
POST /login: User login

Request body: { "email": "<user_email>", "password": "<user_password>" }
Returns: JWT token on successful login.
POST /projects: Create a new project

Request body: { "name": "<project_name>", "user_id": "<user_id>" }
Returns: Created project data.
POST /list
/flow: Create list for a project

/flow: Create an email flow for a project

Request body: { "list": "<list_of_contacts>", "template": "<template_id>", "wait": "<wait_time>", "subject": "<email_subject>", "content": "<email_content>" }
Returns: Created flow data.
GET /project/id
/flows: Get all flows for a specific project

Request body: { "flowId": "<flow_id>", "user_id": "<user_id>" }
Returns: Status of the started flow.
How It Works:
User Authentication:

The backend handles user signup and login via JWT authentication. When a user signs up or logs in, they receive a JWT token, which is then used for protected routes (e.g., creating a project, creating a flow).
Creating Projects:

After login, users can create projects, each of which can have multiple email flows. Projects are saved in MongoDB.
Email Flow Creation:

Users can define email flows, where they can choose a list of recipients, select a template, and define a wait time between emails. The flow is then saved in the backend.
Starting the Flow:

After defining a flow, users can start it. The backend will trigger the email sending process according to the flow sequence, utilizing the configured email service (e.g., SendGrid, Nodemailer).
Email Sending:

The email service provider is responsible for sending emails to the selected contacts based on the flow's configuration. The backend ensures that the emails are sent in the defined sequence and with the right wait times.
Technologies Used:
Node.js: JavaScript runtime for server-side code.
Express: Web framework for building the API.
MongoDB: NoSQL database for storing user data, projects, and flows.
JWT: JSON Web Tokens for user authentication.
Nodemailer / Agenda: Email service provider for sending emails.
env: For managing environment variables.
Running the Tests:
If you have written tests for the backend, you can run them using:

bash
Copy code
npm test
Contributing:
If you want to contribute to this project, please follow these steps:

Fork the repository.
Create a new branch (git checkout -b feature-branch).
Commit your changes (git commit -am 'Add new feature').
Push to the branch (git push origin feature-branch).
Create a new Pull Request.
License:
This project is licensed under the MIT License - see the LICENSE file for details.

Contact:
For questions or feedback, feel free to reach out to me via email at [ridhijain7300@gmail.com].

markdown
Copy code

### Explanation of Key Sections:

- **Setup Instructions**: Detailed instructions to install dependencies, configure environment variables, and start the server.
- **API Endpoints**: Lists the available API endpoints for authentication, project management, and email flow handling.
- **How It Works**: Describes the flow of the application and how each feature operates on the backend.
- **Technologies Used**: Lists the tech stack for the backend, including Express, MongoDB, JWT, and the email service.
- **Running the Tests**: If applicable, includes a section on running backend tests.
- **Contributing**: Encourages contributions and provides guidelines for contributing to the project.

This README file will help users and developers understand how to set up and use the backend of your EmailFlow
