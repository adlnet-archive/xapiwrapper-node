# ADL xAPI Wrapper - Node [![Build Status](https://secure.travis-ci.org/adlnet/xapiwrapper-node.png?branch=master)](http://travis-ci.org/adlnet/xapiwrapper-node)

ADL's Experience API wrapper for nodejs. The wrapper simplifies the process of communicating 
with an xAPI LRS. 

## Getting Started
Install the module with: `npm install adl-xapiwrapper`

Start the node Read-Eval-Print-Loop (REPL): `node` or `nodejs` depending on your installation.  
See [node's documentation](http://nodejs.org/api/repl.html) for more information.  

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
* `options` - options object used by the request module. [see options](https://github.com/mikeal/request#requestoptions-callback)  
* `data` - the payload for POSTs and PUTs  
* `callback` - function to process after request has completed.  
    * Parameters passed to callback:
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
* `searchparams` - JSON object of search parameters. See [the xAPI Spec](https://github.com/adlnet/xAPI-Spec/blob/master/xAPI.md#723-getstatements) for parameters.
* `more` - the url to more results. 
* `callback` - function to process after request has completed.  
    * Parameters passed to callback:
    * `error` - an error message if something went wrong  
    * `response` - the response object  
    * `body` - the body of the response if there is one 

###### Get all Statements

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
mylrs.getStatements(null, null, function (err, resp, bdy) {
    adl.log('info', resp.statusCode);
    adl.log('info', bdy);
    adl.log('info', JSON.parse(bdy).statements.length);
});
>> info: 200
>> info: {"statements":[<statements>], "more":<url to more results>}
>> info: 50 // depends on LRS
```

###### Get more Statements

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
mylrs.getStatements(null, null, function (err, resp, bdy) {
    adl.log('info', resp.statusCode);
    adl.log('info', bdy);
    var bdyobj = JSON.parse(bdy)
    if (bdyobj.more) {
        adl.log('info', 'going to get more statements');
        mylrs.getStatements(null, bdyobj.more, function (err, resp, bdy) {
            adl.log('info', resp.statusCode);
            adl.log('info', bdy);
        });
    }
});
>> info: 200
>> info: {"statements":[<statements>], "more":<url to more results>}
>> info: going to get more statements
>> info: 200
>> info: {"statements":[<statements>], "more":<url to more results>}
```

###### Get Statements based on Search Parameters

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
var myopts = {"verb":"http://adlnet.gov/expapi/verbs/answered"};
mylrs.getStatements(myopts, null, function (err, resp, bdy) {
    adl.log('info', resp.statusCode);
    adl.log('info', bdy);
    adl.log('info', JSON.parse(bdy).statements.length);
});
>> info: 200
>> info: {"statements":[<statements with verb 'answered'>], "more":<url to more results>}
>> info: 50 // depends on LRS
```

#### Get Activities
`function getActivities(activityid, callback)`  
Gets the complete Activity object from the LRS.  
Parameters:
* `activityid` - the id of the Activity requested
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
mylrs.getActivities("act:adlnet.gov/JsTetris_XAPI", function (err, resp, bdy) {
    adl.log('info', resp.statusCode);
    adl.log('info', bdy);
});
>> info: 200
>> info: <complete Activity object>
```
#### Send State
`function sendState(activityid, agent, stateid, registration, stateval, matchHash, noneMatchHash, callback)`  
Sends state information about the agents experience of the activity.  
Parameters:
* `activityid` - the id of the Activity this state is about
* `agent` - the agent this Activity state is related to 
* `stateid` - the id you want associated with this state
* `registration` - (optional) the registraton id associated with this state
* `stateval` - the state
* `matchHash` - the hash of the state to replace or * to replace any
* `noneMatchHash` - the hash of the current state or * to indicate no previous state
* `callback` - function to process after request has completed.  
    * Parameters passed to callback:
    * `error` - an error message if something went wrong  
    * `response` - the response object  
    * `body` - the body of the response if there is one 

#### Get State
`function getState(activityid, agent, stateid, registration, since, callback)`  
Get activity state from the LRS  
Parameters:
* `activityid` - the id of the Activity this state is about
* `agent` - the agent this Activity state is related to 
* `stateid` - (optional - if not included, the response will be a list of stateids 
                          associated with the activity and agent)
                          the id you want associated with this state
* `registration` - (optional) the registraton id associated with this state
* `since` - date object telling the LRS to return objects newer than the date supplied
* `callback` - function to process after request has completed.  
    * Parameters passed to callback:
    * `error` - an error message if something went wrong  
    * `response` - the response object  
    * `body` - the body of the response if there is one 

###### Send / Retrieve New Activity state  

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

var myactid = "http://example.com/activity/trails/appalachian";
var agent = {"mbox":"mailto:hikerbob@example.com"};
var mystateid = "training:appalachian-trail";
var mystate = {"trees":["hemlock","blue spruce"],"scene":"forest"};

mylrs.sendState(myactid, agent, mystateid, null, mystate, null, "*", function (err, resp, bdy) {
    if (err) {
        adl.log("error", "got an error");
    } else {
        adl.log("info", "response status: " + resp.statusCode);
    }
});
>> info: response status: 204

mylrs.getState(myactid, agent, mystateid, null, null, function (err, resp, bdy) {
    if (err) {
        adl.log("error", "got an error");
    } else {
        adl.log("info", "status code: " + resp.statusCode);
        adl.log("info", "the state: " + bdy);
    }
});
>> info: status code: 200
>> info: the state: {"trees":["hemlock","blue spruce"],"scene":"forest"}
```

###### Change Activity State

```javascript
var statehash = adl.hash(JSON.stringify(mystate));
mystate['checkpoint'] = "pa-w-blaze-6";
mylrs.sendState(myactid, agent, mystateid, null, mystate, statehash, null, function (err, resp, bdy) {
    if (err) {
        adl.log("error", "got an error");
    } else {
        adl.log("info", "status code: " + resp.statusCode);
    }
});
>> info: status code: 204

mylrs.getState(myactid, agent, mystateid, null, null, function (err, resp, bdy) {
    if (err) {
        adl.log("error", "got an error");
    } else {
        adl.log("info", "state: " + bdy);
    }
});
>> info: state: {"checkpoint": "pa-w-blaze-6", "scene": "forest", "trees": ["hemlock", "blue spruce"]}
```

###### Get all state ids for given Activity and Agent

```javascript
mylrs.getState(myactid, agent, null, null, null, function (err, resp, bdy) {
    if (err) {
        adl.log("error", "got an error");
    } else {
        adl.log("info", "state ids: " + bdy);
    }
});
>> info: state ids: ["training:appalachian-trail"]
```

###### Get state ids for a given Activity and Agent since a specified time

```javascript
var sincehere = new Date()
var newstateid = "content:settings";
var newstate = {"fps":"30","resolution":"1680x1050"};
mylrs.sendState(myactid, agent, newstateid, null, newstate, null, "*", function (err, resp, bdy) {
    if (err) {
        adl.log("error", "error with request: " + err);
    } else {
        adl.log("info", "status: " + resp.statusCode);
    }
});
>> info: status: 204

// get all state ids
mylrs.getState(myactid, agent, null, null, null, function (err, resp, bdy) {
    if (err) {
        adl.log("error", "error with request: " + err);
    } else {
        adl.log("info", "state ids: " + bdy);
    }
});
>> info: state ids: ["content:settings", "training:appalachian-trail"]

// get ids of states saved since ..
mylrs.getState(myactid, agent, null, null, sincehere, function (err, resp, bdy) {
    if (err) {
        adl.log("error", "error with request: " + err);
    } else {
        adl.log("info", "state ids since " + sincehere + ": " + bdy);
    }
});
>> info: state ids since Mon Nov 18 2013 09:31:15 GMT-0500 (EST): ["content:settings"]
```

#### Send Activity Profile
`function sendActivityProfile(activityid, profileid, profileval, matchHash, noneMatchHash, callback)`  
Sends an Activity Profile to the LRS.  
Parameters:
* `activityid` - the id of the Activity this profile is about
* `profileid` - the id you want associated with this profile
* `profileval` - the profile
* `matchHash` - the hash of the profile to replace or * to replace any
* `noneMatchHash` - the hash of the current profile or * to indicate no previous profile
* `callback` - function to process after request has completed.  
    * Parameters passed to callback:
    * `error` - an error message if something went wrong  
    * `response` - the response object  
    * `body` - the body of the response if there is one 

#### Get Activity Profile
`function getActivityProfile(activityid, profileid, since, callback)`  
Get activity profile from the LRS  
Parameters:  
* `activityid` - the id of the Activity this profile is about
* `profileid` - (optional - if not included, the response will be a list of profileids 
                associated with the activity)
                the id of the profile
* `since` - date object telling the LRS to return objects newer than the date supplied
* `callback` - function to process after request has completed.  
    * Parameters passed to callback:
    * `error` - an error message if something went wrong  
    * `response` - the response object  
    * `body` - the body of the response if there is one 

###### Send / Retrieve New Activity Profile 

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

var profile = {"type":"question"};
var activityid = "http://adlnet.gov/expapi/activities/question";
var profileid = "question:profile";

mylrs.sendActivityProfile(activityid, profileid, profile, null, "*", function (err, resp, bdy) {
    if (err) {
        adl.log("error", "request error: " + err);
    } else {
        adl.log("info", "status: " + resp.statusCode);
    }
});
>> info: status: 204

mylrs.getActivityProfile(activityid, profileid, null, function (err, resp, bdy) {
    if (err) {
        adl.log("error", "request error: " + err);
    } else {
        adl.log("info", "profile: " + bdy);
    }
});
>> info: profile: {"type":"question"}
```

###### Update Activity Profile 

```javascript
var profhash = adl.hash(JSON.stringify(profile));
profile["updated"] = true;

mylrs.sendActivityProfile(activityid, profileid, profile, profhash, null, function (err, resp, bdy) {
    if (err) {
        adl.log("error", "request error: " + err);
    } else {
        adl.log("info", "status: " + resp.statusCode);
    }
});
>> info: status: 204

mylrs.getActivityProfile(activityid, profileid, null, function (err, resp, bdy) {
    if (err) {
        adl.log("error", "request error: " + err);
    } else {
        adl.log("info", "profile: " + bdy);
    }
});
>> info: profile: {"updated": true, "type": "question"}
```

###### Get all profiles about a specific Activity

```javascript
mylrs.getActivityProfile(activityid, null, null, function (err, resp, bdy) {
    if (err) {
        adl.log("error", "request error: " + err);
    } else {
        adl.log("info", "profile ids: " + bdy);
    }
});
>> info: profile ids: ["question:profile"]
```

###### Get profiles about an Activity since a certain time

```javascript
var sincehere = new Date();

var newprofile = {"another" : "profile"};
var newprofileid = "another:profile";

mylrs.sendActivityProfile(activityid, newprofileid, newprofile, null, "*", function (err, resp, bdy) {
    if (err) {
        adl.log("error", "request error: " + err);
    } else {
        adl.log("info", "status: " + resp.statusCode);
    }
});
>> info: status: 204

// get all ids
mylrs.getActivityProfile(activityid, null, null, function (err, resp, bdy) {
    if (err) {
        adl.log("error", "request error: " + err);
    } else {
        adl.log("info", "profile ids: " + bdy);
    }
});
>> info: profile ids: ["question:profile", "another:profile"]

// get ids of Activity Profiles saved since date...
mylrs.getActivityProfile(activityid, null, sincehere, function (err, resp, bdy) {
    if (err) {
        adl.log("error", "request error: " + err);
    } else {
        adl.log("info", "profile ids: " + bdy);
    }
});
>> info: profile ids: ["another:profile"]
```

#### Get Agents
`function getAgents(agent, callback)`  
Gets a special Person object containing all the values 
of an Agent the LRS knows about. The Person object's 
identifying properties are arrays and it may have more 
than one identifier. [See more about Person in the spec](https://github.com/adlnet/xAPI-Spec/blob/master/xAPI.md#getagents)  
Parameters:
* `agent` - JSON object representing an agent ex: {"mbox":"mailto:tom@example.com"}
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

mylrs.getAgents({"mbox":"mailto:tom@example.com"}, function (err, resp, bdy) {
    if (err) {
        adl.log("error", "error in request: " + err);
    } else {
        adl.log("info", "the Person: " + bdy);
    }
});
>> info: the Person: <Person object>
```
#### Send Agent Profile
`function sendAgentProfile(agent, profileid, profileval, matchHash, noneMatchHash, callback)`  
Sends an Agent Profile to the LRS.  
Parameters:
* `agent` - the agent this profile is related to
* `profileid` - the id you want associated with this profile
* `profileval` - the profile
* `matchHash` - the hash of the profile to replace or * to replace any
* `noneMatchHash` - the hash of the current profile or * to indicate no previous profile
* `callback` - function to process after request has completed.  
    * Parameters passed to callback:
    * `error` - an error message if something went wrong  
    * `response` - the response object  
    * `body` - the body of the response if there is one 

#### Get Agent Profile
`function getAgentProfile(agent, profileid, since, callback)`  
Gets an Agent Profile from the LRS.  
Parameters:
* `agent` - the agent associated with this profile
* `profileid` - (optional - if not included, the response will be a list of profileids 
                associated with the agent)
                the id of the profile
* `since` - date object telling the LRS to return objects newer than the date supplied
* `callback` - function to process after request has completed.  
    * Parameters passed to callback:
    * `error` - an error message if something went wrong  
    * `response` - the response object  
    * `body` - the body of the response if there is one 

###### Send / Retrieve New Agent Profile 

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

var profile = {"competencies":["http://adlnet.gov/competency/sitting-quietly", 
                               "http://adlnet.gov/competency/watching-tv"], 
               "current path":"http://adlnet.gov/competency/knitting"};
var agent = {"mbox":"mailto:tom@example.com"};
var profileid = "competencies";

mylrs.sendAgentProfile(agent, profileid, profile, null, "*", function (err, resp, bdy) {
    if (err) {
        adl.log("error", "request error: " + err);
    } else {
        adl.log("info", "status: " + resp.statusCode);
    }
});
>> info: status: 204

mylrs.getAgentProfile(agent, profileid, null, function (err, resp, bdy) {
    if (err) {
        adl.log("error", "request error: " + err);
    } else {
        adl.log("info", "profile: " + bdy);
    }
});
>> info: profile: {"competencies":["http://adlnet.gov/competency/sitting-quietly",
                                   "http://adlnet.gov/competency/watching-tv"],
                   "current path":"http://adlnet.gov/competency/knitting"}
```

###### Update Agent Profile 

```javascript
var profhash = adl.hash(JSON.stringify(profile));
profile["competencies"].push(profile['current path']);
profile["current path"] = "http://adlnet.gov/competency/juggling";

mylrs.sendAgentProfile(agent, profileid, profile, profhash, null, function (err, resp, bdy) {
    if (err) {
        adl.log("error", "request error: " + err);
    } else {
        adl.log("info", "status: " + resp.statusCode);
    }
});
>> info: status: 204

mylrs.getAgentProfile(agent, profileid, null, function (err, resp, bdy) {
    if (err) {
        adl.log("error", "request error: " + err);
    } else {
        adl.log("info", "profile: " + bdy);
    }
});
>> info: profile: {"competencies": ["http://adlnet.gov/competency/sitting-quietly", 
                                    "http://adlnet.gov/competency/watching-tv", 
                                    "http://adlnet.gov/competency/knitting"], 
                   "current path": "http://adlnet.gov/competency/juggling"}
```

###### Get all profiles about a specific Agent

```javascript
mylrs.getAgentProfile(agent, null, null, function (err, resp, bdy) {
    if (err) {
        adl.log("error", "request error: " + err);
    } else {
        adl.log("info", "profile ids: " + bdy);
    }
});
>> info: profile ids: ["competencies"]
```

###### Get profiles about an Agent since a certain time

```javascript
var sincehere = new Date();

var newprofile = {"another" : "profile"};
var newprofileid = "another:profile";

mylrs.sendAgentProfile(agent, newprofileid, newprofile, null, "*", function (err, resp, bdy) {
    if (err) {
        adl.log("error", "request error: " + err);
    } else {
        adl.log("info", "status: " + resp.statusCode);
    }
});
>> info: status: 204

// get all ids
mylrs.getAgentProfile(agent, null, null, function (err, resp, bdy) {
    if (err) {
        adl.log("error", "request error: " + err);
    } else {
        adl.log("info", "profile ids: " + bdy);
    }
});
>> info: profile ids: ["competencies", "another:profile"]

// get ids of Activity Profiles saved since date...
mylrs.getAgentProfile(agent, null, sincehere, function (err, resp, bdy) {
    if (err) {
        adl.log("error", "request error: " + err);
    } else {
        adl.log("info", "profile ids: " + bdy);
    }
});
>> info: profile ids: ["another:profile"]
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or 
changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
* 0.2.0 - Initial commit and release to npm
* 0.2.1 - Update of Readme

## License
Copyright (c) 2013 ADL  
Licensed under the Apache, 2.0 licenses.
