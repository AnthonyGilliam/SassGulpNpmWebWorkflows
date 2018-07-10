const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const reload = browserSync.reload;

const SOURCEPATHS = {
    sass: 'src/scss/*.scss',
    html: 'src/**/*.html'
};
const APPPATHS = {
    root: 'app/',
    css: 'app/css',
    js: 'app/js'
};

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

gulp.task('serve', gulp.series('sass', () => {
    browserSync.init([APPPATHS.root + '/*.html', APPPATHS.css + '/*.css', APPPATHS.js + '/*.js'], {
        server: {
            baseDir: APPPATHS.root
        }
    })
}));

gulp.task('watch', gulp.series('sass', () => {
    gulp.watch([SOURCEPATHS.sass], gulp.series('sass'));
    gulp.watch([SOURCEPATHS.html], gulp.series('copy'));
}));

gulp.task('default', gulp.series('copy', 'sass', 'watch'));