var gulp = require('gulp');
var args = require('yargs').argv;
var config = require('./gulp.config')();
var $ = require('gulp-load-plugins')({ lazy: true });
var del = require('del');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

var port = 8000 || args.Port;


gulp.task('help', $.taskListing);

//TODO set default task 
//gulp.task('default', ['']);

gulp.task('styles', ['clean-styles'], function () {
    log('Compiling Less --> CSS');

    return gulp
        .src(config.less)
        .pipe($.less())
        .pipe($.plumber())
        .pipe($.autoprefixer({ browsers: ['last 2 version', '> 5%'] }))
        .pipe(gulp.dest(config.temp))
        .pipe(reload({ stream: true }));

});

gulp.task('clean-styles', function (done) {
    var files = config.temp + '**/*.css';
    clean(files, done);
});

gulp.task('images', ['clean-images'], function () {
    log('Optimizing images');
    return gulp
        .src(config.images)
        .pipe($.imagemin({ optimizationLevel: 3 }))
        .pipe(gulp.dest(config.build + 'img'));
});

gulp.task('clean-images', function (done) {
    var files = config.build + 'img/**/*.*';
    clean(files, done);
});

gulp.task('fonts', ['clean-fonts'], function () {
    log('Copying fonts');
    return gulp
        .src(config.fonts)
        .pipe(gulp.dest(config.build + 'fonts'));
});

gulp.task('clean-fonts', function (done) {
    var files = config.build + 'fonts/**/*.*';
    clean(files, done);
});

gulp.task('clean', function (done) {
    var delconfig = [].concat(config.build, config.temp);
    log('cleaning: ' + $.util.colors.blue(delconfig));
    clean(delconfig, done);
});

gulp.task('wiredep', function () {
    log('wiere up bower css and js into the ' + config.baseHtml)
    var options = config.getWiredepDefaulOptions();
    var wiredep = require('wiredep').stream;

    return gulp
        .src(config.base)
        .pipe(wiredep(options))
        .pipe(gulp.dest(config.templates));
});

gulp.task('inject', ['styles'], function () {
    log('wire up the app css and js into the html');
    var injectCssOptions = config.getInjectDefaultCssOptions();
    var injectJsOptions = config.getInjectDefaultJsOptions();
    return gulp
        .src(config.base)
        .pipe($.inject(gulp.src(config.css), injectCssOptions))
        .pipe($.inject(gulp.src(config.js), injectJsOptions))
        .pipe(gulp.dest(config.templates));
});

gulp.task('backup-dev', function () {
    log('backing up ' + config.baseHtml);
    return gulp
        .src(config.base)
        .pipe(gulp.dest(config.backupTemplateDir));
});

gulp.task('restore-dev', function () {
    log('restoring ' + config.baseHtml);
    return gulp
        .src(config.backupTemplateDir + config.baseHtml)
        .pipe(gulp.dest(config.templates));
});

gulp.task('optimize', ['backup-dev', 'wiredep', 'inject','fonts','images'], function () {
    log('Optimazing the assets');
    var assets = $.useref.assets();
    var cssFilter = $.filter(config.relativePathToStaticFiles + '**/*.css');
    var jsFilter = $.filter(config.relativePathToStaticFiles + '**/*.js');

    return gulp
        .src(config.base)
        .pipe($.replace(config.staticURLPrefix, config.relativePathToStaticFiles))
        .pipe($.plumber())
        .pipe(assets)
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore())
        .pipe(jsFilter)
        .pipe($.uglify())
        .pipe(jsFilter.restore())
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe($.replace(config.relativePathToStaticFiles, config.staticURLPrefix))
        .pipe(gulp.dest(config.templates));
});

gulp.task('inject-watch', ['inject'], browserSync.reload);

gulp.task('sync',['inject'] , function () {
    startBrowserSync();
});


///////////
function clean(path, done) {
    log('Cleaning ' + $.util.colors.blue(path));
    del(path, done);
};

function log(msg) {
    if (typeof (msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
};

function changeEvent(event) {
    var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
    log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
};

///////
function startBrowserSync() {
    log('starting browser-sync on port ' + port);
    //var options = {
       // proxy: 'localhost:' + port,
      //  port: 3000//,
        //files: [
        //    config.client + '**/*.*',
        //    '!' + config.less,
        //    config.temp + '**/*.css'
        //],
        //ghostMode: {
        //    click: true,
        //    location: false,
        //    forms: true,
        //    scroll: true
        //},
        //injetChanges: true,
        //logFileChanges: true,
        //logLevel: 'debug',
        //notify: true,
        //reloadDelay: 1000
    //};

    browserSync.init({
        proxy: 'localhost:' + port,
        port: 3000
    });

    gulp.watch([config.less], ['styles']);
    gulp.watch([config.staticFiles + 'js/*.js'], ['inject-watch']);
    gulp.watch([config.templates + '**/*.html']).on("change", browserSync.reload);
};
