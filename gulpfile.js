"use strict";

var gulp = require('gulp'),
    spritesmith = require('gulp.spritesmith'),
    notify = require('gulp-notify'),
    rev = require('gulp-rev-append'),
    autoprefixer = require('gulp-autoprefixer'),
    csscomb = require('gulp-csscomb'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    rigger = require('gulp-rigger'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    watch = require('gulp-watch'),
    mainBowerFiles = require('main-bower-files'),
    connect = require('gulp-connect');

var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/images/',
        fonts: 'build/css/fonts/',
        sprite: 'build/css/sprite-build/'
    },
    src: {
        html: 'src/*.html',
        js: 'src/js/main.js',
        css: 'src/css/main.scss',
        img: 'src/images/*.*',
        fonts: 'src/css/fonts/*.*',
        sprite: 'src/images/sprite/*.png'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/*.js',
        css: 'src/css/**/*.scss',
        img: 'src/images/*.*',
        fonts: 'src/css/fonts/*.*',
        sprite: 'src/images/sprite/*.png'
    }
};

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('connect', function() {
    connect.server({
        root: path.build.html,
        livereload: true
    });
});

gulp.task('html:build', function () {
    return gulp.src(path.src.html) 
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(connect.reload());
});

gulp.task('js:build', function () {
    return gulp.src(path.src.js) 
        .pipe(gulp.dest(path.build.js));
});

gulp.task('css:build', function () {
    return gulp.src(path.src.css) 
        .pipe(sass().on('error', sass.logError))
        .pipe(plumber())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(csscomb('.csscomb.json'))
        .pipe(gulp.dest(path.build.css))
        .pipe(connect.reload())
        .pipe(notify("Done!"));
});

gulp.task('image:build', function () {
    return gulp.src(path.src.img) 
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img));
});

gulp.task('fonts:build', function() {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
});

gulp.task('rev', function() {
    return gulp.src('./src/template/head.html') 
        .pipe(rev())
        .pipe(gulp.dest('./src/template/'));
});

//sprite
gulp.task('sprite', function () {
    var spriteData = gulp.src(path.src.sprite).pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.css'
    }));
    return spriteData.pipe(gulp.dest(path.build.sprite));
});

gulp.task('mainJS', function() {
    return gulp.src(mainBowerFiles('**/*.js'))
        .pipe(gulp.dest('build/js'))
});

gulp.task('mainCSS', function() {
    return gulp.src(mainBowerFiles('**/*.css'))
        .pipe(gulp.dest('build/css'))
});

gulp.task('build', [
    'js:build',
    'fonts:build',
    'image:build',
    'rev',
    'sprite',
    'mainJS',
    'mainCSS',
    'css:build',
    'html:build'
]);


gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
        return deferred.promise;
    }); 
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
        return deferred.promise;
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
        return deferred.promise;
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
        return deferred.promise;
    });
    watch([path.watch.css], function(event, cb) {
        setTimeout(function(){
            gulp.start('css:build');
        },200);
        return deferred.promise;
    });
    watch([path.src.css], function(event, cb) {
        gulp.start('rev');
        return deferred.promise;
    });
    watch([path.watch.sprite], function(event, cb) {
        gulp.start('sprite');
        return deferred.promise;
    });
    watch(['bower_components'], function(event, cb) {
        gulp.start('mainJS');
        gulp.start('mainCSS');
        return deferred.promise;
    });
});


gulp.task('default', ['build', 'watch']);