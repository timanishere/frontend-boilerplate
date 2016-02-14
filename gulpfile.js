//------------------- DEPENDENCIES -------------------//
var gulp 					= require('gulp');
var sass 					= require('gulp-sass');
var cssnano					= require('gulp-cssnano');
var sourcemaps 				= require('gulp-sourcemaps');
var imagemin 				= require('gulp-imagemin');
var concat 					= require('gulp-concat');
var uglify 					= require('gulp-uglify');
//var notify 					= require('gulp-notify');
var autoprefixer 			= require('gulp-autoprefixer');
var jshint 					= require('gulp-jshint');
var useref 					= require('gulp-useref');
var htmlmin 				= require('gulp-htmlmin');
var concatCss 				= require('gulp-concat-css');
var ngAnnotate 				= require('gulp-ng-annotate');

var pngquant 				= require('imagemin-pngquant');
var browserSync 			= require('browser-sync');

//var reload		 		=  browserSync.reload;
var	d 						= new Date();
//------------------- DEPENDENCIES -------------------//


///////////////////////////////////////
// BROWSER SYNC
///////////////////////////////////////
gulp.task('serve', ['sass'], function() {
	browserSync.init({
		server: "./app"
	});

	gulp.watch('./app/scss/**/*.scss', ['sass']);
	gulp.watch('./app/css/*.css');
	gulp.watch('./app/scripts/**/*.js', ['scripts']);
	gulp.watch('./app/html/**/*.html').on('change', browserSync.reload);
	gulp.watch('./app/*.html').on('change', browserSync.reload);
});


///////////////////////////////////////
// SASS COMPILE
///////////////////////////////////////
gulp.task('sass', function() {
	gulp.src('./app/scss/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browser: ['last 2 versions'],
			cascade: false
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./app/css'))
		.pipe(browserSync.stream());
		//.pipe(notify('SASS has been compiled successfully'));
});


///////////////////////////////////////
// FONT AWESOME BOWER CONCATENATE
///////////////////////////////////////
gulp.task('fontawesome', function() {
	return gulp.src('./app/bower_components/font-awesome/css/font-awesome.css')
	.pipe(concat({path: '_font-awesome.scss', stat: { mode: 0666}}))
	.pipe(gulp.dest('./app/scss/vendor'));
});



gulp.task('fontawesomeTypo', function() {
	return gulp.src('./app/bower_components/font-awesome/fonts/**')
	//.pipe(concat({path: '_font-awesome.scss', stat: { mode: 0666}}))
	.pipe(gulp.dest('./app/fonts'));
});


///////////////////////////////////////
// FONT AWESOME BOWER CONCATENATE
///////////////////////////////////////
gulp.task('break')
///////////////////////////////////////
// CSS MINIFY
///////////////////////////////////////
gulp.task('cssnano', function() {
	return gulp.src('./app/css/main.css')
		.pipe(sourcemaps.init())
		.pipe(cssnano())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./dist_' + d.getTime() + '/css'));
		//.pipe(notify('CSS has been minified successfully'));
});


///////////////////////////////////////
// IMAGE MINIFY
///////////////////////////////////////
gulp.task('imagemin', function() {
	return gulp.src('./app/images/**/**')
		.pipe(imagemin({
			progressive:true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest('./dist_' + d.getTime() + '/images/'));
		//.pipe(notify('images has been minified successfully'));
});


///////////////////////////////////////
// JAVASCRIPT CONCATENATE
// ANGULAR + JQUERY BOWER CONCATENATE
///////////////////////////////////////
gulp.task('scripts', function() {
	return gulp.src([ 
		'./app/bower_components/angular/angular.min.js',
		'./app/bower_components/angular-animate/angular-animate.min.js',
		'./app/bower_components/angular-sanitize/angular-sanitize.min.js',
		'./app/bower_components/jquery/dist/jquery.min.js',
		'./app/scripts/src/**/**/**.js'
		])
		//.pipe(concat('main.js'))
		.pipe(concat({path: 'main.js', stat: { mode: 0666}}))
		.pipe(gulp.dest('./app/scripts/'))
		.pipe(browserSync.stream());
		//.pipe(notify('JavaScript has been concatenated successfully'));
});



///////////////////////////////////////
// JS LINTING
///////////////////////////////////////
gulp.task('jshint', function() {
	return gulp.src('./app/scripts/src/*.js')
	.pipe(jshint())
	.pipe(jshint.reporter('default'));

});


///////////////////////////////////////
// JAVASCRIPT MINIFY
///////////////////////////////////////
gulp.task('uglify', function() {
	return gulp.src('./app/scripts/main.js')
		.pipe(sourcemaps.init())
		.pipe(ngAnnotate())
		.pipe(uglify())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./dist_' + d.getTime() + '/scripts'));
		//.pipe(notify('JavaScript has been minified successfully'));
});


///////////////////////////////////////
// PARSES INDEX HTML TO DIST + MINIFY
///////////////////////////////////////
gulp.task('fonts', function() {
	return gulp.src('./app/fonts/**')
	.pipe(gulp.dest('./dist_' + d.getTime() + '/fonts'));
});

///////////////////////////////////////
// PARSES INDEX HTML TO DIST + MINIFY
///////////////////////////////////////
gulp.task('userefInd', function() {
	return gulp.src('./app/*.html')
		.pipe(useref())
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest('./dist_' + d.getTime()));
});


///////////////////////////////////////
// PARSES HTML PAGES TO DIST + MINIFY
///////////////////////////////////////
gulp.task('userefPgs', function() {
	return gulp.src('./app/html/*.html')
		.pipe(useref())
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest('./dist_' + d.getTime() + '/html'));
});


/////////////////////////////////////////
// PARSES HTML INCLUDES TO DIST + MINIFY
/////////////////////////////////////////
gulp.task('userefInc', function() {
	return gulp.src('./app/html/includes/*.html')
		.pipe(useref())
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest('./dist_' + d.getTime() + '/html/includes'));
});


///////////////////////////////////////////////
// PARSES INDEX HTML + PAGES + INCLUDES + BOWER
// TO DIST
///////////////////////////////////////////////
gulp.task('useref', ['userefInd', 'userefPgs', 'userefInc'], function() {
	console.log('HTML + BOWER COMPONENTS HAS BEEN SUCCESSFUL PARSED TO DIST FOLDER');
});


////////////////////////////////////////////
// WATCHES FOR SCSS + CSS + SCRIPTS CHANGES
///////////////////////////////////////////
gulp.task('watch', function() {
	gulp.watch('./app/scss/**/*.scss', ['sass']);
	gulp.watch('./app/css/*.css');
	gulp.watch('./app/scripts/src/**/**/**.js', ['scripts', 'jshint']);
	gulp.watch('./app/html/**/**/*.html');
});


////////////////////////////////////////
// CREATES DIST FOLDER 
////////////////////////////////////////
gulp.task('dist', ['useref','sass', 'cssnano', 'fonts', 'scripts', 'uglify', 'imagemin'], function() {
	console.log('SUCCESS: File fully compiled :)');
});

///////////////////////////////////////
// GULP DEFAULT
///////////////////////////////////////
gulp.task('default', ['fontawesome','fontawesomeTypo', 'sass', 'scripts', 'jshint', 'serve', 'watch' ]);
//gulp.task('default', ['fontawesomeTypo']);
