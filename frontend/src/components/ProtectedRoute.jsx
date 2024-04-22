import React from 'react'
import { useAuth } from './AuthProvider'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ component: Component, ...props }) {
	const { user } = useAuth()

	return user ? <Component {...props} /> : <Navigate to="/login" />
}

export default ProtectedRoute
