# ADL xAPI Wrapper - Node [![Build Status](https://secure.travis-ci.org/adlnet/xapiwrapper-node.png?branch=master)](http://travis-ci.org/adlnet/xapiwrapper-node)

ADL's Experience API wrapper for nodejs.

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
>> [statements]
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2013 ADL  
Licensed under the Apache, 2.0 licenses.
