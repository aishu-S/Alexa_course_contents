// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Licensed under the Amazon Software License
// http://aws.amazon.com/asl/

/* eslint-disable  func-names */
/* eslint-disable  no-console */
/* eslint-disable  no-restricted-syntax */
'use strict';
const Alexa = require('ask-sdk');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
      const speechText = 'Hi, I can help you remember the phone numbers of your friends and family.';
      return handlerInput.responseBuilder
          .speak(speechText)
          .reprompt(speechText)
          .getResponse();
  }
};
const AddPhoneNumberIntentHandler = {
  canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
          && handlerInput.requestEnvelope.request.intent.name === 'AddPhoneNumberIntent';
  },
async handle(handlerInput) {
      const phoneNumber = handlerInput.requestEnvelope.request.intent.slots.number.value;
      const name = handlerInput.requestEnvelope.request.intent.slots.name.value;
      const attributesManager = handlerInput.attributesManager;
  const responseBuilder = handlerInput.responseBuilder;
  const attributes = await attributesManager.getPersistentAttributes() || {};
  if(Object.keys(attributes).length === 0) {
          attributes.PhoneNumbers = {};
      }
      attributes.PhoneNumbers[name] = phoneNumber;
  attributesManager.setPersistentAttributes(attributes);
  await attributesManager.savePersistentAttributes();
      const speechText = 'Okay, I will remember that '  + name + 's phonenumber is ' +phoneNumber;
      return responseBuilder
          .speak(speechText)
          .reprompt(speechText)
          .getResponse();
  }
};
const FetchPhoneNumberIntentHandler = {
  canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
          && handlerInput.requestEnvelope.request.intent.name === 'FetchPhoneNumberIntent';
  },
async handle(handlerInput) {
      var speechText = "";
      const name = handlerInput.requestEnvelope.request.intent.slots.name.value;
  const attributesManager = handlerInput.attributesManager;
  const responseBuilder = handlerInput.responseBuilder;
  const attributes = await attributesManager.getPersistentAttributes() ;
  if(attributes.PhoneNumbers[name]) {
          speechText = name + '\'s number is  '+attributes.PhoneNumbers[name];
      }
      else {
          speechText = "Are you sure you gave me"+name+"s number?";
      }
       return handlerInput.responseBuilder
          .speak(speechText)
          .reprompt(speechText)
          .getResponse();
  }
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;

    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('Bye')
      .getResponse();
  },
};

const SessionEndedRequest = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

const HelpIntent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;

    return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechOutput = 'You can ask me to remember phone numbers.';
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(speechOutput)
      .getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    AddPhoneNumberIntentHandler,
    FetchPhoneNumberIntentHandler,
    ExitHandler,
    SessionEndedRequest,
    HelpIntent
  )
  .addErrorHandlers(ErrorHandler)
  .withTableName('Contacts')
  .withAutoCreateTable(true)
  .lambda();
