"use strict";
var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var through2 = require('through2');
var path = require("path");
var gulpSequence = require('gulp-sequence')
require("./commonTask");

gulp.task("js-frameworks",function () {
    return gulp.src(setting.jsList.finalModuleJsList)
        .pipe(sourcemaps.init())
        .pipe(concat("cocos2d.pkg.js", {newLine: ';\n'}))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(setting.dist));
});
gulp.task("js-jsList",function () {
    return gulp.src(setting.jsList.finalProjectJsList)
        .pipe(sourcemaps.init())
        .pipe(concat(setting.outputName, {newLine: ';\n'}))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(setting.dist));
});

gulp.task("js",["js-frameworks","js-jsList"]);

gulp.task("mainJs",function () {
    return gulp.src([setting.mainPath])
        .pipe(through2.obj(function (file, enc, cb) {
            file.base =path.dirname(file.path);
            cb(null,file);
        }))
        .pipe(gulp.dest(setting.dist))
});
gulp.task("default",gulpSequence("clean",["js","projectJson","mainJs","html"]));