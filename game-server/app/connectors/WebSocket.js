var util = require('util');
var EventEmitter = require('events').EventEmitter;
var logger = require('pomelo-logger').getLogger(__filename);
var ST_INITED = 0;
var ST_CLOSED = 1;

/**
 * Socket class that wraps socket.io socket to provide unified interface for up level.
 */
var WebSocket = function (id, req, res) {
    EventEmitter.call(this);
    this.id = id;
    this.req = req;
    this.res = res;

    var self = this;
    this.state = ST_INITED;
};

util.inherits(WebSocket, EventEmitter);

module.exports = WebSocket;

WebSocket.prototype.onData = function () {
    var paths = this.req.path.split("/");
    if(paths.length <=3){
        this.emit('message', {code:503, q: this.req.query});
    }else{
        var server = paths[1];
        var handler = paths[2];
        var method = paths[3];
        this.emit('message', {code:200,s:server,h: handler, m: method, q: this.req.query});
    }

};

WebSocket.prototype.send = function (msg) {
    if (this.state !== ST_INITED) {
        return;
    }
    if (typeof msg !== 'string') {
        msg = JSON.stringify(msg);
    }
    this.res.send(msg);
    this.res.end();
};

WebSocket.prototype.disconnect = function () {
    if (this.state === ST_CLOSED) {
        return;
    }

    this.state = ST_CLOSED;
};

WebSocket.prototype.sendBatch = function (msgs) {
    this.send(encodeBatch(msgs));
};

/**
 * Encode batch msg to client
 */
var encodeBatch = function (msgs) {
    var res = '[', msg;
    for (var i = 0, l = msgs.length; i < l; i++) {
        if (i > 0) {
            res += ',';
        }
        msg = msgs[i];
        if (typeof msg === 'string') {
            res += msg;
        } else {
            res += JSON.stringify(msg);
        }
    }
    res += ']';
    return res;
};
