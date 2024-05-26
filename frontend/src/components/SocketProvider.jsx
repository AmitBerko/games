import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './Auth/AuthProvider'
import io from 'socket.io-client'

const SocketContext = createContext()

function SocketProvider({ children }) {
	const [socket, setSocket] = useState(null)
	const { userData } = useAuth()
  const token = userData ? userData.token : ''

	useEffect(() => {
		if (!userData) return
		const newSocket = io(import.meta.env.VITE_SERVER_URL, {
			auth: { token: userData.token }, // Pass the token here
		})
		setSocket(newSocket)

		return () => {
      console.log('Disconnecting the socket')
			newSocket.disconnect()
		}
	}, [token])

	return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
}

export const useSocket = () => useContext(SocketContext)

export default SocketProvider
