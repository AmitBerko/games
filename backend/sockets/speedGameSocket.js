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
      let newScore = sessionsData[socket.user.uid]
      // This shouldn't happen unless the client is trying to cheat
      if (sessionsData[socket.user.uid] !== score) {
        // Just take the minimum out of the two
        newScore = Math.min(score, sessionsData[socket.user.uid])
      }

			if (newScore > currentBest) {
				console.log('updating best to ', newScore)
				await User.findOneAndUpdate(
					{ uid: socket.user.uid },
					{ speedGameBest: newScore }
				)
			}
			delete sessionsData[socket.user.uid]
		})
	})
}

export default handleSpeedGameSocket
