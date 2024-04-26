import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import axios from 'axios'

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
				const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/users/${user.uid}`)
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
		const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/users`, {
			uid: user.uid,
			username,
		})

		setUserData(response.data)
	}

	async function login(email, password) {
		setAuthOperation('login')
		await signInWithEmailAndPassword(auth, email, password)
	}

	async function signOut() {
		return await auth.signOut()
	}

	async function updateUserData() {
    // Call this function after a change is done in order to use the updated userData state
		const updatedResponse = await axios.get(
			`${import.meta.env.VITE_SERVER_URL}/users/${userData.uid}`
		)
		setUserData(updatedResponse.data)
	}

	return (
		<AuthContext.Provider value={{ signup, login, signOut, userData, updateUserData }}>
			{!isLoading && children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => useContext(AuthContext)
