var path = require('path');
var fs = require('fs');
var config = require('config');

var accessTokenFile = path.join(__dirname, '../access_token.txt');

if (!fs.existsSync(accessTokenFile)) {
  fs.appendFileSync(accessTokenFile, '', {encoding: 'utf8'});
}

var jsApiTicketFile = path.join(__dirname, '../jsapi_ticket.txt');

if (!fs.existsSync(jsApiTicketFile)) {
  fs.appendFileSync(jsApiTicketFile, '', {encoding: 'utf8'});
}

var weixin = require("weixin-trap")({
  attrNameProcessors: 'underscored',
  saveToken: function(token, callback){
    token.saveTime = new Date().getTime();
    var tokenStr = JSON.stringify(token);
    fs.writeFile(accessTokenFile, tokenStr, {encoding: 'utf8'}, callback);
  },
  getToken: function(callback){
    fs.readFile(accessTokenFile, {encoding: 'utf8'}, function(err, str){
      var token;
      if (str) {
        token = JSON.parse(str);
      }
      var time = new Date().getTime();
      if (token && (time - token.saveTime) < ((token.expireTime - 120) * 1000) ) {
        return callback(null, token);
      }
      callback();
    });
  },
  saveTicketToken: function(appid, type, token, callback) {
    token.saveTime = new Date().getTime();
    var tokenStr = JSON.stringify(token);
    fs.writeFile(jsApiTicketFile, tokenStr, {encoding: 'utf8'}, callback);
  },
  getTicketToken: function(callback) {
    fs.readFile(jsApiTicketFile, {encoding: 'utf8'}, function(err, str){
      var token;
      if (str) {
        token = JSON.parse(str);
      }
      var time = new Date().getTime();
      if (token && (time - token.saveTime) < ((token.expireTime - 120) * 1000) ) {
        return callback(null, token);
      }      
      weixin.api.getTicket(config.weixin.id, 'jsapi', function(err, token){
        if (err) {
          console.log('获取 jsapi 签名出错:  ', err);
        }
        callback(null, token);
      });
    });  
  },
  config: {
    id: config.weixin.id, // 微信公众号 id
    appid: config.weixin.appid,
    token: config.weixin.token,
    appsecret: config.weixin.app_secret
    //encryptkey: config.weixin.encryptkey
  }
});


/**
 * 处理微信用户发送到公众号的文本消息
 */
weixin.trap.text(/\S/, function(req, res){
  var id = req.body.to_user_name;
  var openid = req.body.from_user_name;
  var content = req.body.content;
  if(content) content = content.trim();
  console.log("收到消息来自微信用户 %s 的消息：%s", openid, content);
  res.text("hello");
  /**
   * // 发送消息给设备
  res.text("收到 openid: " + openid + " 发来的数据: " + content);
  weixin.api.transferMessage(id, id, device_id, openid, content, contefunction(err, ret){
    var replyText = "写入数据成功： " + content;
    if (err) {
      replyText =  "给设备写数据失败: " + JSON.stringify(err);
    }
    weixin.api.sendText(id, openid, replyText);
  });
  */
});

/**
 * 接受设备发送到的消息并回复
 */
/**
weixin.trap.device(function(req, res){
  //res.device(new Buffer("1111", "hex")); // 响应设备
  var openid = req.body.from_user_name;
  var content = req.body.content;
  if(content) {
    content = content.trim();
    content = new Buffer(content, 'base64').toString();
  }
  var id = req.body.device_id;
  var replyText = id + ' 说:  ';
  if (content) {
    replyText += content;
  } else {
    replyText += '什么都不想说';
  }
  weixin.api.sendText(appid, openid, replyText);
});
 */

module.exports = weixin;