import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

function SpeedGameResults({ resultsModalInfo, setResultsModalInfo, setReadyToStart }) {
	const handlePlayAgain = () => {
		// setShowResults(false)
		setReadyToStart(true)
		setResultsModalInfo((prevInfo) => ({ ...prevInfo, show: false }))
	}

	const goHomepage = () => {
		// add navigation to homepage
		setResultsModalInfo((prevInfo) => ({ ...prevInfo, show: false }))
	}

	return (
		<>
			{/* <Button variant="primary" onClick={() => setShowResults(true)}> */}
			{/* <Button
				variant="primary"
				onClick={() => setResultsModalInfo((prevInfo) => ({ ...prevInfo, show: true }))}
			>
				Launch demo modal
			</Button> */}

			<Modal show={resultsModalInfo.show}>
				<Modal.Header>Modal header</Modal.Header>
				<Modal.Body>modal body</Modal.Body>
				<Modal.Footer>
					modal footer. the score is {resultsModalInfo.score}
					<Button variant="secondary" onClick={goHomepage}>
						secondary button
					</Button>
					<Button variant="primary" onClick={handlePlayAgain}>
						Play Again
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}

export default SpeedGameResults
