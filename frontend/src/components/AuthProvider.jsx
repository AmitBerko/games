import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import axios from '../api/axios'

const AuthContext = createContext()

export default function AuthProvider({ children }) {
	const [isLoading, setIsLoading] = useState(true)
	const [userData, setUserData] = useState()
	const [authOperation, setAuthOperation] = useState('')

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(async (user) => {
			if (!user) {
				setUserData()
			}

			// Dont fetch again if it's a signup, because we already have the data
			if (user && !userData && authOperation !== 'signup') {
				const token = await user.getIdToken()
				const requestHeaders = {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
				const response = await axios.get(`/users/${user.uid}`, requestHeaders)
				response.data.token = token
				setUserData(response.data)
			}
			setIsLoading(false)
		})

		return () => unsubscribe()
	}, [authOperation])

	async function signup(email, username, password) {
		setAuthOperation('signup')
		const creds = await createUserWithEmailAndPassword(auth, email, password)
		const user = creds.user

		// Create a new user in the db
		const response = await axios.post(`/users`, {
			uid: user.uid,
			username,
		})

		const token = await user.getIdToken()
		response.data.token = token
		setUserData(response.data)
	}

	async function login(email, password) {
		setAuthOperation('login')
		await signInWithEmailAndPassword(auth, email, password)
	}

	async function signOut() {
		return await auth.signOut()
	}

	return (
		<AuthContext.Provider value={{ signup, login, signOut, userData, setUserData }}>
			{!isLoading && children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => useContext(AuthContext)
