var gulp = require('gulp'),
	//wiredep = require('wiredep').stream,
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
    notify = require('gulp-notify'),
    reload = browserSync.reload,
    del = require('del'),
    plumber = require('gulp-plumber');

var path = {
	build: {
		html: 'dist/',
		js: 'dist/js/',
		css: 'dist/css/',
	},

	src: { //пути к исходным файлам
		html: 'app/index.html',
		js: 'app/js/',
		css: 'app/css/',
	},

    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'app/**/*.html',
        js: 'app/js/SmallCalendar.js',
        css: 'app/css/SmallCalendarStyle.css',
    },

    clean: '/dist'
}; 

gulp.task('html', function(){
		gulp.src(path.src.html)
			.pipe(notify('HTML DONE!'))
			.pipe(reload({stream:true}));
});
 
gulp.task('css', function(){
	return gulp.src([path.src.css + "SmallCalendarStyle.css"])
			.pipe(plumber())
			.pipe(autoprefixer({
				browsers: ['last 20 version'],
				cascade: false
			}))
			.pipe(minifyCss())
			.pipe(rename({suffix: '.min'}))
			.pipe(gulp.dest(path.src.css))
			.pipe(notify('CSS DONE!'))
			.pipe(reload({stream:true}));
});

gulp.task('js', function(){
	return gulp.src([path.src.js + "SmallCalendar.js"])
			.pipe(plumber())
			.pipe(uglify())
			.pipe(rename({suffix: '.min'}))
			.pipe(gulp.dest(path.src.js))
			.pipe(notify('JS DONE!'))
			.pipe(reload({stream:true}));
});


gulp.task('browserSync', function(){
	browserSync({
		server:{
			baseDir: "./app"
		},
		port: 8080,
		open: true,
		notify: false
	});
});

gulp.task('clean', function() {
    del.sync('dist'); // Удаляем папку dist перед сборкой
});

gulp.task('build', ['clean', 'css', 'js'], function(){
	gulp.src([path.src.css + "SmallCalendarStyle.css", path.src.css + "SmallCalendarStyle.min.css"])
		.pipe(gulp.dest(path.build.css));	

	gulp.src(path.src.js + "**/*.js")
		.pipe(gulp.dest(path.build.js));
});

gulp.task('watcher', function(){
	gulp.watch(path.watch.html, ['html']);
	gulp.watch(path.watch.css, ['css']);
	gulp.watch(path.watch.js, ['js']);
});

gulp.task('default', ['browserSync', 'watcher']);