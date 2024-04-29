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
				const response = await axios.get(`/users/${user.uid}`)
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

		setUserData(response.data)
	}

	async function login(email, password) {
		setAuthOperation('login')
		await signInWithEmailAndPassword(auth, email, password)
	}

	async function signOut() {
		return await auth.signOut()
	}

	async function updateUserData(newData) {
    const token = auth.currentUser && await auth.currentUser.getIdToken()
		const updatedResponse = await axios.put(`/users/${userData.uid}`, newData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
		setUserData(updatedResponse.data)
	}

	return (
		<AuthContext.Provider value={{ signup, login, signOut, userData, updateUserData }}>
			{!isLoading && children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => useContext(AuthContext)
