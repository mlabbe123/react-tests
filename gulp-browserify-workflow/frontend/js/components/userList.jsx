var React = require('react');


var UserInfoBox = React.createClass({
	render: function() {
		return (
			<li className="userList-item" data-id={this.props.id} data-group={this.props.group}>
				<img src="img/user.png" className="userList-item-pic"/>
				<div className="userList-item-infos">
					<span className="userList-item-infos-item">Name: {this.props.display_name}</span>
					<span className="userList-item-infos-item">email: {this.props.email}</span>
				</div>
			</li>
		)
	}
});

var UserList = React.createClass({
	render: function() {
		var userNodes = this.props.data.map(function(user) {
			return (
				<UserInfoBox id={user.id} display_name={user.display_name} group={user.group} email={user.email} />
			)
		});

		return (
			<ul className="userList">
				{userNodes}	
			</ul>
		)
	}
});

var UserListBox = React.createClass({
	getUsersFromServer: function() {
		$.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
	},
	getInitialState: function() {
        return {data: []};
    },
    componentDidMount: function() {
        this.getUsersFromServer();
    },
	render: function() {
		return (
			<div className="userList-wrapper">
				<h1>Users</h1>
				<UserList data={this.state.data}/>
			</div>
		)
	}
});

module.exports = UserListBox;