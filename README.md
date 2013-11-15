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
## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or 
changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2013 ADL  
Licensed under the Apache, 2.0 licenses.
