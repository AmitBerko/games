import express from 'express'

const router = express.Router()

let level = 1 // Starting from 1

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

router.get('/getLevelData', (req, res) => {
	// Return level x and x + 1 correct indexes
	let result = { currentLevel: [], nextLevel: [] }
	const maxLevel = Object.keys(levelsConfig).length
	const currentLevel = levelsConfig[level] || levelsConfig[maxLevel]
	const nextLevel = levelsConfig[level + 1] || levelsConfig[maxLevel]
	const currentGridLength = currentLevel.gridLength
	const currentRatio = currentLevel.correctRatio
	const nextGridLength = nextLevel.gridLength
	const nextRatio = nextLevel.correctRatio

	result.currentLevel = getRandomIndexes(currentGridLength, currentRatio)
	result.nextLevel = getRandomIndexes(nextGridLength, nextRatio)

	res.json(result)
})

export default router
