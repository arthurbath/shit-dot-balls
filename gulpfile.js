let del = require('del')
let gulp = require('gulp')
let browserSync = require('browser-sync').create()
let gulpLoadPlugins = require('gulp-load-plugins')
let $ = gulpLoadPlugins()

// Build tasks
gulp.task('clearBuild', done => {
	del(['build/*'])
	done()
})

gulp.task('buildHypertext', done => {
	gulp.src(['src/hypertext/**/*.html', '!**/vendor/**'])
		.pipe($.htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest('build')) // Copy to build
	done()
})

gulp.task('buildScripts', done => {
	gulp.src(['src/scripts/vendor/*.js', 'src/scripts/**/*.js'])
		.pipe($.sourcemaps.init()) // Initialize sourcemap
			.pipe($.concat({ path: 'script.js' })) // Concatenate all
			.pipe($.babel({
				presets: ['es2015'],
				compact: true,
			})) // Transpile
			.on('error', console.error.bind(console)) // Catch transpilation error
			.pipe($.uglify()) // Minify
		.pipe($.sourcemaps.write('.')) // Write sourcemap
		.pipe(gulp.dest('build')) // Copy to build
	done()
})

gulp.task('buildStyles', done => {
	gulp.src(['src/styles/**/*.scss', '!**/vendor/**'])
		.pipe($.sourcemaps.init()) // Initialize sourcemap
			.pipe($.sass() // Transpile
			.on('error', $.sass.logError)) // Catch transpilation error
			.pipe($.autoprefixer()) // Auto-prefix properties for browser support
			.pipe($.cssnano()) // Minify
		.pipe($.sourcemaps.write('.')) // Write sourcemap
		.pipe(gulp.dest('build')) // Copy to build
		.pipe(browserSync.stream({ match: 'build/**/*.css' })) // Send updates to BrowserSync
	done()
})

gulp.task('build', gulp.series('clearBuild', 'buildHypertext', 'buildScripts', 'buildStyles'))

// BrowserSync tasks
gulp.task('startBrowserSync', () => {
	browserSync.init({
		notify: false,
		open: false,
		server: {
			baseDir: 'build',
		},
	})
})

gulp.task('reloadBrowserSync', done => {
	browserSync.reload()
	done()
})

// Watch tasks
gulp.task('watch', done => {
	gulp.watch('src/hypertext/**/*.html', gulp.series('buildHypertext', 'reloadBrowserSync'))
	gulp.watch('src/scripts/**/*.js', gulp.series('buildScripts', 'reloadBrowserSync'))
	gulp.watch('src/styles/**/*.scss', gulp.series('buildStyles'))
	done()
})

// Beautification tasks
gulp.task('beautifyHypertext', done => {
	gulp.src(['src/hypertext/**/*.html', '!**/vendor/**'])
		.pipe($.jsbeautifier()) // Beautify src
		.pipe(gulp.dest('src/hypertext')) // Replace src
	done()
})

gulp.task('beautifyScripts', done => {
	gulp.src(['src/scripts/**/*.js', '!**/vendor/**'])
		.pipe($.jsbeautifier()) // Beautify src
		.pipe(gulp.dest('src/scripts')) // Replace src
	done()
})

gulp.task('beautifyStyles', done => {
	gulp.src(['src/styles/**/*.scss', '!**/vendor/**'])
		.pipe($.csscomb()) // Beautify src
		.pipe($.stylefmt()) // Beautify src
		.pipe(gulp.dest('src/styles')) // Replace src
	done()
})

gulp.task('beautifySrc', gulp.series('beautifyHypertext', 'beautifyScripts', 'beautifyStyles'))

// Task flows
gulp.task('default', gulp.series('build', gulp.parallel('startBrowserSync', 'watch')))