import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import axios from '../api/axios'

const AuthContext = createContext()

const getTokenFromLocalStorage = () => localStorage.getItem('accessToken')

export default function AuthProvider({ children }) {
	const [isLoading, setIsLoading] = useState(true)
	const [userData, setUserData] = useState()
  const [userAccessToken, setUserAccessToken] = useState(getTokenFromLocalStorage())
	const [authOperation, setAuthOperation] = useState('')

  useEffect(() => {
    if (userAccessToken) {
      
    }
  }, [userAccessToken])

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(async (user) => {
			if (!user) {
				setUserData()
			}

			// // Dont fetch again if it's a signup, because we already have the data
			// if (user && !userData && authOperation !== 'signup') {
			//   console.log(await user.getIdToken())
			// 	const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/users/${user.uid}`)
			// 	setUserData(response.data)
			// }
			setIsLoading(false)
		})

		return () => unsubscribe()
	}, [authOperation])

	async function signup(email, username, password) {
		try {
			const response = await axios.post('/users', {
				email,
				username,
				password,
			})
			setUserData(response.data)
			return response.data
		} catch (error) {
			return error.response.data
		}
	}

	async function login(email, password) {
		try {
			const response = await axios.post('/users/login', { email, password })
			setUserData(response.data)
			return response.data
		} catch (error) {
			return error.response.data
		}
	}

	async function signOut() {
		setUserData()
	}

	async function updateUserData(newData) {
		const updatedResponse = await axios.put(
			`${import.meta.env.VITE_SERVER_URL}/users/${userData.uid}`,
			newData
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
