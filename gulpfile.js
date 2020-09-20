'use strict'
const gulp = require('gulp');
const watch = require('gulp-watch');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync');
const prefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cleanCss = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const rimraf = require('rimraf');
const reload = browserSync.reload;

//Path for all of the folders for App, Dist and watch
const path = {
	app: {
		html: './app/*.html',
		js: './app/js/*.js',
		css: './app/css/*.css',
		scss: './app/css/*.scss',
		img: './app/img/**/*.*',
		fonts: './app/fonts/**/*.*'
	},
	dist: {
		html: './dist/',
		js: './dist/js/',
		css: './dist/css/',
		scss: './dist/css/',
		img: './dist/img/',
		fonts: 'dist/fonts/'
	},
	watch: { 
        html: 'app/**/*.html',
        js: 'app/js/**/*.js',
        scss: 'app/css/**/*.scss',
        css: 'app/css/**/*.css',
        img: 'app/img/**/*.*',
        fonts: 'app/fonts/**/*.*'
        },
    clean: './dist'
};

//Server initiliatization 
 const config = {
    server: {
        baseDir: "./dist"
    },
      tunnel: false,
        host: 'localhost',
        port: 8081,
        logPrefix: "Dewei"
 };

//Tasks for every folder
 gulp.task('html:build', async function () {
    gulp.src(path.app.html)
	.pipe(gulp.dest(path.dist.html)) 
	.pipe(reload({stream: true})); 
 });
 gulp.task('js:build', async function () {
    gulp.src(path.app.js) 
    .pipe(sourcemaps.init()) 
  	.pipe(uglify()) 
    .pipe(sourcemaps.write()) 
    .pipe(gulp.dest(path.dist.js)) 
    .pipe(reload({stream: true}));
});
 gulp.task('scss:build', async function () {
    gulp.src(path.app.scss) 
    .pipe(sourcemaps.init()) 
    .pipe(sass()) 
    .pipe(prefixer()) 
    .pipe(cleanCss()) 
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.dist.scss))
    .pipe(reload({stream: true}));
});
 gulp.task('css:build', async function () {
    gulp.src(path.app.css) 
    .pipe(sourcemaps.init()) 
    .pipe(cleanCss()) 
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.dist.css)) 
    .pipe(reload({stream: true}));
});
gulp.task('image:build', async function () {
    gulp.src(path.app.img) 
    .pipe(imagemin({ 
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()],
        interlaced: true
    }))
    .pipe(gulp.dest(path.dist.img))
    .pipe(reload({stream: true}));
});
gulp.task('fonts:build', async function() {
    gulp.src(path.app.fonts)
    .pipe(gulp.dest(path.dist.fonts))
});

//Watching for changes in every folder
gulp.task('watch', async function(){
	gulp.watch(path.watch.html, gulp.series('html:build'));
	gulp.watch(path.watch.scss, gulp.series('scss:build'));
	gulp.watch(path.watch.css, gulp.series('css:build'));
	gulp.watch(path.watch.js, gulp.series('js:build'));
	gulp.watch(path.watch.img, gulp.series('image:build'));
	gulp.watch(path.watch.fonts, gulp.series('fonts:build'));
});

//Running the localhost
gulp.task('webserver', async function () {
    browserSync(config);
});
//Clean the trash from dist folder
gulp.task('clean', async function (cb) {
    rimraf(path.clean, cb);
});
//Gulp default task 
gulp.task('default', gulp.parallel('html:build','js:build','scss:build', 'webserver','css:build','fonts:build','image:build','watch'));
