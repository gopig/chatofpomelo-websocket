/**
 * Created by 猫粮 on 13-12-19.
 */
console.log('-----------------------use in socket------------------------');

var net = require('net');
var ExBuffer = require('ExBuffer');
var ByteBuffer = require('./app/pt/ByteBuffer');
var pt = require('./app/pt/pt');

//测试服务端
var server = net.createServer(function(socket) {
    console.log('client connected');
    new Connection(socket);//有客户端连入时
});
server.listen(8124);

//服务端中映射客户端的类
function Connection(socket) {
    var exBuffer = new ExBuffer().ushortHead().bigEndian();
    exBuffer.on('data',onReceivePackData);

    socket.on('data', function(data) {
        exBuffer.put(data);//只要收到数据就往ExBuffer里面put
    });
    socket.on('close',function(data){
       console.log('>> client disconnect');
    });
    socket.on('error',function(data){
        console.log('>> client error',data);
    });

    //当服务端收到完整的包时
    function onReceivePackData(buffer){
        console.log('>> server receive data,length:'+buffer.length);
        console.log(buffer.toString());

        var data = 'wellcom, I am server';
        var len = Buffer.byteLength(data);

        //写入2个字节表示本次包长

        var arr = [1,2,3,4,5];
        var byteBuff = new ByteBuffer();
        var buffer = byteBuff.string(data).pack();
        var buffer2 = pt.pack(10000,buffer);
        console.log(buffer2);
        console.log(buffer);
//        var headBuf = new Buffer(2);
//        headBuf.writeUInt16BE(len, 0)
//        socket.write(headBuf);
//
//        var bodyBuf = new Buffer(len);
//        bodyBuf.write(data);
        socket.write(buffer2);
    }
}