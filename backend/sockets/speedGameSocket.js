import User from '../models/userModel.js'

const handleSpeedGameSocket = (io) => {
	let sessionsData = {} // { session: clicks }

	io.on('connection', (socket) => {
		console.log('Connected')

		socket.on('disconnect', () => {
			console.log('Disconnected')
		})

		socket.on('click', ({ score }) => {
			console.log('clicked, the session is ', socket.user.uid, score)
			if (score === 1) {
				sessionsData[socket.user.uid] = 1
				return
			}

			sessionsData[socket.user.uid]++
		})

		socket.on('endGame', ({ score }) => {
			if (!sessionsData[socket.user.uid]) return

			console.log(sessionsData[socket.user.uid], score)
			delete sessionsData[socket.user.uid]
		})

		socket.on('updateScore', async ({ score }) => {
      console.log('updating best to ', score)
			await User.findOneAndUpdate({ uid: socket.user.uid }, { speedGameBest: score })
		})
	})
}

export default handleSpeedGameSocket
