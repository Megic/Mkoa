module.exports = function(app){
      let cors = require('koa-cors');
      app.use($F.convert(cors($C.cors_config)));
};
