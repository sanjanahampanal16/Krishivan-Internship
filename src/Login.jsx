import { useState } from "react"

function Login({ onLogin, onSignup, onForgotPassword }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setMessage("")
    setLoading(true)

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

      if (data.success) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        onLogin()
      } else {
        setMessage(data.message || "Invalid email or password")
      }
    } catch (error) {
      console.error("Login error:", error)
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
          <h2>Welcome back 👋</h2>
<p>Login to continue managing your tasks</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">

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
<button
  type="button"
  className="auth-link forgot-password"
  onClick={onForgotPassword}
>
  Forgot Password?
</button>
          {message && (
            <div className="auth-error">
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

     <p className="auth-footer">
  Don't have an account?{" "}
  <button
    type="button"
    className="auth-link"
    onClick={onSignup}
  >
    Sign up
  </button>
</p>

      </div>
    </main>
  )
}

export default Login