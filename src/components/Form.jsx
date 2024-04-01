import React from 'react'

function SubForm({ isLogin }) {
	const handleToggle = () => {}
	// const handleToggle = () => {
	// 	const loginForm = document.getElementsByClassName('form-container')[0]
	// 	const loginFormHeader = document.querySelector('.form-container.login-form .form-header')
	// 	const registerFormHeader = document.querySelector('.form-container.register-form .form-header')
	// 	const animationSettings = {
	// 		duration: 1000,
	// 		fill: 'forwards',
	// 		easing: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)',
	// 	}
	// 	if (loginForm.classList.contains('shown')) {
	// 		loginForm.classList.remove('shown')
	// 		registerFormHeader.animate(
	// 			{
	// 				fontSize: '2.25rem',
	// 			},
	// 			animationSettings
	// 		)
	// 		loginFormHeader.animate(
	// 			{
	// 				fontSize: '1.5rem',
	// 			},
	// 			animationSettings
	// 		)
	// 		loginForm.animate(
	// 			{
	// 				transform: 'translate(-50%, 200px)',
	// 				opacity: 1,
	// 			},
	// 			animationSettings
	// 		)
	// 	} else {
	// 		loginForm.classList.add('shown')
	// 		registerFormHeader.animate(
	// 			{
	// 				fontSize: '1.5rem',
	// 			},
	// 			animationSettings
	// 		)
	// 		loginFormHeader.animate(
	// 			{
	// 				fontSize: '2.25rem',
	// 			},
	// 			animationSettings
	// 		)
	// 		loginForm.animate(
	// 			{
	// 				transform: 'translate(-50%, -30%)',
	// 				opacity: 1,
	// 			},
	// 			animationSettings
	// 		)
	// 	}
	// }

	return (
		<div className={`form-container ${isLogin ? 'login-form' : 'register-form'}`}>
			<label for="check">
				<div className="form-header">
					{isLogin ? 'Login' : 'Sign Up'}
				</div>
			</label>
			<div className="form-padding">
				<div className="form-content">
					<div className="input-box">
						<input placeholder="" id={`email-input${isLogin ? '1' : '2'}`}></input>
						<label htmlFor={`email-input${isLogin ? '1' : '2'}`}>Email</label>
						<i className="fa-solid fa-envelope"></i>
					</div>
					<div className="input-box">
						<input placeholder="" id={`password-input${isLogin ? '1' : '2'}`}></input>
						<label htmlFor={`password-input${isLogin ? '1' : '2'}`}>Password</label>
						<i className="fa-solid fa-lock"></i>
					</div>
					{!isLogin && (
						<div className="input-box">
							<input placeholder="" id="confirm-password-input"></input>
							<label htmlFor="confirm-password-input">Confirm Password</label>
							<i className="fa-solid fa-lock"></i>
						</div>
					)}
					<button>{isLogin ? 'Login' : 'Sign Up'}</button>
					<p className="login-register">
						{isLogin ? `Don't have an account?` : 'Already have an account?'}{' '}
						<label for="check">
							<span htmlFor="check">
								{isLogin ? 'Register' : 'Login'}
							</span>
						</label>
					</p>
				</div>
			</div>

			<div className="form-footer"></div>
		</div>
	)
}

function Form() {
	return (
		<div className="wrapper">
			<input id="check" type="checkbox" />
			<SubForm isLogin={true} />
			<SubForm isLogin={false} />
		</div>
	)
}

export default Form
