/**
 * Created by 猫粮 on 13-12-4.
 */
var fs = require('fs');

var util = require('util');

var watch = require('watch');


module.exports.start = function() {
    var _this = this;
    watch.watchTree('./', function(f, curr, prev) {
        var regex;
        regex = "\.js$";
        if (RegExp(regex).test(f)) {
            if (typeof f === "object" && prev === null && curr === null) {

            } else if (prev === null) {
                console.log("New file: " + f, "info");
                require.cache = {};
            } else if (curr.nlink === 0) {
                console.log("" + f + " has been deleted");
                require.cache = {};
            } else {
                console.log("" + f + " has been changed");
                require.cache = {};

            }
        }
    });
};
