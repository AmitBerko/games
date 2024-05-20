import React from 'react'
import { Form, Placeholder } from 'react-bootstrap'

function LeaderboardRow({ index, name, level, setLeaderboardMode, placeholder}) {
	return (
		<div className="leaderboard-row-container">
			<div className="leaderboard-row-item leaderboard-index">{index}</div>
			<div className="leaderboard-row-item leaderboard-name">
				{placeholder ? (
					<Placeholder as="div" animation="glow">
						<Placeholder xs={6} style={{ width: 'calc(50px + 5vw)' }} />
					</Placeholder>
				) : (
					name
				)}
			</div>
			{level === 'select' ? (
				<Form.Select
					className="leaderboard-select"
					onChange={(e) => setLeaderboardMode(e.target.value)}
				>
					<option>Memory</option>
					<option>Speed</option>
				</Form.Select>
			) : (
				<div className="leaderboard-row-item leaderboard-level">
					{placeholder ? (
						<Placeholder as="div" animation="glow">
							<Placeholder xs={6} style={{ width: 'calc(50px + 1.5vw)' }} />
						</Placeholder>
					) : (
						level
					)}
				</div>
			)}
		</div>
	)
}

export default LeaderboardRow
