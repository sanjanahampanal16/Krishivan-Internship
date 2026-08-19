const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

const sendResetEmail = async (email, resetLink) => {
  await transporter.sendMail({
    from: `"Krishivan" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset your Krishivan password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2>Reset your Krishivan password</h2>

        <p>You requested to reset your password.</p>

        <p>Click the button below to create a new password:</p>

        <a
          href="${resetLink}"
          style="
            display: inline-block;
            padding: 12px 20px;
            background: #2563eb;
            color: white;
            text-decoration: none;
            border-radius: 6px;
          "
        >
          Reset Password
        </a>

        <p style="margin-top: 20px;">
          This link will expire in 15 minutes.
        </p>

        <p>
          If you did not request a password reset, you can ignore this email.
        </p>
      </div>
    `,
  })
}

module.exports = sendResetEmail