import React from 'react'

function MemoryTile({ isCorrect, handleTileClick }) {
	return (
		<div
			className={`memory-tile ${isCorrect ? 'correct-tile' : ''}`}
			onClick={handleTileClick}
		></div>
	)
}

export default MemoryTile
