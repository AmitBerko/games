import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'

const AuthContext = createContext()

export default function AuthProvider({ children }) {
	const [user, setUser] = useState()
  const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
      setIsLoading(false)
    })

		return () => unsubscribe()
	}, [])

	async function signup(email, password) {
		return await createUserWithEmailAndPassword(auth, email, password)
	}

	async function login(email, password) {
		return await signInWithEmailAndPassword(auth, email, password)
	}

  async function signOut() {
    return await auth.signOut()
  }

	return <AuthContext.Provider value={{ user, signup, login, signOut }}>{!isLoading && children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)