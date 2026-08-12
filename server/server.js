require("dotenv").config()

const app = require("./app")
console.log("Task routes should be loaded")
const connectDB = require("./config/db")

const PORT = process.env.PORT || 5000

connectDB()

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})




