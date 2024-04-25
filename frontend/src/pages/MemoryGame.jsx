import React, { useEffect, useState } from 'react'
import MemoryTile from '../components/MemoryTile'
import MemoryGameResults from '../components/MemoryGameResults'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider'

function MemoryGame() {
	const [level, setLevel] = useState(1)
	const [triesLeft, setTriesLeft] = useState(3)
	const [gridLength, setGridLength] = useState(3) // Start with a 3x3 grid
	const [correctIndexes, setCorrectIndexes] = useState([])
	const [disableTiles, setDisableTiles] = useState(true)
	const [correctIndexesCount, setCorrectIndexesCount] = useState(0) // To prevent dom manipulation
  const navigate = useNavigate()
	// Results modal
	const [showResults, setShowResults] = useState(false)

	const handlePlayAgain = () => {
    // Bring all settings to default
		removeSpecialClasses()
		setCorrectIndexes([])
		setCorrectIndexesCount(0)
		setTriesLeft(3)
		setLevel(1)
		setShowResults(false)
	}

  const handleReturn = () => {
    setShowResults(false)
    navigate('/')
  }

	const levelConfig = {
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

	function removeSpecialClasses() {
		const tiles = [...document.querySelectorAll('.memory-tile')]
		const levelPass = document.querySelector('.level-pass')

		tiles.map((tile) => {
			if (tile.classList.contains('wrong-tile')) {
				tile.classList.remove('wrong-tile')
			} else if (tile.classList.contains('correct-tile')) {
				tile.classList.remove('correct-tile', 'animate-flip')
				tile.classList.add('animate-unflip')

				setTimeout(() => {
					tile.classList.remove('animate-unflip')
					levelPass.classList.remove('animate')
				}, 300)
			}
		})
	}

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

	useEffect(() => {
		// If its level 1, have a 1 second delay, otherwise start immediately
		const delay = level === 1 ? 1000 : 0
		setTimeout(() => {
			setCorrectIndexesCount(0)
			setGridLength(() => {
        // Use the current level's config. If it doesnt exist in the config, use the last one
				const { gridLength, correctRatio } =
					levelConfig[level] || levelConfig[Object.keys(levelConfig).length]
				setCorrectIndexes(getRandomIndexes(gridLength, correctRatio))
				return gridLength
			})
		}, delay)
	}, [level])

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
			setDisableTiles(true)

			// open up a results modal or something
			setShowResults(true)
		}

		return () => {
			heartIcon.removeEventListener('animationend', handleAnimationEnd)
		}
	}, [triesLeft])

	useEffect(() => {
		const correctTiles = [...document.querySelectorAll('.correct-tile')]
		if (correctTiles.length === 0) return
		correctTiles.map((tile) => {
			tile.classList.add('animate-flip')
		})

		setTimeout(() => {
			correctTiles.map((tile) => {
				tile.classList.add('animate-unflip')
				tile.classList.remove('correct-tile', 'animate-flip')
				setDisableTiles(false)

				setTimeout(() => {
					tile.classList.remove('animate-unflip')
				}, 300)
			})
		}, 2000)
	}, [correctIndexes])

	function handleTileClick(tileIndex) {
		const tile = document.getElementsByClassName('memory-tile')[tileIndex]
		if (!tile || disableTiles) return
		if (tile.classList.contains('correct-tile') || tile.classList.contains('wrong-tile')) return
		if (correctIndexes.includes(tileIndex)) {
			// If correct
			tile.classList.add('correct-tile')
			tile.classList.add('animate-flip')
			setCorrectIndexesCount((prevLength) => prevLength + 1)
		} else {
			// If wrong
			tile.classList.add('wrong-tile')
			setTriesLeft((prevTries) => prevTries - 1)
		}
	}

	useEffect(() => {
		// Means we passed the level
		if (correctIndexesCount === correctIndexes.length && correctIndexes.length > 0) {
			setDisableTiles(true)
			const levelPass = document.querySelector('.level-pass')
			levelPass.classList.add('animate')

			setTimeout(() => {
				// 1 second after passing the level, remove all correct and wrong tiles classes
				removeSpecialClasses()

				setTimeout(() => {
					// 1 second after removing all correct and wrong tiles, get to the next level
					setCorrectIndexes([]) // Removes the correct-tile class from all tiles

					setLevel((prevLevel) => prevLevel + 1)
				}, 1000)
			}, 1000)
		}
	}, [correctIndexesCount])

	useEffect(() => {
		const tiles = [...document.querySelectorAll('.memory-tile')]

		if (disableTiles) {
			tiles.map((tile) => {
				tile.style.cursor = 'default'
			})
		} else {
			tiles.map((tile) => {
				tile.style.cursor = ''
			})
		}
	}, [disableTiles])

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
							handleTileClick={() => handleTileClick(index)}
							isCorrect={correctIndexes.includes(index)}
						/>
					))}
				</div>
				<div></div>
			</div>
			<div className="level-pass"></div>
			<MemoryGameResults
				showResults={showResults}
				handlePlayAgain={handlePlayAgain}
				handleReturn={handleReturn}
        level={level}
			/>
		</>
	)
}

export default MemoryGame
