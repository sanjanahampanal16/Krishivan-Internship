require("dotenv").config()

const request = require("supertest")
const mongoose = require("mongoose")
const connectDB = require("../config/db")
const app = require("../app")

describe("Task API validation", () => {
  beforeAll(async () => {
    await connectDB()
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  test("POST /api/tasks should reject a task with a blank title", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .send({
        title: "",
        assignedEmployee: "Test Employee",
        relatedEntityType: "FPO",
        relatedEntity: "Test FPO",
        priority: "High",
        dueDate: "2026-12-31",
        status: "Pending",
      })

    expect(response.statusCode).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toContain("title")
  })

  test("POST /api/tasks should reject an invalid priority", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .send({
        title: "Test Task",
        assignedEmployee: "Test Employee",
        relatedEntityType: "FPO",
        relatedEntity: "Test FPO",
        priority: "Wrong",
        dueDate: "2026-12-31",
        status: "Pending",
      })

    expect(response.statusCode).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toContain("priority")
  })

  test("POST /api/tasks should reject an invalid status", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .send({
        title: "Test Task",
        assignedEmployee: "Test Employee",
        relatedEntityType: "FPO",
        relatedEntity: "Test FPO",
        priority: "High",
        dueDate: "2026-12-31",
        status: "Wrong",
      })

    expect(response.statusCode).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toContain("status")
  })

  test("POST /api/tasks should reject an invalid related entity type", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .send({
        title: "Test Task",
        assignedEmployee: "Test Employee",
        relatedEntityType: "ABC",
        relatedEntity: "Test Entity",
        priority: "High",
        dueDate: "2026-12-31",
        status: "Pending",
      })

    expect(response.statusCode).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toContain("relatedEntityType")
  })

  test("POST /api/tasks should reject an invalid due date", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .send({
        title: "Test Task",
        assignedEmployee: "Test Employee",
        relatedEntityType: "FPO",
        relatedEntity: "Test FPO",
        priority: "High",
        dueDate: "not-a-date",
        status: "Pending",
      })

    expect(response.statusCode).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toContain("dueDate")
  })

  test("GET /api/tasks/not-a-valid-id should return 400", async () => {
    const response = await request(app).get("/api/tasks/not-a-valid-id")

    expect(response.statusCode).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe("Invalid task ID")
  })

  test("GET /api/tasks/:id should return 404 for a missing task", async () => {
    const fakeId = new mongoose.Types.ObjectId()

    const response = await request(app).get(`/api/tasks/${fakeId}`)

    expect(response.statusCode).toBe(404)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe("Task not found")
  })
})