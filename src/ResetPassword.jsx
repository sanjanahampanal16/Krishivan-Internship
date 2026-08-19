import { useState } from "react"

function ResetPassword({ token, onBackToLogin }) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleResetPassword = async (e) => {
    e.preventDefault()

    setMessage("")
    setError("")

    if (!token) {
      setError("Invalid or missing reset link.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    try {
      setLoading(true)

      const response = await fetch(
        `https://krishivan-internship-backend.onrender.com/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.message || "Unable to reset password")
        return
      }

      setMessage("Password reset successfully!")

      setTimeout(() => {
        onBackToLogin()
      }, 2000)
    } catch (error) {
      console.error("Reset password error:", error)
      setError("Unable to connect to server.")
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
          <h2>Reset Password 🔐</h2>
          <p>Create a new password for your account</p>
        </div>

        <form
          onSubmit={handleResetPassword}
          className="auth-form"
        >

          <div className="auth-field">
            <label>New Password</label>

            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Confirm Password</label>

            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              required
            />
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          {message && (
            <div className="success-message">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

        </form>

      </div>
    </main>
  )
}

export default ResetPassword