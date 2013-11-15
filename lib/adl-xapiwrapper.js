/*
 * adl-xapiwrapper
 * https://github.com/adlnet/xapiwrapper-node
 *
 * Copyright (c) 2013 ADL
 * Licensed under the Apache, 2.0 licenses.
 */
/*jslint node: true, passfail: false, vars: true */
'use strict';

var request = require('request');
var url = require('url');
var crypto = require('crypto');

exports.hash = function (str) {
    var shasum = crypto.createHash('sha1');
    shasum.update(str);
    return shasum.digest('hex');
};

exports.debugLevel = 'warn';
exports.log = function (level, message) {
    var levels = ['error', 'warn', 'info'];
    if (levels.indexOf(level) <= levels.indexOf(exports.debugLevel)) {
        if (typeof message !== 'string') {
            message = JSON.stringify(message);
        }
        console.log(level + ': ' + message);
    }
};

/*
 * XAPIWrapper Constructor
 * config - object with lrs connection information
 *          minimally define lrs 'url' and 'auth'
 */
function XAPIWrapper(config) {
    if (!config) {
        throw new Error("config was not defined");
    }

    if (!config.url) {
        throw new Error("config.url was not defined");
    }

    if (!config.auth) {
        throw new Error("config.auth was not defined");
    }

    if (!((config.auth.user || config.auth.username) && (config.auth.pass || config.auth.password))) {
        throw new Error("config.auth does not have user or pass");
    }

    this.config = config;
}

module.exports.XAPIWrapper = XAPIWrapper;
exports.xapiversion = '1.0.1';
exports.build = '2013-11-14T20:14Z';

XAPIWrapper.prototype.testConfig = function (callback) {
    var opts = {
        "method" : "GET",
        "url" : this.config.url + "about"
    };

    var thewrapper = this;

    exports.xapi_request(opts, null, function (err, resp, bdy) {
        if (err) {
            callback(false);
        }
        try {
            var bdyobj = JSON.parse(bdy), versionok = false;
            for (var i in bdyobj.version) {
                if (bdyobj.version[i].indexOf(exports.xapiversion.substring(0,3)) === 0) {
                    versionok = true;
                    break;
                }
            }
            if (!versionok) {
                callback(false);
            }
            thewrapper.getStatements({"limit":1}, null, function (err, resp, bdy) {
                if (err) {
                    callback(false);
                }
                callback(resp.statusCode === 200);
            });
        } catch (e) {
            callback(false);
        }
    });
};

XAPIWrapper.prototype.sendStatements = function (statements, callback) {
    var opts = {
        "method" : "POST",
        "url" : this.config.url + "statements",
        "auth" : this.config.auth
    };
    exports.xapi_request(opts, JSON.stringify(statements), callback);
};

XAPIWrapper.prototype.getStatements = function (searchparams, more, callback) {
    var p, opts = {"method" : "GET"};
    if (more) {
        if (this.config.baseurl) {
            opts.url = this.config.baseurl + more;
        } else {
            p = url.parse(this.config.url);
            opts.url = p.protocol + "//" + p.host + more;
        }
    } else {
        opts.url = this.config.url + "statements";
        if (searchparams) {
            opts.qs = searchparams;
        }
    }
    opts.auth = this.config.auth;
    exports.xapi_request(opts, null, callback);
};

XAPIWrapper.prototype.getActivities = function (activityid, callback) {
    var opts = {
        "method" : "GET",
        "url" : this.config.url + "activities",
        "auth" : this.config.auth,
        "qs" : {"activityId" : activityid}
    };
    exports.xapi_request(opts, null, callback);
};

XAPIWrapper.prototype.sendState = function (activityid, agent, stateid, registration, stateval, matchHash, noneMatchHash, callback) {
    var opts = {
        "method" : "PUT",
        "url" : this.config.url + "activities/state",
        "auth" : this.config.auth,
        "qs" : {
            "activityId" : activityid,
            "agent" : JSON.stringify(agent),
            "stateId" : stateid
        },
        "headers" : {}
    };

    if (registration) {
        opts.qs.registration = registration;
    }

    if (matchHash) {
        opts.headers['If-Match'] = matchHash;
    } else if (noneMatchHash) {
        opts.headers['If-None-Match'] = noneMatchHash;
    }

    if (stateval instanceof Array) {
        stateval = JSON.stringify(stateval);
        opts.headers["Content-Type"] = "application/json";
    } else if (stateval instanceof Object) {
        stateval = JSON.stringify(stateval);
        opts.headers["Content-Type"] = "application/json";
        opts.method = "POST";
    } else {
        opts.headers["Content-Type"] = "application/octect-stream";
    }

    exports.xapi_request(opts, stateval, callback);
};

XAPIWrapper.prototype.getState = function (activityid, agent, stateid, registration, since, callback) {
    var opts = {
        "method" : "GET",
        "url" : this.config.url + "activities/state",
        "auth" : this.config.auth,
        "qs" : {"activityId" : activityid,
                "agent" : JSON.stringify(agent)}
    };

    if (stateid) {
        opts.qs.stateId = stateid;
    }

    if (registration) {
        opts.qs.registration = registration;
    }

    if (since) {
        opts.qs.since = since.toISOString();
    }

    exports.xapi_request(opts, null, callback);
};

XAPIWrapper.prototype.sendActivityProfile = function (activityid, profileid, profileval, matchHash, noneMatchHash, callback) {
    var opts = {
        "method" : "PUT",
        "url" : this.config.url + "activities/profile",
        "auth" : this.config.auth,
        "qs" : {
            "activityId" : activityid,
            "profileId" : profileid
        },
        "headers" : {}
    };

    if (matchHash) {
        opts.headers['If-Match'] = matchHash;
    } else if (noneMatchHash) {
        opts.headers['If-None-Match'] = noneMatchHash;
    }

    if (profileval instanceof Array) {
        profileval = JSON.stringify(profileval);
        opts.headers["Content-Type"] = "application/json";
    } else if (profileval instanceof Object) {
        profileval = JSON.stringify(profileval);
        opts.headers["Content-Type"] = "application/json";
        opts.method = "POST";
    } else {
        opts.headers["Content-Type"] = "application/octect-stream";
    }

    exports.xapi_request(opts, profileval, callback);
};

XAPIWrapper.prototype.getActivityProfile = function (activityid, profileid, since, callback) {
    var opts = {
        "method" : "GET",
        "url" : this.config.url + "activities/profile",
        "auth" : this.config.auth,
        "qs" : {"activityId" : activityid}
    };

    if (profileid) {
        opts.qs.profileId = profileid;
    }

    if (since) {
        opts.qs.since = since.toISOString();
    }

    exports.xapi_request(opts, null, callback);
};

XAPIWrapper.prototype.getAgents = function (agent, callback) {
    var opts = {
        "method" : "GET",
        "url" : this.config.url + "agents",
        "auth" : this.config.auth,
        "qs" : {"agent" : JSON.stringify(agent)}
    };
    exports.xapi_request(opts, null, callback);
};

XAPIWrapper.prototype.sendAgentProfile = function (agent, profileid, profileval, matchHash, noneMatchHash, callback) {
    var opts = {
        "method" : "PUT",
        "url" : this.config.url + "agents/profile",
        "auth" : this.config.auth,
        "qs" : {
            "agent" : JSON.stringify(agent),
            "profileId" : profileid
        },
        "headers" : {}
    };

    if (matchHash) {
        opts.headers['If-Match'] = matchHash;
    } else if (noneMatchHash) {
        opts.headers['If-None-Match'] = noneMatchHash;
    }

    if (profileval instanceof Array) {
        profileval = JSON.stringify(profileval);
        opts.headers["Content-Type"] = "application/json";
    } else if (profileval instanceof Object) {
        profileval = JSON.stringify(profileval);
        opts.headers["Content-Type"] = "application/json";
        opts.method = "POST";
    } else {
        opts.headers["Content-Type"] = "application/octect-stream";
    }

    exports.xapi_request(opts, profileval, callback);
};

XAPIWrapper.prototype.getAgentProfile = function (agent, profileid, since, callback) {
    var opts = {
        "method" : "GET",
        "url" : this.config.url + "agents/profile",
        "auth" : this.config.auth,
        "qs" : {"agent" : JSON.stringify(agent)}
    };

    if (profileid) {
        opts.qs.profileId = profileid;
    }

    if (since) {
        opts.qs.since = since.toISOString();
    }

    exports.xapi_request(opts, null, callback);
};

exports.xapi_request = function (options, data, callback) {
    try {
        options.headers = options.headers || {};
        options.headers['Content-Type'] = options.headers['Content-Type'] || "application/json";
        options.headers['X-Experience-API-Version'] = options.headers['X-Experience-API-Version'] || exports.xapiversion;

        if (data) {
            options.body = data;
        }
        // console.log("going to call with options: " + JSON.stringify(options));
        request(options, callback);
    } catch (e) {
        if (callback && typeof callback === 'function') {
            callback(e);
        } else {
            console.log(e);
        }
    }
};

/*!
Excerpt from: Math.uuid.js (v1.4)
http://www.broofa.com
mailto:robert@broofa.com
Copyright (c) 2010 Robert Kieffer
Dual licensed under the MIT and GPL licenses.
*/
exports.ruuid = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
};

/*
 * dateFromISOString
 * parses an ISO string into a date object
 * isostr - the ISO string
 */
exports.dateFromISOString = function (isostr) {
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
