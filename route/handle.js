var config = require('config');
var request = require('request');
var sign = require('../util/sign');
var db = require('../db/db').db_wechat();

module.exports = function(app, wx){

  /**
   * jssdk 签名
   */
  app.get('/sign', function(req, res){
    var url = req.query.url;
    if(!url) return res.json(400, {errMsg: "need url"});
    url = decodeURIComponent(url);
    var access_token = wx.access_token();
    if(!access_token) return res.json(400, {errMsg:'access_token empty'});
    getTicket(access_token, function(err, ticket){
      if(err) return res.json(400, err);
      var ret = sign(ticket, url);
      ret.appid = config.weixin.app_id;
      res.json(ret);
    });
  });

};

function getTicket(access_token, cb){
  db.get("WX:jsapi:ticket", function(err, ticket){
    if(err) return cb(err);
    if(ticket) return cb(null, ticket);
    request("https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + access_token + "&type=jsapi", function(err, res, body){
      if(err) {
        console.log(err);
        return cb(err);
      }
      if(typeof body === "string"){
        try{
          body = JSON.parse(body);
        }catch(e){
          console.error("body parse error: ", e);
        }
      }
      var _ticket = body.ticket;
      var exp = Number(body.expires_in) || 7200;
      exp = exp - 60;
      if(!_ticket) return cb("get ticket error");
      db.setex("WX:jsapi:ticket", exp, _ticket, function(err){
        if(err) return cb(err);
        return cb(null, _ticket);
      });
    });
  });
}
