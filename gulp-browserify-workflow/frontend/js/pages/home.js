var React = require('react');
var ReactDOM = require('react-dom');

var CommentBox = require('../components/commentBox.jsx');

console.log('this is home');

ReactDOM.render(<CommentBox url="/api/comments" />,
    document.getElementById('content')
);