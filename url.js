const express = require("express");
const app = express();
const dif = require("dialogflow-fulfillment");
//global.document = new JSDOM(html).window.document;
const request = require('request-promise');
const fs = require('fs');
const client = require('twilio')('ACdd98b60126258e2791c5165edbbb66f9', '4f0ecc3f4742d31601bee784a1ea3f60');
var mongodb = require('mongodb');
const sn=require('servicenow-rest-api');
const { text } = require("express");
const ServiceNow=new sn('dev94799','admin','bJ3OVm2WKgcg');
const {
  Card,
  Suggestion
} = require('dialogflow-fulfillment');
const { response } = require("express");

var mongoClient = mongodb.MongoClient;
var url = "mongodb://0.0.0.0:27017/";

app.get('/',(req, res)=>{
    res.send("we are live")
});

app.post("/", express.json(), (req, res) => {
    const agent = new dif.WebhookClient({ request: req, response: res 
});

app.post("/", express.json(), function(request,response){
  
})

function demo(agent) { 
    agent.add('Hi, I am assistant. I can help you in various service. How can I help you today?');
}

function Ticket(agent) {
//writer.writeString(global.JSON.stringify(response_body1));
    console.log("Ticket function " +JSON.stringify(req.body));
    var text = agent.parameters["Description"];
    var priority=agent.parameters["priority"];
    console.log(text+" "+priority);

    var ticketText=''
    console.log("getTask " +JSON.stringify(req.body));

    if(req.body.queryResult.speechRecognitionConfidence > 0){
      ticketText='Description: ' +text+ "Priority: " +priority+' Anything else we can help you with?'
    }else{
      ticketText='</b><br>Description: <b>' +text+'</b><br>Priority:<b>' +priority+'</b><br><i>Anything else we can help you with?'
    }
      return createTask(text)
      .then((res) => {
        agent.add('Ticket number has been created with below details <b>' + res.number+ '</b> ' +ticketText)
      })
      .catch((err) => {
        agent.add("Uh oh, something went wrong");
      });

  //}
}

  function createTask(text) {
    var interupttext=''
    //interupttext=req.body.queryResult.queryText
    // if(interupttext == 'I want to check status of my ticket')
    // {
    //   console.log('inside inter')
    //   agent.add('inside interrupt')
    // }
    //else{
    return new Promise(function (myResolve, myReject) {
      const data = {
        short_description: text,
        urgency: "3",
        priority: "1",
        assignment_group: "Hardware",
      };
      
      ServiceNow.createNewTask(data, "incident", (res) => {
        console.log(res);
        console.log(res.number);
        if (res && res.number && res.number.length > 0) {
          myResolve(res); // when successful
        } else {
          myReject("error"); // when error
        }
      });
    });
  }

function status(agent) {
    //agent.add('<p><button name=subject type=button value=High>High</button><br><p style="text-align:center;"><FONT color=Blue>You can check Below Incdient Details which you had raised earlier:</FONT></p><table border=1><tr><th>Incident</th><th>Status</th></tr><tr><td><a href=https://dev94799.service-now.com/api/now/v2/table/incident?sysparm_display_value=true&sysparm_query=number=INC0010115>INC0010115</a></td><td>Resolved</td></tr></table></p>')
    var txt = "INC00"+agent.parameters["number"];
    console.log(txt);
    console.log("getstatus " +JSON.stringify(req.body));
    var statusText=''
    if(req.body.queryResult.speechRecognitionConfidence > 0){
      statusText="Do you want to go to previous task of raising Incident? If yes could you provide the prority of issue.."
    }else{
      statusText="<br><br>Do you want to go to previous task of raising Incident?<br> If yes could you provide the prority of issue.."  
    }
    return getTableData(txt)
      .then((res) => {
        count=1
        // if(res[0].priority == 'Priority 5 - Planning'){
        //   count=1
        //  }
        agent.add("Incident is currently assigned to "+res[0].approval+ " with Priority " +res[0].priority+" "+ statusText);
        //agent.add('Do you want to go to previous task of raising Incident?<br> If yes could you provide the prority of issue..')
      })
      .catch((err) => {
        agent.add("Uh oh, something went wrong");
      });
  }

  function getTableData(txt) {
    return new Promise(function (myResolve, myReject) {
      
      const data = {
        number: txt,
        urgency: "3",
        priority: "1",
        approval:"Not Yet Requested"
      };
    
      const filters=[
        'number='+txt
      ];
    
      ServiceNow.getTableData(data,filters,'incident', (res) => {
        console.log(res);
        myResolve(res);
      });  
    });
    
  }
  
  function welcomeMsg(agent) {
     const data = {
      major_incident_state: "Accepted",
      priority: "1"
    };

    const filters=[
      //'major_incident_state=Accepted',
      'priority=1'
    ];
      incident=''
    ServiceNow.getTableData(data,filters,'incident', (res) => {
     //console.log(res[0].number);
     //incident=res[0].number
     console.log('HIGH INCIDENT ' +incident);
     });
    
     
    //agent.add('<p><button name=subject type=button value=High>High</button><br><p style="text-align:center;"><FONT color=green>Customer Details & Document References:</FONT></p><table border=1><tr><th>Month</th><th>Savings</th></tr><tr><td>January</td><td>$100</td></tr></table></p>');
     if(req.body.queryResult.queryText.includes('101') || req.body.queryResult.queryText.includes('102') ||
     req.body.queryResult.queryText.includes('103') || req.body.queryResult.queryText.includes('100') || 
     req.body.queryResult.queryText.includes('120'))
     {
       if(req.body.queryResult.speechRecognitionConfidence > 0){
         agent.add('You are Authenticated Here I can perform following tasks for you: 1. Raise a ticket 2. Status of ticket 3. Connect to live agent 4. Password Reset');
       }else{
         agent.add('<i><b>You are Authenticated</b></i><br><img src=https://bleuwire.com/wp-content/uploads/2021/04/cloud-based-itsm.jpg width=200><br>Here I can perform following tasks for you: <br> 1. Raise a ticket <br> 2. Status of ticket <br> 3. Connect to live agent <br> 4. Password Reset<br><br>Current High Priority incident running is:<b><i>Linux Server is down</i></b><br>Click below link to view details about same<br><a href=https://dev94799.service-now.com/nav_to.do?uri=%2Fincident.do%3Fsys_id%3D899b4cf907b14110a171fa7f7c1ed007%26sysparm_view%3Dess%26sysparm_record_target%3Dincident%26sysparm_record_row%3D2%26sysparm_record_rows%3D49%26sysparm_record_list%3Dcaller_id%253Djavascript%253Ags.getUserID%2528%2529%255Eactive%253Dtrue%255Euniversal_requestISEMPTY%255EORDERBYnumber>INC0010001</a><br><br><a href=http://localhost:8000/>Click here to view your CPU performance</a>');
       }
     }
     else{
       agent.add('You are not Authenticated. Please provide your correct employee id')
     }
   }

    function incpriority() {
      return new Promise(function (myResolve, myReject) {
       const data = {
        major_incident_state: "Accepted",
        priority: "1"
     };
  
      const filters=[
        //'major_incident_state=Accepted',
        'priority=1'
     ];
  
      ServiceNow.getTableData(data,filters,'incident', (res) => {
       console.log(res[0].number);
       
      });
    });
  }

  function getImage(agent) {
      var img = agent.parameters["imagesearch"];
      if (img =='Laptop'){
        agent.add('<img src=https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8rpmSuIabga090ZuZNVWR93QNOzOBI4Z32Q&usqp=CAU width=200>&nbsp&nbsp');  
      }else if (img=='mouse'){
        agent.add('<img src=https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8rpmSuIabga090ZuZNVWR93QNOzOBI4Z32Q&usqp=CAU width=200>&nbsp&nbsp');  
      }
   }

  function liveagent() {
  sentiment=0
  var text=''
  text=req.body.queryResult.queryText
  console.log("text " +text);
  //using event to trigger intent
  // if (req.body.queryResult.sentimentAnalysisResult.queryTextSentiment.score < 0)
  //   var response_body1={
  //     "followupEventInput": {
  //       "name": "agent",
  //       "languageCode": "en"
  //     }
  // }
  console.log("channel id " +JSON.stringify(req.body));

  if(text.includes('agent')||text.includes('human')){}
  else{ sentiment = req.body.queryResult.sentimentAnalysisResult.queryTextSentiment.score
    console.log('sentiment txt '+sentiment)}

  if (sentiment<0){
    const data = {    
      "transcription": [
        {
            "type": "USER",
            "text": ""+req.body.queryResult.queryText
        },
    ],
    "moredetails": {
        "Sentiment": "Y",
        "Entity Extraction": "N",
        "Total Sentences": "N",
        "Number of questions": "N",
        "Total question": "N",
        "Questions asked from Customer": "N",
        "Duration of call": "N",
        "Reason for contact": "N"
    }
  };
  const options = {
    method: 'POST',
    uri: 'http://127.0.0.1:8000/myapp/summary',
    body: data,
    json: true,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'bwejjr33333333333'
    }
  }

  request(options).then(function (response){
    //res.status(200).json(response);
    console.log(response)
})
.catch(function (err) {
    console.log(err);
})

  knowledgeurl=''
  if(sentiment<0){
    sentimentval='negative'
    smiley='<img src="https://hotemoji.com/images/dl/9/white-frowning-face-emoji-by-twitter.png" alt="" width=30>'
  }
  else{
  sentimentval='positive'
  smiley='<img src="https://hotemoji.com/images/dl/9/slightly-smiling-face-emoji-by-twitter.png" alt="" width=30>'
  }

  console.log('text '+req.body.queryResult.queryText)
  if(req.body.queryResult.queryText == 'My incident not resolve it been 2 days since i had raised issue but no action taken yet'){
    summary='User Ticket not resolved'
    knowledgeurl='https://investharyana.in/content/pdfs/SOPforHelpdeskatHEPC.pdf'
    agent.context.set({
      name: "out",
      lifespan: 3,
      parameters: {
        'issue': ' is employee id and Summary of issue is that: ' +summary  +". User sentiment Value is: "+sentimentval+ ". Knowldege URL for reference: "+knowledgeurl,     },
    })
    agent.add('Are you sure you want to connect to Live agent...');
  }
  else if(req.body.queryResult.queryText.includes('Iam trying to change password but it is causing issue')){
    
    console.log('here')
    summary='Facing Password reset issue'
    knowledgeurl='https://docs.servicenow.com/bundle/sandiego-servicenow-platform/page/administer/login.html'
    agent.context.set({
      name: "out",
      lifespan: 3,
      parameters: {
      'issue': ' is employee id and Summary of issue is that: ' +summary  +". User sentiment Value is: "+sentimentval+  ". Knowldege URL for reference: "+knowledgeurl,//datanew,//+'User ticket not resolved yet',
      },  
          
    })
    console.log('her2e')
    agent.add('Are you sure you want to connect to Live agent...'); 
  }
    //agent.add('Are you sure you want to connect to Live agent...');
    //console.log(datanew +"summary " +agent.parameters['issue'])
    //var intentdetails = "Intent is "+ req.body.queryResult.intent.displayName + " "
    //var userrequest = "Input is " + req.body.queryResult.queryText + " "
    
    //  client.messages 
    //         .create({ 
    //             body: intentdetails+userrequest,  
    //             messagingServiceSid: 'MGc7ea6b85d53715697ab8c85d777348ef',      
    //            to: '+917288039833' 
    //          }) 
    //         .then(message => console.log(message)) 
    //         .catch(error => console.log(error))
    //         return ""//agent.add("SMS sent to Agent "+intentdetails+userrequest)
  }
  else{
    agent.context.set({
      name: "out",
      lifespan: 3,
      parameters: {
      'issue': ' is employee id                                                                                                                                                                                                    '
      },
    })

    var rstream=fs.createReadStream("summary.txt");
    var data1=""
    rstream.on("data",function(buffer){
      data1=buffer
     console.log('data started')
    });

    rstream.on("end",function(error){
      console.log(data1.toString())
      //return agent.add('Values of Data1 ' +data1)    
  });  

  function setVariable(){ 
    var a = "Do you want to connect to Live agent.."; 
    data1='..'
    return a+' '+data1; 
  } 
   
  function getVariable(){ 
    return setVariable(); 
  } 
   
  var b = getVariable(); 

  return agent.add(' '+b)
  }
}

function passwordReset(agent) {
  var Email = agent.parameters["email_id"];
  var Empid = agent.parameters["id"];
  console.log("Empid "+Empid);
  var phoned = " "
      // Phone_number
  var mongodb = require("mongodb");
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/';
  MongoClient.connect(url, function(error, databases) {
          if (error) {
              throw error;

          }
          var nodtst = databases.db("admin");
          nodtst.collection("EmpCredDetails").findOne({ Emp_ID: Empid }, function(err, result) {
              if (err) throw err;
              //console.log("one record is find now....." + result.Phone_Number);
              store = result.Phone_Number;
              databases.close();
              fs.writeFile('textfile.txt', store, err => {
                  if (err) {
                      console.log('Error writing file', err)
                  } else {
                      console.log('Successfully wrote file')
                  }
              })

              console.log(store);
          })
      })
      //return agent.add("agents: ", result.Phone_Number)
  phoned = fs.readFileSync('textfile.txt', { encoding: 'utf8', flag: 'r' });
  // //console.log("Line 61",otpdata)
  console.log("phone is:", phoned)
  if (phoned != null) {
      agent.context.set({
          name: "phonenumber",
          lifespan: 5,
          parameters: {
              'Phone_Number': phoned
          },
      })
      return agent.add("Are you using this phone number:  " + phoned)
  } else {
      return agent.add("Mobile Number not found")
  }
}

function OTPsend(agent) {
  var phonenumber = "91" + req.body.queryResult.parameters.Phone_Number
  console.log(phonenumber)
  if (phonenumber) {
      client
          .verify
          .services("VA4463286e4585d50a7c0565ec04ac4027")
          .verifications
          .create({
              to: `+${phonenumber}`,
              channel: 'sms'
          })
          .then(data => console.log("Verification is sent!!"))
      return agent.add("OTP is Sent, Please provide it")
  } else {
      return agent.add("Unable to send OTP")
  }
}

function OTPVerify(agent) {
  // var phonenumber = "91" + req.body.queryResult.parameters.Phone
  // var otp = req.body.queryResult.parameters.otpverify
  // var otpinfo = ""
  // var otpdata = ""
  // if (phonenumber && otp) {
  //     client
  //         .verify
  //         .services("VA4463286e4585d50a7c0565ec04ac4027")
  //         .verificationChecks
  //         .create({
  //             to: `+${phonenumber}`,
  //             code: otp
  //         })
  //         .then(data => {
  //             otpinfo = JSON.stringify(data.status)

  //             fs.writeFile('./otpverification.txt', otpinfo, err => {
  //                 if (err) {
  //                     console.log('Error writing file', err)
  //                 } else {
  //                     console.log('Successfully wrote file')
  //                 }
  //             })
  //         })
  //     otpdata = fs.readFileSync('./otpverification.txt', { encoding: 'utf8', flag: 'r' });
  //     //console.log("Line 61",otpdata)

  //    if (otpdata.includes("approved")) {
          agent.add("Looks like your account has been locked. <br>Raised a incident with ID INC0010160 for password reset issue<br><i>Anything else we can help you with?")
  //    } else {
  //        agent.add("Mobile Number Unverified")
  //    }
  // } else {
  //     console.log(otp)
  //     agent.add("Mobile Number " + phonenumber + " is wrong")
  // }

}


var intentMap = new Map();
    intentMap.set("Details", demo);
    intentMap.set("Default Welcome Intent", welcomeMsg);
    intentMap.set("Raise a ticket", Ticket);
    intentMap.set("status_check", status);
    intentMap.set("liveagent", liveagent);
    intentMap.set("passwordReset", passwordReset);
    intentMap.set("passwordReset - yes", OTPsend)
    intentMap.set("OTPVerify", OTPVerify)
    intentMap.set("getImage", getImage)
    agent.handleRequest(intentMap);
});
  
app.listen(8080,()=>console.log("server is live at port 8080"));

