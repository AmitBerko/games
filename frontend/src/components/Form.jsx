import React from 'react'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'

function Form() {
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
		<div className="wrapper">
			<input id="check" type="checkbox" onChange={handleCheckChange} />
      <LoginForm />
      <SignupForm />
		</div>
	)
}

export default Form
