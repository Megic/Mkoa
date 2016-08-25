module.exports = function(app){
  if($C.cors){
      var cors = require('koa-cors');
      app.use(cors($C.cors));
  }

};
