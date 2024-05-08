import Form from './components/Form'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import AuthProvider from './components/AuthProvider'
import Homepage from './pages/Homepage'
import ProtectedRoute from './components/ProtectedRoute'
import SpeedGame from './pages/SpeedGame'
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/styles.css'
import MemoryGame from './pages/MemoryGame'
import Leaderboard from './components/Leaderboard'

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
    element: <Leaderboard />
  },
])

function App() {
	return (
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
	)
}

export default App
