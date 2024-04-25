import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import axios from 'axios'

const AuthContext = createContext()

export default function AuthProvider({ children }) {
	const [isLoading, setIsLoading] = useState(true)
	const [userData, setUserData] = useState('')

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(async (user) => {
			if (user && !userData) {
				const hasUserJustRegistered = user.metadata.creationTime === user.metadata.lastSignInTime
				if (!hasUserJustRegistered) {
					console.log('fetching data in useeffect')
					const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/users/${user.uid}`)
					setUserData(response.data)
				}
			}
			setIsLoading(false)
		})

		return () => unsubscribe()
	}, [])

	async function signup(email, username, password) {
		const creds = await createUserWithEmailAndPassword(auth, email, password)
		const user = creds.user

		// Create a new user in the db
		const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/users`, {
			uid: user.uid,
			username,
		})

		setUserData(response.data)

		return user
	}

	async function login(email, password) {
		await signInWithEmailAndPassword(auth, email, password)
	}

	async function signOut() {
		setUserData('')
		return await auth.signOut()
	}

	return (
		<AuthContext.Provider value={{ signup, login, signOut, userData }}>
			{!isLoading && children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => useContext(AuthContext)
