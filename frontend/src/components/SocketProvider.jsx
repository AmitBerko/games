import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthProvider'
import io from 'socket.io-client'

const SocketContext = createContext()

function SocketProvider({ children }) {
	const [socket, setSocket] = useState(null)
	const { userData } = useAuth()

	useEffect(() => {
		if (!userData) return
    console.log(userData)
		const newSocket = io(import.meta.env.VITE_SERVER_URL, {
			auth: { token: userData.token }, // Pass the token here
		})
		setSocket(newSocket)

		return () => {
			newSocket.disconnect()
		}
	}, [userData])

	return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
}

export const useSocket = () => useContext(SocketContext)

export default SocketProvider
