#!/usr/bin/env node
"use strict";
var pkg = require('../package.json');
var config = require("../config.json");
var commander = require("commander");
var fs = require("fs");
var path = require("path");

initSetting();

commander
    .version(pkg.version);
commander
    .command('set <name> [content]')
    .description('路径前缀配置:set prefix engine(默认值) ')
    .action(function(name,content){
        if(name && content){
            updateConfig(name,content);
        }
    });
commander
    .command('pro')
    .description('生产环境')
    .action(function(options){
        setting.env = "pro";
        startGulp()
    });
commander
    .command('dvp')
    .description('开发环境')
    .action(function(options){
        setting.env = "dvp";
        startGulp()
    });
commander.parse(process.argv);

function initSetting() {
    global.setting = {};
    var pjConfig = path.resolve("./build.json");
    if(fs.existsSync(pjConfig)){
        var customCon = require(pjConfig);
        if(typeof customCon.prefix !== "undefined"){
            setting.prefix = customCon.prefix;
        }
        if(typeof customCon.dist !== "undefined"){
            setting.dist = customCon.dist;
        }
        if(typeof customCon.outputName !== "undefined"){
            setting.outputName = customCon.outputName;
        }
    }else {
        setting.prefix = config.prefix;
    }
    setting.projectPath = path.join(".",setting.prefix);
    setting.frameWorksPath = path.join(setting.projectPath,"frameworks/cocos2d-html5/");
    setting.frameWorksPathModuleJson = path.join(setting.frameWorksPath,"moduleConfig.json");
    setting.frameWorksPathBoot = path.join(setting.frameWorksPath,"CCBoot.js");
    setting.res = path.join(setting.projectPath,"res");
    setting.mainPath = path.join(setting.projectPath,"main.js");
    setting.projectJson = path.join(setting.projectPath,"project.json");
    setting.dist = setting.dist||"dist";
    setting.dist = path.join(setting.dist,setting.prefix);
    setting.outputName = setting.outputName||"game.pkg.js";
    setting.indexHtmlPath = path.join(setting.projectPath,"index.html")
}

if(typeof process.argv[2] === "undefined"){
    setting.env = "pro";
    startGulp()
}

//更新配置文件
function updateConfig(name,val){
    var settingPath = path.resolve("../config.json");
    if(typeof stringify[name] === "undefined"){
        return;
    }
    config[name] = val;
    fs.writeFileSync(settingPath,JSON.stringify(config,null,1));
}
//获取js压缩列表
function getJsList() {
    var finalModuleJsList = {};
    var finalProjectJsList = {};
    //读取项目project.json
    if(fs.existsSync(setting.projectJson)){
        var projectJson = JSON.parse(fs.readFileSync(setting.projectJson));
    }else{
        console.error("找不到project.json");
        process.exit(0)
    }
    //读取框架模块配置
    if(fs.existsSync(setting.frameWorksPathModuleJson)){
        var moduleJson = JSON.parse(fs.readFileSync(setting.frameWorksPathModuleJson));
    }else{
        console.error("找不到框架模块配置文件moduleConfig.json");
        process.exit(0)
    }
    var projectModulesList = projectJson["modules"];
    var moduleModulesList = moduleJson["module"];

    //根据模块名递归解析模块配置文件，并保存在obj中
    function parseModule(name,obj) {
        var subModuleList = moduleModulesList[name];
        if(typeof subModuleList === "undefined"){
            return ;
        }
        subModuleList.forEach(function (t) {
            if(/.*\.js$/.test(t)){
                obj[t] = 1;
            }else{
                parseModule(t,obj)
            }
        })
    }
    //查找项目列表依赖，解析模块依赖并保存
    projectModulesList.forEach(function (t) {
        parseModule(t,finalModuleJsList);
    });
    projectJson.jsList.forEach(function (t) {
        finalProjectJsList[t] = 1;
    });
    if(setting.pjConfig&&setting.pjConfig.apppendList&&Array.isArray(setting.pjConfig.apppendList)){
        setting.pjConfig.apppendList.forEach(function (t) {
            finalProjectJsList[t] = 1;
        });
    }
   return {
       finalProjectJsList:Object.keys(finalProjectJsList)
            .map(function (item) {
            return path.resolve(path.relative("/",item));
        }),
       finalModuleJsList:[
           setting.frameWorksPathBoot,
           ...Object.keys(finalModuleJsList)
                .map(function (item) {
                return path.resolve(setting.frameWorksPath,item);
        })]
    }
}
//运行task
function startGulp(){
    var gulp = require("../lib/logEventsGulp");
    setting.jsList = getJsList();
    setting.dist= setting.dist||"dist";
    if(setting.env === "dvp"){
        require("../task/dvp.js");
    }else{
        require("../task/build.js");
    }
    gulp.start("default");
}
//