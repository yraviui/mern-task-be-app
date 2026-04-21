import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import TaskModel from './models/tasks.js'


dotenv.config()
connectDB()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/api/tasks', async (req, res) => {
    try {
       const tasks = await TaskModel.find({})
       res.status(200).send({ success: true, message: 'Tasks retrieved successfully', tasks })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' })
    }
})

app.post('/api/tasks', async (req, res) => { // {"title": "Task1", "description": "Task1 Description"}
    try {
        const { title, description } = req.body
        const task = await TaskModel.create({ title, description })
        res.status(201).send({ success: true, message: 'Task created successfully', task })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' })
    }
})

app.put('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { title, description } = req.body
        const task = await TaskModel.findByIdAndUpdate(id, { title, description }, { new: true })
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' })
        }
        res.status(200).send({ success: true, message: 'Task updated successfully', task })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' })
    }
})

app.get('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params
        const task = await TaskModel.findById(id)
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' })
        }
        res.status(200).send({ success: true, message: 'Task retrieved successfully', task })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' })
    }
})

app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params
        const task = await TaskModel.findByIdAndDelete(id)
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' })
        }
        res.status(200).send({ success: true, message: 'Task deleted successfully' })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' })
    }
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})


