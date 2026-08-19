import { useState } from "react"

function ForgotPassword({ onBack, onResetPassword }) {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setMessage("")
    setLoading(true)

    try {
      const response = await fetch(
        "https://krishivan-internship-backend.onrender.com/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      )

      const data = await response.json()

      setMessage(data.message)

    } catch (error) {
      console.error("Forgot password error:", error)
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
          <h2>Forgot Password?</h2>
          <p>Enter your email to reset your password</p>
        </div>

        <form onSubmit={handleForgotPassword} className="auth-form">

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
            {loading ? "Sending..." : "Send Reset Request"}
          </button>

        </form>

        <p className="auth-footer">
          Remember your password?{" "}
          <button
            type="button"
            className="auth-link"
            onClick={onBack}
          >
            Back to Login
          </button>
          <button
  type="button"
  className="auth-link"
  onClick={onResetPassword}
>
  Reset Password
</button>
        </p>

      </div>
    </main>
  )
}

export default ForgotPassword