import React from 'react'

function SpeedTile({ id, isActive, handleActiveClick }) {
	const handleWrongClick = () => {
		// alert('bad')
	}

	const handleTileClick = (e) => {
    if (e.touches?.length > 1) {
      return // Dont allow multi taps
    }

		if (isActive) {
			handleActiveClick(e)
		} else {
			handleWrongClick()
		}
	}

	return (
		<div
			onTouchStart={(e) => handleTileClick(e)} // Handle touch events
			onMouseDown={(e) => handleTileClick(e)} // Handle mouse events
			className={`tile ${isActive ? 'active' : ''}`}
			id={id}
		></div>
	)
}

export default SpeedTile
