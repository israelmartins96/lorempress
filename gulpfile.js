/**
 * Using Gulp 5.
 */

/**
 * Modules.
 */
// Gulp.
import gulp from 'gulp';

// Gulp Rename for modifying file name.
import rename from 'gulp-rename';

// Sass CSS compiler.
import * as dartSass from 'sass';
import gulpSassModule from 'gulp-sass';

const gulpSass = gulpSassModule( dartSass );

// Gulp Autoprefixer for adding CSS vendor prefixes.
import autoprefixer from 'gulp-autoprefixer';

// Gulp Uglify.
import uglify from 'gulp-uglify';

// Gulp Sourcemaps.
import * as sourcemaps from 'gulp-sourcemaps';

// Browserify.
import browserify from 'browserify';

// Babelify.
import babelify from 'babelify';

// Vinyl Source Stream.
import source from 'vinyl-source-stream';

// Vinyl Buffer.
import buffer from 'vinyl-buffer';

// Browser Sync.
import theBrowserSync, { watch } from 'browser-sync';

const browserSync = theBrowserSync.create();
// BrowserSync Reload.
const reload = browserSync.reload;

/**
 * Stylesheets and scripts sources and destinations.
 */
const paths = {
    projectURL: 'http://127.0.0.1/mysandbox/javascript/gulp/',
    current: '.',
    html: {
        watch: './**/*.html'
    },
    styles: {
        src: {
            main: 'assets/src/scss/style.scss',
            dir: 'assets/src/scss/',
            files: [
                'style.scss'
            ]
        },
        dest: './assets/css/',
        watch: 'assets/src/scss/**/*.scss'
    },
    scripts: {
        src: {
            main: [
                'assets/src/js/random-lorem-generator.js',
                'assets/src/js/custom-input.js'
            ],
            dir: 'assets/src/js/',
            files: [
                'random-lorem-generator-bundled.js'
            ]
        },
        dest: './assets/js/',
        watch: 'assets/src/js/**/*.js'
    },
    php: {
        watch: './**/*.php'
    }
};

/**
 * Tasks data.
 */
// Tasks list.
const tasksList = {
    default: 'default',
    style: 'style',
    js: 'js',
    watch: 'watch',
    browserSync: 'browser-sync'
};

// Default tasks.
const tasksDefault = [
    tasksList.style,
    tasksList.js,
    tasksList.browserSync
];

/**
 * Compiles stylesheet with sourcemap enabled.
 */
const loadStyle = async () => {
    gulp.src( paths.styles.src.main, { sourcemaps: true } )
    // Render CSS in minified form.
    .pipe( gulpSass( {
        errorLogToConsole: true,
        outputStyle: 'compressed'
    } ) )
    // Log errors in the console if any during the CSS rendering.
    .on( 'error', console.error.bind( console ) )
    // Add browser vendor CSS prefixes.
    .pipe( autoprefixer( {
        cascade: false
    } ) )
    // Add the ".min" suffix to the file name.
    .pipe( rename( { suffix: '.min' } ) )
    // Render the CSS file in the CSS directory with external sourcemaps.
    .pipe( gulp.dest( paths.styles.dest, { sourcemaps: '.' } ) )
    // Add BrowserSync stream.
    .pipe( browserSync.stream() );
};

/**
 * Maps scripts.
 */
const mapScripts = entryScript => {
    // Browserify.
    return browserify()
        // Transform babelify.
        .transform( babelify )
        // Make source file available.
        .require( paths.scripts.src.main, { entry: true } )
        // Bundle.
        .bundle()
        // Check source.
        .pipe( source( entryScript ) )
        // Add ".min" file name suffix.
        .pipe( rename( { extname: '.min.js' } ) )
        // Buffer.
        .pipe( buffer() )
        // Sourcemap.
        .pipe( sourcemaps.init( { loadMaps: true } ) )
        // Uglify.
        .pipe( uglify() )
        // Render the JavaScript file in the directory with external sourcemaps.
        .pipe( gulp.dest( paths.scripts.dest, { sourcemaps: '.' } ) )
        // Add BrowserSync stream.
        .pipe( browserSync.stream() );
};

/**
 * Compiles JavaScript.
 */
const loadJavaScript = async () => {
    paths.scripts.src.files.map( mapScripts );
};

/**
 * Watches for specified tasks.
 */
const doWatch = async () => {
    // Watch for style updates.
    gulp.watch( paths.styles.watch, loadStyle );
    // Watch for script updates.
    gulp.watch( paths.scripts.watch, loadJavaScript );
};

/**
 * Browser Sync.
 */
const doBrowserSync = async () => {
    browserSync.init( {
        open: false,
        injectChanges: true,
        proxy: paths.projectURL,
        watch: true
    } );

    /**
     * Only used when not using the Gulp 'watch' task (i.e., when using 'browser-sync' task):
     */
    // Watch for style updates.
    gulp.watch( paths.styles.watch, loadStyle ).on( 'change', reload );
    // Watch for script updates.
    gulp.watch( paths.scripts.watch, loadJavaScript ).on( 'change', reload );
    // Watch for updates in the HTML files.
    gulp.watch( paths.html.watch ).on( 'change', reload );
    // Watch for updates in the PHP files.
    gulp.watch( paths.php.watch ).on( 'change', reload );
};

/**
 * Tasks.
 */
// For Browser Sync. "gulp browser-sync" in CLI.
gulp.task( tasksList.browserSync, doBrowserSync );

// To compile stylesheet. "gulp style" in CLI.
gulp.task( tasksList.style, loadStyle );

// To compile script. "gulp js" in CLI.
gulp.task( tasksList.js, loadJavaScript );

// To watch for file changes. "gulp watch" in CLI.
gulp.task( tasksList.watch, doWatch );

// Task to run default tasks. "gulp" in CLI.
gulp.task( tasksList.default, gulp.parallel( tasksDefault ) );