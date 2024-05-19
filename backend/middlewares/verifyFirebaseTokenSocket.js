import { admin } from "./verifyFirebaseToken.js";

const verifyFirebaseTokenSocket = async (socket, next) => {
	try {
		const token = socket.handshake.auth.token
		if (!token) {
			throw new Error('No token received')
		}
		const decodedToken = await admin.auth().verifyIdToken(token)
		socket.user = decodedToken
		next()
	} catch (error) {
		console.error('Error verifying Firebase ID token:', error)
	}
}

export default verifyFirebaseTokenSocket