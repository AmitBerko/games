import express from 'express'
import verifyFirebaseToken from '../middlewares/verifyFirebaseToken.js'
import User from '../models/userModel.js'
import ObfuscateIndexes from '../misc/Obfuscator.js'

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

let usersLevel = {} // { 'myjwttoken': {level: 2, correctIndexes: [1,2,3], gridLength: 3, triesLeft: 3} }

const getLevelData = (level) => {
	const maxLevel = Object.keys(levelsConfig).length
	const currentLevelConfig = levelsConfig[level] || levelsConfig[maxLevel]

	const { gridLength, correctRatio } = currentLevelConfig
	const correctIndexes = getRandomIndexes(gridLength, correctRatio)
	return { correctIndexes, level, gridLength }
}

router.get('/startGame', verifyFirebaseToken, (req, res) => {
	const levelData = getLevelData(1)
	usersLevel[req.user.token] = { ...levelData, triesLeft: 3 }
	res.json({
		...usersLevel[req.user.token],
		correctIndexes: ObfuscateIndexes(usersLevel[req.user.token].correctIndexes),
	})
})

router.get('/getLevelData', verifyFirebaseToken, (req, res) => {
	const currentLevel = usersLevel[req.user.token].level
	let newLevelData = getLevelData(currentLevel)
	usersLevel[req.user.token] = { ...newLevelData, triesLeft: usersLevel[req.user.token].triesLeft }
	res.json({
		...usersLevel[req.user.token],
		correctIndexes: ObfuscateIndexes(usersLevel[req.user.token].correctIndexes),
	})
})

router.post('/checkSolution', verifyFirebaseToken, (req, res) => {
	const { currentClicked } = req.body
	let hasPassed = true
	const levelData = usersLevel[req.user.token]

	// Find out how many mistakes a user has done
	let mistakes = 0
	for (let i = 0; i < currentClicked.length; i++) {
		if (!levelData.correctIndexes.includes(currentClicked[i])) {
			mistakes++
		}
	}

	// Check if user has passed the level
	for (let i = 0; i < levelData.correctIndexes.length; i++) {
		if (!currentClicked.includes(levelData.correctIndexes[i])) {
			hasPassed = false
			break
		}
	}

	usersLevel[req.user.token].triesLeft -= mistakes
	// If a user tries to cheat, delete his current game data
	if (usersLevel[req.user.token].triesLeft <= 0 || !hasPassed) {
		delete usersLevel[req.user.token]
		return res.json({ hasPassed: false })
	}

	usersLevel[req.user.token].level++
	res.json({ hasPassed: true })
})

router.get('/endGame', verifyFirebaseToken, async (req, res) => {
	// Send data to display in results screen and update the db
	if (!usersLevel[req.user.token]) {
		return res.status(500).json({ message: `Start a game before trying to end it` })
	}
	try {
		let usersCurrentBest = (await User.findOne({ uid: req.user.uid })).memoryGameBest
		const currentLevel = usersLevel[req.user.token].level
		if (currentLevel > usersCurrentBest) {
			await User.updateOne({ uid: req.user.uid }, { memoryGameBest: currentLevel })
			usersCurrentBest = currentLevel
		}

		delete usersLevel[req.user.token]
		res.json({ currentLevel, memoryGameBest: usersCurrentBest })
	} catch (error) {
		console.error('Error:', error)
		res.status(500).json({ message: `Internal server error: ${error}` })
	}
})

export default router