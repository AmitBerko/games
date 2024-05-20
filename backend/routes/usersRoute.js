import express from 'express'
import User from '../models/userModel.js'
import verifyFirebaseToken from '../middlewares/verifyFirebaseToken.js'

const router = express.Router()

// Get all users
router.get('/', verifyFirebaseToken, async (req, res) => {
	try {
		// If this will ever be used, just make an if statement to only allow admin users
    if (true || req.user.uid === 'my uid') {
      return res.status(400).json({ error: 'Unauthorized' })
    }
    
		const users = await User.find({})
		res.status(200).json(users)
	} catch (error) {
		res.status(500).json({ error: `Failed to get all users: ${error.message}` })
	}
})

// Get one user by uid
router.get('/:uid', verifyFirebaseToken, async (req, res) => {
	const { uid } = req.params

	if (req.user.uid !== uid) {
		return res.status(400).json({ error: 'Unauthorized' })
	}

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
	const { uid, username } = req.body

	try {
		const user = await User.create({ uid, username, speedGameBest: 0, memoryGameBest: 0 })
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

	const users = await User.find({}, projection).sort({ [leaderboardMode]: -1 })
	res.json(users.slice(0, 5)) // Show only the top 5
})

export default router
