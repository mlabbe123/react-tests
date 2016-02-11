var React   = require('react');
var socket  = require('socket.io-client');
var cx      = require('classnames');

var socketClient = socket();

var Comment = React.createClass({
    render: function() {    
        return (
            <li className="comment">
                <h2 className="comment-author">
                   {this.props.author} 
                </h2>
                {this.props.children}
            </li>
        );
    }
});

var CommentList = React.createClass({
    render: function() {
        var commentNodes = this.props.data.map(function(comment) {
            return (
                <Comment author={comment.author} key={comment.id}>
                    {comment.text}
                </Comment>
            );
        });

        return (
            <ul className="comment-list">
                {commentNodes}
            </ul>
        )
    }
});

var CommentForm = React.createClass({
    getInitialState: function() {
        return {author: '', text: ''};
    },
    handleAuthorChange: function(e) {
        this.setState({author: e.target.value});
    },
    handleTextChange: function(e) {
        this.setState({text: e.target.value});
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var author = this.state.author.trim();
        var text = this.state.text.trim();
        if (!text || !author) {
            return;
        }
        this.props.onCommentSubmit({author: author, text: text});
        this.setState({author: '', text: ''});
    },
    render: function() {
        return (
            <form className="comment-form" onSubmit={this.handleSubmit}>
                <h1 className="comment-form__title">Join the conversation:</h1>
                <label htmlFor="form-name" className="comment-form__name-label">Your name: </label>
                <input
                    id="form-name"
                    className="comment-form__name-input"
                    type="text"
                    placeholder="Your name"
                    value={this.state.author} 
                    onChange={this.handleAuthorChange}
                />
                <label htmlFor="form-name" className="comment-form__text-label">Comment: </label>
                <input
                    id="form-text"
                    className="comment-form__text-input"
                    type="text"
                    placeholder="Say something..." 
                    value={this.state.text}
                    onChange={this.handleTextChange}
                />
                <input className="comment-form__submit-button" type="submit" value="Post" />
            </form>
        );
    }
});

var CommentBox = React.createClass({
    loadCommentsFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                if(data.length === 0) {
                    this.setState({
                        data: [{id: 0, author: 'No comments yet', text: 'Be the first to say something.'}],
                        commentsCount: data.length
                    });
                } else {
                    this.setState({
                        data: data,
                        commentsCount: data.length
                    });
                    document.getElementById("comment-box-count").className = document.getElementById("comment-box-count").className.replace( /(?:^|\s)hidden(?!\S)/g , '' );
                }
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleCommentSubmit: function(comment) {
        var comments = this.state.data;
        comment._id = Date.now();
        var newComments = comments.concat([comment]);
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: comment,
            success: function(data) {
                // Emit to socket.io
                socketClient.emit('tsm-comment:add', comment);
            }.bind(this),
            error: function(xhr, status, err) {
                this.setState({
                    data: comments,
                    commentsCount: 0
                });
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function() {
        return {
            data: [{id: 0, author: 'Loading...', text: ''}],
            commentsCount: 0
        };
    },
    _updateComments: function(comment) {
        var comments = this.state.data;
        var commentsCount = comments.length;

        comments.push(comment);
        this.setState({
            data: comments,
            commentCount: commentsCount
        });
    },
    componentDidMount: function() {
        this.loadCommentsFromServer();
        socketClient.on('tsm-comment:new', this._updateComments);
    },
    render: function() {
        var countClasses = cx({
            'comments-count': true,
            'hidden': true
        });

        return (
            <div className="comment-box">
                <h1 className="comment-box__title">
                    Comments&nbsp;
                    <span id="comment-box-count" className={countClasses}>({this.state.commentsCount})</span>
                </h1>
                <CommentList data={this.state.data}/>
                <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
            </div>
        );
    }
});

module.exports = CommentBox;