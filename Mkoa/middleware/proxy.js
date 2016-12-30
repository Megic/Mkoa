module.exports = function(app){
      let proxy = require('./proxy/index');
      app.use(proxy(app,$C.apiProxy_prefix,$C.apiProxy_proxy,$C.apiProxy_request));
};
