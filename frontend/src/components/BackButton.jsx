import React from 'react'
import { useNavigate } from 'react-router-dom'

function BackButton({ navigateTo }) {
	const navigate = useNavigate()

	return (
		<i
			className="back-button fa-solid fa-right-from-bracket"
			onClick={() => navigate(navigateTo)}
		></i>
	)
}

export default BackButton
