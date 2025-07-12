const express = require("express");
const router = express.Router();
const { Task, User } = require("../database");

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll();
    res.send(users);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch users" });
  }
});

// GET a single user by id
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    res.send(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// GET all tasks for a user by id
router.get("/:id/tasks", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    const tasks = await user.getTasks();
    res.send(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user's tasks" });
  }
});

//Fetch all tasks assigned to a given user
router.get("/:id/assigned-tasks", async (req, res) => {
  try{
    const userId = Number(req.params.id);
    const user = await User.findByPk(userId, {
      include: "assignedTask"
    })
    if (!user) {return res.status(404).json({error: "User not found"});}
    res.json(user.assignedTask)
  }
  catch {
    res.status(500).json({ error: "Failed to fetch assigned tasks" });
  }
})

// POST a new user
router.post("/", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).send(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

module.exports = router;
