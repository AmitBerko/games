import React, { useState } from 'react'
import { useAuth } from './AuthProvider'
import { Alert } from 'react-bootstrap'
import { Spinner } from 'react-bootstrap'

function LoginForm() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [errorMessage, setErrorMessage] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const { login } = useAuth()

	async function handleLogin(e) {
		e.preventDefault()

		try {
			setIsLoading(true)
			await login(email, password)
			setErrorMessage('')
		} catch (error) {
			console.log(error.code)
			setIsLoading(false)
			switch (error.code) {
				case 'auth/invalid-email':
					setErrorMessage('Please enter a valid email address.')
					break
				case 'auth/invalid-credential':
					setErrorMessage('Invalid email or password.')
					break

				default:
					setErrorMessage('An error occurred. Please try again later.')
			}
		}
	}

	return (
		<form className="form-container login-form" onSubmit={(e) => handleLogin(e)}>
			<div className="form-header">Login</div>
			<div className="form-padding">
				<div className="form-content">
					<div className="input-box">
						<input
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder=" "
							id="login-email"
							required
						></input>
						<label htmlFor="login-email">Email</label>
						<i className="fa-solid fa-envelope"></i>
					</div>
					<div className="input-box">
						<input
							value={password}
							onChange={(e) => setPassword(e.target.value)}
              type="password"
							placeholder=" "
							id="login-password"
							required
						></input>
						<label htmlFor="login-password">Password</label>
						<i className="fa-solid fa-lock"></i>
					</div>
					<button type="submit" disabled={isLoading}>
						{isLoading ? <Spinner className="form-spinner" /> : 'Login'}
					</button>
					<div className="login-register">
						Don't have an account?{' '}
						<label htmlFor="check">
							<span>Register</span>
						</label>
						{errorMessage && (
							<Alert className="form-alert fs-6 text-start m-0 p-2 mt-2 mt-sm-3" variant="danger">
								{errorMessage}
							</Alert>
						)}
					</div>
				</div>
			</div>
		</form>
	)
}

export default LoginForm
