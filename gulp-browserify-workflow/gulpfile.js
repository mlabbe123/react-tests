var gulp        = require('gulp');
var uglify      = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var source      = require('vinyl-source-stream');
var browserify  = require('browserify');
var watchify    = require('watchify');
var reactify    = require('reactify');
var streamify   = require('gulp-streamify');
var rename      = require('gulp-rename');
var es          = require('event-stream');
var sass        = require('gulp-sass');


// =============================
// JS
// =============================

// Watch task for a single bundle.
gulp.task('watch-single', function() {
    gulp.watch('./templates/**/*.jade', []);

    path = {
        OUT: 'build.js',
        DEST: 'dist',
        ENTRY_POINT: './frontend/js/app.js'
    }

    var watcher  = watchify(browserify({
        entries: [path.ENTRY_POINT],
        transform: [reactify],
        debug: true,
        cache: {},
        packageCache: {},
        fullPaths: true
    }));

    return watcher.on('update', function () {
        watcher.bundle()
            .pipe(source(path.OUT))
            .pipe(gulp.dest(path.DEST))
            console.log('Updated');
    })
        .bundle()
        .pipe(source(path.OUT))
        .pipe(gulp.dest(path.DEST));
});

// one-time task for multiple bundles.
gulp.task('bundle-pages-js', function() {
    var files = [
        './frontend/js/pages/comments.js',
        './frontend/js/pages/users.js'
    ];

    var tasks = files.map(function(entry) {
        return browserify({
                entries: [entry],
                transform: [reactify],
                debug: true,
                cache: {},
                packageCache: {},
                fullPaths: true 
            })
            .bundle()
            .pipe(source(entry))
            .pipe(rename({
                dirname: 'js/pages',
                extname: '.bundle.js'    
            }))
            .pipe(gulp.dest('./dist'))
        });

    return es.merge.apply(null, tasks);
});

// =============================
// SASS
// =============================
gulp.task('compile-sass', function() {
    gulp.src('./frontend/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/css'));
});

// Watch task for a multiple bundles.
gulp.task('watch-multiple', function() {
    gulp.watch(['./frontend/js/**/*.jsx', './frontend/js/**/*.js'], ['bundle-pages-js']);
    gulp.watch(['./frontend/sass/**/*.scss'], ['compile-sass']);
});


gulp.task('default', ['watch']);

gulp.task('watch-multiple-bundles', ['bundle-pages-js', 'compile-sass', 'watch-multiple']);