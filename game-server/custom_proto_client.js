/**
 * Created by 猫粮 on 13-12-19.
 */
//测试客户端
var net = require('net');
var ExBuffer = require('ExBuffer');
var ByteBuffer = require('ByteBuffer');

var exBuffer = new ExBuffer().uint32Head();
var client = net.connect(8124, function() {

    var data = 'hello I am client';
    var len = Buffer.byteLength(data);

    //写入2个字节表示本次包长
    var headBuf = new Buffer(2);
    headBuf.writeUInt16BE(len, 0);
    client.write(headBuf);

    var bodyBuf = new Buffer(len);
    bodyBuf.write(data);
    client.write(bodyBuf);

});

client.on('data', function(data) {
    exBuffer.put(data);//只要收到数据就往ExBuffer里面put
});

//当客户端收到完整的数据包时
exBuffer.on('data', function(buffer) {
    console.log('>> client receive data,length:'+buffer.length);
    var buf = new ByteBuffer(buffer);
    var arr = buf.ushort().string().unpack();
    console.log(arr);
});