##微信蓝牙设备DEMO
* 测试微信蓝牙硬件流程，由于硬件不熟悉，所以只写了服务器和H5部分。

####步骤
1. 当然需要一个公众号，现在可以申请测试公众号。
  
	<a href="http://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login"> http://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login</a>
	
	* 现在好像需要找微信申请开通硬件权限
	
	
2. 还需要一个满足微信蓝牙协议的蓝牙模块。
  
	最好用微信的AirSyncDebugger测试通过  
	<a href="http://iot.weixin.qq.com/doc/blue/%E5%BE%AE%E4%BF%A1%E8%93%9D%E7%89%99%E5%8D%8F%E8%AE%AE%E8%B0%83%E8%AF%95%E5%B7%A5%E5%85%B7AirSyncDebugger%E8%AF%B4%E6%98%8E%E6%96%87%E6%A1%A3%20v2.0.pdf">http://iot.weixin.qq.com/doc/blue/%E5%BE%AE%E4%BF%A1%E8%93%9D%E7%89%99%E5%8D%8F%E8%AE%AE%E8%B0%83%E8%AF%95%E5%B7%A5%E5%85%B7AirSyncDebugger%E8%AF%B4%E6%98%8E%E6%96%87%E6%A1%A3%20v2.0.pdf</a>


3. 配置好公众号的各种信息

	URL, Token, JS接口安全域名等信息  
	URL 最好 `http://your_domain.com/wechat`  
	不然需要修改 app.js 中的 `app.use('/wechat', wx);` 路由
	
4. 克隆代码 

	`git clone git@github.com:liuxiaodong/weixin-device-demo.git`   

	
5. 安装依赖包并修改配置文件 
 
	`cd weixin-device-demo`
	
	`sudo npm install`  
	
	`cp config/_sample.json development.json` 
	
	修改 development.json 里面配置,比如 weixin 部分的 id, token, app_id, app_secret 为自己公众号的配置信息。

6. 修改前端的配置文件 `./public/scripts/config.js` 里的 baseUrl 为自己域名的url

7. 发布到服务，打开微信关注公众号进入链接 http://your_domain/wechat/demo 即可测试微信蓝牙硬件流程。
	* 在调用其他接口前必须先调用 初始化设备库(openWXDeviceLib) 接口