import express from 'express'
import User from '../models/userModel.js'
import { hash, compare } from 'bcrypt'
import { v4 } from 'uuid'
import jwt from 'jsonwebtoken'

const router = express.Router()

// Get all users
router.get('/', async (req, res) => {
	try {
		const users = await User.find({})
		res.status(200).json(users)
	} catch (error) {
		res.status(500).json({ error: `Failed to get all users: ${error.message}` })
	}
})

// Get one user by uid
router.get('/:uid', async (req, res) => {
	const { uid } = req.params

	try {
		const user = await User.findOne({ uid })
		if (!user) {
			return res.status(404).json({ error: 'User not found' })
		}
		res.status(200).json(user)
	} catch (error) {
		res.status(500).json({ error: `Failed to get user by uid: ${error.message}` })
	}
})

// Create a new user
router.post('/', async (req, res) => {
	const { email, username, password, speedGameBest, memoryGameBest } = req.body
	const existingUser = await User.findOne({ email })
	if (existingUser) {
		return res.status(400).json({ error: 'Email already exists' })
	}

	const uid = v4() // Create a unique id for each user
	try {
		const hashedPassword = await hash(password, 10) // Hash the user's password
		const userPayload = {
			uid,
			email,
			username,
			password: hashedPassword,
			speedGameBest,
			memoryGameBest,
		}

		await User.create(userPayload)
		const accessToken = jwt.sign(userPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })

		res.status(201).json(accessToken)
	} catch (error) {
		res.status(500).json({ error: `Failed to create new user: ${error}` })
	}
})

router.post('/login', async (req, res) => {
	const { email, password } = req.body
	const user = await User.findOne({ email })
	if (!user) {
		return res.status(404).json({ error: 'Email not found' })
	}
	console.log(user)
	const hashedPassword = user.password
	const passwordsMatch = await compare(password, hashedPassword)

	if (passwordsMatch) {
		res.status(200).json(user)
	} else {
		res.status(400).json({ error: 'Incorrect password' })
	}
})

// Update user by uid
router.put('/:uid', async (req, res) => {
	const { uid } = req.params
	const newData = req.body
	try {
		const allowedFields = {
			speedGameBest: newData.speedGameBest,
			memoryGameBest: newData.memoryGameBest,
		}

		const updatedUser = await User.findOneAndUpdate({ uid }, allowedFields, { new: true })

		if (!updatedUser) {
			res.status(404).json({ error: 'User not found' })
		} else {
			res.status(200).json(updatedUser)
		}
	} catch (error) {
		res.status(500).json({ error: `Failed to update user: ${error.message}` })
	}
})

export default router
