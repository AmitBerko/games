import Form from './components/Form'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import AuthProvider from './components/AuthProvider'
import Homepage from './pages/Homepage'
import ProtectedRoute from './components/ProtectedRoute'
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/styles.css'

const router = createBrowserRouter([
	{
		path: '/',
		element: (
			<ProtectedRoute>
				<Homepage />
			</ProtectedRoute>
		),
	},
	{
		path: '/login',
		element: <Form />,
	},
])

function App() {
	let currentUser = {name: 'amit', id: 1} // replace it with firebase authentication later

	return (
		<AuthProvider currentUser={currentUser}>
			<RouterProvider router={router} />
		</AuthProvider>
	)
}

export default App
