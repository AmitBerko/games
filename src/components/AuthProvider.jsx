import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export default function AuthProvider({ children, currentUser }) {
	const [user, setUser] = useState(currentUser ? currentUser : undefined)

	return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
