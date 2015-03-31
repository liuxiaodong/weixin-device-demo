var config = require('config');
var base64 = require('base64');
var gb2312 = require('encode-gb2312');

module.exports = function(wx){
  /**
   * 处理微信用户发送到公众号的文本消息
   */
  wx.text(/\S/, function(req, res){
    var openid = req.user.openid;
    var content = req.content;
    if(content) content = content.trim();
    console.log("收到消息来自微信用户 %s 的消息：%s", openid, content);
    res.text("hello");
    /**
     * 发送消息给设备
    var buff = gb2312.encodeToGb2312(content);
    var data = {
      device_type: config.weixin.id,
      device_id: device_id,
      open_id: openid,
      content: buff
    };
    res.text('已发送数据: ' + content + "  GB2312: " + buff);
    wx.transmsg({access_token:wx.access_token(), data:data}, function(err, ret){
      if(err){
        return req.user.text("给设备写数据失败: " + JSON.stringify(err));
      }
      var s = base64.encode(content);
      req.user.text('写入数据成功： ' + s);
    });
    */
  });

  /**
   * 接受设备发送到的消息并回复
   * wx 模块在 npm 上可能没有 device 接口，但可以下载源码自己编译
   */
  /**
  wx.device(function(req, res){
    var content = req.content;
    if(content) {
      content = content.trim();
      content = base64.decode(content);
    }
    //res.device(new Buffer("1111", "hex"));   // 响应设备
    req.user.text(req.device_id + "  :  " + (content || '消息为空'));
  });
   */
};
