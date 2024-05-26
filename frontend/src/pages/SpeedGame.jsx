import React, { useState, useEffect } from 'react'
import SpeedGameResults from '../components/SpeedGame/SpeedGameResults'
import { useAuth } from '../components/Auth/AuthProvider'
import BackButton from '../components/BackButton'
import { useSocket } from '../components/SocketProvider'
import SpeedTile from '../components/SpeedGame/SpeedTile'

function SpeedGame() {
	const tileCount = 16
	const gameTime = 15000
	const socket = useSocket()
	const [activeIndexes, setActiveIndexes] = useState(getInitialIndexes())
	const [timer, setTimer] = useState(gameTime)
	const [formattedTimer, setFormattedTimer] = useState(formatTimer(gameTime))
	const [hasStarted, setHasStarted] = useState(false)
	const [score, setScore] = useState(0)
	const [resultsModalInfo, setResultsModalInfo] = useState({ show: false, score: 0 })

	useEffect(() => {
		if (!socket) return
		socket.on('connect', () => {
			console.log('Connected to the server')
		})

		socket.on('disconnect', () => {
			console.log('Disconnected from server')
		})
	}, [socket])

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

	function getInitialIndexes() {
		const firstIndex = Math.floor(Math.random() * tileCount)
		let secondIndex
		do {
			secondIndex = Math.floor(Math.random() * tileCount)
		} while (firstIndex === secondIndex)

		return [firstIndex, secondIndex]
	}

	// useEffect(() => {
	// 	if (isNewHighScore) {
	// 		setUserData((prevUserData) => {
	// 			return { ...prevUserData, speedGameBest: score }
	// 		})

	// 		setIsNewHighScore(false)
	// 	}
	// }, [isNewHighScore])

	const handleActiveClick = (e, index) => {
		// If it wasn't clicked by a human or game hasn't started, return
		if (!e.isTrusted) return

		socket.emit('click', { score: score + 1 })
		if (score === 0) {
			setHasStarted(true)
		}
		setScore((prevScore) => prevScore + 1)
		setActiveIndexes((prevIndexes) => getRandomIndexes(index, prevIndexes))
	}

	function formatTimer(milliseconds) {
		const totalSeconds = Math.floor(milliseconds / 1000)
		const remainingMilliseconds = milliseconds % 1000

		const paddedSeconds = String(totalSeconds).padStart(2, '0')
		const paddedMilliseconds = String(Math.floor(remainingMilliseconds / 10)).padStart(2, '0')

		return `${paddedSeconds}.${paddedMilliseconds}`
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
	let startTime

	if (hasStarted) {
		startTime = Date.now()
		interval = setInterval(() => {
			const elapsedTime = Date.now() - startTime
			const remainingTime = gameTime - elapsedTime
			setTimer(Math.max(remainingTime, 0))

			if (remainingTime <= 0) {
				clearInterval(interval)
			}
		}, 10)
	} else {
		setScore(0)
		setTimer(gameTime)
	}

	// Cleanup function to clear the interval when the component unmounts or hasStarted changes
	return () => clearInterval(interval)
}, [hasStarted])

	useEffect(() => {
		setFormattedTimer(formatTimer(timer))
		if (timer <= 0) {
			// Game end
			setResultsModalInfo({ show: true, score: score })
			setHasStarted(false)
		}
	}, [timer])

	return (
		<>
			<BackButton navigateTo="/" />
			<div className="speed-game-wrapper">
				<div className="speed-game-timer-score display-1 fw-medium">
					<div className="speed-game-timer">{formattedTimer}</div>
					<div className="speed-game-score">{score}</div>
				</div>
				<div className="tiles-container">
					{Array.from({ length: tileCount }).map((_, index) => (
						<SpeedTile
							handleActiveClick={(e) => handleActiveClick(e, index)}
							key={`tile${index}`}
							isActive={activeIndexes.includes(index)}
						/>
					))}
				</div>
				<div className="speed-game-notification fs-2 text-center">
					{!hasStarted && 'Click any tile to start the game'}
				</div>
			</div>
			{/* <button onClick={() => setReadyToStart(true)}>start</button>
			<button onClick={() => setReadyToStart(false)}>stop</button> */}
			<SpeedGameResults
				// setReadyToStart={setReadyToStart}
				resultsModalInfo={resultsModalInfo}
				setResultsModalInfo={setResultsModalInfo}
			/>
			{/* {`ready: ${readyToStart} hasstarted: ${hasStarted}`} */}
		</>
	)
}

export default SpeedGame
