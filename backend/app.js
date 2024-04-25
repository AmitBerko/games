import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import usersRoute from './routes/usersRoute.js'
import cors from 'cors'

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors({
  origin: 'http://localhost:5173'
}))

app.use('/users', usersRoute)

const port = 8080

app.get('/', (req, res) => {
	res.send('hello world')
})

mongoose
	.connect(process.env.MONGO_CONNECTION_STRING)
	.then(() => {
		console.log('connected to db')

		app.listen(port, () => {
			console.log(`listening on port ${port}`)
		})
	})
	.catch((err) => {
		console.log('failed to connect db: ' + err)
	})
