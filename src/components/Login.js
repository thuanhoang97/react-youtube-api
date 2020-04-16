import React, { Component } from "react";
import { Link } from "react-router-dom";

import youtubeApi from '../youtubeApi';


export default class Login extends Component {
	onLogin = (e) => {
		e.preventDefault();

		const formData = new FormData(e.target);
		const clientId = formData.get('clientId');
		console.log(clientId);
		youtubeApi.init(clientId, () => {
			window.location = '/';
		});
	}

  render() {
    return <div>
			<h3 className="app-title">Login</h3>
			<form className="form-login" onSubmit={this.onLogin}>
				<input 
					type="text"
					name="clientId" 
					className="form-text" 
					placeholder="Client ID"
				/>
				<input type="submit" className="btn" value="Sign In"/>
			</form>
			</div>;
  }
}
