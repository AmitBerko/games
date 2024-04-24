import express from 'express'
import User from '../models/userModel.js'

const router = express.Router()

// Get all users
router.get('/', async (req, res) => {
	try {
		const users = await User.find({})
		res.status(200).json(users)
	} catch (error) {
		res.status(500).json({ error: error.message })
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
		res.status(500).json({ error: error.message })
	}
})

// Create a new user
router.post('/', async (req, res) => {
	const { uid, speedGameBest, memoryGameBest } = req.body

	try {
		await User.create({ uid, speedGameBest, memoryGameBest })
		res.status(201).json({ message: 'Added user successfuly' })
	} catch (error) {
		res.status(500).json({ error: `Failed to create new user: ${error}` })
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

		const updatedUser = await User.findOneAndUpdate({ uid }, allowedFields)

		if (!updatedUser) {
			res.status(404).json({ error: 'User not found' })
		} else {
			res.status(200).json({ message: 'User updated successfuly' })
		}
	} catch (error) {
		console.log(`Failed to update user: ${error}`)
		res.status(500).json({ error: 'Failed to update user' })
	}
})

export default router
