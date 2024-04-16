import React from 'react'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'

function Form() {
	return (
		<div className="wrapper">
			<input id="check" type="checkbox" />
      <LoginForm />
      <SignupForm />
		</div>
	)
}

export default Form
