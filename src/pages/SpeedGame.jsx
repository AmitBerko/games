import React, { useState, useEffect } from 'react'
import Tile from '../components/Tile'

function SpeedGame() {
	const tileCount = 16
	const getRandomIndex = () => {
		return Math.floor(Math.random() * tileCount)
	}

	const [activeIndex, setActiveIndex] = useState(getRandomIndex())

	const handleActiveClick = (e) => {
    if (!e.isTrusted) return
		setActiveIndex((prevIndex) => {
			let newIndex = getRandomIndex()
			while (newIndex === prevIndex) {
				newIndex = getRandomIndex()
			}
			return newIndex
		})
	}

	// useEffect(() => {
	// 	const tilesContainer = document.getElementsByClassName('tiles-container')[0]
	// 	const handleMouseMove = (e) => {
	// 		const { clientX, clientY } = e
	// 		const { x, y } = tilesContainer.getBoundingClientRect()
	// 		tilesContainer.style.setProperty('--tile-gradient-x', `${clientX - x}px`)
	// 		tilesContainer.style.setProperty('--tile-gradient-y', `${clientY - y}px`)
	// 	}
	// 	tilesContainer.addEventListener('mousemove', handleMouseMove)

	// 	return () => {
	// 		tilesContainer.removeEventListener('mousemove', handleMouseMove)
	// 	}
	// }, [])

	useEffect(() => {
		const tilesContainer = document.getElementsByClassName('tiles-container')[0]
		const handleContainerClick = (e) => {
			const waveEffect = document.createElement('div')
			waveEffect.classList.add('wave')
      const { left, top } = tilesContainer.getBoundingClientRect()
			const x = e.clientX
			const y = e.clientY
			waveEffect.style.setProperty('--wave-x', (x - left) + 'px')
			waveEffect.style.setProperty('--wave-y', (y - top) + 'px')
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

	return (
		<div className="speed-game-wrapper">
      <h1 className="speed-game-timer">30.00</h1>
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
	)
}

export default SpeedGame
