import { useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { useAuth } from '../Auth/AuthProvider'
import axios from '../../api/axios'
import { useNavigate } from 'react-router-dom'

function MemoryGameResults({ showResults, requestHeader, level, handlePlayAgain }) {
	const navigate = useNavigate()
	const { userData, setUserData } = useAuth()
	useEffect(() => {
		const endGame = async () => {
			if (!showResults) return

			const response = await axios.get('/memory/endGame', requestHeader)
			setUserData((prevUserData) => {
				return { ...prevUserData, memoryGameBest: response.data.memoryGameBest }
			})
		}

		endGame()
	}, [showResults])

	const handleReturn = () => {
		navigate('/')
	}

	return (
		<>
			<Modal show={showResults} onHide={handleReturn} backdrop="static" centered>
				<Modal.Header>
					<Modal.Title className="text-center w-100 fw-medium display-6">Game Results</Modal.Title>
				</Modal.Header>
				<Modal.Body className="text-center">
					<div className="fs-4">You have reached level {level}</div>
					<div className="fs-5">
						Your current best is: level{' '}
            {/* Doing this to evade delayed results */}
						{level > userData.memoryGameBest ? level : userData.memoryGameBest}
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

export default MemoryGameResults
