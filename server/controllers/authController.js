const bcrypt = require("bcryptjs")
const User = require("../models/user")

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      })
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    })

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    })

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Signup error:", error)

    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

module.exports = {
  signup,
}