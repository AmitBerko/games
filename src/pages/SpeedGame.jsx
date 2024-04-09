import React, { useState, useEffect } from 'react'
import Tile from '../components/Tile'
import SpeedGameResults from '../components/SpeedGameResults'

function SpeedGame() {
	const tileCount = 16
	const getRandomIndex = () => {
		return Math.floor(Math.random() * tileCount)
	}

	const gameTime = 5000
	const [activeIndex, setActiveIndex] = useState(getRandomIndex())
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
		setActiveIndex((prevIndex) => {
			let newIndex = getRandomIndex()
			while (newIndex === prevIndex) {
				newIndex = getRandomIndex()
			}
			return newIndex
		})
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
            setResultsModalInfo({show: true, score: score})
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
							isActive={index === activeIndex}
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
