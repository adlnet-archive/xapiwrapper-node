# ADL xAPI Wrapper - Node [![Build Status](https://secure.travis-ci.org/adlnet/xapiwrapper-node.png?branch=master)](http://travis-ci.org/adlnet/xapiwrapper-node)

ADL's Experience API wrapper for nodejs. The wrapper simplifies the process of communicating 
with an xAPI LRS. 

## Getting Started
Install the module with: `npm install adl-xapiwrapper`

```javascript
var adl = require('adl-xapiwrapper');
var opts = {
    "url":"https://lrs.adlnet.gov/xapi/",
    "auth":{
        "user":"tom",
        "pass":"1234"
    },
};
var mylrs = new adl.XAPIWrapper(opts);

mylrs.getStatements(null, null, function(err, resp, bdy) {
    console.log(resp.statusCode);
    console.log(JSON.parse(bdy));
});
>> 200
>> {statements:[..], more:""}
```

## Documentation and Examples
### Module Attributes
`xapiversion` - the version of the Experience API Spec this conforms to  
`build` - an ISO date representing when this script was built  
`debugLevel` - the minimum logging level to process ['error','warn','info]  
```javascript
// these values will vary based on the version of wrapper you have
var adl = require('adl-xapiwrapper');
adl.xapiversion;
>> '1.0.1'
adl.build;
>> '2013-11-14T20:14Z'
adl.debugLevel;
>> 'warn'
```
### Module Functions
#### XAPI Request
`function xapi_request(options, data, callback)`  
Encapsulates making requests to an LRS. See the section on this wrapper's 
[instance functions](#instance-functions) for scripted ways to make common 
calls to an LRS. This uses the request module. 
[see requests](https://npmjs.org/package/request)  
`options` - options object used by the request module. [see options](https://github.com/mikeal/request#requestoptions-callback)  
`data` - the payload for POSTs and PUTs  
`callback` - function to process after request has completed.  
Parameters passed to callback:
* `error` - an error message if something went wrong  
* `response` - the response object  
* `body` - the body of the response if there is one  

```javascript
var adl = require('adl-xapiwrapper');
var myopts = {
    "url":"https://lrs.adlnet.gov/xapi/statements",
    "auth":{
        "user":"tom",
        "pass":"1234"
    },
    "method":"GET",
    "qs":{
        "limit":1
    }
};
adl.debugLevel = 'info';
adl.xapi_request(myopts, null, function (error, response, body) {
    adl.log('info', response.statusCode);
    adl.log('info', body);
});
>> info: 200
>> info: {"statements": <statements>, "more": <more url>}
```

#### Hash 
`function hash(string)`  
Sha1 hash of a string. Used for hashing contents sent to 
the document endpoints (state, activity profile, agent profile) to 
use for concurrency checks.  
```javascript
var doc = "This is my activity profile";
var myhash = adl.hash(doc)
```
#### Log
`function log(level, message)`  
Writes message to console based on level. Levels are `error`, `warn`, `info`.
Level filtering can be changed by setting `adl.debugLevel`.
```javascript
var adl = require('adl-xapiwrapper');
adl.debugLevel;
>> 'warn'
adl.log('info', 'this is an informational message');
> undefined
adl.debugLevel = 'info';
>> 'info'
adl.log('info', 'this is an informational message');
>> info: this is an informational message
```
#### UUID  
`function ruuid()`  
Generates a UUID that can be used anywhere the Experience API Spec 
specifies one, such as Statement ID or Registration.  
```javascript
adl.ruuid();
>> '47df99dd-e75f-484d-a85b-78cc988ae7c7'
```
#### Date from ISO String
`function dateFromISOString(isostring)`  
Converts and ISO date time string into a JavaScript date object.  
```javascript
var date = adl.dateFromISOString(adl.build);
date;
>> Thu Nov 14 2013 15:14:00 GMT-0500 (EST)
date.toDateString()
>> 'Thu Nov 14 2013'
```
### Instance Functions
#### Send Statements
`function sendStatements(statements, callback)`  
Sends a single or a list of statements to the LRS.
Parameters:
* `statements` - the single statement as a JSON object, or list of statements as a JSON array of objects
* `callback` - function to process after request has completed.  
    * Parameters passed to callback:
    * `error` - an error message if something went wrong  
    * `response` - the response object  
    * `body` - the body of the response if there is one 

```javascript
var adl = require('adl-xapiwrapper');
adl.debugLevel = 'info';
var myconfig = {
    "url":"https://lrs.adlnet.gov/xapi/",
    "auth":{
        "user":"tom",
        "pass":"1234"
    }
};
var mylrs = new adl.XAPIWrapper(myconfig);

var stmt = {
    "actor" : {"mbox" : "mailto:tom@example.com"},
    "verb" : {"id" : "http://adlnet.gov/expapi/verbs/answered",
              "display" : {"en-US" : "answered"}},
    "object" : {"id" : "http://adlnet.gov/expapi/activities/question"}
};

mylrs.sendStatements(stmt, function (err, resp, bdy) {
    adl.log('info', resp.statusCode);
    adl.log('info', bdy);
});
>> info: 200
>> info: [<statement ids>]
```
#### Get Statements
`function getStatements(searchparams, more, callback)`  
Sends a single or a list of statements to the LRS.
Parameters:
* `statements` - the single statement as a JSON object, or list of statements as a JSON array of objects
* `callback` - function to process after request has completed.  
    * Parameters passed to callback:
    * `error` - an error message if something went wrong  
    * `response` - the response object  
    * `body` - the body of the response if there is one 

```javascript
var adl = require('adl-xapiwrapper');
var myconfig = {
    "url":"https://lrs.adlnet.gov/xapi/",
    "auth":{
        "user":"tom",
        "pass":"1234"
    }
};
var mylrs = new adl.XAPIWrapper(myconfig);
```
#### Get Activities
`function getActivities(activityid, callback)`  
Sends a single or a list of statements to the LRS.
Parameters:
* `statements` - the single statement as a JSON object, or list of statements as a JSON array of objects
* `callback` - function to process after request has completed.  
    * Parameters passed to callback:
    * `error` - an error message if something went wrong  
    * `response` - the response object  
    * `body` - the body of the response if there is one 

```javascript
var adl = require('adl-xapiwrapper');
var myconfig = {
    "url":"https://lrs.adlnet.gov/xapi/",
    "auth":{
        "user":"tom",
        "pass":"1234"
    }
};
var mylrs = new adl.XAPIWrapper(myconfig);
```
#### Send State
`function sendState(activityid, agent, stateid, registration, stateval, matchHash, noneMatchHash, callback)`  
Sends a single or a list of statements to the LRS.
Parameters:
* `statements` - the single statement as a JSON object, or list of statements as a JSON array of objects
* `callback` - function to process after request has completed.  
    * Parameters passed to callback:
    * `error` - an error message if something went wrong  
    * `response` - the response object  
    * `body` - the body of the response if there is one 

```javascript
var adl = require('adl-xapiwrapper');
var myconfig = {
    "url":"https://lrs.adlnet.gov/xapi/",
    "auth":{
        "user":"tom",
        "pass":"1234"
    }
};
var mylrs = new adl.XAPIWrapper(myconfig);
```
#### Get State
`function getState(activityid, agent, stateid, registration, since, callback)`  
Sends a single or a list of statements to the LRS.
Parameters:
* `statements` - the single statement as a JSON object, or list of statements as a JSON array of objects
* `callback` - function to process after request has completed.  
    * Parameters passed to callback:
    * `error` - an error message if something went wrong  
    * `response` - the response object  
    * `body` - the body of the response if there is one 

```javascript
var adl = require('adl-xapiwrapper');
var myconfig = {
    "url":"https://lrs.adlnet.gov/xapi/",
    "auth":{
        "user":"tom",
        "pass":"1234"
    }
};
var mylrs = new adl.XAPIWrapper(myconfig);
```
#### Send Activity Profile
`function sendActivityProfile(activityid, profileid, profileval, matchHash, noneMatchHash, callback)`  
Sends a single or a list of statements to the LRS.
Parameters:
* `statements` - the single statement as a JSON object, or list of statements as a JSON array of objects
* `callback` - function to process after request has completed.  
    * Parameters passed to callback:
    * `error` - an error message if something went wrong  
    * `response` - the response object  
    * `body` - the body of the response if there is one 

```javascript
var adl = require('adl-xapiwrapper');
var myconfig = {
    "url":"https://lrs.adlnet.gov/xapi/",
    "auth":{
        "user":"tom",
        "pass":"1234"
    }
};
var mylrs = new adl.XAPIWrapper(myconfig);
```
#### Get Activity Profile
`function getActivityProfile(activityid, profileid, since, callback)`  
Sends a single or a list of statements to the LRS.
Parameters:
* `statements` - the single statement as a JSON object, or list of statements as a JSON array of objects
* `callback` - function to process after request has completed.  
    * Parameters passed to callback:
    * `error` - an error message if something went wrong  
    * `response` - the response object  
    * `body` - the body of the response if there is one 

```javascript
var adl = require('adl-xapiwrapper');
var myconfig = {
    "url":"https://lrs.adlnet.gov/xapi/",
    "auth":{
        "user":"tom",
        "pass":"1234"
    }
};
var mylrs = new adl.XAPIWrapper(myconfig);
```
#### Get Agents
`function getAgents(agent, callback)`  
Sends a single or a list of statements to the LRS.
Parameters:
* `statements` - the single statement as a JSON object, or list of statements as a JSON array of objects
* `callback` - function to process after request has completed.  
    * Parameters passed to callback:
    * `error` - an error message if something went wrong  
    * `response` - the response object  
    * `body` - the body of the response if there is one 

```javascript
var adl = require('adl-xapiwrapper');
var myconfig = {
    "url":"https://lrs.adlnet.gov/xapi/",
    "auth":{
        "user":"tom",
        "pass":"1234"
    }
};
var mylrs = new adl.XAPIWrapper(myconfig);
```
#### Send Agent Profile
`function sendAgentProfile(agent, profileid, profileval, matchHash, noneMatchHash, callback)`  
Sends a single or a list of statements to the LRS.
Parameters:
* `statements` - the single statement as a JSON object, or list of statements as a JSON array of objects
* `callback` - function to process after request has completed.  
    * Parameters passed to callback:
    * `error` - an error message if something went wrong  
    * `response` - the response object  
    * `body` - the body of the response if there is one 

```javascript
var adl = require('adl-xapiwrapper');
var myconfig = {
    "url":"https://lrs.adlnet.gov/xapi/",
    "auth":{
        "user":"tom",
        "pass":"1234"
    }
};
var mylrs = new adl.XAPIWrapper(myconfig);
```
#### Get Agent Profile
`function getAgentProfile(agent, profileid, since, callback)`  
Sends a single or a list of statements to the LRS.
Parameters:
* `statements` - the single statement as a JSON object, or list of statements as a JSON array of objects
* `callback` - function to process after request has completed.  
    * Parameters passed to callback:
    * `error` - an error message if something went wrong  
    * `response` - the response object  
    * `body` - the body of the response if there is one 

```javascript
var adl = require('adl-xapiwrapper');
var myconfig = {
    "url":"https://lrs.adlnet.gov/xapi/",
    "auth":{
        "user":"tom",
        "pass":"1234"
    }
};
var mylrs = new adl.XAPIWrapper(myconfig);
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or 
changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2013 ADL  
Licensed under the Apache, 2.0 licenses.
