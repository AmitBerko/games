import express from 'express'
import User from '../models/userModel.js'
import verifyFirebaseToken from '../middlewares/verifyFirebaseToken.js'

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
	const { uid, username, speedGameBest, memoryGameBest } = req.body

	try {
		const user = await User.create({ uid, username, speedGameBest, memoryGameBest })
		res.status(201).json(user)
	} catch (error) {
		res.status(500).json({ error: `Failed to create new user: ${error}` })
	}
})

// Update user by uid
router.put('/:uid', verifyFirebaseToken, async (req, res) => {
	const { uid } = req.params

	// Verify if the decoded token's UID matches the UID being updated. throw an error if they differ
	if (req.user.uid !== uid) {
		return res.status(400).json({ error: 'Unauthorized' })
	}
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

router.post('/getLeaderboard', async (req, res) => {
  const { leaderboardMode } = req.body
  const projection = {
		username: 1,
		[leaderboardMode]: 1,
		_id: 0,
	}

  const users = await User.find({}, projection)
  res.json(users)
})

export default router
