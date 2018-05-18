var gulp = require('gulp');

var server = require('gulp-webserver');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minCss = require('gulp-clean-css');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var sequence = require('gulp-sequence');

var dataJson = require('./data/data.json');
var datailJson = require('./data/detail.json');
var url = require('url');

gulp.task('server', function() {
    gulp.src('target')
        .pipe(server({
            port: 8080,
            open: true,
            livereload: true,
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url, true).pathname;
                if (pathname === '/API/swiperData') {
                    var data = {
                        code: 1,
                        data: dataJson.swiper
                    }
                    res.end(JSON.stringify(data))
                } else if (pathname === '/API/listData') {
                    var pagenum = url.parse(req.url, true).query.pagenum;
                    var data = {
                        code: 1,
                        data: dataJson.list
                    }
                    res.end(JSON.stringify(data))
                } else if (pathname === '/API/detail') {
                    var id = url.parse(req.url, true).query.id;
                    var target = datailJson.filter(function(item) {
                        return item.id == id;
                    })
                    var data = {
                        code: 1,
                        data: target
                    }
                    res.end(JSON.stringify(data))
                }
                next()
            }
        }));
});

gulp.task('copyCss', function() {
    return gulp.src('src/css/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0']
        }))
        .pipe(minCss())
        .pipe(rev())
        .pipe(gulp.dest('target/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/css'))

});

gulp.task('copyMcss', function() {
    return gulp.src('src/css/*.min.css')
        .pipe(gulp.dest('target/css'))
})

gulp.task('copyJs', function() {
    return gulp.src('src/js/**/*.js')
        .pipe(gulp.dest('target/js'))
});


gulp.task('copyFonts', function() {
    return gulp.src('src/fonts/*')
        .pipe(gulp.dest('target/fonts'))
});

gulp.task('copyImg', function() {
    return gulp.src('src/imgs/*.{png,jpg}')
        .pipe(gulp.dest('target/imgs'))
});

gulp.task('copyHtml', function() {
    return gulp.src(['rev/**/*.json', 'src/*.html'])
        .pipe(revCollector({
            replaceReved: true
        }))
        .pipe(gulp.dest('target'))
});


gulp.task('default', function(cb) {
    sequence('copyCss', 'copyMcss', 'copyJs', 'copyFonts', 'copyImg', 'copyHtml', 'server', cb);
})