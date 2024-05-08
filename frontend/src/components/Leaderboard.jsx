import React, { useEffect, useState } from 'react'
import { Table, Container, Form, Col } from 'react-bootstrap'
import axios from '../api/axios'
import BackButton from './BackButton'
import LeaderboardRow from './LeaderboardRow'

function Leaderboard() {
	const [leaderboardMode, setLeaderboardMode] = useState('Memory Game Best')
	const [leaderboardData, setleaderboardData] = useState([])

	const formatMode = () => {
		return leaderboardMode.toLowerCase().split(' ')[0] + 'GameBest'
	}

	useEffect(() => {
		// Load the data
		const getLeaderboard = async () => {
			const formattedMode = formatMode()
			const response = await axios.post('/users/getLeaderboard', { leaderboardMode: formattedMode })
			console.log(response.data)
			setleaderboardData(response.data)
		}

		getLeaderboard()
	}, [leaderboardMode])

	return (
		// <>
		// <BackButton />
		// 	<Container className="py-5">
		// <Form.Select className="mb-5 w-auto" onChange={(e) => setLeaderboardMode(e.target.value)}>
		// 	<option>Memory Game</option>
		// 	<option>Speed Game</option>
		// </Form.Select>
		// 		<Col className="col col-sm-10 col-md-8 mx-auto">
		// 			<Table striped bordered hover className="text-center leaderboard w-100">
		// 				<thead className="p-5">
		// 					<tr>
		// 						<th>#</th>
		// 						<th>Name</th>
		// 						<th>Highest Level</th>
		// 					</tr>
		// 				</thead>
		// 				<tbody>
		// {leaderboardData.map((userData, index) => {
		// 	return (
		// 		<tr key={index + 1}>
		// 			<td>{index}</td>
		// 			<td>{userData.username}</td>
		// 			<td>{userData[formatMode()]}</td>
		// 		</tr>
		// 	)
		// })}
		// 				</tbody>
		// 			</Table>
		// 		</Col>
		// 		{/* </div> */}
		// 	</Container>
		// </>
		<Container className="p-0">
			{/* <div className="mode-back-container">
        <BackButton />
				<Form.Select className="mb-5" onChange={(e) => setLeaderboardMode(e.target.value)}>
					<option>Memory Game</option>
					<option>Speed Game</option>
				</Form.Select>
			</div> */}
			{/* <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}> */}
			<div className="leaderboard-container">
				<LeaderboardRow
					index="#"
					name="Name"
					level="select"
					setLeaderboardMode={setLeaderboardMode}
				/>
				{leaderboardData.map((userData, index) => {
					return (
						<LeaderboardRow
              key={index}
							index={index + 1}
							name={userData.username}
							level={userData[formatMode()]}
						/>
					)
				})}
			</div>
		</Container>
	)
}

export default Leaderboard
