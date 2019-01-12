# bitbucket-script
批量操作bitbucket上同一个项目下多个仓库(创建分支,锁定)

## 项目介绍
实现了批量操作 bitbucket 网站中团队帐号下某个项目的多个仓库.

公司是使用bitbucket进行代码托管,有一个团队帐号.在这个帐号下有多个项目.
一个项目下有多个仓库,比如,pc 端代码一个仓库,后端代码一个仓库,APP 代码一个仓库.因为这几个仓库都是一个项目的,所以,每次发布版本的时候,各个仓库都分支都需要同步进行一些操作,比如,同步创建新分支,锁定旧分支,以保持代码版本一致.为简化工作量,所以写了这个脚本

该项目只有一个网页,全部操作都在该网页中,目前(2018-11-3)只有批量新增分支,批量锁定分支.
因为只是个简单脚本,目前已满足实际需求,并没有想要维护,所以,前端代码就用 jquery 全部写在一个 HTML 里面.

## 使用前准备
在使用前,需要先在项目中配置bitbucket帐号(为了准确的保留bitbucket操作记录,建议不要共用密钥私钥)
1.	打开bitbucket网站 https://bitbucket.org/dashboard/overview
![](https://github.com/xrian/bitbucket-script/blob/master/images/step1.png)
2.  按照箭头提示,依次点击,创建一个oauth用户,然后将密钥私钥填写到项目config.js中.如果已有用户,直接使用其密钥私钥就行(记得分配权限)
![](https://github.com/xrian/bitbucket-script/blob/master/images/step2.png)
![](https://github.com/xrian/bitbucket-script/blob/master/images/step3.png)
3.  打开项目文件夹,在src/config目录下有个config.js.其中有五个选项需要填写
![](https://github.com/xrian/bitbucket-script/blob/master/images/step4.png)
填写完成后,就可以启动项目了.

## 使用方法
1.	进入到项目文件夹,执行下面命令, 安装依赖包.
```
$ npm i
```
2.	启动项目,启动成功后,会在控制台输入启动端口号
```
$ node app.js
```
3.	打开网页/assets/index.html,(如果打不开,请检查端口是否正确)<br>
   例: http://localhost:7000/assets/index.html

## 操作步骤
![](https://github.com/xrian/bitbucket-script/blob/master/images/use1.png)
![](https://github.com/xrian/bitbucket-script/blob/master/images/use2.png)
![](https://github.com/xrian/bitbucket-script/blob/master/images/use3.png)
![](https://github.com/xrian/bitbucket-script/blob/master/images/use4.png)
![](https://github.com/xrian/bitbucket-script/blob/master/images/use5.png)
![](https://github.com/xrian/bitbucket-script/blob/master/images/use6.png)
