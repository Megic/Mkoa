module.exports = function(app){
  if($C.cors){
      var cors = require('koa-cors');
      app.use($F.convert(cors($C.cors)));
  }

};
