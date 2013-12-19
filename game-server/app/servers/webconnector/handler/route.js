module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
		this.app = app;
};

var handler = Handler.prototype;

/**
 * New client entry chat server.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */

handler.route = function(msg, session, next) {
	var self = this;

    var server = msg.s;
    var handler = msg.h;
    var method = msg.m;
    var param = msg.q;
    if(msg.code != 200){
        next(null,msg);
        return;
    }
    if(self.app.rpc[server][handler][method] != undefined){
        self.app.rpc[server][handler][method](session,param,function(msg){
            next(null, {
                msg:msg
            })});
    }else{
        next(null,{
            code:404,
            msg:"method not found"
        })
    }

};