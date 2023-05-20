# CNPrint-VueEditor<sup>菜鸟云打印Vue编辑器</sup>

### 简介
    云打印是由菜鸟出品的客户端，是以独立进程和打印机交互（非作为浏览器插件进行打印）。
    浏览器或其他客户端需要通过WebSocket协议与云打印客户端进行通信，支持javascript，java，c/c++，python等常用的语言。
    若ISV的ERP系统是B/S结构，需要使用以下版本的浏览器来更好的支持WebSocket:
    支持chrome 45及以上、Firefox（建议使用chrome的最新版本）
    
- 淘宝本身提供有云打印[在线编辑器](https://cloudprint.cainiao.com/?spm=a219a.7629140.0.0.uzRAm6)，但是需要登录，不能定制，更无法集到我们的系统。

#### 相关资源

- [淘宝开放平台--云打印简介](https://open.taobao.com/docs/doc.htm?spm=a219a.7629140.0.0.JagtH0&treeId=409&articleId=106976&docType=1)

- [云打印Windows PC客户端下载](http://cloudprint.cainiao.com/cloudprint/client/CNPrintSetup.exe?spm=a219a.7629140.0.0.uzRAm6&file=CNPrintSetup.exe) 下载后请安装，否则网页无法预览或打印。

- [云打印交互协议](https://open.taobao.com/docs/doc.htm?spm=a219a.7629140.0.0.r2M9Vg&treeId=409&articleId=107014&docType=1) 网页调用打印的API说明。

### 在线预览
![image](readme.png)

<a href="http://103.236.255.179:3001/editor/index.html" target="_blank">点击查看在线DEMO</a>

### 后记
本编辑器是因OMS项目需求而制，其中还有购物清单打印（着重处理表格问题）、菜鸟电子面单打印（双重模板合并）、快递模板打印都是在此基础上建立。如果有机会其实可以使用SVG来构建此编辑器，对画斜线更直观。

### 记录
- 2018-04-10 使用babel-preset-env替换babel-preset-es2015;
- 2018-10-08 基于Vue CLI 3重构
