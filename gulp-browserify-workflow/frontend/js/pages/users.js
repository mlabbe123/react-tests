var React = require('react');
var ReactDOM = require('react-dom');

var UserList = require('../components/userList.jsx');

ReactDOM.render(<UserList url="/api/users" />,
    document.getElementById('userList-container')
);