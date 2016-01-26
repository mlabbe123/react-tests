var gulp        = require('gulp'),
    uglify      = require('gulp-uglify'),
    htmlreplace = require('gulp-html-replace'),
    source      = require('vinyl-source-stream'),
    browserify  = require('browserify'),
    watchify    = require('watchify'),
    reactify    = require('reactify'),
    streamify   = require('gulp-streamify'),
    rename      = require('gulp-rename'),
    es          = require('event-stream');

    
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
        './frontend/js/pages/home.js',
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

// Watch task for a multiple bundles.
gulp.task('watch-multiple', function() {
    gulp.watch(['./frontend/js/**/*.jsx', './frontend/js/**/*.js'], ['bundle-pages-js']);
});


gulp.task('default', ['watch']);

gulp.task('watch-multiple-bundles', ['bundle-pages-js', 'watch-multiple']);