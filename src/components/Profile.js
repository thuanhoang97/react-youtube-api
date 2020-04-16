import React from "react";


export default class Profile extends React.Component {

	logout () {
		localStorage.clear('clientId');
		window.location = '/';
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
					<i class="fas fa-sign-out-alt fa-2x"></i>
				</div>
			</div>
		);
	}
}