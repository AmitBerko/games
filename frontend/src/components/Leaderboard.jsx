import React, { useEffect, useState } from 'react'
import { Table, Container, Form, Col, Spinner } from 'react-bootstrap'
import axios from '../api/axios'
import BackButton from './BackButton'
import LeaderboardRow from './LeaderboardRow'

function Leaderboard() {
	const [leaderboardMode, setLeaderboardMode] = useState('Memory Game Best')
	const [leaderboardData, setleaderboardData] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	const formatMode = () => {
		return leaderboardMode.toLowerCase().split(' ')[0] + 'GameBest'
	}

	useEffect(() => {
		// Load the data
		const getLeaderboard = async () => {
			setIsLoading(true)
			const formattedMode = formatMode()
			const response = await axios.post('/users/getLeaderboard', { leaderboardMode: formattedMode })
			setleaderboardData(response.data)
			setIsLoading(false)
		}

		getLeaderboard()
	}, [leaderboardMode])

	return (
		<>
			<BackButton navigateTo="/" />
			<Container fluid className="p-0">
				<div className="leaderboard-container">
					<LeaderboardRow
						index="#"
						name="Name"
						level="select"
						setLeaderboardMode={setLeaderboardMode}
					/>
					{!isLoading
						? leaderboardData.map((userData, index) => {
								return (
									<LeaderboardRow
										key={index}
										index={index + 1}
										name={userData.username}
										level={userData[formatMode()]}
									/>
								)
						  })
						: Array.from({ length: 5 }).map((_, index) => {
								return <LeaderboardRow key={index} index={index + 1} placeholder={true} />
						  })}
				</div>
			</Container>
		</>
	)
}

export default Leaderboard
