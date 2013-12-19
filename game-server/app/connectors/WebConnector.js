var util = require('util');
var EventEmitter = require('events').EventEmitter;
var WebSocket = require('./WebSocket');

var express = require('express');
var app = express();


var PKG_ID_BYTES = 4;
var PKG_ROUTE_LENGTH_BYTES = 1;
var PKG_HEAD_BYTES = PKG_ID_BYTES + PKG_ROUTE_LENGTH_BYTES;

var curId = 1;

/**
 * WebConnector that manager low level connection and protocol bewteen server and client.
 * Develper can provide their own connector to switch the low level prototol, such as tcp or probuf.
 */
var WebConnector = function(port, host, opts) {
    if (!(this instanceof WebConnector)) {
        return new WebConnector(port, host, opts);
    }
    EventEmitter.call(this);
    this.port = port;
    this.host = host;
    this.opts = opts;
};

util.inherits(WebConnector, EventEmitter);

module.exports = WebConnector;

/**
 * Start connector to listen the specified port
 */
WebConnector.prototype.start = function(cb) {
    var self = this;
    app.get('/*', function(req, res){
        var websocket = new WebSocket(curId++,req,res);
        self.emit('connection',websocket);
        websocket.onData();
    });
    this.webserver = app.listen(this.port);
    process.nextTick(cb);
};

/**
 * Stop connector
 */
WebConnector.prototype.stop = function(force, cb) {
    this.wsocket.server.close();
    this.webserver.stop();
    process.nextTick(cb);
};

WebConnector.encode = WebConnector.prototype.encode = function(reqId, route, msg) {
    return msg;
};

/**
 * Decode client message package.
 *
 * Package format:
 *   message id: 4bytes big-endian integer
 *   route length: 1byte
 *   route: route length bytes
 *   body: the rest bytes
 *
 * @param  {String} data socket.io package from client
 * @return {Object}      message object
 */
WebConnector.decode = WebConnector.prototype.decode = function(msg) {
    return {
        id: 1,
        route: 'webconnector.route.route',
        body: msg
    };
};