# Krishivan Employee Task Management

A responsive full-stack Employee Task Management application developed as part of the Krishivan Internship Assignment.

The application helps employees create, assign, track, search, filter, update, and delete operational tasks associated with Farmer Producer Organizations (FPOs) and Micro-Entrepreneurs (MEs).

The project is built using React, Vite, Node.js, Express.js, MongoDB, and Mongoose. It follows a REST API architecture with frontend and backend validation, persistent database storage, status workflow enforcement, responsive design, and user feedback for loading, success, empty, validation, and error states.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Objective](#objective)
3. [Key Features](#key-features)
4. [Technology Stack](#technology-stack)
5. [Application Architecture](#application-architecture)
6. [Project Structure](#project-structure)
7. [Prerequisites](#prerequisites)
8. [Environment Variables](#environment-variables)
9. [Installation](#installation)
10. [Running the Application](#running-the-application)
11. [Application Usage](#application-usage)
12. [Task Fields](#task-fields)
13. [Task Status Workflow](#task-status-workflow)
14. [Frontend Functionality](#frontend-functionality)
15. [Backend Functionality](#backend-functionality)
16. [REST API Documentation](#rest-api-documentation)
17. [MongoDB and Mongoose Schema](#mongodb-and-mongoose-schema)
18. [Validation](#validation)
19. [Error Handling](#error-handling)
20. [Search and Filtering](#search-and-filtering)
21. [Responsive Design](#responsive-design)
22. [Accessibility](#accessibility)
23. [Application States](#application-states)
24. [Database Persistence](#database-persistence)
25. [CORS Configuration](#cors-configuration)
26. [Deployment](#deployment)
27. [Security](#security)
28. [Testing](#testing)
29. [Git Workflow](#git-workflow)
30. [Technical Decisions](#technical-decisions)
31. [Assumptions](#assumptions)
32. [Limitations](#limitations)
33. [Future Improvements](#future-improvements)
34. [Assessment Criteria Mapping](#assessment-criteria-mapping)
35. [Completion Checklist](#completion-checklist)
36. [Conclusion](#conclusion)

---

# Project Overview

The Krishivan Employee Task Management application is a full-stack web application designed to manage operational tasks performed by employees.

Tasks can be associated with either:

- Farmer Producer Organizations (FPOs)
- Micro-Entrepreneurs (MEs)

The application provides a simple interface for managing the complete lifecycle of a task.

A user can:

- Create a task
- View tasks
- Search tasks
- Filter tasks
- Edit task details
- Move tasks through the required status workflow
- Delete tasks after confirmation
- Identify priorities
- Identify overdue tasks
- Receive feedback for successful or failed operations

The backend provides a RESTful API and stores task information in MongoDB using Mongoose.

---

# Objective

The main objective of this project is to demonstrate the ability to design and implement a reliable full-stack feature based on a product requirement.

The implementation focuses on:

- Functional CRUD operations
- Clean frontend design
- REST API architecture
- MongoDB persistence
- Backend validation
- Frontend validation
- Status workflow enforcement
- Error handling
- Responsive UI
- Accessibility
- Maintainable code structure
- Git workflow
- Documentation

The implementation prioritizes reliability and completion of the core requirements rather than unnecessary complexity.

---

# Key Features

## Task Management

The application supports complete task management functionality.

Users can:

- Create new tasks
- View all existing tasks
- Edit existing tasks
- Delete tasks
- Update task status
- Search tasks
- Filter tasks

---

## Task Creation

A new task can be created using the task form.

The form contains all required fields:

- Title
- Description
- Assigned Employee
- Related Entity Type
- Related Entity
- Priority
- Due Date
- Status

## Task Status Workflow

New tasks start with:

Pending

The task can then move through the following workflow:

Pending → In Progress → Completed

Only valid forward transitions are allowed.

Allowed transitions:

Pending → In Progress
In Progress → Completed

The following transitions are not allowed:

Pending → Completed
In Progress → Pending
Completed → In Progress
Completed → Pending

A completed task is treated as a final state and cannot be moved backward.

Both the frontend and backend enforce the workflow rules. This means that even if someone tries to send an invalid status through the API directly, the backend will reject the request.

## Task Management Operations

### Create Task

Users can create a new task by selecting the create task option and filling in the required information.

The following fields are available:

- Title
- Description
- Assigned Employee
- Related Entity Type
- Related Entity
- Priority
- Due Date
- Status

When a new task is created, its status starts as:

Pending

The application validates the required information before submitting the task to the backend.

The backend performs an additional validation before storing the task in MongoDB.

### View Tasks

All saved tasks are retrieved from the backend and displayed in the task management interface.

Each task displays important information such as:

- Title
- Description
- Assigned Employee
- Related Entity
- Priority
- Due Date
- Status
- Task actions

Tasks remain stored in MongoDB, so they are available even after restarting the backend server.

### Edit Task

Users can edit an existing task.

The edit form allows the user to update task information while maintaining the required validation rules.

The backend validates the updated information before saving the changes.

The `updatedAt` timestamp is automatically updated whenever a task is modified.

### Delete Task

Users can delete an existing task.

A confirmation is displayed before deletion to reduce the possibility of accidental deletion.

After successful deletion, the task is removed from MongoDB and the task list is refreshed.

### Update Task Status

Task status can be progressed according to the required workflow.

The application supports:

Pending → In Progress

and:

In Progress → Completed

Invalid status transitions are rejected.

Completed tasks cannot be moved back to an earlier status.

## Search and Filtering

The application provides task discovery functionality so users can quickly find relevant tasks.

Users can search tasks using the available search field.

Tasks can also be filtered based on:

- Status
- Priority

Search and filtering are handled on the frontend using the tasks retrieved from the backend.

The filtering interface updates the displayed task list without requiring the user to manually refresh the page.

## Priority Management

Each task has one of the following priority levels:

- Low
- Medium
- High

Priority values are restricted by the backend using Mongoose enum validation.

The interface provides clear visual treatment for different priority levels so that important tasks can be identified quickly.

## Due Date and Overdue Tasks

Every task requires a valid due date.

The application displays the due date as part of the task information.

Tasks whose due dates have passed and which are not completed are visually identified as overdue.

This allows users to quickly recognize tasks that require attention.

## Frontend Validation

The frontend validates task information before sending requests to the backend.

The application prevents users from submitting tasks with:

- Empty title
- Empty assigned employee
- Empty related entity
- Missing priority
- Missing due date
- Invalid task information
- Invalid status values

Validation feedback is displayed to the user so that incorrect information can be corrected before submission.

Frontend validation improves the user experience, but it is not treated as the only layer of protection.

## Backend Validation

The backend performs independent validation for every task request.

This ensures that invalid requests cannot bypass the React interface.

The backend validates:

- Required fields
- Text values
- Text length
- Related entity type
- Priority
- Status
- Due date
- MongoDB ObjectId
- Status transitions

The Mongoose schema uses:

- `required`
- `trim`
- `minlength`
- `maxlength`
- `enum`
- `timestamps`

to enforce the database rules.

## MongoDB Schema

The task collection contains the following fields:

| Field | Type | Required | Validation |
|------|------|----------|------------|
| title | String | Yes | Trimmed, maximum length |
| description | String | No | Trimmed, maximum length |
| assignedEmployee | String | Yes | Trimmed, maximum length |
| relatedEntityType | String | Yes | FPO or ME |
| relatedEntity | String | Yes | Trimmed, maximum length |
| priority | String | Yes | Low, Medium, High |
| dueDate | Date | Yes | Valid date |
| status | String | No | Pending, In Progress, Completed |
| createdAt | Date | Automatic | Mongoose timestamp |
| updatedAt | Date | Automatic | Mongoose timestamp |

The status field defaults to:

Pending

Mongoose automatically creates and maintains:

createdAt

and:

updatedAt

## REST API

The frontend communicates with the backend through REST API endpoints.

The backend base URL for local development is:

http://localhost:5000/api

### API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/tasks` | Retrieve all tasks |
| GET | `/api/tasks/:id` | Retrieve one task |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update an existing task |
| DELETE | `/api/tasks/:id` | Delete a task |
| GET | `/api/health` | Check whether the backend is running |

## GET All Tasks

Endpoint:

GET `/api/tasks`

Purpose:

Retrieves all tasks stored in MongoDB.

A successful response returns the tasks from the database.

Example response:

```json
{
  "success": true,
  "tasks": []
}
### Get a Single Task

**Endpoint:**

```text
GET /api/tasks/:id
```

This endpoint retrieves a single task using its MongoDB document ID.

Example request:

```text
GET /api/tasks/64f123456789abcdef123456
```

If the task exists, the API returns the task details.

Example successful response:

```json
{
  "success": true,
  "task": {
    "_id": "64f123456789abcdef123456",
    "title": "FPO Field Visit",
    "description": "Visit the FPO and collect required information",
    "assignedEmployee": "Employee 1",
    "relatedEntityType": "FPO",
    "relatedEntity": "Sample FPO",
    "priority": "High",
    "dueDate": "2026-08-20T00:00:00.000Z",
    "status": "Pending",
    "createdAt": "2026-08-13T10:00:00.000Z",
    "updatedAt": "2026-08-13T10:00:00.000Z"
  }
}
```

If the task does not exist, the API returns HTTP `404`.

Example:

```json
{
  "success": false,
  "message": "Task not found"
}
```

### Create a Task

**Endpoint:**

```text
POST /api/tasks
```

This endpoint creates a new task.

The request must contain all required task fields.

Example request:

```json
{
  "title": "FPO Field Visit",
  "description": "Visit the FPO and collect required information",
  "assignedEmployee": "Employee 1",
  "relatedEntityType": "FPO",
  "relatedEntity": "Sample FPO",
  "priority": "High",
  "dueDate": "2026-08-20"
}
```

The status is automatically set to:

```text
Pending
```

Example successful response:

```json
{
  "success": true,
  "message": "Task created successfully",
  "task": {
    "_id": "64f123456789abcdef123456",
    "title": "FPO Field Visit",
    "description": "Visit the FPO and collect required information",
    "assignedEmployee": "Employee 1",
    "relatedEntityType": "FPO",
    "relatedEntity": "Sample FPO",
    "priority": "High",
    "dueDate": "2026-08-20T00:00:00.000Z",
    "status": "Pending"
  }
}
```

### Update a Task

**Endpoint:**

```text
PUT /api/tasks/:id
```

This endpoint updates an existing task.

The backend first checks whether the task ID is valid and whether the task exists.

The submitted values are then validated before the task is updated.

Example request:

```json
{
  "title": "FPO Field Visit Updated",
  "description": "Updated task information",
  "assignedEmployee": "Employee 1",
  "relatedEntityType": "FPO",
  "relatedEntity": "Sample FPO",
  "priority": "Medium",
  "dueDate": "2026-08-22",
  "status": "In Progress"
}
```

A successful response returns the updated task.

```json
{
  "success": true,
  "message": "Task updated successfully",
  "task": {}
}
```

The `updatedAt` field is automatically updated by Mongoose.

### Delete a Task

**Endpoint:**

```text
DELETE /api/tasks/:id
```

This endpoint deletes an existing task.

The frontend displays a confirmation before sending the delete request.

Example:

```text
DELETE /api/tasks/64f123456789abcdef123456
```

Successful response:

```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

If the task does not exist:

```json
{
  "success": false,
  "message": "Task not found"
}
```

### Health Check

**Endpoint:**

```text
GET /api/health
```

This endpoint is used to verify that the Express backend is running.

Example response:

```json
{
  "success": true,
  "message": "Krishivan API is running"
}
```

## API Validation

The backend validates every incoming task request.

The API prevents:

- Empty required fields
- Invalid priority values
- Invalid related entity types
- Invalid status values
- Invalid dates
- Invalid MongoDB task IDs
- Invalid status transitions
- Updating tasks that do not exist
- Deleting tasks that do not exist

Frontend validation improves the user experience, while backend validation ensures that invalid data cannot be inserted directly through the API.

## Status Validation

The required status workflow is:

```text
Pending
   ↓
In Progress
   ↓
Completed
```

The following transitions are allowed:

```text
Pending → In Progress
In Progress → Completed
```

The following transitions are rejected:

```text
Pending → Completed
In Progress → Pending
Completed → In Progress
Completed → Pending
Completed → Completed
```

The backend checks the current task status before accepting a status update.

This prevents clients from bypassing the frontend and directly sending invalid status transitions through the API.

## Database Persistence

MongoDB is used as the persistent database.

The backend connects to MongoDB using the `MONGODB_URI` environment variable.

The Mongoose model automatically creates:

```text
createdAt
updatedAt
```

These timestamps allow the application to track when a task was created and when it was last modified.

Because tasks are stored in MongoDB, the data remains available after the Express server is restarted.

## Backend Error Handling

The backend uses consistent JSON responses for errors.

### Validation Error

```json
{
  "success": false,
  "message": "Validation error"
}
```

### Invalid Task ID

```json
{
  "success": false,
  "message": "Invalid task ID"
}
```

### Task Not Found

```json
{
  "success": false,
  "message": "Task not found"
}
```

### Invalid Status Transition

```json
{
  "success": false,
  "message": "Invalid status transition"
}
```

### Unexpected Server Error

Unexpected errors are handled by the backend without exposing sensitive information or stack traces to the client.

Example:

```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Frontend User Interface

The frontend provides a complete task management interface.

The main interface includes:

- Application header
- Task statistics
- Search bar
- Status filter
- Priority filter
- Task list
- Create task form
- Edit task form
- Status controls
- Delete controls
- Success messages
- Error messages
- Loading indicators
- Empty states

The interface is designed to make common task-management operations easy to access.

## Create and Edit Form

The task form contains all required fields from the assignment.

### Title

A short name describing the task.

This field is required.

### Description

Additional information about the task.

This field is optional.

### Assigned Employee

The employee responsible for the task.

This field is required.

### Related Entity Type

The type of organization or entity associated with the task.

Allowed values:

```text
FPO
ME
```

### Related Entity

The name or identifier of the selected FPO or ME.

This field is required.

### Priority

The task priority.

Allowed values:

```text
Low
Medium
High
```

### Due Date

The date by which the task should be completed.

This field is required.

### Status

The current task status.

Allowed values:

```text
Pending
In Progress
Completed
```

New tasks automatically begin with:

```text
Pending
```

## Task List

Tasks are displayed in a structured task list.

Each task displays important information including:

- Task title
- Description
- Assigned employee
- Related entity
- Entity type
- Priority
- Due date
- Status
- Available actions

This allows users to understand the state of a task without opening a separate page.

## Priority Indicators

Priority is displayed clearly in the interface.

The available priority levels are:

```text
Low
Medium
High
```

High-priority tasks are visually distinguishable so users can identify important work quickly.

## Status Indicators

Task status is clearly displayed.

The available statuses are:

```text
Pending
In Progress
Completed
```

Status controls only allow valid workflow actions.

Once a task reaches:

```text
Completed
```

it cannot be moved backward.

## Overdue Tasks

Tasks are checked against their due dates.

If the due date has passed and the task is not completed, the task is treated as overdue.

Overdue tasks receive a clear visual indication so that users can identify tasks requiring immediate attention.

## Search

The application includes a search field for quickly finding tasks.

Users can search for relevant task information.

Search results update as the user enters search text.

If no tasks match the search query, an appropriate empty-state message is displayed.

## Filtering

The application provides filters for task discovery.

Available filters include:

```text
Status
Priority
```

Users can combine search and filters to narrow down the displayed tasks.

For example, users can search for a particular employee and then filter the results to show only high-priority tasks.

## Loading State

When the frontend requests tasks from the backend, a loading state is displayed.

This communicates that the application is currently retrieving data.

The user is not left with a blank screen while the API request is in progress.

## Empty State

An empty state is displayed when:

- No tasks exist
- Search returns no results
- Filters return no results

The empty state clearly communicates that there are currently no matching tasks.

## Success Feedback

Success feedback is provided after important actions.

Examples include:

- Task created successfully
- Task updated successfully
- Task deleted successfully
- Task status updated successfully

This gives users confirmation that their action was completed.

## Error Feedback

The frontend displays an error message when an operation fails.

Examples include:

- Backend unavailable
- API request failed
- Validation failed
- Task not found
- Invalid status transition
- Database error

This prevents failures from occurring silently.

## Responsive Design

The application is responsive and designed for:

```text
Desktop
Tablet
Mobile
```

Responsive CSS is used to adjust the layout based on screen size.

The following elements adapt to smaller screens:

- Header
- Statistics section
- Search controls
- Filters
- Task cards
- Forms
- Buttons
- Action controls

The application is designed to remain readable and usable without unnecessary horizontal scrolling.

## Accessibility

Accessibility was considered during frontend development.

The application includes:

- Semantic HTML
- Proper form labels
- Keyboard-accessible controls
- Visible focus states
- Clear button labels
- Readable text
- Sufficient color contrast
- Responsive layouts
- Clear validation messages

Form labels are associated with their corresponding controls.

Interactive controls can be reached and operated using the keyboard.

## Project Structure

The project follows a simple full-stack structure.

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

## Frontend Structure

### `src/App.jsx`

Contains the main React application.

It manages:

- Task retrieval
- Task creation
- Task editing
- Task deletion
- Status updates
- Search
- Filtering
- Form state
- Loading state
- Error state
- Success messages

### `src/main.jsx`

The entry point for the React application.

It mounts the main application into the HTML root element.

### `src/styles.css`

Contains the styling and responsive design rules for the application.

It controls:

- Layout
- Colors
- Typography
- Cards
- Forms
- Buttons
- Responsive behavior
- Focus states
- Status indicators
- Priority indicators

## Backend Structure

### `server/config/db.js`

Responsible for connecting the application to MongoDB.

### `server/models/task.js`

Contains the Mongoose task schema.

It defines:

- Required fields
- String validation
- Enums
- Due date
- Status
- Automatic timestamps

### `server/controllers/taskController.js`

Contains the main business logic for task operations.

The controller handles:

- Create
- Read
- Update
- Delete
- Validation
- Status workflow

### `server/routes/taskRoutes.js`

Defines the REST API routes.

### `server/app.js`

Configures the Express application.

It includes:

- CORS
- JSON middleware
- Routes
- Health endpoint
- Error handling

### `server/server.js`

Starts the backend server and establishes the database connection.

## Environment Variables

The project uses environment variables to keep configuration and secrets outside the source code.

### Frontend

Example:

```env
VITE_API_URL=http://localhost:5000/api
```

### Backend

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

Actual credentials must never be committed to GitHub.

Only placeholder values should be present in `.env.example`.

## Installation

Clone the repository:

```bash
git clone https://github.com/Ritesh45C/Krishivan-Internship.git
```

Enter the project directory:

```bash
cd Krishivan-Internship
```

Install frontend dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
cd server
npm install
```

Return to the root directory:

```bash
cd ..
```

## Running Locally

### Start Backend

Open a terminal:

```bash
cd server
npm start
```

The backend runs on:

```text
http://localhost:5000
```

### Start Frontend

Open another terminal in the project root:

```bash
npm run dev
```

The frontend normally runs on:

```text
http://localhost:5173
```

Both frontend and backend should be running for the application to function correctly.

## Production Deployment

The application can be deployed using separate frontend and backend services.

The backend requires the following environment variables in production:

```text
PORT
MONGODB_URI
```

The frontend must use the deployed backend API URL.

Example:

```text
https://your-backend-service.onrender.com/api
```

The backend CORS configuration must allow the deployed frontend origin.

Production environment variables should be configured directly in the deployment platform rather than committed to the repository.

## Git Workflow

Development was performed using a dedicated feature branch:

```text
feature/employee-task-management
```

The general workflow is:

```text
Create feature branch
        ↓
Implement functionality
        ↓
Test changes
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

Example commit:

```text
feat: implement employee task management module
```

## Security and Repository Hygiene

The repository should not contain:

- `.env`
- Database passwords
- MongoDB credentials
- API secrets
- `node_modules`
- Build output
- Temporary files
- Editor-specific files

The `.gitignore` file is used to prevent these files from being committed.

Environment variables are used for sensitive configuration.

## Testing

The application was tested against the core requirements.

### Backend Testing

The backend was tested for:

- Server startup
- MongoDB connection
- Health endpoint
- GET tasks
- GET single task
- POST task
- PUT task
- DELETE task
- Invalid task ID
- Missing task
- Invalid enum values
- Missing required fields
- Invalid dates
- Invalid status transitions

### Frontend Testing

The frontend was tested for:

- Task list display
- Task creation
- Task editing
- Task deletion
- Delete confirmation
- Status updates
- Search
- Status filtering
- Priority filtering
- Loading state
- Empty state
- Success feedback
- Error feedback
- Responsive layout
- Keyboard accessibility

### Workflow Testing

The following workflow was verified:

```text
Pending
   ↓
In Progress
   ↓
Completed
```

Invalid backward transitions were rejected.

## Manual Test Cases

### Test Case 1: Create Task

1. Open the application.
2. Select the create task option.
3. Enter all required fields.
4. Submit the form.
5. Verify that the task appears in the task list.
6. Verify that its status is `Pending`.

### Test Case 2: Required Validation

1. Open the task form.
2. Leave required fields empty.
3. Submit the form.
4. Verify that validation messages are displayed.
5. Verify that the task is not created.

### Test Case 3: Status Workflow

1. Create a task.
2. Move it from `Pending` to `In Progress`.
3. Move it from `In Progress` to `Completed`.
4. Attempt to move the completed task backward.
5. Verify that the backward transition is rejected.

### Test Case 4: Edit Task

1. Select an existing task.
2. Click edit.
3. Modify the task information.
4. Save the changes.
5. Verify that the updated information is displayed.

### Test Case 5: Delete Task

1. Select delete.
2. Confirm the deletion.
3. Verify that the task is removed from the list.
4. Verify that it is also removed from MongoDB.

### Test Case 6: Search

1. Enter a task name or relevant search text.
2. Verify that matching tasks are displayed.
3. Enter text that does not match any task.
4. Verify that the empty state is displayed.

### Test Case 7: Filtering

1. Select a status filter.
2. Verify that only matching tasks are displayed.
3. Select a priority filter.
4. Verify that only matching tasks are displayed.

### Test Case 8: API Failure

1. Stop the backend.
2. Refresh the frontend.
3. Verify that an appropriate API error is displayed.

## Assignment Requirement Mapping

The project was developed according to the requirements of the Krishivan Internship Assignment.

| Assignment Requirement | Status |
|------------------------|--------|
| React with Vite | Completed |
| Responsive web application | Completed |
| View tasks | Completed |
| Create tasks | Completed |
| Edit tasks | Completed |
| Delete tasks | Completed |
| Delete confirmation | Completed |
| Required task fields | Completed |
| Pending → In Progress → Completed workflow | Completed |
| Invalid status prevention | Completed |
| Search | Completed |
| Status filtering | Completed |
| Priority filtering | Completed |
| Priority indication | Completed |
| Overdue task indication | Completed |
| Loading state | Completed |
| Empty state | Completed |
| Success feedback | Completed |
| Error feedback | Completed |
| Frontend validation | Completed |
| Backend validation | Completed |
| MongoDB persistence | Completed |
| Mongoose schema | Completed |
| REST API | Completed |
| Health endpoint | Completed |
| CORS | Completed |
| Environment variables | Completed |
| Git feature branch | Completed |
| Documentation | Completed |

## Assessment Criteria

### Functionality — 30%

The project implements the required task-management functionality.

Users can:

- Create tasks
- View tasks
- Edit tasks
- Delete tasks
- Update task status
- Search tasks
- Filter tasks

The complete workflow is enforced.

### Code Quality — 20%

The project uses a clear separation between frontend and backend.

Backend responsibilities are separated into:

- Configuration
- Models
- Controllers
- Routes
- Application setup

The implementation avoids unnecessary complexity and dependencies.

### API and Data Design — 15%

The application uses REST-style endpoints and MongoDB persistence.

The Mongoose schema enforces:

- Required fields
- Enums
- String trimming
- Length limits
- Valid dates
- Automatic timestamps

API responses follow a consistent structure.

### UI/UX and Responsiveness — 15%

The interface provides:

- Clear task information
- Task forms
- Search
- Filters
- Status controls
- Priority indicators
- Overdue indicators
- Delete confirmation
- Success feedback
- Error feedback

The application supports desktop, tablet, and mobile layouts.

### Validation and Reliability — 10%

Validation is implemented on both frontend and backend.

The backend validates:

- Required fields
- Enums
- Dates
- MongoDB IDs
- Status transitions
- Missing resources

The application provides loading, success, empty, and error states.

### Git and Documentation — 10%

The project uses Git and a dedicated feature branch.

The README provides detailed documentation covering:

- Installation
- Environment variables
- Project structure
- API
- Database
- Validation
- Testing
- Git workflow
- Technical decisions
- Limitations
- Future improvements

## Technical Decisions

### MongoDB

MongoDB was selected because it is part of the suggested technology stack and provides persistent storage suitable for task documents.

### Mongoose

Mongoose provides schema validation and simplifies MongoDB operations.

### Express

Express provides a simple structure for creating REST APIs using Node.js.

### React

React was selected for building the interactive task-management interface.

### Vite

Vite provides a lightweight and fast React development environment.

### Fetch API

The native Fetch API is sufficient for the CRUD operations, so no additional HTTP library was required.

### Plain CSS

Plain CSS was selected instead of adding a UI framework because the required interface can be implemented without unnecessary dependencies.

## Assumptions

The assignment does not provide separate collections for employees, FPOs, or MEs.

Therefore:

- Employee names are entered as text.
- Related FPO/ME names are entered as text.
- `relatedEntityType` identifies whether the entity is an FPO or ME.

Authentication and authorization were not implemented because they were not part of the core assignment requirements.

## Limitations

The current version does not include:

- Employee authentication
- Role-based access control
- Separate employee collection
- Separate FPO collection
- Separate ME collection
- Pagination
- Advanced sorting
- Automated testing framework
- Real-time notifications

These can be added as future improvements.

## Future Improvements

Potential improvements include:

- Employee authentication
- Role-based permissions
- Employee management
- FPO management
- ME management
- Dashboard analytics
- Pagination
- Sorting
- Automated API tests
- Automated frontend tests
- Email notifications
- In-app notifications
- Task activity history
- Task comments
- File attachments
- Advanced reporting

## Conclusion

The Krishivan Employee Task Management application is a full-stack implementation of the internship assignment.

It provides a responsive React interface connected to a Node.js and Express REST API with MongoDB persistence.

The application supports complete task CRUD operations, validation, search, filtering, status workflow management, overdue task identification, delete confirmation, loading states, empty states, success feedback, error handling, accessibility considerations, and responsive design.

The required workflow is enforced throughout the application:

```text
Pending
   ↓
In Progress
   ↓
Completed
```

Both frontend and backend validation are used to maintain data integrity and prevent invalid task operations.

The project was designed with the assignment assessment criteria in mind, with particular attention to functionality, maintainability, API and database design, UI/UX, validation, reliability, Git workflow, and documentation.
