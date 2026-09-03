
import { useState } from "react"

function Login({ onLogin, onSignup }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      setMessage("Please enter email and password")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      const response = await fetch(
        "https://krishivan-internship-backend.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Invalid email or password")
      }

      if (data.token) {
        localStorage.setItem("token", data.token)
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user))
      }

      onLogin()
    } catch (error) {
      setMessage(error.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-overlay"></div>

      <div className="auth-card">
        <div className="auth-logo-container">
          <img
            src="https://krishivantech.com/krishivan-logo.png"
            alt="Krishivan"
            className="auth-logo"
          />
        </div>

        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Login to your employee task management account</p>
        </div>

        <form onSubmit={handleLogin}>
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
                placeholder="Enter your password"
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          <span>Don't have an account?</span>

          <button
            type="button"
            className="switch-auth"
            onClick={onSignup}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login

