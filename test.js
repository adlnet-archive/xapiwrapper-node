var ADL = require('./xapiwrapper').configure("base","http://localhost:3000/test","http:",3000,"localhost");
console.log(ADL);

var conf = {
  "endpoint" : "http://lrs.adlnet.gov/xapi/",
  "auth" : "Basic " + (new Buffer("tom:1234", 'base64').toString('ascii')),
};

ADL.XAPIWrapper.changeConfig(conf);
ADL.XAPIWrapper.testConfig();


var stmt = {"actor" : {"mbox" : "mailto:tom@example.com"},
            "verb" : {"id" : "http://adlnet.gov/expapi/verbs/answered",
                      "display" : {"en-US" : "answered"}},
            "object" : {"id" : "http://adlnet.gov/expapi/activities/question"}};


var resp_obj = ADL.XAPIWrapper.sendStatement(stmt,function(xhr){
    console.log(xhr);
});