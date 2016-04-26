/**
 * Created by Megic
 */
var crypto = require('crypto');
module.exports = {
    md5: function (text,encoding) {
        return crypto.createHash('md5').update(this.bufferStr(text), 'utf8').digest(encoding || 'hex');
    },

    bufferStr:function(value) {
        return Buffer.isBuffer(value) ? value : this.toStr(value);
    },

    toStr:function (value) {
        return (value || value === 0) ? (value + '') : '';
    },


    d: function (crypted) {

        var decipher = crypto.createDecipher('aes-256-cbc', C.secret);
        var dec = decipher.update(crypted, 'hex', 'utf8');
        dec += decipher.final('utf8');
        return dec;


    },

    e: function (text) {
        var cipher = crypto.createCipher('aes-256-cbc', C.secret);
        var crypted = cipher.update(text, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;


    },
    Trim:function(val) {//去除两边空格
        return val?val.replace(/(^\s*)|(\s*$)/g, ""):'';
    },
    isJSON:function (body) {
        if (!body) return false;
        if ('string' == typeof body) return false;
        if ('function' == typeof body.pipe) return false;
        if (Buffer.isBuffer(body)) return false;
        return true;
    }
};