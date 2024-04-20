import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

function MemoryGameResults({showResults, handlePlayAgain, handleReturn}) {


	return (
		<>
			<Modal show={showResults} onHide={handleReturn} backdrop="static">
				<Modal.Header closeButton>
					<Modal.Title>Game Results</Modal.Title>
				</Modal.Header>
				<Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleReturn}>
						Return To Homepage
					</Button>
					<Button variant="primary" onClick={handlePlayAgain}>
						Play Again
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}

export default MemoryGameResults
