import express from 'express'

console.log('Task.route.js loaded') // 🔴 IMPORTANT

const Taskrouter = express.Router()

Taskrouter.get('/', (req, res) => {
  res.json({ message: 'Task router is working ✅' })
})

Taskrouter.post('/create-task', (req, res) => {
  res.json({
    message: 'Create task route hit ✅',
    body: req.body
  })
})

export default Taskrouter

