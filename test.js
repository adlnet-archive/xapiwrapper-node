var ADL = require('./xapiwrapper').configure("base","https://lrs.adlnet.gov","https:",80,"lrs.adlnet.gov");
console.log(ADL);

var conf = {
  "endpoint" : "https://lrs.adlnet.gov/XAPI/",
  //"auth" : "Basic " + (new Buffer("tom:1234", 'base64').toString('utf8')),
  "user": "tom",
  "password": "1234"
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