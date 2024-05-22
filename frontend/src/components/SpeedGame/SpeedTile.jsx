import React from 'react'

function SpeedTile({ id, isActive, handleActiveClick }) {
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
		<div
			onClick={(e) => handleTileClick(e)}
			className={`tile ${isActive ? 'active' : ''}`}
			id={id}
		></div>
	)
}

export default SpeedTile
