import React from 'react'
import { useAuth } from './Auth/AuthProvider'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ component: Component, ...props }) {
	const { userData } = useAuth()

	return userData ? <Component {...props} /> : <Navigate to="/login" />
}

export default ProtectedRoute
