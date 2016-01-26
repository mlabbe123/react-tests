var gulp        = require('gulp'),
    uglify      = require('gulp-uglify'),
    htmlreplace = require('gulp-html-replace'),
    source      = require('vinyl-source-stream'),
    browserify  = require('browserify'),
    watchify    = require('watchify'),
    reactify    = require('reactify'),
    streamify   = require('gulp-streamify'),

    path = {
        MINIFIED_OUT: 'build.min.js',
        OUT: 'build.js',
        DEST: 'dist',
        DEST_BUILD: 'dist/build',
        DEST_SRC: 'dist/src',
        ENTRY_POINT: './frontend/js/app.js'
    }

gulp.task('watch', function() {
    gulp.watch('./templates/**/*.jade', []);

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
            .pipe(gulp.dest(path.DEST_SRC))
            console.log('Updated');
    })
        .bundle()
        .pipe(source(path.OUT))
        .pipe(gulp.dest(path.DEST_SRC));
});

gulp.task('default', ['watch']);