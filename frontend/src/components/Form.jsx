import React, { useEffect } from 'react'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import { useAuth } from './AuthProvider'
import { Navigate } from 'react-router-dom'

function Form() {
	const { userData } = useAuth()

	const handleCheckChange = () => {
		const wrapper = document.querySelector('.wrapper')
		const checkbox = document.querySelector('#check')
		if (checkbox.checked) {
			wrapper.classList.add('expand')
		} else {
			wrapper.classList.remove('expand')
		}
	}

	return (
		<>
			{userData ? (
				<Navigate to="/" />
			) : (
				<div className="wrapper">
					<input id="check" type="checkbox" onChange={handleCheckChange} />
					<LoginForm />
					<SignupForm />
				</div>
			)}
		</>
	)
}

export default Form
