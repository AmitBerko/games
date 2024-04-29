import admin from 'firebase-admin'
import dotenv from 'dotenv'

dotenv.config()

admin.initializeApp({
	credential: admin.credential.cert({
		type: 'service_account',
		project_id: 'games-bb191',
		private_key_id: process.env.PRIVATE_KEY_ID,
		privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
		client_email: process.env.CLIENT_EMAIL,
		client_id: process.env.CLIENT_ID,
		auth_uri: 'https://accounts.google.com/o/oauth2/auth',
		token_uri: 'https://oauth2.googleapis.com/token',
		auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
		client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
		universe_domain: 'googleapis.com',
	}),
})

const verifyFirebaseToken = async (req, res, next) => {
	try {
		const token = req.headers.authorization && req.headers.authorization.split(' ')[1]
    if (!token) {
      throw 'No token received'
    }
		const decodedToken = await admin.auth().verifyIdToken(token)
		req.user = decodedToken
		next()
	} catch (error) {
		console.error('Error verifying Firebase ID token:', error)
		res.status(401).json({ error: 'Unauthorized' })
	}
}

export default verifyFirebaseToken
