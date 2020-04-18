import React from "react";


export default class Profile extends React.Component {

	logout () {
		window.gapi.auth2.getAuthInstance().signOut().then(() => {
			localStorage.clear('clientId');
			window.location = '/';
		});
	}

	render() {
		const data = this.props.data;

		return (
			<div className="profile">
				<div className="avatar">
					<img src={data.imageUrl} alt="" />
				</div>
				<div className="name">{data.name}</div>
				<div className="btn-logout" onClick={this.logout}>
					<i className="fas fa-sign-out-alt fa-2x"></i>
				</div>
			</div>
		);
	}
}