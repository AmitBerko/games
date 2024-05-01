import React from 'react'

function MemoryTile({ isCorrect, handleTileClick, id }) {
	return (
		<div
			className='memory-tile'
			onClick={handleTileClick}
      id={id}
		></div>
	)
}

export default MemoryTile
