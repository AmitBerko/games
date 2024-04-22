import React, { useState, useEffect } from 'react'
import Tile from '../components/Tile'
import SpeedGameResults from '../components/SpeedGameResults'
import { useAuth } from '../components/AuthProvider'

function SpeedGame() {
	const tileCount = 16
	const gameTime = 15000
  const [user, setUser] = useAuth()

	const getRandomIndexes = (clickedTile, prevIndexes) => {

		// Generates a random index instead of the one that was click
		const indexToReplace = prevIndexes.indexOf(clickedTile)
		const otherIndex = prevIndexes[indexToReplace === 0 ? 1 : 0]
		let newIndex
		do {
			newIndex = Math.floor(Math.random() * tileCount)
		} while (newIndex === clickedTile || newIndex === otherIndex)

		return [newIndex, otherIndex]
	}

  const getInitialIndexes = () => {
    const firstIndex = Math.floor(Math.random() * tileCount)
    let secondIndex
    do {
      secondIndex = Math.floor(Math.random() * tileCount)
    }
    while (firstIndex === secondIndex)

    return [firstIndex, secondIndex]
  }

	const [activeIndexes, setActiveIndexes] = useState(getInitialIndexes())
	const [timer, setTimer] = useState(gameTime) // start with 20 seconds
	const [readyToStart, setReadyToStart] = useState(false)
	const [hasStarted, setHasStarted] = useState(false)
	const [score, setScore] = useState(0)
	const [resultsModalInfo, setResultsModalInfo] = useState({ show: false, score: 0 })

	const handleActiveClick = (e) => {
		// If it wasn't clicked by a human or game hasn't started, return
		if (!e.isTrusted || !readyToStart) return

		if (score === 0 && readyToStart) {
			setHasStarted(true)
		}
		setScore((prevScore) => prevScore + 1)
    const clickedTile = parseInt(e.target.id.slice(4))
		setActiveIndexes((prevIndexes) => getRandomIndexes(clickedTile, prevIndexes))
	}

	useEffect(() => {
		const tilesContainer = document.getElementsByClassName('tiles-container')[0]
		const handleContainerClick = (e) => {
			const waveEffect = document.createElement('div')
			waveEffect.classList.add('wave')
			const { left, top } = tilesContainer.getBoundingClientRect()
			const x = e.clientX
			const y = e.clientY
			waveEffect.style.setProperty('--wave-x', x - left + 'px')
			waveEffect.style.setProperty('--wave-y', y - top + 'px')
			tilesContainer.appendChild(waveEffect)

			waveEffect.addEventListener('animationend', () => {
				waveEffect.remove()
			})
		}

		tilesContainer.addEventListener('mouseup', handleContainerClick)

		return () => {
			tilesContainer.removeEventListener('mouseup', handleContainerClick)
		}
	}, [])

	useEffect(() => {
		let interval

		if (hasStarted) {
			interval = setInterval(() => {
				setTimer((prevTimer) => {
					if (prevTimer > 0) {
						return prevTimer - 10
					} else {
						// GAME FINISHED
						setResultsModalInfo({ show: true, score: score })
						// setShowResults(true)
						setReadyToStart(false)
						setHasStarted(false)
						return 0
					}
				})
			}, 10)
		}

		if (!hasStarted) {
			setScore(0)
			setTimer(gameTime)
		}

		// Cleanup function to clear the interval when the component unmounts or hasStarted changes
		return () => clearInterval(interval)
	}, [hasStarted, score])

	// useEffect(() => {
	// 	if (!readyToStart && timer !== 0) {
	// 		setScore(0)
	// 		setTimer(gameTime)
	// 		setHasStarted(false)
	// 	}
	// }, [readyToStart])

	return (
		<>
    user is {user.name}
			<div className="speed-game-wrapper">
				<div className="speed-game-timer-score display-1 fw-medium">
					<div className="speed-game-timer">{timer}</div>
					<div className="speed-game-score">{score}</div>
				</div>
				<div className="tiles-container">
					{Array.from({ length: tileCount }).map((_, index) => (
						<Tile
							handleActiveClick={handleActiveClick}
							key={`tile${index}`}
							id={`tile${index}`}
							isActive={activeIndexes.includes(index)}
						/>
					))}
				</div>
			</div>
			<button onClick={() => setReadyToStart(true)}>start</button>
			<button onClick={() => setReadyToStart(false)}>stop</button>
			<SpeedGameResults
				setReadyToStart={setReadyToStart}
				resultsModalInfo={resultsModalInfo}
				setResultsModalInfo={setResultsModalInfo}
			/>
			{`ready: ${readyToStart} hasstarted: ${hasStarted}`}
		</>
	)
}

export default SpeedGame
