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
			<div className="d-flex justify-content-center vh-100 align-items-center">
				<Container className="w-100 d-flex justify-content-center">
					<Table className="leaderboard m-0">
						<thead>
							<LeaderboardRow rowType="header" setLeaderboardMode={setLeaderboardMode} />
						</thead>
						<tbody>
							{!isLoading
								? leaderboardData.map((userData, index) => {
										return (
											<LeaderboardRow
												key={index}
												index={index + 1}
												name={userData.username}
												level={userData[formatMode()]}
												rowType="normal"
											/>
										)
								  })
								: Array.from({ length: 5 }).map((_, index) => {
										return <LeaderboardRow key={index} index={index + 1} rowType="placeholder" />
								  })}
						</tbody>
					</Table>
				</Container>
			</div>
		</>
	)
}

export default Leaderboard
