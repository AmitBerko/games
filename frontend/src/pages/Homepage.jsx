import React from 'react'
import { useAuth } from '../components/AuthProvider'
import { useNavigate } from 'react-router-dom'

function Homepage() {
	const { userData, signOut } = useAuth()
	const navigate = useNavigate()

	async function handleSignOut() {
		await signOut()
	}

	return (
		<div className="homepage">
			<div className="user-greeting">
				Hello {userData.username}
				<button onClick={handleSignOut}>LOG OUT</button>
			</div>
			{/* <div className="bubble"></div>
			<div className="bubble"></div>
			<div className="bubble"></div>
			<div className="bubble"></div>
			<div className="bubble"></div>
			<div className="bubble"></div>
			<div className="bubble"></div>
			<div className="bubble"></div> */}
			<div className="games-menu-container container">
				<div className="games-menu-title display-3 fw-bold">Games Menu</div>
				<div className="games-menu-content">
					<button onClick={() => navigate('/speed-game')} className="games-menu-btn fs-1">
						<span>Speed Game</span>
					</button>
					<button onClick={() => navigate('/memory-game')} className="games-menu-btn fs-1">
						<span>Memory Game</span>
					</button>
					<button onClick={() => navigate('/leaderboard')} className="games-menu-btn fs-1">
						<span>Leaderboard</span>
					</button>
				</div>
			</div>
		</div>
	)
}

export default Homepage
