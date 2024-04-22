import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

function MemoryGameResults({showResults, handlePlayAgain, handleReturn}) {


	return (
		<>
			<Modal show={showResults} onHide={handleReturn} backdrop="static" centered>
				<Modal.Header>
					<Modal.Title className="text-center w-100 fw-medium display-6">Game Results</Modal.Title>
				</Modal.Header>
				<Modal.Body className="text-center">
					<div className="fs-4">You have reached level x</div>
					<div className="fs-5">Your current best is: level y</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" onClick={handlePlayAgain} className="col-12 mx-0 col-sm me-sm-1">
						Play Again
					</Button>
					<Button variant="secondary" onClick={handleReturn} className="col-12 mx-0 col-sm ms-sm-2">
						Return To Homepage
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}

export default MemoryGameResults
