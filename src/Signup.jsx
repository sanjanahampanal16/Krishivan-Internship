
import { useState } from "react"

function Signup({ onSignup, onLogin }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e) => {
    e.preventDefault()

    if (!name || !email || !password || !confirmPassword) {
      setMessage("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters")
      return
    }

    setLoading(true)
    setMessage("")

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

      if (!response.ok) {
        throw new Error(data.message || "Signup failed")
      }

      if (data.token) {
        localStorage.setItem("token", data.token)
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user))
      }

      onSignup()
    } catch (error) {
      setMessage(error.message || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-overlay"></div>

      <div className="auth-card signup-card">
        <div className="auth-logo-container">
          <img
            src="https://krishivantech.com/krishivan-logo.png"
            alt="Krishivan"
            className="auth-logo"
          />
        </div>

        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Create your employee task management account</p>
        </div>

        <form onSubmit={handleSignup}>
          <div className="input-group">
            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>

            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="input-group">
            <label>Confirm Password</label>

            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          <span>Already have an account?</span>

          <button
            type="button"
            className="switch-auth"
            onClick={onLogin}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default Signup

