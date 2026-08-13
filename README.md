# Krishivan Employee Task Management

A responsive full-stack task management application built for the Krishivan Internship Assignment.

The application allows employees to create, view, edit, track, search, filter, and delete operational tasks connected to Farmer Producer Organizations (FPOs) or Micro-Entrepreneurs (MEs).

## Features

* Create new tasks
* View all tasks
* Edit existing tasks
* Delete tasks with confirmation
* Search tasks
* Filter tasks by status and priority
* Track task status through the required workflow:

  * Pending
  * In Progress
  * Completed
* Prevent invalid status transitions
* Display task priority clearly
* Highlight overdue tasks
* Frontend validation
* Backend validation using Mongoose
* Loading, empty, success, and error states
* Responsive layout for desktop, tablet, and mobile
* Keyboard-accessible form controls
* Semantic form labels
* Readable color contrast
* Persistent MongoDB storage
* RESTful API using Express

## Technology Stack

### Frontend

* React
* Vite
* JavaScript
* CSS
* Fetch API

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* dotenv
* CORS

### Development Tools

* Git
* GitHub
* Visual Studio Code
* npm

## Project Structure

```text
Krishivan-Internship/
│
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
│
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── taskController.js
│   ├── models/
│   │   └── task.js
│   ├── routes/
│   │   └── taskRoutes.js
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
└── README.md
```

## Prerequisites

Before running the project, make sure the following are installed:

* Node.js 20 or newer
* npm
* MongoDB local installation or MongoDB Atlas
* Git

## Environment Variables

Environment variables are used to keep configuration and database credentials outside the source code.

### Frontend

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:5000/api
```

The frontend `.env` file should not be committed to Git.

### Backend

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

Replace `your_mongodb_connection_string` with your MongoDB connection string.

Never commit the real `.env` file or database credentials.

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Ritesh45C/Krishivan-Internship.git
cd Krishivan-Internship
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd server
npm install
```

Then return to the project root:

```bash
cd ..
```

## Running the Application

The frontend and backend run separately.

### Start the backend

Open a terminal in the project root:

```bash
cd server
npm start
```

The backend will run at:

```text
http://localhost:5000
```

The API health endpoint can be checked at:

```text
http://localhost:5000/api/health
```

A successful response is:

```json
{
  "success": true,
  "message": "Krishivan API is running"
}
```

### Start the frontend

Open another terminal in the project root:

```bash
npm run dev
```

Vite will start the frontend development server.

The application normally runs at:

```text
http://localhost:5173
```

If port 5173 is already in use, Vite may automatically use another available port.

## API Endpoints

Base URL:

```text
http://localhost:5000/api
```

| Method | Endpoint     | Purpose          |
| ------ | ------------ | ---------------- |
| GET    | `/tasks`     | Get all tasks    |
| GET    | `/tasks/:id` | Get one task     |
| POST   | `/tasks`     | Create a task    |
| PUT    | `/tasks/:id` | Update a task    |
| DELETE | `/tasks/:id` | Delete a task    |
| GET    | `/health`    | Check API status |

## Task Fields

Each task contains the required fields from the assignment:

| Field               | Description                                |
| ------------------- | ------------------------------------------ |
| `title`             | Required task name                         |
| `description`       | Optional task details                      |
| `assignedEmployee`  | Required employee name or identifier       |
| `relatedEntityType` | `FPO` or `ME`                              |
| `relatedEntity`     | Related FPO/ME name or identifier          |
| `priority`          | `Low`, `Medium`, or `High`                 |
| `dueDate`           | Required valid date                        |
| `status`            | `Pending`, `In Progress`, or `Completed`   |
| `createdAt`         | Automatically generated creation timestamp |
| `updatedAt`         | Automatically updated timestamp            |

## Status Workflow

The application follows the required workflow:

```text
Pending
   ↓
In Progress
   ↓
Completed
```

A completed task cannot move backward.

The backend also validates status transitions so invalid requests cannot bypass the frontend.

For example:

```text
Pending → In Progress      Allowed
In Progress → Completed    Allowed
Pending → Completed        Not allowed
Completed → Pending        Not allowed
Completed → In Progress    Not allowed
```

This validation is implemented on the server as well as reflected in the frontend controls.

## Validation

Validation is performed on both the frontend and backend.

The application prevents:

* Blank required fields
* Invalid priority values
* Invalid related entity types
* Invalid status values
* Invalid dates
* Malformed MongoDB task IDs
* Invalid status transitions
* Missing tasks during update/delete operations

The Mongoose schema also defines required fields, enum values, trimmed text, and reasonable text length limits.

## Error Handling

The backend returns consistent JSON responses.

### Successful response

```json
{
  "success": true,
  "task": {}
}
```

### Validation error

```json
{
  "success": false,
  "message": "Validation error message"
}
```

### Missing task

```json
{
  "success": false,
  "message": "Task not found"
}
```

### Invalid task ID

```json
{
  "success": false,
  "message": "Invalid task ID"
}
```

Unexpected server errors are handled without exposing sensitive server information or stack traces to the client.

## Search and Filtering

The frontend provides useful task discovery controls.

Users can search tasks and filter them based on task information such as:

* Status
* Priority

This helps users quickly find operational tasks.

## Responsive Design

The interface is designed to work across:

* Desktop
* Tablet
* Mobile

Responsive CSS media queries adjust:

* Navigation layout
* Statistics cards
* Search and filter controls
* Task details
* Forms
* Buttons
* Task action controls

The application avoids requiring horizontal scrolling on smaller screens.

## Accessibility

Accessibility considerations include:

* Semantic HTML elements
* Labels associated with form inputs
* Keyboard-accessible controls
* Visible `focus-visible` states
* Readable text
* Sufficient color contrast
* Responsive layouts
* Clear button labels and feedback messages

The application can be operated using a keyboard for the main interactive controls.

## Loading, Empty, Success and Error States

The frontend provides feedback for important application states.

### Loading

Displayed while tasks are being retrieved from the API.

### Empty

Displayed when there are no tasks or when search/filter criteria return no matching tasks.

### Success

Displayed after successful operations such as creating, editing, or deleting a task.

### Error

Displayed when an API request fails or validation fails.

These states help the user understand what is happening instead of leaving the interface blank or unresponsive.

## Database

MongoDB is used for persistent task storage.

Mongoose manages the task schema and database operations.

The task model uses automatic timestamps:

```text
createdAt
updatedAt
```

Because tasks are stored in MongoDB, the data remains available after restarting the Node.js server.

## Technical Decisions

### MongoDB + Mongoose

MongoDB was selected because it fits the suggested technology stack and provides straightforward document-based storage for tasks.

Mongoose provides schema validation, enums, timestamps, and database interaction.

### REST API

A REST-style API was used to keep the frontend and backend separated.

The frontend communicates with the Express API using HTTP requests.

### Backend Status Validation

Status transition validation is implemented on the backend rather than relying only on the React interface.

This prevents clients from bypassing the workflow rules.

### Completed Tasks

Completed tasks cannot move backward.

This follows the assignment requirement that completed tasks should not move backward unless a different behavior is explicitly documented.

### Responsive CSS

Plain CSS was used instead of adding a UI library because the required interface can be implemented without an additional styling dependency.

## Testing Performed

The application was tested for the following flows:

*  Backend starts successfully
*  MongoDB connection succeeds
*  Health endpoint responds successfully
*  Tasks can be created
*  Tasks can be displayed
*  Tasks can be edited
*  Tasks can be deleted
*  Status can move from Pending to In Progress
*  Status can move from In Progress to Completed
*  Completed tasks cannot move backward
*  Invalid task IDs are rejected
*  Invalid enum values are rejected
*  Blank required fields are rejected
*  Invalid dates are rejected
*  Search/filter functionality works
*  Responsive layout works across screen sizes
*  Keyboard focus states are visible
*  Loading and error states are handled

## Git Workflow

Development was organized using Git.

The implementation was committed with a meaningful commit message:

```text
feat: implement employee task management module
```

A dedicated feature branch was created:

```text
feature/employee-task-management
```

The intended workflow is:

```text
Create feature branch
        ↓
Make changes
        ↓
git add .
        ↓
git commit
        ↓
git push
        ↓
Create Pull Request
        ↓
Review
        ↓
Merge into main
```

## Security and Git Ignore

The repository does not include:

* `node_modules`
* `.env`
* `.env.local`
* Build output
* Log files
* Editor-specific files

Environment variables containing credentials should remain local and should never be committed.

Only placeholder values are included in `.env.example` files.

## Assumptions and Limitations

* Employee names and FPO/ME names are entered as text because the assignment does not provide separate employee or organization collections.
* Authentication and authorization are outside the scope of this internship assignment.
* The application uses a single task collection.
* Pagination is not implemented because it is an optional improvement and the assignment focuses on the core task-management functionality.
* Automated tests are not included because the core functionality was prioritized first.
* Deployment is outside the core assignment requirements.

## Future Improvements

Possible future enhancements include:

* Employee authentication
* Role-based access control
* Separate employee and FPO/ME collections
* Pagination
* Sorting
* Automated frontend and backend tests
* Toast notifications
* Dashboard analytics
* Seed/demo data
* Production deployment

## Conclusion

The Krishivan Employee Task Management module demonstrates a complete full-stack implementation using React, Express, MongoDB, and Mongoose.

The application focuses on reliable CRUD operations, server-side validation, workflow enforcement, responsive UI design, accessibility, persistent data storage, and clear user feedback.
