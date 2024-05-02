import { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { useAuth } from './AuthProvider'
import axios from '../api/axios'
import { useNavigate } from 'react-router-dom'

function MemoryGameResults({ showResults, requestHeader }) {
	const navigate = useNavigate()
  const [gameData, setGameData] = useState({})
	useEffect(() => {
		const endGame = async () => {
			if (!showResults) return

			const response = await axios.get('/memory/endGame', requestHeader)
			console.log(response.data)
      setGameData(response.data)
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
					<div className="fs-4">You have reached level {gameData.currentLevel}</div>
					<div className="fs-5">
						Your current best is: level{' '}
            {gameData.memoryGameBest}
						{/* {level > userData.memoryGameBest ? level : userData.memoryGameBest}{' '} */}
						{/* {userData.memoryGameBest} */}
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="primary"
						// onClick={handlePlayAgain}
						className="col-12 mx-0 col-sm me-sm-1"
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
