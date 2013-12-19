/**
 * Created by 猫粮 on 13-12-19.
 */
var ByteBuffer = require('ByteBuffer');

/**
 *
 * @param cmd {Integer}
 * @param data   {Buffer}
 */
module.exports.pack = function(cmd,data){
    var l = data.length+2;
    var buff = new ByteBuffer();
    var org_buff = buff.uint32(l)
                    .ushort(cmd)
                    .byteArray(data,data.length).pack();
    return org_buff;

}

