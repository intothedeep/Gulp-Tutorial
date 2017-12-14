// 'use strict';
// import gulp from 'gulp';
const gulp = require('gulp');
const path = require('path');
const pump = require('pump'); // pump is a small node module that pipes streams together and destroys all of them if one of them closes.

const webserver = require('gulp-webserver'); // running like server
const livereload = require('gulp-livereload');

// minify js, css, html
const uglify = require('gulp-uglify'); // minify js files
const uglifycss = require('gulp-uglifycss'); // minify css files

const htmlmin = require('gulp-htmlmin'); // minify html
const imagemin = require('gulp-imagemin'); // minify image
const concat = require('gulp-concat'); // build js, css files to each 1 of js, css file

// build css preprocessors
const less = require('gulp-less') // build less
const sass = require('gulp-sass'); // build sass

// change name of files
const rename = require('gulp-rename');



// src:files I wrote, dist:files being built by gulp
const src = 'public/src';
const dist = 'public/dist';

// path for each type of files, which you want to build
const paths = {
  html: src + '/*.html',
	js: src + '/js/*.js',
  css: src + '/css/*.css',
	scss: src + '/scss/*.scss',
  less: src + '/less/*.less',
  image: src + '/images/*'
};


// combine js and compress
gulp.task('compress-js', function (cb) {
  pump([
      gulp.src(paths.js),
      concat('bundle.js'),      //bundle js files
      // gulp.dest('public/src/js/'),
      uglify(),                 //minify bundle.js
      rename({                  //renames the concatenated js file
        basename : 'project',   //the base name of the renamed js file
        extname : '.min.js'     //the extension fo the renamed js file
      }),
      gulp.dest(dist + '/js')   //save project.min.js at public/dist/js
    ],
    cb
  );
});

// 1. convert less, sass to css
// 2. combine css to bundle.css
// 3. uglify bundle.css to ~.min.css

// compile sass to css files
gulp.task('compile-sass', function (cb) {
  pump([
      gulp.src(paths.scss),
      sass({
        errLogToConsole:true
      }),
      gulp.dest(src + '/css')
    ],
    cb
  );
});

// compile less to css files
gulp.task('compile-less', (cb) => {
  pump([
      gulp.src(paths.less),
      less(),
      gulp.dest(src + '/css')
    ],
    cb
  );
});

// combine css files to project.css and minify, then rename project.min.css
gulp.task('compress-css', function (cb) {
  pump([
      gulp.src(paths.css),
      concat('bundle.css'),
      // gulp.dest(src + "/css"),
      uglifycss(),
      rename({
        basename:'project',
        extname:'.min.css'
      }),
      gulp.dest(dist + '/css')
    ],
    cb
  );
});

// minify html files
gulp.task('minifyHtml', function (cb) {
  pump([
      gulp.src(paths.html),
      htmlmin({ collapseWhitespace: true }),
      gulp.dest(dist + '/')
    ],
    cb
  );
});

//minify images
gulp.task('minifyImg', () => {
    return gulp.src(paths.image)
           .pipe(imagemin())
           .pipe(gulp.dest(dist + "/images"));
});

// delete dist folder
// const del  = require('del');
// gulp.task('clean', () => {
//     return del.sync([dist]);
// });


// watch file change and reload server
gulp.task('watch', function () {
	livereload.listen();
	gulp.watch(paths.js, ['compress-js']);
	gulp.watch(paths.scss, ['compile-sass', 'compress-css']);
	gulp.watch(paths.less, ['compile-less', 'compress-css']);
	gulp.watch(paths.image, ['minifyImg']);
	gulp.watch(paths.html, ['minifyHtml']);
	gulp.watch(dist + '/**').on('change', livereload.changed);
});

// running webserver
gulp.task('server', function () {
  return gulp.src(dist + '/')
  .pipe(webserver({
    port:80
  }));
});

//기본 task 설정
gulp.task('default', [
    // 'clean',
  	'server',
    'minifyHtml',
    'minifyImg',
  	'compile-sass',
  	'compile-less',
    'compress-js',
    'compress-css',
  	'watch'
  ]
);





















// how to use src()
// gulp.src([
// 	'public/src/js/loginForm.js'
// 	'public/src/js/slider/*.js'
// 	'!public/src/js/slider/slider-beta.js'
// 	] ...);

// how to use pipe()
// gulp.src('public/src/js/*.js')
// 	.pipe(stripDebug())
// 	.pipe(uglify())
// 	.pipe(concat('script.js'))
// 	.pipe(gulp.dest('public/dist/js'));


// const concatCss = require('gulp-concat-css'); // css together

// const minifyCSS = require('gulp-csso'); // minify css , i am using uglifycss
// const minifyhtml = require('gulp-minify-html'); // depreciated

/* how to use examples */





// const webserver = require('gulp-webserver');
// gulp.task('webserver', function() {
//   gulp.src('app')
//     .pipe(webserver({
//       livereload: true,
//       directoryListing: true,
//       open: true
//     }));
// });


// const gulp = require('gulp'),
//     less = require('gulp-less'),
//     livereload = require('gulp-livereload');
//
// gulp.task('less', function() {
//   gulp.src('less/*.less')
//     .pipe(less())
//     .pipe(gulp.dest('css'))
//     .pipe(livereload());
// });
//
// gulp.task('watch', function() {
//   livereload.listen();
//   gulp.watch('less/*.less', ['less']);
// });

// const concat = require('gulp-concat');
// gulp.task('scripts', function() {
//   return gulp.src(['./lib/file3.js', './lib/file1.js', './lib/file2.js'])
//     .pipe(concat({
//       path: 'new.js',
//       stat: {
//         mode: 0666
//       }})
//     )
//     .pipe(gulp.dest('./dist'));
// });

// const concatCss = require('gulp-concat-css'); // css together
// gulp.task('default', function () {
//   return gulp.src('assets/**/*.css')
//     .pipe(concatCss("styles/bundle.css"))
//     .pipe(gulp.dest('out/'));
// });


// const uglify = require('gulp-uglify');
// const pump = require('pump');
// gulp.task('compress', function (cb) {
//   pump([
//         gulp.src('lib/*.js'),
//         uglify(),
//         gulp.dest('dist')
//     ],
//     cb
//   );
// });

// const uglifycss = require('gulp-uglifycss');
// gulp.task('css', function () {
//   gulp.src('./styles/**/*.css')
//     .pipe(uglifycss({
//       "maxLineLen": 80,
//       "uglyComments": true
//     }))
//     .pipe(gulp.dest('./dist/'));
// });

// const htmlmin = require('gulp-htmlmin');
// gulp.task('minify', function() {
//   return gulp.src('src/*.html')
//     .pipe(htmlmin({collapseWhitespace: true}))
//     .pipe(gulp.dest('dist'));
// });

// const rename = require("gulp-rename");
// // rename via string
// gulp.src("./src/main/text/hello.txt")
//   .pipe(rename("main/text/ciao/goodbye.md"))
//   .pipe(gulp.dest("./dist")); // ./dist/main/text/ciao/goodbye.md
//
// // rename via function
// gulp.src("./src/**/hello.txt")
//   .pipe(rename(function (path) {
//     path.dirname += "/ciao";
//     path.basename += "-goodbye";
//     path.extname = ".md"
//   }))
//   .pipe(gulp.dest("./dist")); // ./dist/main/text/ciao/hello-goodbye.md
//
// // rename via hash
// gulp.src("./src/main/text/hello.txt", { base: process.cwd() })
//   .pipe(rename({
//     dirname: "main/text/ciao",
//     basename: "aloha",
//     prefix: "bonjour-",
//     suffix: "-hola",
//     extname: ".md"
//   }))
//   .pipe(gulp.dest("./dist")); // ./dist/main/text/ciao/bonjour-aloha-hola.md
// See test/rename.spec.js for more examples and test/path-parsing.spec.js for hairy details.

// const pump = require('pump');
// gulp.task('compress', function (cb) {
//   pump([
//       gulp.src('lib/*.js'),
//       uglify(),
//       gulp.dest('dist')
//     ],
//     cb
//   );
// });

//  imagemin
// Basic
// const gulp = require('gulp');
// const imagemin = require('gulp-imagemin');
//
// gulp.task('default', () =>
//     gulp.src('src/images/*')
//         .pipe(imagemin())
//         .pipe(gulp.dest('dist/images'))
// );
// Custom plugin options
// …
// .pipe(imagemin([
//     imagemin.gifsicle({interlaced: true}),
//     imagemin.jpegtran({progressive: true}),
//     imagemin.optipng({optimizationLevel: 5}),
//     imagemin.svgo({
//         plugins: [
//             {removeViewBox: true},
//             {cleanupIDs: false}
//         ]
//     })
// ]))
// …
