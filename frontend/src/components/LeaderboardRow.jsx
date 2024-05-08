import React from 'react'
import { Table, Container, Form, Col } from 'react-bootstrap'

function LeaderboardRow({ index, name, level, setLeaderboardMode }) {
	return (
		<div className="leaderboard-row-container">
			<div className="leaderboard-row-item leaderboard-index">{index}</div>
			<div className="leaderboard-row-item leaderboard-name">{name}</div>
			{level === 'select' ? (
				<Form.Select
					className="leaderboard-select"
					onChange={(e) => setLeaderboardMode(e.target.value)}
				>
					<option>Memory</option>
					<option>Speed</option>
				</Form.Select>
			) : (
				<div className="leaderboard-row-item leaderboard-level">{level}</div>
			)}
		</div>
	)
}

export default LeaderboardRow
