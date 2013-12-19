var pomelo = require('pomelo');
var dispatcher = require('./app/util/dispatcher');
var abuseFilter = require('./app/servers/chat/filter/abuseFilter');
var timeReport = require('./app/modules/timeReport');
var webConnector = require('./app/connectors/WebConnector');
var reloader = require('./app/util/reloader');

// route definition for chat server
var chatRoute = function (session, msg, app, cb) {
    var chatServers = app.getServersByType('chat');

    if (!chatServers || chatServers.length === 0) {
        cb(new Error('can not find chat servers.'));
        return;
    }

    var res = chatServers[parseInt(Math.random()*chatServers.length)];
    cb(null, res.id);
};
var adminRoute = function (session, msg, app, cb) {
    var webServers = app.getServersByType('webconnector');

    if (!webServers || webServers.length === 0) {
        cb(new Error('can not find chat servers.'));
        return;
    }
    var res = webServers[parseInt(Math.random()*webServers.length)];

    //var res = dispatcher.dispatch(session.get('rid'), webServers);

    cb(null, res.id);
};


/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'chatofpomelo-websocket');

// app configuration
app.configure('production|development', 'connector', function () {
    app.set('connectorConfig',
        {
            connector: pomelo.connectors.hybridconnector
        });
});
app.configure('production|development', 'webconnector', function () {
    app.set('connectorConfig',
        {
            connector: webConnector
        });
});
app.configure('production|development', 'gate', function () {
    app.set('connectorConfig',
        {
            connector: pomelo.connectors.hybridconnector,
            useDict: true,
            useProtobuf: true
        });
});
//// app configure
app.configure('production|development', function () {
    // route configures
    app.before(pomelo.filters.toobusy());
    app.enable('systemMonitor');
    app.route('chat', chatRoute);
    app.route('webconnector',adminRoute);
    app.filter(pomelo.timeout());
});
//
//app.configure('production|development', 'chat', function() {
//  app.filter(abuseFilter());
//});

//app.registerAdmin(timeReport, {app: app});
// start app
app.enable('systemMonitor');
app.start();
//reloader.start();
process.on('uncaughtException', function (err) {
    console.error(' Caught exception: ' + err.stack);
});
