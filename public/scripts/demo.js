;(function(window, undefined){

  var url = location.href.replace(location.hash, "");
  url = encodeURIComponent(url);

  var deviceId = "112233445566"; // 需要连接设备的deviceID
  var buf = "aGVsbG8="; // 发送给设备的数据，base64编码

  /**
   * 去后端获取 config 需要的签名
   * @param url 本页面的url（去掉hash部分）
   */
  $.get(baseUrl + "/sign?url="+url, function(data){
    signData = {
      "verifyAppId" : data.appid,
      "verifyTimestamp" : data.timestamp,
      "verifySignType" : "sha1",
      "verifyNonceStr" : data.nonceStr,
      "verifySignature" : data.signature
    };
    wx.config({
      debug: false,
      appId: data.appid,
      timestamp: data.timestamp,
      nonceStr: data.nonceStr,
      signature: data.signature,
      jsApiList: [
        'openWXDeviceLib',
        'closeWXDeviceLib',
        'getWXDeviceInfos',
        'startScanWXDevice',
        'stopScanWXDevice',
        'connectWXDevice',
        'disconnectWXDevice',
        'sendDataToWXDevice'
      ]
    });
  });

  /**
   * config 完成后绑定各种事件
   */
  wx.ready(function (){
    console.log("config", "ready");
    WeixinJSBridge.on('onWXDeviceBindStateChange', function(argv) {
      console.log("onWXDeviceBindStateChange", argv);
    });

    WeixinJSBridge.on('onWXDeviceStateChange', function(argv) {
      console.log("onWXDeviceStateChange", argv);
    });

    WeixinJSBridge.on('onReceiveDataFromWXDevice', function(argv) {
      console.log("onReceiveDataFromWXDevice", argv);
    });

    WeixinJSBridge.on('onWXDeviceBluetoothStateChange', function(argv) {
      console.log("onWXDeviceBluetoothStateChange", argv);
    });

    WeixinJSBridge.on('onScanWXDeviceResult', function(argv){
      console.log("onScanWXDeviceResult", argv);
    });

    onConfigReady();

  });

  /**
   * config 失败
   */
  wx.error(function (res) {
    alert(JSON.stringify(res));
  });

  /**
   * 事件绑定初始化
   */
	function onConfigReady() {
		document.querySelector('#openWXDeviceLib').addEventListener('touchstart', function(e){
      openWXDeviceLib();
		});

		document.querySelector('#closeWXDeviceLib').addEventListener('touchstart', function(e){
      closeWXDeviceLib();
		});

		document.querySelector('#getWXDeviceInfos').addEventListener('touchstart', function(e){
      getWXDeviceInfos();
		});

		document.querySelector('#startScanWXDevice').addEventListener('touchstart', function(e){
      startScanWXDevice();
		});

		document.querySelector('#stopScanWXDevice').addEventListener('touchstart', function(e){
      stopScanWXDevice();
		});

		document.querySelector('#connectWXDevice').addEventListener('touchstart', function(e){
      connectWXDevice();
		});

		document.querySelector('#disconnectWXDevice').addEventListener('touchstart', function(e){
      disconnectWXDevice();
		});

		document.querySelector('#sendDataToWXDevice').addEventListener('touchstart', function(e){
      sendDataToWXDevice();
		});

	};

  /*
   * jsapi接口的封装
   */
  function checkJsApi(){
    wx.checkJsApi({
      jsApiList: ['getWXDeviceTicket'],
      success: function(res) {
        //alert(JSON.stringify(res));
      }
    });
  }

  /**
   * 各个 JSSDK 的 API 接口实现 
   */

  function openWXDeviceLib(){
    WeixinJSBridge.invoke('openWXDeviceLib', {}, function(res){
      console.log("openWXDeviceLib", res);
    });
  }

  function closeWXDeviceLib(){
    WeixinJSBridge.invoke('closeWXDeviceLib', {}, function(res){
      console.log("closeWXDeviceLib", res);
    });
  }


  function getWXDeviceInfos(){
    WeixinJSBridge.invoke('getWXDeviceInfos', {}, function(res){
      console.log("getWXDeviceInfos", res);
    });
  }

  function connectWXDevice(){
    var _data = {"deviceId":deviceId};
    WeixinJSBridge.invoke('connectWXDevice', _data, function(res){
      console.log("connectWXDevice", res);
    });
  }

  function disconnectWXDevice(){
    var _data = {"deviceId":deviceId};
    WeixinJSBridge.invoke('disconnectWXDevice', _data, function(res){
      console.log("disconnectWXDevice", res);
    });
  }

  function sendDataToWXDevice(deviceId, buf, cb){
    var _data = {"deviceId":deviceId, "base64Data": buf};
    WeixinJSBridge.invoke('sendDataToWXDevice', _data, function(res){
      console.log("sendDataToWXDevice", res);
    });
  }

  function startScanWXDevice(cb){
    var _data = {btVersion:'ble'};
    WeixinJSBridge.invoke('startScanWXDevice', _data, function(res){
      console.log("startScanWXDevice", res);
    });
  }

  function stopScanWXDevice(){
    WeixinJSBridge.invoke('stopScanWXDevice', signData, function(res){
      console.log("stopScanWXDevice", res);
    });
  }


})(window);
