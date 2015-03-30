var _ = require('underscore');
var config = require('config');

var dbclients = {};

var dbnames = ['wechat'];

dbnames.forEach(function(name){
  exports['db_'+name] = function(key, options){
    // key must be a string, if providered hash on the key
    // options must be a object
    if (typeof key === 'object') {
      options = key;
      key = undefined;
    }
    options = _.extend({force:false}, options);
    return open(name, key, options);
  };
});


function open(name, key, options){
  console.log(name, key);
  function hash(key){
    // key must be a string
    // return key % 256;
    return 0;
  }

  function dbname(name,key){
    var dname = name;
    if (key) dname += "_"+hash(key);
    return dname;
  }

  function connect(dname){
    // ** connect to redis server

    var db;

    var env = process.env.NODE_ENV || "development";

    var host = config.redis.host;
    var port = config.redis.port;
    var index = config.redis.index || 0;

    if(process.env.REDISTOGO_URL){
      var rtg = require("url").parse(process.env.REDISTOGO_URL);
      db = require("redis").createClient(rtg.port, rtg.hostname);
      var auth = function(){
        db.auth(rtg.auth.split(":")[1]);
      };
      db.addListener('connected', auth);
      db.addListener('reconnected', auth);
      auth();
    }else{
      db = require("redis").createClient(port, host);
      db.setMaxListeners(0);
      db.select(index);
      console.log("redis %s:%s %s -> %s:%d#%d ok", name, key || "", dname, host, port, index);
    }
    return db;
  }

  function extend(db){
    return _.extend(db, {

    });
  }

  // console.log("db.open(%j,%j,%j)",name,key,options);

  var dname = dbname(name, key);

  if (options.force) return extend(connect(dname));

  var db = dbclients[dname] || extend(connect(dname));
  dbclients[dname] = db;
  return db;
}
