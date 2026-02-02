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

// routes
app.use('/api/task', Taskrouter)

// connect DB and start server
mongoose.connect(process.env.MONGODB_CONN)
  .then(() => {
    console.log('Database connected.')

    app.listen(PORT, () => {
      console.log('Server running on port:', PORT)
    })
  })
  .catch(err => {
    console.log('Database connection failed.', err)
  })
