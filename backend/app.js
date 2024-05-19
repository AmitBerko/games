import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import usersRoute from './routes/usersRoute.js'
import memoryRoute from './routes/memoryRoute.js'
import cors from 'cors'
import { Server } from 'socket.io'
import handleSpeedGameSocket from './sockets/speedGameSocket.js'
import verifyFirebaseTokenSocket from './middlewares/verifyFirebaseTokenSocket.js'

dotenv.config()

const app = express()
// const server = http.createServer(app)
app.use(express.json())
app.use(
	cors({
		origin: ['http://localhost:5173', 'https://amit-games.web.app'],
	})
)

app.use('/users', usersRoute)
app.use('/memory', memoryRoute)

const port = 8080

app.get('/', (req, res) => {
	res.send('hello world')
})

mongoose
	.connect(process.env.MONGO_CONNECTION_STRING)
	.then(() => {
		console.log('connected to db')

		const server = app.listen(port, () => {
			console.log(`listening on port ${port}`)
		})

    const io = new Server(server, {
      cors: {
        origin: ['http://localhost:5173', 'https://amit-games.web.app']
      }
    })

    io.use(verifyFirebaseTokenSocket)

		handleSpeedGameSocket(io)
	})
	.catch((err) => {
		console.log('failed to connect db: ' + err)
	})
