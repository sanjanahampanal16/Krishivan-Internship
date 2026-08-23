import Login from "./Login"
import Signup from "./Signup"

import { useEffect, useState, useRef } from "react"

const API_URL =
  "https://krishivan-internship-backend.onrender.com/api/tasks"
  const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
})

function App() {
  
const [isLoggedIn, setIsLoggedIn] = useState(() => {
  return !!localStorage.getItem("token")
})
const [checkingAuth, setCheckingAuth] = useState(true)
const [showSignup, setShowSignup] = useState(false)


const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

const handleLogout = () => {
  setShowLogoutConfirm(true)
}

const confirmLogout = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  setIsLoggedIn(false)
  setShowLogoutConfirm(false)
}

const cancelLogout = () => {
  setShowLogoutConfirm(false)
}


  const [tasks, setTasks] = useState([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [priorityFilter, setPriorityFilter] = useState("All")
  const [showForm, setShowForm] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [loading, setLoading] = useState(true)

const [message, setMessage] = useState("")
const [error, setError] = useState("")
const formRef = useRef(null)
useEffect(() => {
  const token = localStorage.getItem("token")

  if (!token) {
    setIsLoggedIn(false)
    setCheckingAuth(false)
    return
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]))

    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      setIsLoggedIn(false)
    } else {
      setIsLoggedIn(true)
    }
  } catch (error) {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setIsLoggedIn(false)
  }

  setCheckingAuth(false)
}, [])

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedEmployee: "",
    relatedEntityType: "FPO",
    relatedEntity: "",
    priority: "Medium",
    dueDate: "",
  })

  // GET TASKS
 useEffect(() => {
  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError("")

      const response = await fetch(API_URL, {
  headers: getAuthHeaders(),
})
      const data = await response.json()

      console.log("Tasks from backend:", data)

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch tasks")
      }

      setTasks(data.tasks || [])
    } catch (error) {
      console.error("API connection failed:", error)
      setError("Unable to load tasks. Please check the backend server.")
    } finally {
      setLoading(false)
    }
  }

  fetchTasks()
}, [])

  // EDIT TASK
  const handleEditTask = (task) => {
  setEditingTaskId(task.id)

  setFormData({
    title: task.title,
    description: task.description,
    assignedEmployee: task.assignedEmployee,
    relatedEntityType: task.relatedEntityType,
    relatedEntity: task.relatedEntity,
    priority: task.priority,
    dueDate: task.dueDate,
  })

  setShowForm(true)

  setTimeout(() => {
    formRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }, 100)
}

  // INPUT CHANGE
  const handleInputChange = (event) => {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  // CREATE / UPDATE TASK
  const handleCreateTask = async (event) => {
    event.preventDefault()
    setMessage("")
setError("")

    if (
      !formData.title.trim() ||
      !formData.assignedEmployee.trim() ||
      !formData.relatedEntity.trim() ||
      !formData.dueDate
    ) {
      alert("Please fill in all required fields.")
      return
    }

    try {
      if (editingTaskId !== null) {
        // UPDATE
        const response = await fetch(`${API_URL}/${editingTaskId}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            title: formData.title.trim(),
            description: formData.description.trim(),
            assignedEmployee: formData.assignedEmployee.trim(),
            relatedEntityType: formData.relatedEntityType,
            relatedEntity: formData.relatedEntity.trim(),
            priority: formData.priority,
            dueDate: formData.dueDate,
          }),
        })

        const data = await response.json()

        if (!data.success) {
          alert("Failed to update task")
          return
        }

        setTasks((currentTasks) =>
          currentTasks.map((task) =>
            task.id === editingTaskId ? data.task : task
          )
        )
      } else {
        // CREATE
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.title.trim(),
            description: formData.description.trim(),
            assignedEmployee: formData.assignedEmployee.trim(),
            relatedEntityType: formData.relatedEntityType,
            relatedEntity: formData.relatedEntity.trim(),
            priority: formData.priority,
            dueDate: formData.dueDate,
            status: "Pending",
          }),
        })

        const data = await response.json()

        if (!data.success) {
          alert("Failed to create task")
          return
        }
setMessage("Task created successfully!")
        setTasks((currentTasks) => [data.task, ...currentTasks])
      }

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
      setShowForm(false)
   } catch (error) {
  console.error("Task operation failed:", error)
  setError("Something went wrong. Please try again.")
}
  }

  // CHANGE STATUS
  const handleStatusChange = async (id) => {
    const task = tasks.find((task) => task.id === id)

    if (!task || task.status === "Completed") return

    let newStatus = "Pending"

    if (task.status === "Pending") {
      newStatus = "In Progress"
    } else if (task.status === "In Progress") {
      newStatus = "Completed"
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...task,
          status: newStatus,
        }),
      })

      const data = await response.json()

      if (data.success) {
  setTasks((currentTasks) =>
    currentTasks.map((task) =>
      task.id === id ? data.task : task
    )
  )

  setMessage(`Task moved to ${newStatus}.`)
} else {
  setError(data.message || "Failed to update task status.")
}
   } catch (error) {
  console.error("Status update failed:", error)
  setError("Failed to update task status. Please try again.")
}
  }

  // DELETE TASK
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    )

    if (!confirmed) return

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        setTasks((currentTasks) =>
          currentTasks.filter((task) => task.id !== id)
        )
        setMessage("Task deleted successfully!")
      } else {
        alert("Failed to delete task")
      }
    } catch (error) {
  console.error("Delete failed:", error)
  setError("Failed to delete task. Please try again.")
}
  }

  // FILTER TASKS
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase()) ||
      task.assignedEmployee.toLowerCase().includes(search.toLowerCase()) ||
      task.relatedEntity.toLowerCase().includes(search.toLowerCase())

    const matchesStatus =
      statusFilter === "All" || task.status === statusFilter

    const matchesPriority =
      priorityFilter === "All" || task.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const pendingCount = tasks.filter(
    (task) => task.status === "Pending"
  ).length

  const progressCount = tasks.filter(
    (task) => task.status === "In Progress"
  ).length

  const completedCount = tasks.filter(
  (task) => task.status === "Completed"
).length

if (checkingAuth) {
  return null
}
if (!isLoggedIn) {
  if (showSignup) {
    return (
      <Signup
        onSignup={() => setShowSignup(false)}
      />
    )
  }

  
 
  return (
    <Login
  onLogin={() => setIsLoggedIn(true)}
  onSignup={() => setShowSignup(true)}
/>
  )
}

return (
  <main className="app-shell">

    {showLogoutConfirm && (
      <div className="logout-overlay">
        <div className="logout-modal">

          <div className="logout-icon">↪</div>

          <h2>Logout?</h2>

          <p>
            Are you sure you want to logout from your account?
          </p>

          <div className="logout-modal-actions">

            <button
              className="secondary-button"
              onClick={cancelLogout}
            >
              Cancel
            </button>

            <button
              className="logout-confirm-button"
              onClick={confirmLogout}
            >
              Yes, Logout
            </button>

          </div>

        </div>
      </div>
    )}

    <header className="topbar">
  <div className="brand">
    <div className="brand-icon">K</div>

    <div>
      <h2>Krishivan</h2>
      <span>Employee Task Manager</span>
    </div>
  </div>

  <div className="header-actions">
    <button
      className="primary-button"
      onClick={() => {
        setEditingTaskId(null)
        setShowForm(true)
      }}
    >
      + New Task
    </button>

    <button
      className="logout-button"
      onClick={handleLogout}
    >
      Logout
    </button>
  </div>
</header>
      <section className="dashboard">
        {loading && (
  <div className="info-message">
    Loading tasks...
  </div>
)}

{message && (
  <div className="success-message">
    {message}
  </div>
)}

{error && (
  <div className="error-message">
    {error}
  </div>
)}

        {showForm && (
        
      <section ref={formRef} className="task-form-card">
            <div className="form-header">
              <div>
                <p className="eyebrow">Task Management</p>

                <h2>
                  {editingTaskId !== null
                    ? "Edit Task"
                    : "Create New Task"}
                </h2>
              </div>

              <button
                type="button"
                className="close-button"
                onClick={() => setShowForm(false)}
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateTask}>
              <div className="form-grid">

                <div className="form-group">
                  <label htmlFor="title">Title *</label>

                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter task title"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="assignedEmployee">
                    Assigned Employee *
                  </label>

                  <input
                    id="assignedEmployee"
                    name="assignedEmployee"
                    type="text"
                    value={formData.assignedEmployee}
                    onChange={handleInputChange}
                    placeholder="Enter employee name"
                    required
                  />
                </div>

                <div className="form-group form-full">
                  <label htmlFor="description">
                    Description
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the task"
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="relatedEntityType">
                    Entity Type *
                  </label>

                  <select
                    id="relatedEntityType"
                    name="relatedEntityType"
                    value={formData.relatedEntityType}
                    onChange={handleInputChange}
                  >
                    <option value="FPO">FPO</option>
                    <option value="ME">ME</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="relatedEntity">
                    Related Entity *
                  </label>

                  <input
                    id="relatedEntity"
                    name="relatedEntity"
                    type="text"
                    value={formData.relatedEntity}
                    onChange={handleInputChange}
                    placeholder="Enter FPO or ME"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="priority">Priority *</label>

                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="dueDate">Due Date *</label>

                  <input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>

              </div>

              <div className="form-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  {editingTaskId !== null
                    ? "Save Changes"
                    : "Create Task"}
                </button>

              </div>
            </form>
          </section>
        )}

        <div className="page-heading">
          <div>
            <p className="eyebrow">Task Management</p>

            <h1>Employee Tasks</h1>

            <p className="subtitle">
              Create, track and manage operational tasks.
            </p>
          </div>
        </div>

        <section className="stats-grid">

          <div className="stat-card">
            <span className="stat-label">Total Tasks</span>
            <strong>{tasks.length}</strong>
          </div>

          <div className="stat-card pending-stat">
            <span className="stat-label">Pending</span>
            <strong>{pendingCount}</strong>
          </div>

          <div className="stat-card progress-stat">
            <span className="stat-label">In Progress</span>
            <strong>{progressCount}</strong>
          </div>

          <div className="stat-card completed-stat">
            <span className="stat-label">Completed</span>
            <strong>{completedCount}</strong>
          </div>

        </section>

        <section className="filters">

          <div className="search-box">
            <span>⌕</span>

            <input
              type="search"
              placeholder="Search tasks, employees or FPOs..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              aria-label="Search tasks"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            aria-label="Filter by status"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(event) =>
              setPriorityFilter(event.target.value)
            }
            aria-label="Filter by priority"
          >
            <option value="All">All Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

        </section>

        <div className="task-header">
          <div>
            <h2>Tasks</h2>
            <p>{filteredTasks.length} tasks found</p>
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <section className="empty-state">
            <div className="empty-icon">✓</div>

            <h3>No tasks found</h3>

            <p>
              Try changing your search or filter options.
            </p>
          </section>
        ) : (
          <section className="task-list">

            {filteredTasks.map((task) => {

              const isOverdue =
                new Date(task.dueDate) < new Date() &&
                task.status !== "Completed"

              return (
                <article
                  className="task-card"
                  key={task.id}
                >

                  <div className="task-top">
                    <div>

                      <div className="task-title-row">

                        <h3>{task.title}</h3>

                        <span
                          className={`priority priority-${task.priority.toLowerCase()}`}
                        >
                          {task.priority}
                        </span>

                      </div>

                      <p className="task-description">
                        {task.description}
                      </p>

                    </div>
                  </div>

                  <div className="task-details">

                    <div>
                      <span>Assigned Employee</span>

                      <strong>
                        👤 {task.assignedEmployee}
                      </strong>
                    </div>

                    <div>
                      <span>Related Entity</span>

                      <strong>
                        🏢 {task.relatedEntity}
                        <small>
                          {" "}
                          ({task.relatedEntityType})
                        </small>
                      </strong>
                    </div>

                    <div>
                      <span>Due Date</span>

                      <strong
                        className={
                          isOverdue ? "overdue" : ""
                        }
                      >
                        📅 {task.dueDate}

                        {isOverdue && " • Overdue"}
                      </strong>
                    </div>

                  </div>

                  <div className="task-footer">

                    <button
                      className={`status-button status-${task.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                      onClick={() =>
                        handleStatusChange(task.id)
                      }
                      disabled={task.status === "Completed"}
                    >
                      {task.status}
                    </button>

                    <div className="task-actions">

                      <button
                        className="secondary-button"
                        onClick={() =>
                          handleEditTask(task)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() =>
                          handleDelete(task.id)
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </article>
              )
            })}

          </section>
        )}

      </section>
    </main>
  )
}

export default App