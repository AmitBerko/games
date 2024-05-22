import React from 'react'

function MemoryTile({ handleTileClick, id, isDisabled }) {
	return (
		<div
			className='memory-tile'
			onClick={handleTileClick}
      id={id}
      style={{cursor: (isDisabled ? 'default' : '')}}
		></div>
	)
}

export default MemoryTile
