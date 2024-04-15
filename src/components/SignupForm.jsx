import React, { useEffect, useState } from 'react'
import { useAuth } from './AuthProvider'
import { Spinner, Alert } from 'react-bootstrap'

function SignupForm() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [errorMessage, setErrorMessage] = useState()
	const { signup, user } = useAuth()

	async function handleRegister(e) {
		try {
			e.preventDefault()
			setIsLoading(true)

			if (password !== confirmPassword) {
				setErrorMessage('Passwords do not match')
				return
			}

			const account = await signup(email, password)
			setErrorMessage('')
			console.log(account)
		} catch (error) {
			switch (error.code) {
				case 'auth/invalid-email':
					setErrorMessage('Invalid email address.')
					break
				case 'auth/email-already-in-use':
					setErrorMessage('Email is already registered. Please sign in or use a different email.')
					break
				case 'auth/weak-password':
					setErrorMessage('Password is too weak. Please use a stronger password.')
					break

				default:
					setErrorMessage('An error occurred. Please try again later.')
			}
		} finally {
			setIsLoading(false)
		}
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
					<div className="input-box">
						<input
							value={confirmPassword}
							onChange={(e) => {
								setConfirmPassword(e.target.value)
							}}
							placeholder=""
							id="confirm-password"
							required
						></input>
						<label htmlFor="confirm-password">Confirm Password</label>
						<i className="fa-solid fa-lock"></i>
					</div>
					<button type="submit" disabled={isLoading}>
						{isLoading ? <Spinner className="form-spinner" /> : 'Register'}
					</button>
					<p className="login-register">
						Already have an account?{' '}
						<label htmlFor="check">
							<span>Login</span>
						</label>
						{errorMessage && (
							<Alert className="form-alert fs-6 text-start p-2 mt-2 mt-sm-3" variant="danger">
								{errorMessage}
							</Alert>
						)}
					</p>
				</div>
			</div>
		</form>
	)
}

export default SignupForm
