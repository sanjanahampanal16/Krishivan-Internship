import Login from "./Login"
import Signup from "./Signup"
import { useEffect, useMemo, useRef, useState } from "react"

const API_URL =
  "https://krishivan-internship-backend.onrender.com/api/tasks"

const LOGO_URL =
  "https://krishivantech.com/krishivan-logo.png"

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
})
/* =========================
   DASHBOARD PAGE
========================= */

function DashboardPage({
  tasks,
  pendingCount,
  progressCount,
  completedCount,
  priorityCounts,
  openNewTask,
  loading,
  message,
  error,
}) {
  return (
    <>
      <section className="dashboard-welcome">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Dashboard</h1>
          <p>Here's what's happening with your tasks today.</p>
        </div>

        <button
          className="dashboard-new-task"
          onClick={openNewTask}
        >
          + New Task
        </button>
      </section>

      {message && (
        <div className="dashboard-message success">
          ✓ {message}
        </div>
      )}

      {error && (
        <div className="dashboard-message error">
          ! {error}
        </div>
      )}

      <section className="dashboard-stats">
        <div className="dashboard-stat-card">
          <div className="stat-card-top">
            <span>Total Tasks</span>
            <div className="stat-icon green">✓</div>
          </div>

          <strong>{tasks.length}</strong>
          <p>All assigned tasks</p>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-card-top">
            <span>Pending</span>
            <div className="stat-icon yellow">◷</div>
          </div>

          <strong>{pendingCount}</strong>
          <p>Waiting to start</p>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-card-top">
            <span>In Progress</span>
            <div className="stat-icon blue">↻</div>
          </div>

          <strong>{progressCount}</strong>
          <p>Currently working</p>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-card-top">
            <span>Completed</span>
            <div className="stat-icon purple">✓</div>
          </div>

          <strong>{completedCount}</strong>
          <p>Successfully completed</p>
        </div>
      </section>

      <section className="charts-grid">
        <div className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h2>Task Overview</h2>
              <p>Current task status distribution</p>
            </div>

            <span className="panel-period">
              All time
            </span>
          </div>

          <div className="status-chart">
            <div className="donut-wrapper">
              <div
                className="donut-chart"
                style={{
                  "--pending": pendingCount,
                  "--progress": progressCount,
                  "--completed": completedCount,
                }}
              >
                <div className="donut-center">
                  <strong>{tasks.length}</strong>
                  <span>Tasks</span>
                </div>
              </div>
            </div>

            <div className="chart-legend">
              <div>
                <span className="legend-dot pending-dot" />
                <span>Pending</span>
                <strong>{pendingCount}</strong>
              </div>

              <div>
                <span className="legend-dot progress-dot" />
                <span>In Progress</span>
                <strong>{progressCount}</strong>
              </div>

              <div>
                <span className="legend-dot completed-dot" />
                <span>Completed</span>
                <strong>{completedCount}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h2>Tasks by Priority</h2>
              <p>Distribution across priorities</p>
            </div>
          </div>

          <div className="priority-chart">
            {["High", "Medium", "Low"].map((priority) => {
              const count = priorityCounts[priority]

              const percentage =
                tasks.length > 0
                  ? (count / tasks.length) * 100
                  : 0

              return (
                <div
                  className="priority-row"
                  key={priority}
                >
                  <div className="priority-row-label">
                    <span
                      className={`priority-dot priority-dot-${priority.toLowerCase()}`}
                    />

                    <span>{priority}</span>

                    <strong>{count}</strong>
                  </div>

                  <div className="priority-bar">
                    <div
                      className={`priority-fill priority-fill-${priority.toLowerCase()}`}
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="dashboard-panel recent-tasks-panel">
        <div className="panel-header">
          <div>
            <h2>Recent Tasks</h2>
            <p>Latest employee task activity</p>
          </div>

          <span className="panel-period">
            {tasks.length} Tasks
          </span>
        </div>

        {loading ? (
          <div className="dashboard-empty">
            <p>Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="dashboard-empty">
            <h3>No tasks yet</h3>
            <p>Create a new task to see it here.</p>
          </div>
        ) : (
          <div className="recent-task-list">
            {tasks.slice(0, 5).map((task) => (
              <div
                className="recent-task-item"
                key={task.id}
              >
                <div className="recent-task-main">
                  <div className="recent-task-icon">
                    ✓
                  </div>

                  <div>
                    <strong>{task.title}</strong>

                    <span>
                      Assigned to {task.assignedEmployee}
                    </span>
                  </div>
                </div>

                <div className="recent-task-meta">
                  <span
                    className={`table-priority ${(
                      task.priority || "Medium"
                    ).toLowerCase()}`}
                  >
                    {task.priority}
                  </span>

                  <span
                    className={`table-status ${(
                      task.status || "Pending"
                    )
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    <span />
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  )
}

/* =========================
   TASKS PAGE
========================= */

function TasksPage({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  filteredTasks,
  loading,
  openNewTask,
  handleEditTask,
  handleDelete,
  handleStatusChange,
  showForm,
  formRef,
  editingTaskId,
  formData,
  handleInputChange,
  handleCreateTask,
  setShowForm,
  resetForm,
}) {
  return (
    <section className="content-page">
      <div className="page-title-row">
        <div>
          <p className="eyebrow">Management</p>

          <h1>Tasks</h1>

          <p>
            Create, manage and track employee tasks.
          </p>
        </div>

        <button
          className="dashboard-new-task"
          onClick={openNewTask}
        >
          + New Task
        </button>
      </div>

      {showForm && (
        <div
          className="page-card task-form-card"
          ref={formRef}
        >
          <div className="panel-header">
            <div>
              <h2>
                {editingTaskId !== null
                  ? "Edit Task"
                  : "Create New Task"}
              </h2>

              <p>
                Fill in the task details below.
              </p>
            </div>

            <button
              type="button"
              className="form-close"
              onClick={() => {
                setShowForm(false)
                resetForm()
              }}
            >
              ×
            </button>
          </div>

          <form
            className="task-form"
            onSubmit={handleCreateTask}
          >
            <div className="form-group">
              <label>Task Title *</label>

              <input
                type="text"
                name="title"
                placeholder="Enter task title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>

              <textarea
                name="description"
                placeholder="Enter task description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>Assigned Employee *</label>

              <input
                type="text"
                name="assignedEmployee"
                placeholder="Enter employee name"
                value={formData.assignedEmployee}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Related Entity Type *</label>

              <select
                name="relatedEntityType"
                value={formData.relatedEntityType}
                onChange={handleInputChange}
                required
              >
                <option value="FPO">FPO</option>
                <option value="ME">ME</option>
              </select>
            </div>

            <div className="form-group">
              <label>Related FPO / ME *</label>

              <input
                type="text"
                name="relatedEntity"
                placeholder="Enter FPO or ME name"
                value={formData.relatedEntity}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Priority *</label>

              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                required
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="form-group">
              <label>Due Date *</label>

              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setShowForm(false)
                  resetForm()
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="dashboard-new-task"
              >
                {editingTaskId !== null
                  ? "Update Task"
                  : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="dashboard-filters">
        <div className="filter-search">
          <span>⌕</span>

          <input
            type="search"
            placeholder="Search tasks, employees or FPOs..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">
            In Progress
          </option>
          <option value="Completed">
            Completed
          </option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) =>
            setPriorityFilter(e.target.value)
          }
        >
          <option value="All">All Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {loading ? (
        <div className="page-card">
          Loading tasks...
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="page-card empty-page">
          <h2>No tasks found</h2>

          <p>
            Create your first task to get started.
          </p>

          <button
            className="dashboard-new-task"
            onClick={openNewTask}
          >
            + Create Task
          </button>
        </div>
      ) : (
        <div className="task-table-wrapper">
          <table className="task-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Employee</th>
                <th>Entity</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredTasks.map((task) => {
                const isOverdue =
                  new Date(task.dueDate) <
                    new Date() &&
                  task.status !== "Completed"

                return (
                  <tr key={task.id}>
                    <td>
                      <div className="table-task-name">
                        <strong>
                          {task.title}
                        </strong>

                        <span>
                          {task.description ||
                            "No description"}
                        </span>
                      </div>
                    </td>

                    <td>
                      {task.assignedEmployee}
                    </td>

                    <td>
                      <span className="entity-badge">
                        <strong>
                          {task.relatedEntity}
                        </strong>

                        <small>
                          {task.relatedEntityType}
                        </small>
                      </span>
                    </td>

                    <td>
                      <span
                        className={`table-priority ${(
                          task.priority || "Medium"
                        ).toLowerCase()}`}
                      >
                        {task.priority}
                      </span>
                    </td>

                    <td>
                      <span
                        className={
                          isOverdue
                            ? "table-overdue"
                            : "table-date"
                        }
                      >
                        {task.dueDate
                          ? new Date(
                              task.dueDate
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "-"}
                      </span>
                    </td>

                    <td>
                      <button
                        className={`table-status ${(
                          task.status || "Pending"
                        )
                          .toLowerCase()
                          .replace(" ", "-")}`}
                        onClick={() =>
                          handleStatusChange(
                            task.id
                          )
                        }
                        disabled={
                          task.status ===
                          "Completed"
                        }
                      >
                        <span />
                        {task.status}
                      </button>
                    </td>

                    <td>
                      <div className="table-actions">
                        <button
                          className="icon-action edit"
                          onClick={() =>
                            handleEditTask(task)
                          }
                        >
                          ✎
                        </button>

                        <button
                          className="icon-action delete"
                          onClick={() =>
                            handleDelete(task.id)
                          }
                        >
                          ×
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

/* =========================
   EMPLOYEES PAGE
========================= */

function EmployeesPage({ tasks }) {
  const employees = [
    ...new Set(
      tasks
        .map(
          (task) => task.assignedEmployee
        )
        .filter(Boolean)
    ),
  ]

  return (
    <section className="content-page">
      <div className="page-title-row">
        <div>
          <p className="eyebrow">Team</p>

          <h1>Employees</h1>

          <p>
            View employees and their assigned tasks.
          </p>
        </div>
      </div>

      <div className="employee-grid">
        {employees.length === 0 ? (
          <div className="page-card">
            No employees found.
          </div>
        ) : (
          employees.map((employee) => {
            const employeeTasks =
              tasks.filter(
                (task) =>
                  task.assignedEmployee ===
                  employee
              )

            const completed =
              employeeTasks.filter(
                (task) =>
                  task.status === "Completed"
              ).length

            return (
              <div
                className="employee-card"
                key={employee}
              >
                <div className="employee-avatar">
                  {employee
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <h3>{employee}</h3>

                  <p>
                    {employeeTasks.length} assigned
                    tasks
                  </p>

                  <span>
                    {completed} completed
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </section>
  )
}

/* =========================
   FPO / ME PAGE
========================= */

function FPOPage({ tasks }) {
  const entities = [
    ...new Set(
      tasks
        .map(
          (task) => task.relatedEntity
        )
        .filter(Boolean)
    ),
  ]

  return (
    <section className="content-page">
      <div className="page-title-row">
        <div>
          <p className="eyebrow">
            Operations
          </p>

          <h1>FPOs & MEs</h1>

          <p>
            Monitor tasks associated with FPOs and MEs.
          </p>
        </div>
      </div>

      <div className="entity-grid">
        {entities.length === 0 ? (
          <div className="page-card">
            No FPOs or MEs found.
          </div>
        ) : (
          entities.map((entity) => {
            const entityTasks =
              tasks.filter(
                (task) =>
                  task.relatedEntity === entity
              )

            const completed =
              entityTasks.filter(
                (task) =>
                  task.status === "Completed"
              ).length

            return (
              <div
                className="entity-card"
                key={entity}
              >
                <div className="entity-card-icon">
                  ◉
                </div>

                <div>
                  <h3>{entity}</h3>

                  <p>
                    {entityTasks.length} tasks
                  </p>

                  <span>
                    {completed} completed
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </section>
  )
}

/* =========================
   REPORTS PAGE
========================= */

function ReportsPage({
  tasks,
  pendingCount,
  progressCount,
  completedCount,
}) {
  const total = tasks.length

  const completionRate =
    total > 0
      ? Math.round(
          (completedCount / total) * 100
        )
      : 0

  return (
    <section className="content-page">
      <div className="page-title-row">
        <div>
          <p className="eyebrow">
            Analytics
          </p>

          <h1>Reports</h1>

          <p>
            Task performance and completion reports.
          </p>
        </div>
      </div>

      <div className="report-grid">
        <div className="report-card">
          <span>Total Tasks</span>
          <strong>{total}</strong>
        </div>

        <div className="report-card">
          <span>Pending</span>
          <strong>{pendingCount}</strong>
        </div>

        <div className="report-card">
          <span>In Progress</span>
          <strong>{progressCount}</strong>
        </div>

        <div className="report-card">
          <span>Completed</span>
          <strong>{completedCount}</strong>
        </div>
      </div>

      <div className="page-card report-summary">
        <h2>Completion Rate</h2>

        <div className="report-progress">
          <div
            style={{
              width: `${completionRate}%`,
            }}
          />
        </div>

        <strong>
          {completionRate}% completed
        </strong>
      </div>
    </section>
  )
}

/* =========================
   SETTINGS PAGE
========================= */

function SettingsPage({
  user,
  userName,
  onLogout,
}) {
  const [notifications, setNotifications] =
    useState(true)

  const [compactMode, setCompactMode] =
    useState(false)

  return (
    <section className="content-page settings-page">
      <div className="page-title-row">
        <div>
          <p className="eyebrow">Preferences</p>

          <h1>Settings</h1>

          <p>
            Manage your account and application preferences.
          </p>
        </div>
      </div>

      <div className="settings-grid">
        {/* PROFILE */}

        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon">
              👤
            </div>

            <div>
              <h2>Profile</h2>
              <p>Your account information</p>
            </div>
          </div>

          <div className="settings-profile">
            <div className="settings-avatar">
              {userName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <h3>{userName}</h3>

              <p>
                {user.email ||
                  "Employee account"}
              </p>

              <span className="settings-role">
                Employee
              </span>
            </div>
          </div>
        </div>

        {/* APPLICATION */}

        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon">
              ⚙
            </div>

            <div>
              <h2>Application</h2>
              <p>Customize your experience</p>
            </div>
          </div>

          <div className="settings-option">
            <div>
              <strong>
                Task Notifications
              </strong>

              <span>
                Receive notifications about task activity.
              </span>
            </div>

            <button
              className={
                notifications
                  ? "settings-toggle active"
                  : "settings-toggle"
              }
              onClick={() =>
                setNotifications(
                  !notifications
                )
              }
            >
              <span />
            </button>
          </div>

          <div className="settings-option">
            <div>
              <strong>
                Compact Mode
              </strong>

              <span>
                Use a more compact dashboard layout.
              </span>
            </div>

            <button
              className={
                compactMode
                  ? "settings-toggle active"
                  : "settings-toggle"
              }
              onClick={() =>
                setCompactMode(
                  !compactMode
                )
              }
            >
              <span />
            </button>
          </div>
        </div>

        {/* ACCOUNT */}

        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon">
              🔐
            </div>

            <div>
              <h2>Account</h2>
              <p>Manage your session</p>
            </div>
          </div>

          <div className="settings-account">
            <div>
              <strong>
                Sign out of Krishivan
              </strong>

              <span>
                You will be returned to the login page.
              </span>
            </div>

            <button
              className="settings-logout-button"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

/* =========================
   MAIN APP
========================= */
function App() {

  const [isLoggedIn, setIsLoggedIn] =
    useState(false)

  const [checkingAuth, setCheckingAuth] =
    useState(true)

  const [showSignup, setShowSignup] =
    useState(false)

  const [tasks, setTasks] =
    useState([])

  const [search, setSearch] =
    useState("")

  const [statusFilter, setStatusFilter] =
    useState("All")

  const [priorityFilter, setPriorityFilter] =
    useState("All")

  const [showForm, setShowForm] =
    useState(false)

  const [editingTaskId, setEditingTaskId] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  const [message, setMessage] =
    useState("")

  const [error, setError] =
    useState("")

  const [showLogoutConfirm, setShowLogoutConfirm] =
    useState(false)

  const [activePage, setActivePage] =
    useState("Dashboard")

  const formRef = useRef(null)
  const [formData, setFormData] =
    useState({
      title: "",
      description: "",
      assignedEmployee: "",
      relatedEntityType: "FPO",
      relatedEntity: "",
      priority: "Medium",
      dueDate: "",
    })

  /* AUTH CHECK */

useEffect(() => {
  setIsLoggedIn(false)
  setCheckingAuth(false)
}, [])
  /* FETCH TASKS */

  useEffect(() => {
    const fetchTasks = async () => {
      if (!isLoggedIn) return

      try {
        setLoading(true)
        setError("")

        const response = await fetch(
          API_URL,
          {
            headers: getAuthHeaders(),
          }
        )

        const data =
          await response.json()

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Failed to fetch tasks"
          )
        }

        setTasks(data.tasks || [])
      } catch (err) {
        console.error(
          "API connection failed:",
          err
        )

        setError(
          "Unable to load tasks. Please check the backend server."
        )
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [isLoggedIn])

  /* COUNTS */

  const pendingCount =
    tasks.filter(
      (task) =>
        task.status === "Pending"
    ).length

  const progressCount =
    tasks.filter(
      (task) =>
        task.status === "In Progress"
    ).length

  const completedCount =
    tasks.filter(
      (task) =>
        task.status === "Completed"
    ).length

  /* PRIORITY COUNTS */

  const priorityCounts =
    useMemo(() => {
      return {
        High: tasks.filter(
          (task) =>
            task.priority === "High"
        ).length,

        Medium: tasks.filter(
          (task) =>
            task.priority === "Medium"
        ).length,

        Low: tasks.filter(
          (task) =>
            task.priority === "Low"
        ).length,
      }
    }, [tasks])

  /* FILTER */

  const filteredTasks =
    tasks.filter((task) => {
      const title =
        task.title || ""

      const description =
        task.description || ""

      const employee =
        task.assignedEmployee || ""

      const entity =
        task.relatedEntity || ""

      const searchText =
        search.toLowerCase()

      const matchesSearch =
        title
          .toLowerCase()
          .includes(searchText) ||
        description
          .toLowerCase()
          .includes(searchText) ||
        employee
          .toLowerCase()
          .includes(searchText) ||
        entity
          .toLowerCase()
          .includes(searchText)

      const matchesStatus =
        statusFilter === "All" ||
        task.status ===
          statusFilter

      const matchesPriority =
        priorityFilter === "All" ||
        task.priority ===
          priorityFilter

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      )
    })

  /* FORM */

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      assignedEmployee: "",
      relatedEntityType: "FPO",
      relatedEntity: "",
      priority: "Medium",
      dueDate: "",
    })

    setEditingTaskId(null)
  }

  const openNewTask = () => {
    resetForm()
    setShowForm(true)
    setActivePage("Tasks")

    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }, 100)
  }

  const handleEditTask = (task) => {
    setEditingTaskId(task.id)

    setFormData({
      title: task.title || "",
      description:
        task.description || "",
      assignedEmployee:
        task.assignedEmployee || "",
      relatedEntityType:
        task.relatedEntityType ||
        "FPO",
      relatedEntity:
        task.relatedEntity || "",
      priority:
        task.priority || "Medium",
      dueDate:
        task.dueDate
          ? task.dueDate.split("T")[0]
          : "",
    })

    setShowForm(true)
    setActivePage("Tasks")

    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }, 100)
  }

  const handleInputChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target

    setFormData(
      (currentData) => ({
        ...currentData,
        [name]: value,
      })
    )
  }

  /* CREATE / UPDATE */

  const handleCreateTask =
    async (event) => {
      event.preventDefault()

      setMessage("")
      setError("")

      if (
        !formData.title.trim() ||
        !formData.assignedEmployee.trim() ||
        !formData.relatedEntity.trim() ||
        !formData.dueDate
      ) {
        setError(
          "Please fill in all required fields."
        )

        return
      }

      try {
        const taskData = {
          title:
            formData.title.trim(),

          description:
            formData.description.trim(),

          assignedEmployee:
            formData.assignedEmployee.trim(),

          relatedEntityType:
            formData.relatedEntityType,

          relatedEntity:
            formData.relatedEntity.trim(),

          priority:
            formData.priority,

          dueDate:
            formData.dueDate,
        }

        if (
          editingTaskId !== null
        ) {
          const response =
            await fetch(
              `${API_URL}/${editingTaskId}`,
              {
                method: "PUT",
                headers:
                  getAuthHeaders(),
                body: JSON.stringify(
                  taskData
                ),
              }
            )

          const data =
            await response.json()

          if (
            !response.ok ||
            !data.success
          ) {
            throw new Error(
              data.message ||
                "Failed to update task"
            )
          }

          setTasks(
            (currentTasks) =>
              currentTasks.map(
                (task) =>
                  task.id ===
                  editingTaskId
                    ? data.task
                    : task
              )
          )

          setMessage(
            "Task updated successfully."
          )
        } else {
          const response =
            await fetch(
              API_URL,
              {
                method: "POST",
                headers:
                  getAuthHeaders(),
                body: JSON.stringify({
                  ...taskData,
                  status: "Pending",
                }),
              }
            )

          const data =
            await response.json()

          if (
            !response.ok ||
            !data.success
          ) {
            throw new Error(
              data.message ||
                "Failed to create task"
            )
          }

          setTasks(
            (currentTasks) => [
              data.task,
              ...currentTasks,
            ]
          )

          setMessage(
            "Task created successfully."
          )
        }

        resetForm()
        setShowForm(false)
      } catch (err) {
        console.error(
          "Task operation failed:",
          err
        )

        setError(
          err.message ||
            "Something went wrong."
        )
      }
    }

  /* STATUS */

  const handleStatusChange =
    async (id) => {
      const task =
        tasks.find(
          (item) =>
            item.id === id
        )

      if (
        !task ||
        task.status ===
          "Completed"
      ) {
        return
      }

      let newStatus = "Pending"

      if (
        task.status === "Pending"
      ) {
        newStatus =
          "In Progress"
      } else if (
        task.status ===
        "In Progress"
      ) {
        newStatus =
          "Completed"
      }

      try {
        const response =
          await fetch(
            `${API_URL}/${id}`,
            {
              method: "PUT",
              headers:
                getAuthHeaders(),
              body: JSON.stringify({
                ...task,
                status: newStatus,
              }),
            }
          )

        const data =
          await response.json()

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Failed to update status"
          )
        }

        setTasks(
          (currentTasks) =>
            currentTasks.map(
              (item) =>
                item.id === id
                  ? data.task
                  : item
            )
        )

        setMessage(
          `Task moved to ${newStatus}.`
        )
      } catch (err) {
        console.error(
          "Status update failed:",
          err
        )

        setError(
          "Failed to update task status."
        )
      }
    }

  /* DELETE */

  const handleDelete =
    async (id) => {
      const confirmed =
        window.confirm(
          "Are you sure you want to delete this task?"
        )

      if (!confirmed) return

      try {
        const response =
          await fetch(
            `${API_URL}/${id}`,
            {
              method: "DELETE",
              headers:
                getAuthHeaders(),
            }
          )

        const data =
          await response.json()

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Failed to delete task"
          )
        }

        setTasks(
          (currentTasks) =>
            currentTasks.filter(
              (task) =>
                task.id !== id
            )
        )

        setMessage(
          "Task deleted successfully."
        )
      } catch (err) {
        console.error(
          "Delete failed:",
          err
        )

        setError(
          "Failed to delete task."
        )
      }
    }

  /* LOGOUT */

  const handleLogout = () => {
    setShowLogoutConfirm(true)
  }

  const confirmLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    setTasks([])
    setShowForm(false)
    resetForm()

    setActivePage("Dashboard")
    setIsLoggedIn(false)
    setShowLogoutConfirm(false)
  }

  const cancelLogout = () => {
    setShowLogoutConfirm(false)
  }

  /* USER */

  const user = useMemo(() => {
    try {
      return (
        JSON.parse(
          localStorage.getItem(
            "user"
          )
        ) || {}
      )
    } catch {
      return {}
    }
  }, [isLoggedIn])

  const userName =
    user.name || "Employee"

  /* AUTH */

  if (checkingAuth) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <img
            src={LOGO_URL}
            alt="Krishivan"
          />

          <p>
            Checking authentication...
          </p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    if (showSignup) {
      return (
        <Signup
          onSignup={() =>
            setShowSignup(false)
          }
        />
      )
    }

    return (
      <Login
        onLogin={() =>
          setIsLoggedIn(true)
        }
        onSignup={() =>
          setShowSignup(true)
        }
      />
    )
  }

  /* =========================
     DASHBOARD LAYOUT
  ========================= */

  return (
    <div className="dashboard-layout">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="sidebar-brand">
          <img
            src={LOGO_URL}
            alt="Krishivan"
            className="sidebar-logo"
          />

          <div>
            <strong>
              Krishivan
            </strong>

            <span>
              Task Management
            </span>
          </div>
        </div>

        <div className="sidebar-section-title">
          MAIN MENU
        </div>

        <nav className="sidebar-nav">

          <button
            className={
              activePage ===
              "Dashboard"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => {
              setActivePage(
                "Dashboard"
              )
              setShowForm(false)
            }}
          >
            <span className="nav-icon">
              ▣
            </span>

            <span>
              Dashboard
            </span>
          </button>

          <button
            className={
              activePage === "Tasks"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => {
              setActivePage("Tasks")
              setShowForm(false)
            }}
          >
            <span className="nav-icon">
              ✓
            </span>

            <span>
              Tasks
            </span>
          </button>

          <button
            className={
              activePage ===
              "Employees"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => {
              setActivePage(
                "Employees"
              )
              setShowForm(false)
            }}
          >
            <span className="nav-icon">
              ♙
            </span>

            <span>
              Employees
            </span>
          </button>

          <button
            className={
              activePage === "FPOs"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => {
              setActivePage("FPOs")
              setShowForm(false)
            }}
          >
            <span className="nav-icon">
              ◉
            </span>

            <span>
              FPOs & MEs
            </span>
          </button>

          <button
            className={
              activePage === "Reports"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => {
              setActivePage(
                "Reports"
              )
              setShowForm(false)
            }}
          >
            <span className="nav-icon">
              ▤
            </span>

            <span>
              Reports
            </span>
          </button>

        </nav>

        <div className="sidebar-bottom">

          <div className="sidebar-section-title">
            ACCOUNT
          </div>

          <button
            className={
              activePage ===
              "Settings"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => {
              setActivePage(
                "Settings"
              )
              setShowForm(false)
            }}
          >
            <span className="nav-icon">
              ⚙
            </span>

            <span>
              Settings
            </span>
          </button>

          <button
            className="nav-item logout-nav"
            onClick={
              handleLogout
            }
          >
            <span className="nav-icon">
              ↪
            </span>

            <span>
              Logout
            </span>
          </button>

        </div>

      </aside>

      {/* MAIN */}

      <main className="dashboard-main">

        <header className="dashboard-topbar">

          <div className="mobile-brand">
            <img
              src={LOGO_URL}
              alt="Krishivan"
            />

            <strong>
              Krishivan
            </strong>
          </div>

          <div className="topbar-search">
            <span>⌕</span>

            <input
              type="search"
              placeholder="Search tasks..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />
          </div>

          <div className="topbar-user">

            <div className="notification-icon">
              ♢
            </div>

            <div className="user-avatar">
              {userName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="user-info">
              <strong>
                {userName}
              </strong>

              <span>
                Employee
              </span>
            </div>

          </div>

        </header>

        <div className="dashboard-content">

          {activePage ===
            "Dashboard" && (
            <DashboardPage
              tasks={tasks}
              pendingCount={
                pendingCount
              }
              progressCount={
                progressCount
              }
              completedCount={
                completedCount
              }
              priorityCounts={
                priorityCounts
              }
              openNewTask={
                openNewTask
              }
              loading={loading}
              message={message}
              error={error}
            />
          )}

          {activePage ===
            "Tasks" && (
            <TasksPage
              search={search}
              setSearch={
                setSearch
              }
              statusFilter={
                statusFilter
              }
              setStatusFilter={
                setStatusFilter
              }
              priorityFilter={
                priorityFilter
              }
              setPriorityFilter={
                setPriorityFilter
              }
              filteredTasks={
                filteredTasks
              }
              loading={loading}
              openNewTask={
                openNewTask
              }
              handleEditTask={
                handleEditTask
              }
              handleDelete={
                handleDelete
              }
              handleStatusChange={
                handleStatusChange
              }
              showForm={
                showForm
              }
              formRef={
                formRef
              }
              editingTaskId={
                editingTaskId
              }
              formData={
                formData
              }
              handleInputChange={
                handleInputChange
              }
              handleCreateTask={
                handleCreateTask
              }
              setShowForm={
                setShowForm
              }
              resetForm={
                resetForm
              }
            />
          )}

          {activePage ===
            "Employees" && (
            <EmployeesPage
              tasks={tasks}
            />
          )}

          {activePage ===
            "FPOs" && (
            <FPOPage
              tasks={tasks}
            />
          )}

          {activePage ===
            "Reports" && (
            <ReportsPage
              tasks={tasks}
              pendingCount={
                pendingCount
              }
              progressCount={
                progressCount
              }
              completedCount={
                completedCount
              }
            />
          )}

          {activePage ===
            "Settings" && (
            <SettingsPage
              user={user}
              userName={
                userName
              }
              onLogout={
                handleLogout
              }
            />
          )}

        </div>
      </main>

      {/* LOGOUT CONFIRMATION */}

      {showLogoutConfirm && (
        <div className="logout-overlay">

          <div className="logout-modal">

            <div className="logout-modal-icon">
              ↪
            </div>

            <h2>
              Logout?
            </h2>

            <p>
              Are you sure you want to
              logout from Krishivan?
            </p>

            <div className="logout-modal-actions">

              <button
                className="secondary-button"
                onClick={
                  cancelLogout
                }
              >
                Cancel
              </button>

              <button
                className="logout-confirm-button"
                onClick={
                  confirmLogout
                }
              >
                Logout
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  )
}

export default App