
#cocos2d-html5-packager
###Package your cocos2d-html5 app into js bundles in the command line.

##Installation
```shell
npm install cocos2d-html5-packager -g
```

##Usage
###From the Command Line
```shell
cocospack //打包生成js
cocospack dvp //输出未压缩版js及sourcemap
cocospack set perfix xxx //xxx可以修改；prefix表示当前目录与项目目录之间的目录结构，默认是engine。生成代码会有同样的目录层级
```
###For example
项目目录结构：
``` shell
www
 |--engine
     |--res
     |--iframeworks
     |--src
     |--main.js
     |--project.json
     |--index.html
```

执行

```shell
cd www
cocospack set prefix "engine"
cocospack
```
输出
``` shell
www
 |--dist
     |-engine
        |--cocos2d.pkg.js
        |--game.pkg.js
        |--index.html
        |--main.js
        |--project.json
     
 |--engine
     |--res
     |--iframeworks
     |--src
     |--main.js
     |--project.json
     |--index.html
```

执行
```shell
cd www/engine
cocospack set prefix ""
cocospack
```
输出
``` shell
www
 |-engine
    |--dist
       |--cocos2d.pkg.js
       |--game.pkg.js
       |--index.html
       |--main.js
       |--project.json
    |--res
    |--iframeworks
    |--src
    |--main.js
    |--project.json
    |--index.html
```

(注：```cocospack set```命令只用执行一次即可写入到全局配置，不用每次执行都set一次。示例代码只是演示如何使用set命令)


##build.json
命令执行时会读取当前根目录下build.json文件，覆盖全局配置。

当前全局配置：
```shell
prefix(可以通过cocospack set命令修改)
```
build.json文件配置项：
```shell
{
    prefix:"",
    outputName:"",//输出文件名称
    dist：""//目标路径
}
```
##api

_todo:待开发_


