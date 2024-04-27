import React, { useEffect, useState } from 'react'
import { useAuth } from './AuthProvider'
import { Spinner, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

function SignupForm() {
	const [email, setEmail] = useState('')
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	// const [confirmPassword, setConfirmPassword] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [errorMessage, setErrorMessage] = useState()
	const { signup } = useAuth()
	const navigate = useNavigate()

	function isValidEmail(email) {
		// Regular expression pattern for validating email format
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		return emailPattern.test(email)
	}

	function isValidUsername(username) {
		// Only alphabetical letters
		const usernamePattern = /^[a-zA-Z]+$/
		return usernamePattern.test(username)
	}

	async function handleRegister(e) {
		e.preventDefault()
		if (!isValidUsername(username)) {
			return setErrorMessage('Username must only contain alphabetical letters')
		} else if (!isValidEmail(email)) {
			return setErrorMessage('Invalid email address')
		}

		if (username.length <= 4) {
			setErrorMessage('Username must be atleast 5 letters')
			return
		}

		setIsLoading(true)
		const response = await signup(email, username, password) // the response should have the accessToken
		setIsLoading(false)
		if (response.error) {
			return setErrorMessage(response.error)
		}
    localStorage.setItem('accessToken', response)
		setErrorMessage('')
	}

	return (
		<form className="form-container register-form" onSubmit={(e) => handleRegister(e)}>
			<label htmlFor="check">
				<div className="form-header">Register</div>
			</label>
			<div className="form-padding">
				<div className="form-content">
					<div className="input-box">
						<input
							value={email}
							onChange={(e) => {
								setEmail(e.target.value)
							}}
							placeholder=""
							id="signup-email"
							required
						></input>
						<label htmlFor="signup-email">Email</label>
						<i className="fa-solid fa-envelope"></i>
					</div>
					<div className="input-box">
						<input
							value={username}
							onChange={(e) => {
								setUsername(e.target.value)
							}}
							placeholder=""
							id="confirm-password"
							required
						></input>
						<label htmlFor="confirm-password">Username</label>
						<i className="fa-solid fa-user"></i>
					</div>
					<div className="input-box">
						<input
							value={password}
							onChange={(e) => {
								setPassword(e.target.value)
							}}
							placeholder=""
							id="signup-password"
							required
						></input>
						<label htmlFor="signup-password">Password</label>
						<i className="fa-solid fa-lock"></i>
					</div>
					<button type="submit" disabled={isLoading}>
						{isLoading ? <Spinner className="form-spinner" /> : 'Register'}
					</button>
					<div className="login-register">
						Already have an account?{' '}
						<label htmlFor="check">
							<span>Login</span>
						</label>
						{errorMessage && (
							<Alert className="form-alert fs-6 m-0 text-start p-2 mt-2 mt-sm-3" variant="danger">
								{errorMessage}
							</Alert>
						)}
					</div>
				</div>
			</div>
		</form>
	)
}

export default SignupForm
