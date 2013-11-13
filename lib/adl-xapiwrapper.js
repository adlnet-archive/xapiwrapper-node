/*
 * adl-xapiwrapper
 * https://github.com/adlnet/xapiwrapper-node
 *
 * Copyright (c) 2013 tom creighton
 * Licensed under the Apache, 2.0 licenses.
 */

 'use strict';

var request = require('request');
var url = require('url');

exports.debugLevel = 'warn';
exports.log = function(level, message) {
    var levels = ['error', 'warn', 'info'];
    if (levels.indexOf(level) <= levels.indexOf(exports.debugLevel) ) {
        if (typeof message !== 'string') {
            message = JSON.stringify(message);
        }
        console.log(level+': '+message);
    }
}

/* ctr XAPIWrapper
 * config - object
 */
function XAPIWrapper(config) {
    this.config = config;
} 
module.exports.XAPIWrapper = XAPIWrapper;
exports.xapiversion = '1.0.1';
exports.build = '2013-11-13T21:00Z';

XAPIWrapper.prototype.sendStatements = function(statements, callback) {
    var opts = {
        "method":"POST",
        "url":this.config['url'] + "statements",
        "auth":this.config['auth']
    };
    exports.xapi_request(opts, statements, callback);
}

XAPIWrapper.prototype.getStatements = function(searchparams, more, callback) {
    var opts = {"method":"GET"};
    if (more) {
        if (this.config['baseurl']) {
            opts['url'] = this.config['baseurl'] + more;
        }
        else {
            var p = url.parse(this.config['url']);
            opts['url'] = p.protocol + "//" + p.host + more;
        }
    }
    else {
        opts['url'] = this.config['url'] + "statements";
        if (searchparams) {
            opts['qs'] = searchparams;
        }
    }
    opts['auth'] = this.config['auth'];
    exports.xapi_request(opts, null, callback);
};

exports.xapi_request = function(options, data, callback) {
    try {
        options['headers'] = options['headers'] || {};
        options['headers']['Content-Type'] = options['headers']['Content-Type'] || "application/json";
        options['headers']['X-Experience-API-Version'] = options['headers']['X-Experience-API-Version'] || exports.xapiversion;
        
        if(data) {
            options['body'] = JSON.stringify(data);
        }
        // console.log("going to call with options: " + JSON.stringify(options));
        request(options, callback);
    }
    catch (e) {
        if (callback && typeof(callback) == 'function') {
            callback(e);
        }
        else {
            console.log(e);
        }
    }
}

/*!
Excerpt from: Math.uuid.js (v1.4)
http://www.broofa.com
mailto:robert@broofa.com
Copyright (c) 2010 Robert Kieffer
Dual licensed under the MIT and GPL licenses.
*/
exports.ruuid = function() 
{
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
    });
};

/*
 * dateFromISOString
 * parses an ISO string into a date object
 * isostr - the ISO string
 */
exports.dateFromISOString = function(isostr) 
{
    var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
        "([T| ]([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +
        "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
    var d = isostr.match(new RegExp(regexp));

    var offset = 0;
    var date = new Date(d[1], 0, 1);

    if (d[3]) { date.setMonth(d[3] - 1); }
    if (d[5]) { date.setDate(d[5]); }
    if (d[7]) { date.setHours(d[7]); }
    if (d[8]) { date.setMinutes(d[8]); }
    if (d[10]) { date.setSeconds(d[10]); }
    if (d[12]) { date.setMilliseconds(Number("0." + d[12]) * 1000); }
    if (d[14]) {
        offset = (Number(d[16]) * 60) + Number(d[17]);
        offset *= ((d[15] == '-') ? 1 : -1);
    }

    offset -= date.getTimezoneOffset();
    var time = (Number(date) + (offset * 60 * 1000));

    var dateToReturn = new Date();
    dateToReturn.setTime(Number(time));
    return dateToReturn;
};
