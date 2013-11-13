'use strict';

var adl_xapiwrapper = require('../lib/adl-xapiwrapper.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['xapiwrapper'] = {
  setUp: function(done) {
    // setup here
    done();
  },
  'no args': function(test) {
    // test.expect(3);
    // tests here
    test.equal(adl_xapiwrapper.xapiversion, '1.0.1', 'should be 1.0.1');
    test.equal(adl_xapiwrapper.debugLevel, 'warn', 'debugLevel should be warn');
    test.equal(hijack(adl_xapiwrapper,adl_xapiwrapper.log,['info', 'this is a test']), '', 'this should be an ignored log message');
    adl_xapiwrapper.debugLevel = 'info';
    test.equal(adl_xapiwrapper.debugLevel, 'info', 'debugLevel should be info');
    test.equal(hijack(adl_xapiwrapper,adl_xapiwrapper.log,['warn', 'this is a test']), 'warn: this is a test', 'this should be a logging message');
    test.ok(new adl_xapiwrapper.XAPIWrapper(), 'should be able to create a new wrapper');
    test.notEqual(adl_xapiwrapper.ruuid, '', 'should return a uuid');
    var date = new Date();
    test.equal(adl_xapiwrapper.dateFromISOString(date.toISOString()).toString(), date.toString(), 'test iso string conversion');
    test.done();
  },
};

exports['statement_gets'] = {
    setUp: function (callback) {
        this.opts = {
            "url":"https://lrs.adlnet.gov/xapi/",
            // "url":"http://localhost:8000/xapi/",
            "auth":{
                "user":"tom",
                "pass":"1234"
            },
        };
        this.mylrs = new adl_xapiwrapper.XAPIWrapper(this.opts);
        callback();
    },
    tearDown: function (callback) {
        // clean up
        callback();
    },
    test1: function (test) {
        this.mylrs.getStatements(null, null, function(err, resp, bdy) {
            test.equals(resp.statusCode, 200, '200 response');
            test.done();
        });
    },
    test2: function (test) {
        this.mylrs.getStatements({"verb":"http://test.example.com/tested"}, null, function(err, resp, bdy) {
            test.equals(resp.statusCode, 200, '200 response');
            var bdyobj = JSON.parse(bdy);
            if (bdyobj['statements'].length > 0) {
                test.equals(bdyobj['statements'][0]['verb']['id'], 'http://test.example.com/tested', 'verb ids match');
            }
            else {
                test.ok(true, 'no statements in the lrs');
            }
            test.done();
        });
    },
    test3: function (test) {
        var thelrs = this.mylrs;
        thelrs.getStatements(null, null, function(err, resp, bdy) {
            if (resp.statusCode == 200) {
                var bdyobj = JSON.parse(bdy);
                if (bdyobj['more']) {
                    thelrs.getStatements(null, bdyobj['more'], function(err, resp, bdy) {
                        if (err) {
                            test.ok(false, "more get didn't work");
                        }
                        else {
                            test.equals(resp.statusCode, 200, 'more url response status was 200');
                            test.ok(JSON.parse(bdy)['statements'].length > 0, 'got at least 1 more statement');
                        }
                    });
                }
                test.done();
            }
            else {
                test.ok(true, "didn't have a more url.. that's ok, we just can't run this test");
                test.done();
            }
        });
    }
};


exports['statement_posts'] = {
    setUp: function (callback) {
        this.opts = {
            "url":"https://lrs.adlnet.gov/xapi/",
            // "url":"http://localhost:8000/xapi/",
            "auth":{
                "user":"tom",
                "pass":"1234"
            },
        };
        this.mylrs = new adl_xapiwrapper.XAPIWrapper(this.opts);
        callback();
    },
    tearDown: function (callback) {
        // clean up
        callback();
    },
    test1: function (test) {
        var stmt = {
            "actor":{"mbox":"mailto:tom@example.com"},
            "verb":{"id":"http://test.example.com/tested"},
            "object":{"id":"act:statement_posts/test1"}
        };
        this.mylrs.sendStatements(stmt, function(err, resp, bdy) {
            if (err) {
                test.ok(false, err);
            }
            else {
                test.equals(resp.statusCode, 200, '200 response');
            }
            test.done();
        });
    },
    test2: function (test) {
        var stmt = {
            "actor":{"mbox":"mailto:tom@example.com"},
            "verb":{"id":"http://test.example.com/tested"},
            "object":{"id":"act:statement_posts/test2/1"}
        };
        var stmt2 = {
            "actor":{"mbox":"mailto:tom@example.com"},
            "verb":{"id":"http://test.example.com/tested"},
            "object":{"id":"act:statement_posts/test2/2"}
        };

        var stmts = [stmt,stmt2];

        this.mylrs.sendStatements(stmts, function(err, resp, bdy) {
            if (err) {
                test.ok(false, err);
            }
            else {
                test.equals(resp.statusCode, 200, '200 response');
                test.equals(JSON.parse(bdy).length, 2, 'should get 2 ids back');
            }
            test.done();
        });
    }
};


function hijack(o, fn, params) {
    var origlog = console.log;
    var response = "";
    console.log = function (par) {
        response = par;
    }
    fn.apply(o, params);
    console.log = origlog;
    return response;
}