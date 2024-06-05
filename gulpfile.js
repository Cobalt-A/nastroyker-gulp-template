import pkg from "gulp";
import browserSync from "browser-sync";
import gulpSass from "gulp-sass";
import dartSass from "sass";
import postcss from "gulp-postcss";
import concat from "gulp-concat";
const sass = gulpSass(dartSass);
const { src, dest, parallel, series, watch } = pkg;

function sync() {
  browserSync.init({
    server: {
      baseDir: "public/",
    },
    ghostMode: { clicks: false },
    notify: false,
    online: true,
  });
}

function scripts() {
  return src(["src/scripts/*.js"])
  .pipe(concat("scripts.js"))
  .pipe(dest("public/js"))
  .pipe(browserSync.stream());
}

function styles() {
  return src([`src/styles/index.*`])
  .pipe(sass({ "include css": true }))
  .pipe(postcss([]))
  .pipe(concat("styles.css"))
  .pipe(dest("public/css"))
  .pipe(browserSync.stream());
}

function startWatch() {
  // т.к. browserSync.stream обновляет только первое найденное подключение стилей лучше использовать browserSync.reload
  watch(`src/styles/**/*`, { usePolling: true }, styles).on("change", browserSync.reload);
  watch(["src/scripts/**/*.js"], { usePolling: true }, scripts).on("change", browserSync.reload);
  watch(`public/**/*`, { usePolling: true }).on("change", browserSync.reload);
}

export { scripts, styles };

export default series(scripts, styles, parallel(sync, startWatch));
