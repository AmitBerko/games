import React from 'react'
import { Form, Placeholder } from 'react-bootstrap'

function LeaderboardRow({ index, name, level, setLeaderboardMode, rowType }) {
	if (rowType === 'header') {
		return (
			<tr className="text-center align-middle">
				<th className="index">#</th>
				<th className="name">Name</th>
				<th className="level">
					<Form.Select
						className="select"
						// style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
						onChange={(e) => setLeaderboardMode(e.target.value)}
					>
						<option>Memory</option>
						<option>Speed</option>
					</Form.Select>
				</th>
			</tr>
		)
	} else if (rowType === 'normal') {
		return (
			<tr className="text-center align-middle">
				<th className="index">{index}</th>
				<th className="name">{name}</th>
				<th className="level">{level}</th>
			</tr>
		)
	} else if (rowType === 'placeholder') {
		return (
			<tr className="text-center align-middle">
				<th className="index">{index}</th>
				<th className="name">
					<Placeholder as="div" animation="glow">
						<Placeholder xs={12} style={{ width: 'calc(40px + 5vw)' }} />
					</Placeholder>
				</th>
				<th className="level">
					<Placeholder as="div" animation="glow">
						<Placeholder xs={12} style={{ width: 'calc(65px + 2vw)' }} />
					</Placeholder>
				</th>
			</tr>
		)
	}
}

export default LeaderboardRow
