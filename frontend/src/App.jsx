import Form from './components/Auth/Form'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import AuthProvider from './components/Auth/AuthProvider'
import Homepage from './pages/Homepage'
import ProtectedRoute from './components/ProtectedRoute'
import SpeedGame from './pages/SpeedGame'
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/styles.css'
import MemoryGame from './pages/MemoryGame'
import Leaderboard from './components/Leaderboard'
import SocketProvider from './components/SocketProvider'

const router = createBrowserRouter([
	{
		path: '/',
		element: <ProtectedRoute component={Homepage} />,
	},
	{
		path: '/login',
		element: <Form />,
	},
	{
		path: '/speed-game',
		element: <ProtectedRoute component={SpeedGame} />,
	},
	{
		path: '/memory-game',
		element: <ProtectedRoute component={MemoryGame} />,
	},
	{
		path: '/leaderboard',
		element: <Leaderboard />,
	},
])

function App() {
	return (
		<AuthProvider>
			<SocketProvider>
				<RouterProvider router={router} />
			</SocketProvider>
		</AuthProvider>
	)
}

export default App
