import React from 'react'

function SubForm({ isLogin }) {
	return (
		<div className={`form-container ${isLogin ? 'login-form' : 'register-form'}`}>
			{isLogin ? (
				<div className="form-header">Login</div>
			) : (
				<label for="check">
					<div className="form-header">Register</div>
				</label>
			)}

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
					<button>{isLogin ? 'Login' : 'Register'}</button>
					<p className="login-register">
						{isLogin ? `Don't have an account?` : 'Already have an account?'}{' '}
						<label for="check">
							<span htmlFor="check">{isLogin ? 'Register' : 'Login'}</span>
						</label>
					</p>
				</div>
			</div>
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
