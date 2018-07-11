const gulp = require('gulp');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const reload = browserSync.reload;

const SOURCEPATHS = {
    html: 'src/**/*.html',
    sass: 'src/scss/*.scss',
    js: 'src/js/*.js'
};
const APPPATHS = {
    root: 'app/',
    css: 'app/css',
    js: 'app/js'
};

/*Deprecated*/
// gulp.task('clean-html', () => {
//     return gulp.src(APPPATHS.root = '/*.html', { read: false, force: true })
//         .pipe(clean())
// });
//
// gulp.task('clean-css', () => {
//     return gulp.src(APPPATHS.css = '/*.css', { read: false, force: true })
//         .pipe(clean())
// });

gulp.task('clean-html', (done) => {
    del(APPPATHS.root + '/**/*.html');
    done();
});

gulp.task('clean-css', (done) => {
    del(APPPATHS.css + '/**/*.css');
    done();
});

gulp.task('clean-scripts', () => {
    return del(APPPATHS.js + '/**/*.js');
});

gulp.task('clean', gulp.series('clean-html', 'clean-css', 'clean-scripts'));

gulp.task('copy', () => {
    return gulp.src(SOURCEPATHS.html)
        .pipe(gulp.dest(APPPATHS.root));
});

gulp.task('sass', () => {
   return gulp.src(SOURCEPATHS.sass)
       .pipe(autoprefixer())
       .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
       .pipe(gulp.dest(APPPATHS.css));
});

gulp.task('scripts', () => {
    return gulp.src(SOURCEPATHS.js)
        .pipe(concat('main.js'))
        .pipe(gulp.dest(APPPATHS.js))
});

gulp.task('serve', () => {
    gulp.watch([SOURCEPATHS.html], gulp.series('clean-html', 'copy'));
    gulp.watch([SOURCEPATHS.sass], gulp.series('clean-css','sass'));
    gulp.watch([SOURCEPATHS.js], gulp.series('clean-scripts', 'scripts'));
    browserSync.init([APPPATHS.root + '/*.html', APPPATHS.css + '/*.css', APPPATHS.js + '/*.js'], {
        server: {
            baseDir: APPPATHS.root
        }
    })
});

gulp.task('watch', gulp.series('clean', 'copy', 'sass', 'scripts', () => {
    gulp.watch([SOURCEPATHS.html], gulp.series('clean-html', 'copy'));
    gulp.watch([SOURCEPATHS.sass], gulp.series('clean-css','sass'));
    gulp.watch([SOURCEPATHS.js], gulp.series('clean-scripts', 'scripts'));
}));

gulp.task('default', gulp.series('clean', 'copy', 'sass', 'scripts', 'serve'));