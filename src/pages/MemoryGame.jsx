import React, { useEffect, useState } from 'react'
import MemoryTile from '../components/MemoryTile'

function MemoryGame() {
	const [level, setLevel] = useState(1)
	const [triesLeft, setTriesLeft] = useState(3)
	const [gridLength, setGridLength] = useState(3) // Start with a 3x3 grid
	const [correctIndexes, setCorrectIndexes] = useState([])
	const [disableTiles, setDisableTiles] = useState(true)
	const [correctIndexesCount, setCorrectIndexesCount] = useState(0) // To prevent dom manipulation

	function getRandomIndexes(gridLength) {
		// Create an array of all possible indexes
		const indexes = Array.from({ length: gridLength * gridLength }, (_, index) => index)

		// Shuffle the array
		for (let i = indexes.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))
			;[indexes[i], indexes[j]] = [indexes[j], indexes[i]]
		}

		return indexes.slice(0, gridLength * gridLength * 0.45)
	}

	useEffect(() => {
		document.documentElement.style.setProperty('--memory-grid-length', gridLength)
	}, [gridLength])

	useEffect(() => {
		let newGridLength
		if (level >= 3 && level <= 5) {
			newGridLength = 4
		} else if (level >= 6 && level <= 8) {
			newGridLength = 5
		} else {
			newGridLength = 3 // Default grid length
		}

		// Update gridLength state
		setGridLength(newGridLength)

		// Update correctIndexes with new grid length
		setCorrectIndexes(getRandomIndexes(newGridLength))
	}, [level])

	useEffect(() => {
		if (triesLeft === 0) {
			alert('you lost')
		}
	}, [triesLeft])

	// useEffect(() => {
	// 	// If you selected all correct tiles
	// 	if (correctIndexesLength === currentCorrectIndexes.length && currentCorrectIndexes.length > 0) {
	// 		setLevel((prevLevel) => prevLevel + 1)
	//     setCorrectIndexesLength(0)
	// 	}
	// }, [correctIndexesLength])

	useEffect(() => {
		const correctTiles = [...document.querySelectorAll('.correct-tile')]
		if (correctTiles.length === 0) return

		setTimeout(() => {
			correctTiles.map((tile) => {
				tile.classList.remove('correct-tile')
				setDisableTiles(false)
			})
		}, 2000)
	}, [correctIndexes])

	function handleTileClick(tileIndex) {
		const tile = document.getElementsByClassName('memory-tile')[tileIndex]
		if (!tile || disableTiles) return

		if (correctIndexes.includes(tileIndex)) {
			// If correct
			tile.classList.add('correct-tile')
			setCorrectIndexesCount((prevLength) => prevLength + 1)
		} else {
			// If wrong
			tile.classList.add('wrong-tile')
			setTriesLeft((prevTries) => prevTries - 1)
		}
	}

	useEffect(() => {
		if (correctIndexesCount === correctIndexes.length && correctIndexes.length > 0) {
			// get to the next level
			const wrongTiles = [...document.getElementsByClassName('wrong-tile')]
			// if (wrongTiles.length === 0) {
			//   console.log('wrong were 0')
			//   return
			// }

			wrongTiles.map((tile) => {
				tile?.classList.remove('wrong-tile')
			})
			setCorrectIndexesCount(0)
			setLevel((prevLevel) => prevLevel + 1)
		}
	}, [correctIndexesCount])

	return (
		<>
			indexes are {correctIndexes}
			<br></br>
			disabled is {disableTiles.toString()}
			{/* amount is {correctIndexesLength} */}
			<div className="memory-game-container">
				<div className="level-tries fs-1">
					<p className="level">Level {level}</p>
					<p className="tries">
						{triesLeft} <i className="fa-solid fa-heart"></i>
					</p>
				</div>
				<div className="memory-grid-container">
					{Array.from({ length: gridLength * gridLength }).map((_, index) => (
						<MemoryTile
							key={`tile${index}`}
							handleTileClick={() => handleTileClick(index)}
							isCorrect={correctIndexes.includes(index)}
							disableTiles={disableTiles}
						/>
					))}
				</div>
				<div></div>
			</div>
		</>
	)
}

export default MemoryGame
