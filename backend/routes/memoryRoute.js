import express from 'express'
import verifyFirebaseToken from '../middlewares/verifyFirebaseToken.js'
import User from '../models/userModel.js'

const router = express.Router()

function getRandomIndexes(gridLength, correctTilesRatio) {
	// Create an array of all possible indexes
	const indexes = Array.from({ length: gridLength * gridLength }, (_, index) => index)

	// Shuffle the array
	for (let i = indexes.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[indexes[i], indexes[j]] = [indexes[j], indexes[i]]
	}

	return indexes.slice(0, gridLength * gridLength * correctTilesRatio)
}

const levelsConfig = {
	1: { gridLength: 3, correctRatio: 0.4 },
	2: { gridLength: 3, correctRatio: 0.45 },
	3: { gridLength: 4, correctRatio: 0.4 },
	4: { gridLength: 4, correctRatio: 0.45 },
	5: { gridLength: 4, correctRatio: 0.5 },
	6: { gridLength: 5, correctRatio: 0.35 },
	7: { gridLength: 5, correctRatio: 0.4 },
	8: { gridLength: 5, correctRatio: 0.45 },
	9: { gridLength: 5, correctRatio: 0.5 },
	10: { gridLength: 5, correctRatio: 0.55 },
	11: { gridLength: 6, correctRatio: 0.35 },
	12: { gridLength: 6, correctRatio: 0.4 },
	13: { gridLength: 6, correctRatio: 0.45 },
	14: { gridLength: 6, correctRatio: 0.5 },
	15: { gridLength: 6, correctRatio: 0.55 },
	16: { gridLength: 7, correctRatio: 0.35 },
	17: { gridLength: 7, correctRatio: 0.4 },
	18: { gridLength: 7, correctRatio: 0.45 },
	19: { gridLength: 7, correctRatio: 0.5 },
	20: { gridLength: 7, correctRatio: 0.55 },
}

let levelData = []
let usersProgress = {} // { 'myjwttoken': {level: 1} }

const getLevelData = (level) => {
	const maxLevel = Object.keys(levelsConfig).length
	const currentLevelConfig = levelsConfig[level] || levelsConfig[maxLevel]

	const { gridLength, correctRatio } = currentLevelConfig
	const correctIndexes = getRandomIndexes(gridLength, correctRatio)
	return { correctIndexes, level, gridLength }
}

router.get('/startGame', verifyFirebaseToken, (req, res) => {
	usersProgress[req.user.token] = { level: 1 }
	levelData = getLevelData(1)
	res.json(levelData)
})

router.get('/getLevelData', verifyFirebaseToken, (req, res) => {
	// Return level x and x + 1 correct indexes
	const currentLevel = usersProgress[req.user.token].level
	let newLevelData = getLevelData(currentLevel)

	res.json(newLevelData)
})

router.post('/checkSolution', verifyFirebaseToken, (req, res) => {
	const { currentClicked } = req.body

	// Check if user passed
	let hasPassed = true
	for (let i = 0; i < levelData.length; i++) {
		if (!currentClicked.includes(levelData[i])) {
			hasPassed = false
			break
		}
	}
	if (hasPassed) {
		usersProgress[req.user.token].level++
	}
	res.json({ hasPassed })
})

router.get('/endGame', verifyFirebaseToken, async (req, res) => {
	// Send data to display in results screen and update the db
	try {
		let usersCurrentBest = (await User.findOne({ uid: req.user.uid })).memoryGameBest
		const currentLevel = usersProgress[req.user.token].level // Change usersprogress to userslevel

		if (currentLevel > usersCurrentBest) {
			await User.updateOne({ uid: req.user.uid }, { memoryGameBest: currentLevel })
			usersCurrentBest = currentLevel // Update usersCurrentBest
		}

		delete usersProgress[req.user.token]
		console.log(currentLevel)
		res.json({ currentLevel, memoryGameBest: usersCurrentBest })
	} catch (error) {
		console.error('Error:', error)
		res.status(500).json({ message: 'Internal server error' })
	}
})

export default router

/*

• in frontend when user "passes" send it to here and verify.
• if he passes send the next level. in addition to the level contents send the gridlength and current level
• 
• 
• 

*/
