import React, { useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { useNavigate } from 'react-router-dom'
import { useSocket } from './SocketProvider'
import { useAuth } from './AuthProvider'

function SpeedGameResults({ resultsModalInfo, setResultsModalInfo }) {
	const socket = useSocket()
	const { userData } = useAuth()
	const navigate = useNavigate()

	const handlePlayAgain = () => {
		socket.emit('startGame')
		setResultsModalInfo((prevInfo) => ({ ...prevInfo, show: false }))
	}

	const handleReturn = () => {
		navigate('/')
	}

	useEffect(() => {
		if (resultsModalInfo.show) {
			// This means the game has ended and the highscore should be updated
		}
	}, [resultsModalInfo])

	return (
		<>
			<Modal show={resultsModalInfo.show} onHide={handleReturn} backdrop="static" centered>
				<Modal.Header>
					<Modal.Title className="text-center w-100 fw-medium display-6">Game Results</Modal.Title>
				</Modal.Header>
				<Modal.Body className="text-center">
					<div className="fs-4">You have clicked {resultsModalInfo.score} times!</div>
					<div className="fs-5">
						Your current best is: {/* Doing this to evade delayed results */}
						{resultsModalInfo.score > userData.speedGameBest
							? resultsModalInfo.score
							: userData.speedGameBest} clicks
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="primary"
						className="col-12 mx-0 col-sm me-sm-1"
						onClick={handlePlayAgain}
					>
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

export default SpeedGameResults
