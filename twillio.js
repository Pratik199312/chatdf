const express = require("express")
const app = express();
const fulfil = require("dialogflow-fulfillment")
const client = require('twilio')('ACd7833d72cc8305af20eced8a803ddff0', '455b88c2cd48508b730530bd8c3176c3');

app.post("/", express.json(), function(request,response){
    dialogflow(request,response)
})

const dialogflow = (request,response) => {
    const agent = new fulfil.WebhookClient({request,response})

    function demo(agent){
        const sentiment = request.body.queryResult.sentimentAnalysisResult.queryTextSentiment.score
        var intentdetails = "Intent is "+ request.body.queryResult.intent.displayName + " "
        var userrequest = "Input is " + request.body.queryResult.queryText + " "
 
        if (sentiment < 0) 
        {
            client.messages 
            .create({ 
               body: intentdetails+userrequest,  
               messagingServiceSid: 'MGc7ea6b85d53715697ab8c85d777348ef',      
               to: '+917288039833' 
             }) 
            .then(message => console.log(message)) 
            .catch(error => console.log(error))
            return agent.add("SMS sent to Agent "+intentdetails+userrequest)
        }
        else{
            return agent.add("Positive response")
         }   

    }
    let intentMap = new Map()
    intentMap.set("liveagent", demo)
    agent.handleRequest(intentMap)

}

app.listen(3500, function(){
  console.log( "App is Running");
})