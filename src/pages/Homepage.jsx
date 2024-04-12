import React from 'react'
import { useAuth } from '../components/AuthProvider'

function Homepage() {
	const { user, setUser } = useAuth()

	if (!user) {
		return null
	}

	return (
		<div className="homepage">
			<div className="bubble"></div>
			<div className="bubble"></div>
			<div className="bubble"></div>
			<div className="bubble"></div>
			<div className="bubble"></div>
			<div className="bubble"></div>
			<div className="bubble"></div>
			<div className="bubble"></div>

			<div className="games-menu-container container">
				<div className="games-menu-title display-3 fw-bold">Games Menu</div>
				<div className="games-menu-content">
					<button className="games-menu-btn fs-1">
						<span>Speed Game</span>
					</button>
					<button className="games-menu-btn fs-1">
						<span>Memory Game</span>
					</button>
					<button className="games-menu-btn fs-1">
						<span>Leaderboard</span>
					</button>
				</div>
			</div>
		</div>
	)
}

export default Homepage
