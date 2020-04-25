// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
var userName;
var questionNumber;
var score;

var questionImage = ['https://images-na.ssl-images-amazon.com/images/I/51p5mML-S%2BL._SX425_.jpg','https://cdn.playbuzz.com/cdn/ca194889-93ea-49b3-8ed3-4e8ccf40c846/9e0ebc9f-e92f-4296-8984-1cc9ce316150.jpg','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNoZ2giFoHYZPyyKMUevzcr7kOSSPT_9Ys_YTMFn3MZJxTylSX','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLBp9iTEpCNh6XbbK-2u0WhOQz8EQkiO1e1Yn9nZwSmCzck95K','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxpRuTUCAsO_qJ2zZlmhypmRsseAV3ZtIRQlL4Zh_19J_TJ9Yp'];

var answerImage = ['https://cdn.bulbagarden.net/upload/8/88/026Raichu.png','https://cdn.bulbagarden.net/upload/thumb/0/05/038Ninetales.png/1200px-038Ninetales.png','https://pm1.narvii.com/6382/61a371a7768ed6e7e2e9e19a3307101e378e2719_hq.jpg','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWoqPnjWLZCjEP2XeFYih-epcPfbKt7F4TQ8Mch1WcisgIqdCZ','https://pngimage.net/wp-content/uploads/2018/06/horsea-png-4.png'];

var answers = ['raichu','ninetales','bulbasaur','squirtle','horsea'];

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        questionNumber = 0;
        score = 0;
        var title = 'Who is that Pokemon?';
        var cardText = 'Welcome Pokemon trainer! How should I call you?';
        const speechText = 'Welcome Pokemon trainer! How should I call you?';
        var cardImage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/1200px-International_Pok%C3%A9mon_logo.svg.png';
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withStandardCard(title, cardText, cardImage)
            .getResponse();
    }
};

const greetUserIntentHandler = {
    canHandle(handlerInput){
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name ==='greetUserIntent'
    },
    handle(handlerInput) {
        userName = handlerInput.requestEnvelope.request.intent.slots.name.value;
        var speechText = 'Hello '+userName+'. To begin, ask me to start the quiz';
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse()
    }
};

const QuestionIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name ==='QuestionIntent'
    },
    handle(handlerInput) {
        var speechText = 'Can you guess this Pokemon '+userName+'?';
        
        var title = 'Who is this Pokemon?';
        
        var cardText = 'Can you guess this Pokemon?';
        
        var cardImage = questionImage[questionNumber];
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withStandardCard(title, cardText, cardImage)
            .getResponse()
    }
};

const AnswerIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name ==='AnswerIntent'
    },
    handle(handlerInput) {
        
        var title = 'Who is this Pokemon?';
        var cardText;
        var speechText;
        var answer = handlerInput.requestEnvelope.request.intent.slots.pokemon.value;
        
        if(answer === answers[questionNumber]) {
            score++;
            cardText = 'That is correct! It is '+answer+'. You scored '+score;
            speechText = 'That is correct! It is '+answer+'. You scored '+score;
        }
        
        else {
            cardText = 'Sorry. The correct answer is '+answers[questionNumber];
            speechText = 'Sorry. The correct answer is '+answers[questionNumber];
        }
        
        var cardImage = answerImage[questionNumber];
      
        questionNumber++;
        
        if(questionNumber < 5) {
            speechText = speechText +'. To continue playing, ask me for the next question';
            
        }
        else {
            speechText = speechText + 'You have answered all the questions I have, and scored '+score+'. To play again, ask me to play again.'
            score = 0;
            questionNumber = 0;
        }
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withStandardCard(title, cardText, cardImage)
            .getResponse()
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'To play the game ask me to give you a question, you can answer by telling, it is followed by your answer. To exit the game say Alexa, stop.';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = handlerInput.requestEnvelope.request.intent.name;
        const speechText = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.message}`);
        const speechText = `Sorry, I couldn't understand what you said. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
}; 

// This handler acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        greetUserIntentHandler,
        QuestionIntentHandler,
        AnswerIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    .addErrorHandlers(
        ErrorHandler)
    .lambda();
