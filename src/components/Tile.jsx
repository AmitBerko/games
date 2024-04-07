import React, { useEffect } from 'react'

function Tile({ difficulty = 'medium', id, isActive, handleActiveClick }) {
	// useEffect(() => {
	// 	const tile = document.getElementById(id)
	// 	tile.style.setProperty('--tile-gradient-x', '50%')
	// 	tile.style.setProperty('--tile-gradient-y', '50%')

	// 	const handleMouseMove = (e) => {
	// 		const left = tile.getBoundingClientRect().x
	// 		const top = tile.getBoundingClientRect().y
	// 		const x = e.clientX
	// 		const y = e.clientY
			// tile.style.setProperty('--tile-gradient-x', `${x - left}px`)
			// tile.style.setProperty('--tile-gradient-y', `${y - top}px`)

	// 		console.log({ x, y })
	// 		// Set the defaults until the mouse is hovered
	// 	}

	// 	tile.addEventListener('mousemove', handleMouseMove)
	// 	return () => {
	// 		tile.removeEventListener('mousemove', handleMouseMove)
	// 	}
	// }, [])

	// useEffect(() => {
	// 	const tile = document.getElementById(id)
	// 	tile.addEventListener('mousedown', () => {
	// 		tile.classList.add('clicked')
	// 	})

	// 	document.addEventListener('mouseup', () => {
	// 		tile.classList.remove('clicked')
	// 	})
	// }, [])

	const handleWrongClick = () => {
		// alert('bad')
	}

	const handleTileClick = (e) => {
		if (isActive) {
			handleActiveClick(e)
		} else {
			handleWrongClick()
		}
	}

	return (
		<div onClick={(e) => handleTileClick(e)} className={`tile ${isActive ? 'active' : ''}`} id={id}></div>
	)
}

export default Tile
