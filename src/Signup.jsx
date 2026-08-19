import { useState } from "react"

function Signup({ onSignup }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e) => {
    e.preventDefault()
    setMessage("")

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.")
      return
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.")
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        "https://krishivan-internship-backend.onrender.com/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      )

      const data = await response.json()

      if (data.success) {
        setMessage(
          "Account created successfully! You can now login."
        )

        setName("")
        setEmail("")
        setPassword("")
        setConfirmPassword("")

        setTimeout(() => {
          onSignup()
        }, 1500)
      } else {
        setMessage(data.message || "Signup failed")
      }
    } catch (error) {
      console.error("Signup error:", error)
      setMessage("Unable to connect to server.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">

        <div className="auth-brand">
          <div className="auth-logo">K</div>

          <div>
            <h1>Krishivan</h1>
            <p>Employee Task Manager</p>
          </div>
        </div>

        <div className="auth-heading">
          <h2>Create account</h2>
          <p>Register to manage your tasks</p>
        </div>

        <form
          onSubmit={handleSignup}
          className="auth-form"
        >

          <div className="auth-field">
            <label>Name</label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Password</label>

            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <small>
              Password must be at least 6 characters.
            </small>
          </div>

          <div className="auth-field">
            <label>Confirm Password</label>

            <input
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              required
            />
          </div>

          {message && (
            <div className="auth-message">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Create Account"}
          </button>

        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <button
            type="button"
            className="auth-link"
            onClick={onSignup}
          >
            Login
          </button>
        </p>

      </div>
    </main>
  )
}

export default Signup