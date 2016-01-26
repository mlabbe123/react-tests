var React = require('react');
var ReactDOM = require('react-dom');

var CommentBox = require('./components/commentBox.jsx');

console.log(CommentBox);

ReactDOM.render(<CommentBox />,
    document.getElementById('content')
);