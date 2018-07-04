"use strict";

var gulp = require("gulp"),
  watch = require("gulp-watch"),
  sass = require("gulp-sass"),
  browserSync = require("browser-sync"),
  concat = require("gulp-concat"),
  rigger = require("gulp-rigger"),
  uglify = require("gulp-uglify"),
  prefixer = require("gulp-autoprefixer"),
  prettify = require("gulp-html-prettify"),
  cssmin = require("gulp-clean-css"),
  imagemin = require("gulp-imagemin"),
  pngquant = require("imagemin-pngquant"),
  rimraf = require("rimraf"),
  sourcemaps = require("gulp-sourcemaps"),
  htmlImport = require("gulp-html-import"),
  reload = browserSync.reload;

var path = {
  build: {
    //Куда складывать
    html: "build/",
    js: "build/js/",
    css: "build/css/",
    img: "build/img/",
    fonts: "build/fonts/"
  },
  src: {
    //Пути откуда брать исходники
    html: "src/*.html",
    js: "src/js/*.js",
    style: "src/style/main.scss",
    img: ["src/img/*.*", "src/img/**/*.*"]
  },
  watch: {
    //За чем наблюдать
    html: "src/**/*.html",
    js: "src/js/*.js",
    style: "src/style/**/*.scss",
    img: ["src/img/*.*", "src/img/**/*.*"]
  },
  clean: "./build"
};

var config = {
  server: {
    baseDir: "./build"
  },
  tunnel: true,
  host: "localhost",
  port: 9000,
  logPrefix: "WildWood",
  fallback: "build/index.html"
};

function log(error) {
  console.log(
    [
      "",
      "----------ERROR MESSAGE START----------",
      "[" + error.name + " in " + error.plugin + "]",
      error.message,
      "----------ERROR MESSAGE END----------",
      ""
    ].join("\n")
  );
  this.end();
}

//собрать html
gulp.task("html:build", function() {
  gulp
    .src(path.src.html)
    .pipe(htmlImport("src/html/"))
    .pipe(prettify({indent_char: ' ', indent_size: 2}))
    .pipe(rigger())
    .on("error", log)
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({ stream: true }));
});

//собрать js
gulp.task("js:build", function() {
  gulp
    .src(path.src.js)
    .pipe(uglify())
    .on("error", log)
    .pipe(concat("main.min.js"))
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({ stream: true }));
});

//собрать стили
gulp.task("style:build", function() {
  gulp
    .src(path.src.style)
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(prefixer())
    .pipe(cssmin())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.css))
    .pipe(reload({ stream: true }));
});

//сжать картинки
gulp.task("image:build", function() {
  gulp
    .src(path.src.img)
    .pipe(
      imagemin({
        progressive: true,
        optimizationLevel: 5,
        svgoPlugins: [{ removeViewBox: false }],
        use: [pngquant()],
        interlaced: true
      })
    )
    .pipe(gulp.dest(path.build.img))
    .pipe(reload({ stream: true }));
});

//следить за изменениями
gulp.task("watch", function() {
  watch([path.watch.html], function(event, cb) {
    gulp.start("html:build");
  });
  watch([path.watch.style], function(event, cb) {
    gulp.start("style:build");
  });
  watch([path.watch.js], function(event, cb) {
    gulp.start("js:build");
  });
  watch(["src/img/*.*", "src/img/**/*.*"], function(event, cb) {
    gulp.start("image:build");
  });
});

//cобрать все
gulp.task("build", ["html:build", "js:build", "style:build", "image:build"]);

gulp.task("webserver", function() {
  browserSync(config);
});

//очистка удаленных файлов из build
gulp.task("clean", function(cb) {
  rimraf(path.clean, cb);
});

//дефолтный таск, который запускает сборку
gulp.task("default", ["build", "webserver", "watch"]);
