var fs          = require('fs');
var path        = require('path');
var express     = require('express');
var bodyParser  = require('body-parser');
var app         = express();
var http        = require('http').Server(app);
var io          = require('socket.io')(http);


var COMMENTS_FILE = path.join(__dirname, 'comments.json');
var USERS_FILE = path.join(__dirname, 'users.json');

app.set('port', (process.env.PORT || 3030));

app.set('view engine', 'jade');
app.set('views', __dirname + '/templates/');

app.use('/', express.static(path.join(__dirname, 'dist')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

io.on('connection', function(socket) {
    console.log('a user connected');

    socket.on('tsm-comment:add', function(data) {
        console.log('tsm-comment:add:', data);
        io.emit('tsm-comment:new', data);
    });

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});

// routes
app.get('/', function(req, res) {
    res.render('home');
});

app.get('/comments', function(req, res) {
    res.render('comments');
});

app.get('/users', function(req, res) {
    res.render('users');
});

// api
app.get('/api/comments', function(req, res) {
    fs.readFile(COMMENTS_FILE, function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.setHeader('Cache-Control', 'no-cache');
        res.json(JSON.parse(data));
    });
});

app.get('/api/users', function(req, res) {
    fs.readFile(USERS_FILE, function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.setHeader('Cache-Control', 'no-cache');
        res.json(JSON.parse(data));
    });
});


app.post('/api/comments', function(req, res) {
    fs.readFile(COMMENTS_FILE, function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        var comments = JSON.parse(data);
        // NOTE: In a real implementation, we would likely rely on a database or
        // some other approach (e.g. UUIDs) to ensure a globally unique id. We'll
        // treat Date.now() as unique-enough for our purposes.
        var newComment = {
            id: Date.now(),
            author: req.body.author,
            text: req.body.text,
        };
        comments.push(newComment);
        fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 4), function(err) {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            res.setHeader('Cache-Control', 'no-cache');
            res.json(comments);
        });
    });
});


http.listen(app.get('port'), function() {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});
