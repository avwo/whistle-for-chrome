# whistle-for-chrome
设置代理、管理whistle配置页面的Chrome插件


# 安装

1. 下载whistle插件：[whistle.crx.zip](https://raw.githubusercontent.com/avwo/whistle-for-chrome/master/dist/whistle.crx.zip)
2. 打开页面：[chrome://extensions](chrome://extensions)
3. 把下载的 **whistle.crx.zip** 解压后把 **whistle.crx** 文件拖到页面[chrome://extensions](chrome://extensions)，默认安装即可


# 功能

支持设置HTTP、HTTPS代理，支持快速切换配置页面

# 用法

1. 启动whistle
2. 切换到whistle的代理，插件默认设置了两个代理whistle(127.0.0.1:8899)、aeproxy(127.0.0.1:9527)，默认是启用whistle的代理。
3. 如果这些代理无法满足(可能你的whistle不是部署在本地，或者启动时更改了端口号)，这种情况可以通过 `设置代理` 来修改或新增代理。 