# Krishivan Internship Assignment

## Employee Task Management Module

Build a small full-stack task management module for Krishivan employees. The goal is to demonstrate how you understand a product requirement, make sensible implementation decisions, write maintainable code, and communicate your work.

This is an intern-level assignment, not a test of whether you know everything already. You may use documentation and ask questions. Where a detail is not specified, make a reasonable decision and explain it in your submission.

## Product context

Krishivan works with employees, Farmer Producer Organizations (FPOs), and Micro-Entrepreneurs (MEs). Employees need a simple way to create, assign, track, and complete operational tasks connected to an FPO or ME.

## Your goal

Create a responsive web application that allows a user to:

- View all tasks and their important details.
- Create a new task.
- Edit an existing task.
- Delete a task after confirmation.
- Move a task through the required workflow.
- Find useful tasks using search and/or filters.
- Clearly understand loading, empty, success, and error states.

The required workflow is:

`Pending` → `In Progress` → `Completed`

A completed task should not move backward unless you clearly document why you chose to support that behavior. Do not allow invalid status values.

## Required task fields

Each task must contain:

| Field | Expected value |
| --- | --- |
| `title` | Short task name; required |
| `description` | Helpful task details; optional but recommended |
| `assignedEmployee` | Employee name or identifier; required |
| `relatedEntityType` | Either `FPO` or `ME`; required |
| `relatedEntity` | Name or identifier of the selected FPO/ME; required |
| `priority` | `Low`, `Medium`, or `High`; required |
| `dueDate` | Valid date; required |
| `status` | `Pending`, `In Progress`, or `Completed`; defaults to `Pending` |

The database should also record `createdAt` and `updatedAt`. You may add other fields if they improve the solution; document additions in the README.

## Suggested technology

- Frontend: React with Vite (starter included)
- Backend: Node.js and Express
- Database: MongoDB with Mongoose
- Styling: plain CSS, CSS modules, or a UI library of your choice
- API calls: `fetch` or Axios

You may add well-justified libraries. Avoid adding a library for something that can be handled simply.

## Frontend requirements

Design and implement the user experience. At minimum, include:

1. A task list using cards, a table, or a board.
2. A create/edit form containing every required field.
3. Clear visual treatment for priority, status, and overdue tasks.
4. Controls to update task status while respecting the workflow.
5. A delete confirmation.
6. At least one useful search or filter option, such as status, priority, employee, or FPO/ME type.
7. Loading, empty, validation, success, and API error feedback.

The interface must work at mobile, tablet, and desktop widths. Use semantic HTML, associate labels with form fields, support keyboard use, and maintain readable color contrast.

Do not copy the starter welcome screen as the final design. It exists only to confirm that React runs. You are expected to decide the layout and component structure.

## Backend and API requirements

Create an Express server inside `server/`. It should:

- Connect to MongoDB using an environment variable.
- Provide REST endpoints for task CRUD operations.
- Validate request data on the server, not only in React.
- Return consistent JSON responses and suitable HTTP status codes.
- Return `404` for a missing task and useful `400` validation errors.
- Handle unexpected errors without exposing secrets or stack traces to clients.
- Enable CORS for local frontend development.
- Keep credentials and connection strings out of Git.

Suggested endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/tasks` | List tasks; optionally accept filter/search query parameters |
| `GET` | `/api/tasks/:id` | Get one task |
| `POST` | `/api/tasks` | Create a task |
| `PUT` or `PATCH` | `/api/tasks/:id` | Edit a task or update its status |
| `DELETE` | `/api/tasks/:id` | Delete a task |
| `GET` | `/api/health` | Confirm that the server is running |

You may adjust this API design if your alternative is consistent and documented.

## MongoDB schema expectations

Create a Mongoose model that represents the required fields and enforces:

- Required values where specified.
- Trimmed text and sensible length limits.
- Enum values for type, priority, and status.
- A valid due date.
- Automatic timestamps.

Think about whether status transitions should also be checked by the backend. Seed data is optional but helpful for review.

## Validation expectations

At minimum, prevent:

- Blank required text fields.
- Unknown priority, entity type, or status values.
- Invalid dates.
- Requests with malformed task IDs.
- Invalid status transitions.

Show field-level messages in the UI where practical. Server validation remains required even when the frontend validates the same input.

## Suggested project structure

You may change this structure if your choice is clear and maintainable.

```text
Krishivan-Internship/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── app.js
│   └── server.js
├── .env.example
├── index.html
├── package.json
└── README.md
```

## Getting started

### Prerequisites

- Node.js 20 or newer
- npm
- A local MongoDB instance or MongoDB Atlas connection
- Git

### Frontend starter

```bash
git clone https://github.com/Ritesh45C/Krishivan-Internship.git
cd Krishivan-Internship
npm install
cp .env.example .env
npm run dev
```

The frontend environment example uses `http://localhost:5000/api`. Add a separate `server/.env.example` containing at least `PORT` and `MONGODB_URI` when you create the backend. Never commit a real `.env` file.

Add clear backend install and run commands here as part of your submission. A reviewer should be able to start both sides from a fresh clone without guessing.

## Git workflow

1. Create a feature branch, for example `feature/employee-task-management`.
2. Make small, meaningful commits with clear messages.
3. Push your branch and open a pull request to `main`.
4. In the pull request, summarize the approach, include screenshots, provide test steps, and mention limitations or decisions.
5. Do not commit secrets, `node_modules`, build output, or editor-specific files.

Ask before changing the assignment requirements. Questions and documented assumptions are welcome.

## Deliverables

- Working React frontend.
- Working Node.js/Express API connected to MongoDB.
- Mongoose task model and all required CRUD endpoints.
- Responsive UI with the required states and validation.
- Updated README with complete setup instructions and technical decisions.
- `.env.example` files with placeholder values only.
- A pull request with screenshots and testing notes.

Optional improvements include automated tests, sorting, pagination, dashboard counts, toast notifications, deployment, or seeded demo data. Complete the core requirements before optional work.

## Completion checklist

- [ ] The app starts from the documented commands.
- [ ] A user can create, view, edit, and delete a task.
- [ ] Every required field is stored and displayed.
- [ ] Status follows `Pending` → `In Progress` → `Completed`.
- [ ] Frontend and backend validation handle invalid input gracefully.
- [ ] Search or filtering is useful and functional.
- [ ] Loading, empty, success, and error states are present.
- [ ] The UI is usable on mobile and desktop.
- [ ] MongoDB data remains available after a server restart.
- [ ] No secrets or generated dependency folders are committed.
- [ ] The README and pull request explain setup, decisions, and limitations.

## Assessment criteria

| Area | Weight | What we will look for |
| --- | ---: | --- |
| Functionality | 30% | Core flows work reliably and meet the requirements |
| Code quality | 20% | Clear naming, sensible components/modules, low duplication |
| API and data design | 15% | Consistent REST behavior, schema quality, error handling |
| UI/UX and responsiveness | 15% | Clear, accessible, useful experience across screen sizes |
| Validation and reliability | 10% | Edge cases and failures are handled thoughtfully |
| Git and documentation | 10% | Useful commits, reproducible setup, decisions explained |

We value good judgment, learning, and clear communication more than visual complexity. A smaller, reliable solution with documented decisions is stronger than an unfinished solution with many features.

## Expected effort

Aim for approximately 4–7 working days. If you cannot finish everything, submit a working version, state what remains, and explain what you would do next.

