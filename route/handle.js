var weixin = require('../util/weixin');

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
