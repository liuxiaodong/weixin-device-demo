var fs = require('fs');
var path = require('path');
var config = require('config');
var weixin = require('../util/weixin');

// var jsApiTicketFile = path.join(__dirname, '../jsapi_ticket.txt');

// if (!fs.existsSync(jsApiTicketFile)) {
//   fs.appendFileSync(jsApiTicketFile, '', {encoding: 'utf8'});
// }

// var saveTicketToken = function(token, callback) {
//   token.saveTime = new Date().getTime();
//   var tokenStr = JSON.stringify(token);
//   fs.writeFile(jsApiTicketFile, tokenStr, {encoding: 'utf8'}, callback);
// };

// var getTicketToken = function(callback) { 
//   fs.readFile(jsApiTicketFile, {encoding: 'utf8'}, function(err, str){
//     var token;
//     if (str) {
//       token = JSON.parse(str);
//     }
//     var time = new Date().getTime();
//     if (token && (time - token.saveTime) < (token.expireTime - 120)) {
//       return callback(null, token);
//     }
//     weixin.api.getTicket(config.weixin.id, 'jsapi', function(err, token){
//       if (err) {
//         console.log('获取 jsapi 签名出错:  ', err);
//       }
//       if (token) {
//         saveTicketToken(token);
//       }
//       callback(null, token);
//     });
//   });  
// };

module.exports = function(app){

  /**
   * jssdk 签名， 供H5页面调用
   */
  app.get('/sign', function(req, res){
    var url = req.query.url;
    if (!url) {
      return res.status(400).json({errMsg: "need url"});
    }
    url = decodeURIComponent(url);
    weixin.api.getTicketToken(function(err, token){
      if (!token) return res.json({});
      var ret = weixin.util.getJsConfig(token.ticket, url);
      ret.appid = config.weixin.appid;
      console.log('token:  ', token);
      console.log('signData:  ', ret);
      res.json(ret);
    });
  });

};
