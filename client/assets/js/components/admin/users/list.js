"use strict";

import React, {PropTypes} from "react";
import classnames from "classnames";
import UserStore from "../../../stores/UserStore.js";


export default class UserList extends React.Component {

	static displayName = "User List";

	static propTypes = {
		users: PropTypes.array
	};

	static defaultProps = {
		users: []
	};

	constructor(props) {
		super(props);
		this.state = this.getStateFromStores();
	}

	state = {
		users: this.props.users
	};

	componentDidMount() {
		UserStore.addChangeListener(this._onChange.bind(this));
	}

	componentWillUnmount() {
		UserStore.removeChangeListener(this._onChange.bind(this));
	}

	getStateFromStores() {
		return {
			users: UserStore.getUsers()
		};
	}

	_onChange() {
		this.setState(this.getStateFromStores());
	}

	sync() {
		// sync
	}

	renderListItem(user) {
		return (
			<li key={user._id} className="list-group-item">
				<button className={classnames("pull-right", "btn", user.isActive ? "btn-success" : "btn-danger")}
					onClick={() => this.sync(user)} type="button"
				>
					{user.isActive ? "Active" : "Inactive"}
				</button>

				<h4 className="list-group-item-heading">{user.contactName}</h4>
				Email: {user.email}<br/>
				Company: {user.companyName}<br/>
				Phone: {user.phoneNumber}<br/>
			</li>
		);
	}

	render() {
		return (
			<div className="panel panel-default">
				<div className="panel-body">
					<ul className="list-group">
						{this.state.users.map(this.renderListItem)}
					</ul>
				</div>
			</div>
		);
	}
}