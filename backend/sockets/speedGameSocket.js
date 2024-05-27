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

		socket.on('endGame', async ({ score, currentBest }) => {
			console.log(`the game has ended. current score is ${score}`)
			if (!sessionsData[socket.user.uid]) return
      
			console.log(sessionsData[socket.user.uid], score)

      console.log(`the score is ${score} and currentbest is ${currentBest}`)
			if (score > currentBest) {
				console.log('updating best to ', score)
				await User.findOneAndUpdate(
					{ uid: socket.user.uid },
					{ speedGameBest: sessionsData[socket.user.uid] }
				)
			}
			delete sessionsData[socket.user.uid]
		})
	})
}

export default handleSpeedGameSocket
