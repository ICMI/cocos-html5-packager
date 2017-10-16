var path = require("path");
var through2 = require('through2');
var gulp = require('gulp');
var clean = require('gulp-clean');
gulp.task("projectJson",function () {
    return gulp.src(setting.projectJson)
        .pipe(through2.obj(function (file, enc, cb) {
            var json = JSON.parse(file.contents);
            json.modules=[];
            delete json.modules;
            delete json.engineDir;
            json.jsList = [setting.outputName];
            file.contents = new Buffer(JSON.stringify(json,null,1));
            file.base =path.dirname(file.path);
            cb(null,file);
        }))
        .pipe(gulp.dest(setting.dist,{cwd:"."}))
});

gulp.task("html",function () {
    return gulp.src([setting.projectPath+"/*.html"])
        .pipe(through2.obj(function (file, enc, cb) {
            file.base =path.dirname(file.path);
            file.contents = new Buffer(file.contents.toString().replace(/<script.*CCBoot.*?script>/,'<script src="cocos2d.pkg.js"></script>'))
            file.contents = new Buffer(file.contents.toString().replace(/<script.*main.*?script>/,'<script cocos src="main.js"></script>'))
            cb(null,file);
        }))
        .pipe(gulp.dest(setting.dist))
});
gulp.task("clean",function (cb) {
    return gulp.src(setting.dist)
        .pipe(clean());
});