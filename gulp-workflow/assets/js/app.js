'use strict';

var CommentList = React.createClass({
    displayName: 'CommentList',

    render: function render() {
        var commentNodes = this.props.data.map(function (comment) {
            return React.createElement(
                Comment,
                { author: comment.author, key: comment.id },
                comment.text
            );
        });

        return React.createElement(
            'div',
            { className: 'commentList' },
            commentNodes
        );
    }
});

var CommentForm = React.createClass({
    displayName: 'CommentForm',

    getInitialState: function getInitialState() {
        return { author: '', text: '' };
    },
    handleAuthorChange: function handleAuthorChange(e) {
        this.setState({ author: e.target.value });
    },
    handleTextChange: function handleTextChange(e) {
        this.setState({ text: e.target.value });
    },
    handleSubmit: function handleSubmit(e) {
        e.preventDefault();
        var author = this.state.author.trim();
        var text = this.state.text.trim();
        if (!text || !author) {
            return;
        }
        this.props.onCommentSubmit({ author: author, text: text });
        this.setState({ author: '', text: '' });
    },
    render: function render() {
        return React.createElement(
            'form',
            { className: 'commentForm', onSubmit: this.handleSubmit },
            React.createElement('input', {
                type: 'text',
                placeholder: 'Your name',
                value: this.state.author,
                onChange: this.handleAuthorChange
            }),
            React.createElement('input', {
                type: 'text',
                placeholder: 'Say something...',
                value: this.state.text,
                onChange: this.handleTextChange
            }),
            React.createElement('input', { type: 'submit', value: 'Post' })
        );
    }
});

var CommentBox = React.createClass({
    displayName: 'CommentBox',

    loadCommentsFromServer: function loadCommentsFromServer() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ data: data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleCommentSubmit: function handleCommentSubmit(comment) {
        var comments = this.state.data;
        comment._id = Date.now();
        var newComments = comments.concat([comment]);
        this.setState({ data: newComments });
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: comment,
            success: function (data) {
                this.setState({ data: data });
            }.bind(this),
            error: function (xhr, status, err) {
                this.setState({ data: comments });
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function getInitialState() {
        return { data: [] };
    },
    componentDidMount: function componentDidMount() {
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },
    render: function render() {
        return React.createElement(
            'div',
            { className: 'CommentBox' },
            React.createElement(
                'h1',
                null,
                'Comments'
            ),
            React.createElement(CommentList, { data: this.state.data }),
            React.createElement(CommentForm, { onCommentSubmit: this.handleCommentSubmit })
        );
    }
});

var Comment = React.createClass({
    displayName: 'Comment',

    render: function render() {
        return React.createElement(
            'div',
            { className: 'comment' },
            React.createElement(
                'h2',
                { className: 'commentAuthor' },
                this.props.author
            ),
            this.props.children
        );
    }
});

ReactDOM.render(React.createElement(CommentBox, { url: '/api/comments', pollInterval: 10000 }), document.getElementById('content'));
//# sourceMappingURL=app.js.map