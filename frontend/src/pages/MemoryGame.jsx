import React, { useEffect, useState, useRef } from 'react'
import MemoryTile from '../components/MemoryTile'
import MemoryGameResults from '../components/MemoryGameResults'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider'
import axios from '../api/axios'
import DeobfuscateIndexes from '../misc/Deobfuscator'

function MemoryGame() {
	const [level, setLevel] = useState(1)
	const [triesLeft, setTriesLeft] = useState(3)
	const [gridLength, setGridLength] = useState(3) // Start with a 3x3 grid
	const [levelGoal, setLevelGoal] = useState([])
	const [currentClicked, setCurrentClicked] = useState([])
	const [disableTiles, setDisableTiles] = useState(true)
	const [showResults, setShowResults] = useState(false)
	const { userData } = useAuth()

	const runOnce = useRef(false)
	const requestHeader = {
		headers: { Authorization: `Bearer ${userData.token}` },
	}

	useEffect(() => {
		const getInitialData = async () => {
			// Obfuscate the response later
			const startTime = Date.now()
			const response = await axios.get('/memory/startGame', requestHeader)
			const finishTime = Date.now()
			const timeToWait = Math.max(1000 - (finishTime - startTime), 0)
			// Wait a minimum of 1 second
			setTimeout(() => {
				setLevelGoal(DeobfuscateIndexes(response.data.correctIndexes))
			}, timeToWait)
		}

		// Run it only once
		if (!runOnce.current) {
			getInitialData()
		}

		return () => (runOnce.current = true)
	}, [])

	useEffect(() => {
		setDisableTiles(true)
		let goalTilesElements = []
		for (let i = 0; i < levelGoal.length; i++) {
			goalTilesElements.push(document.querySelector(`#tile${levelGoal[i]}`))
		}

		goalTilesElements.map((tile) => {
			tile.classList.add('correct-tile', 'animate-flip')
		})

		setTimeout(() => {
			goalTilesElements.map((tile) => {
				tile.classList.remove('correct-tile', 'animate-flip')
				setDisableTiles(false)
			})
		}, 2000)
	}, [levelGoal])

	useEffect(() => {
		document.documentElement.style.setProperty('--memory-grid-length', gridLength)
		let gridGap = 0.6
		if (gridLength === 5) {
			gridGap = 0.5
		} else if (gridLength === 6) {
			gridGap = 0.45
		} else if (gridLength === 7) {
			gridGap = 0.4
		}
		document.documentElement.style.setProperty('--memory-grid-gap', `calc(${gridGap}rem + 0.275vw)`)
	}, [gridLength])

	const handleTileClick = (tileIndex) => {
		if (disableTiles) return
		if (currentClicked.includes(tileIndex)) return
		setCurrentClicked((prevClicked) => [...prevClicked, tileIndex])

		const tile = document.getElementsByClassName('memory-tile')[tileIndex]
		if (levelGoal.includes(tileIndex)) {
			// If correct
			tile.classList.add('correct-tile')
			tile.classList.add('animate-flip')
		} else {
			// If wrong
			tile.classList.add('wrong-tile')
			setTriesLeft((prevTries) => prevTries - 1)
		}
	}

	const hasPassed = () => {
		if (Object.keys(levelGoal).length === 0) return false
		for (let i = 0; i < levelGoal.length; i++) {
			if (!currentClicked.includes(levelGoal[i])) {
				return false
			}
		}

		return true
	}

	function sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms))
	}

	const removeSpecialClasses = () => {
		const tiles = [...document.querySelectorAll('.memory-tile')]
		const levelPass = document.querySelector('.level-pass')

		tiles.map((tile) => {
			tile.classList.remove('correct-tile', 'animate-flip', 'wrong-tile')
		})
		levelPass.classList.remove('animate')
	}

	const handleGameLose = () => {
		setCurrentClicked([])
		setDisableTiles(true)
		setShowResults(true)
	}

	const handlePlayAgain = async () => {
		// Set states to default for smooth transition
		setLevel(1)
		setGridLength(3)
		setTriesLeft(3)
		removeSpecialClasses()
		setShowResults(false)
		const startTime = Date.now()
		const response = await axios.get('/memory/startGame', requestHeader)
		const finishTime = Date.now()
		const timeToWait = Math.max(1000 - (finishTime - startTime), 0)

		// Wait a minimum of 1 second
		setTimeout(() => {
			setLevelGoal(DeobfuscateIndexes(response.data.correctIndexes))
		}, timeToWait)
	}

	useEffect(() => {
		const checkIfPassed = async () => {
			if (hasPassed()) {
				// Make the level pass animation
				const levelPass = document.querySelector('.level-pass')
				levelPass.classList.add('animate')

				// Verify on the server and receive the next level's data
				let time = Date.now()
				const serverVerification = await axios.post(
					'memory/checkSolution',
					{ currentClicked },
					requestHeader
				)

				// This shouldn't happen unless a user tries to tamper a request
				if (!serverVerification.data.hasPassed) {
					handleGameLose()
					return
				}
				const serverVerificationTime = Date.now() - time
				let extraWaitTime = Math.max(1200 - serverVerificationTime, 0)

				// Wait a minimum of 1.2 seconds
				await sleep(extraWaitTime)
				setCurrentClicked([])
				removeSpecialClasses()

				// Get the next level's data
				time = Date.now()
				const nextLevelsData = await axios.get('/memory/getLevelData', requestHeader)

				// Update all of the new level's properties
				const { correctIndexes, gridLength, level, triesLeft } = nextLevelsData.data

				setTriesLeft(triesLeft)

				const levelsDataTime = Date.now() - time
				extraWaitTime = Math.max(600 - levelsDataTime, 0)
				// Wait for a minimum of 0.6 seconds
				await sleep(extraWaitTime)
				setGridLength(gridLength)

				// 0.6 seconds later start the next level
				await sleep(600)
				setLevelGoal(DeobfuscateIndexes(correctIndexes))
				setLevel(level)
			}
		}

		checkIfPassed()
	}, [currentClicked])

	useEffect(() => {
		if (triesLeft === 3) return // Means we just started, so don't do anything
		const heartIcon = document.querySelector('.fa-heart')

		// Make the heart shake
		heartIcon.classList.add('fa-shake')
		const handleAnimationEnd = () => {
			// Stop the animation after it ends so it only runs once
			heartIcon.classList.remove('fa-shake')
		}

		heartIcon.addEventListener('animationend', handleAnimationEnd)
		if (triesLeft === 0) {
			handleGameLose()
		}

		return () => {
			heartIcon.removeEventListener('animationend', handleAnimationEnd)
		}
	}, [triesLeft])

	return (
		<>
			<div className="memory-game-container">
				<div className="level-tries fs-1">
					<p className="level">Level {level}</p>
					<p className="tries">
						{triesLeft}{' '}
						<i className="fa-solid fa-heart" style={{ '--fa-animation-iteration-count': 1 }}></i>
					</p>
				</div>
				<div className="memory-grid-container">
					{Array.from({ length: gridLength * gridLength }).map((_, index) => (
						<MemoryTile
							key={`tile${index}`}
							id={`tile${index}`}
							handleTileClick={() => handleTileClick(index)}
							isDisabled={disableTiles}
						/>
					))}
				</div>
				<div></div>
			</div>
			<div className="level-pass"></div>
			<MemoryGameResults
				showResults={showResults}
				requestHeader={requestHeader}
				level={level}
				handlePlayAgain={handlePlayAgain}
			/>
		</>
	)
}

export default MemoryGame

// const [correctIndexes, setCorrectIndexes] = useState([])
// const [disableTiles, setDisableTiles] = useState(true)
// const [correctIndexesCount, setCorrectIndexesCount] = useState(0) // To prevent dom manipulation
// const navigate = useNavigate()
// // Results modal
// const [showResults, setShowResults] = useState(false)

// const handlePlayAgain = () => {
// 	// Bring all settings to default
// 	removeSpecialClasses()
// 	setCorrectIndexes([])
// 	setCorrectIndexesCount(0)
// 	setTriesLeft(3)
//   setGridLength(3)
//   // Fixed a bug regarding trying to "play again" after losing at level 1
//   setLevel((prevLevel) => (prevLevel === 1 ? 0 : 1))
// 	setShowResults(false)
// }

// const handleReturn = () => {
// 	setShowResults(false)
// 	navigate('/')
// }

// const levelConfig = {
// 	1: { gridLength: 3, correctRatio: 0.4 },
// 	2: { gridLength: 3, correctRatio: 0.45 },
// 	3: { gridLength: 4, correctRatio: 0.4 },
// 	4: { gridLength: 4, correctRatio: 0.45 },
// 	5: { gridLength: 4, correctRatio: 0.5 },
// 	6: { gridLength: 5, correctRatio: 0.35 },
// 	7: { gridLength: 5, correctRatio: 0.4 },
// 	8: { gridLength: 5, correctRatio: 0.45 },
// 	9: { gridLength: 5, correctRatio: 0.5 },
// 	10: { gridLength: 5, correctRatio: 0.55 },
// 	11: { gridLength: 6, correctRatio: 0.35 },
// 	12: { gridLength: 6, correctRatio: 0.4 },
// 	13: { gridLength: 6, correctRatio: 0.45 },
// 	14: { gridLength: 6, correctRatio: 0.5 },
// 	15: { gridLength: 6, correctRatio: 0.55 },
// 	16: { gridLength: 7, correctRatio: 0.35 },
// 	17: { gridLength: 7, correctRatio: 0.4 },
// 	18: { gridLength: 7, correctRatio: 0.45 },
// 	19: { gridLength: 7, correctRatio: 0.5 },
// 	20: { gridLength: 7, correctRatio: 0.55 },
// }

// function getRandomIndexes(gridLength, correctTilesRatio) {
// 	// Create an array of all possible indexes
// 	const indexes = Array.from({ length: gridLength * gridLength }, (_, index) => index)

// 	// Shuffle the array
// 	for (let i = indexes.length - 1; i > 0; i--) {
// 		const j = Math.floor(Math.random() * (i + 1))
// 		;[indexes[i], indexes[j]] = [indexes[j], indexes[i]]
// 	}

// 	return indexes.slice(0, gridLength * gridLength * correctTilesRatio)
// }

// function removeSpecialClasses() {
// 	const tiles = [...document.querySelectorAll('.memory-tile')]
// 	const levelPass = document.querySelector('.level-pass')

// 	tiles.map((tile) => {
// 		if (tile.classList.contains('wrong-tile')) {
// 			tile.classList.remove('wrong-tile')
// 		} else if (tile.classList.contains('correct-tile')) {
// 			tile.classList.remove('correct-tile', 'animate-flip')
// 			tile.classList.add('animate-unflip')

// 			setTimeout(() => {
// 				tile.classList.remove('animate-unflip')
// 				levelPass.classList.remove('animate')
// 			}, 300)
// 		}
// 	})
// }

// useEffect(() => {
//   // Fixed a bug
// 	if (level === 0) {
// 		return setLevel(1)
// 	}

// 	// If its level 1, have a 1 second delay, otherwise start immediately
// 	const delay = level === 1 ? 1000 : 0
// 	setTimeout(() => {
// 		setCorrectIndexesCount(0)
// 		setGridLength(() => {
// 			// Use the current level's config. If it doesnt exist in the config, use the last one
// 			const { gridLength, correctRatio } =
// 				levelConfig[level] || levelConfig[Object.keys(levelConfig).length]
// 			setCorrectIndexes(getRandomIndexes(gridLength, correctRatio))
// 			return gridLength
// 		})
// 	}, delay)
// }, [level])

// useEffect(() => {
// 	const correctTiles = [...document.querySelectorAll('.correct-tile')]
// 	if (correctTiles.length === 0) return
// 	correctTiles.map((tile) => {
// 		tile.classList.add('animate-flip')
// 	})

// 	setTimeout(() => {
// 		correctTiles.map((tile) => {
// 			tile.classList.add('animate-unflip')
// 			tile.classList.remove('correct-tile', 'animate-flip')
// 			setDisableTiles(false)

// 			setTimeout(() => {
// 				tile.classList.remove('animate-unflip')
// 			}, 300)
// 		})
// 	}, 2000)
// }, [correctIndexes])

// function handleTileClick(tileIndex) {
// 	const tile = document.getElementsByClassName('memory-tile')[tileIndex]
// 	if (!tile || disableTiles) return
// 	if (tile.classList.contains('correct-tile') || tile.classList.contains('wrong-tile')) return
// 	if (correctIndexes.includes(tileIndex)) {
// 		// If correct
// 		tile.classList.add('correct-tile')
// 		tile.classList.add('animate-flip')
// 		setCorrectIndexesCount((prevLength) => prevLength + 1)
// 	} else {
// 		// If wrong
// 		tile.classList.add('wrong-tile')
// 		setTriesLeft((prevTries) => prevTries - 1)
// 	}
// }

// useEffect(() => {
// 	// Means we passed the level
// 	if (correctIndexesCount === correctIndexes.length && correctIndexes.length > 0) {
// 		setDisableTiles(true)
// const levelPass = document.querySelector('.level-pass')
// levelPass.classList.add('animate')

// 		setTimeout(() => {
// 			// 1 second after passing the level, remove all correct and wrong tiles classes
// 			removeSpecialClasses()

// 			setTimeout(() => {
// 				// 1 second after removing all correct and wrong tiles, get to the next level
// 				setCorrectIndexes([]) // Removes the correct-tile class from all tiles

// 				setLevel((prevLevel) => prevLevel + 1)
// 			}, 1000)
// 		}, 1000)
// 	}
// }, [correctIndexesCount])

// useEffect(() => {
// 	const tiles = [...document.querySelectorAll('.memory-tile')]

// 	if (disableTiles) {
// 		tiles.map((tile) => {
// 			tile.style.cursor = 'default'
// 		})
// 	} else {
// 		tiles.map((tile) => {
// 			tile.style.cursor = ''
// 		})
// 	}
// }, [disableTiles])
