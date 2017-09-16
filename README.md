
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
cocospack set perfix xxx //xxx可以修改；表示当前目录与项目目录之间的目录结构，默认是engine。生成代码会有同样的目录层级
```

##build.json
命令执行时会读取当前根目录下build.json文件，覆盖全局配置；
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


