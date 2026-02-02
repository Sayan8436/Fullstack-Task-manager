import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import Taskrouter from './routes/Task.route.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cors())

// 🔴 ADD THIS LOG
console.log('Index.js loaded')

// health route
app.get('/', (req, res) => {
  res.send('Backend is running 🚀')
})

// 🔴 ADD THIS LOG
console.log('Mounting /api/task routes')

// mount router
app.use('/api/task', Taskrouter)

mongoose.connect(process.env.MONGODB_CONN)
  .then(() => {
    console.log('Database connected')
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch(err => console.error(err))
