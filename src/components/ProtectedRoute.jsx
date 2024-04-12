import React, { useEffect } from 'react'
import { useAuth } from './AuthProvider'
import { useNavigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
	const { user } = useAuth()
	const navigate = useNavigate()

	useEffect(() => {
		if (!user) {
			navigate('/login', { replace: true })
		}
	}, [user, navigate])

	return <>{children}</>
}

export default ProtectedRoute
