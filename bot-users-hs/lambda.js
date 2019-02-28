let AWS = require('aws-sdk');
let firebase = require("firebase-admin");
let fs = require('fs');

let serviceAccount = JSON.parse(process.env.service_token);

let addedUserBots = {
  "Abigail":{
    "bio":"#Music#Love#Travel",
    "chatsChecked":0,
    "dateOfBirth":740884837000,
    "firstName":"Abigail",
    "gender":0,
    "headline":"Dammit I'm mad",
    "interested":2,
    "lastName":"Morris",
    "maxChatRadius":50000,
    "maxMapRadius":100000,
    "radius":500,
    "long":-122.1172404,
    "lat":37.4202761  },
  "Emma":{
    "bio":"People think I'm too patronizing",
    "chatsChecked":0,
    "dateOfBirth":750884837000,
    "firstName":"Emma",
    "gender":0,
    "headline":"I feel violated",
    "interested":2,
    "lastName":"Powell",
    "maxChatRadius":50000,
    "maxMapRadius":100000,
    "radius":500,
    "long":-122.1172404,
    "lat":37.4202761
  },
  "Isabella2":{
    "bio":"I used to be good at sports. Then I realized that I could buy trophies",
    "chatsChecked":0,
    "dateOfBirth":760884837000,
    "firstName":"Isabella",
    "gender":0,
    "headline":"Love youuu",
    "interested":2,
    "lastName":"Foster",
    "maxChatRadius":50000,
    "maxMapRadius":100000,
    "radius":500,
    "long":-122.1172404,
    "lat":37.4202761
  },
  "Mia":{
    "bio":"@hell",
    "chatsChecked":0,
    "dateOfBirth":770884837000,
    "firstName":"Mia",
    "gender":0,
    "headline":"It's happy hour",
    "interested":2,
    "lastName":"Hughes",
    "maxChatRadius":50000,
    "maxMapRadius":100000,
    "radius":500,
    "long":-122.153042,
    "lat":37.4457387
  },
  "JKMadison":{
    "bio":"I am a scientist geek",
    "chatsChecked":0,
    "dateOfBirth":780884837000,
    "firstName":"Madison",
    "gender":0,
    "headline":"Learn from Pandora's mistake",
    "interested":2,
    "lastName":"Jackson",
    "maxChatRadius":50000,
    "maxMapRadius":100000,
    "radius":500,
    "long":-122.153042,
    "lat":37.4457387
  },
  "Freya12":{
    "bio":"Expecting the world to treat you fairly",
    "chatsChecked":0,
    "dateOfBirth":740884837000,
    "firstName":"Freya",
    "gender":0,
    "headline":"Love is like a butterfly",
    "interested":2,
    "lastName":"Bennett",
    "maxChatRadius":50000,
    "maxMapRadius":100000,
    "radius":500,
    "long":-122.153042,
    "lat":37.4457387
  },
  "Stel":{
    "bio":"Me my style",
    "chatsChecked":0,
    "dateOfBirth":750884837000,
    "firstName":"Stella",
    "gender":0,
    "headline":"Life's a journey",
    "interested":2,
    "lastName":"Jenkins",
    "maxChatRadius":50000,
    "maxMapRadius":100000,
    "radius":500,
    "long":-122.1371564,
    "lat":37.4119038  },
  "Emy":{
    "bio":"You can't be late until you show up",
    "chatsChecked":0,
    "dateOfBirth":760884837000,
    "firstName":"Emily",
    "gender":0,
    "headline":"Never argue with idiots",
    "interested":2,
    "lastName":"Green",
    "maxChatRadius":50000,
    "maxMapRadius":100000,
    "radius":500,
    "long":-122.1428232,
    "lat":37.4472718
  },
  "GraceD":{
    "bio":"Techy,Smart",
    "chatsChecked":0,
    "dateOfBirth":770884837000,
    "firstName":"Grace",
    "gender":0,
    "headline":"You can go anywhere",
    "interested":2,
    "lastName":"Davis",
    "maxChatRadius":50000,
    "maxMapRadius":100000,
    "radius":500,
    "long":-122.1428232,
    "lat":37.4472718  },
  "Dely":{
    "bio":"Sports lover",
    "chatsChecked":0,
    "dateOfBirth":780884837000,
    "firstName":"Delilah",
    "gender":0,
    "headline":"Oxymoron",
    "interested":2,
    "lastName":"Scott",
    "maxChatRadius":50000,
    "maxMapRadius":100000,
    "radius":500,
    "long":-122.1704614,
    "lat":37.4423305
  },
  "GinnyWis":{
    "bio":"Words can only hurt you if you try to read them",
    "chatsChecked":0,
    "dateOfBirth":770884837000,
    "firstName":"Ginny",
    "gender":0,
    "headline":"Think outside the box",
    "interested":2,
    "lastName":"Williams",
    "maxChatRadius":50000,
    "maxMapRadius":100000,
    "radius":500,
    "long":-122.1704614,
    "lat":37.4423305
  },
  "SarahHill":{
    "bio":"Never interrupt your opponent while he's making a mistake",
    "chatsChecked":0,
    "dateOfBirth":780884837000,
    "firstName":"Sarah",
    "gender":0,
    "headline":"Don't let your mind wander",
    "interested":2,
    "lastName":"Hill",
    "maxChatRadius":50000,
    "maxMapRadius":100000,
    "radius":500,
    "long":-122.1175716,
    "lat":37.4304544
  }


}

let config = {
    credential: firebase.credential.cert(serviceAccount),
    authDomain: "botusers-hs.firebaseapp.com",
    databaseURL: "https://botusers-hs.firebaseio.com",
    projectId: "botusers-hs",
    storageBucket: "botusers-hs.appspot.com",
    messagingSenderId: "170203556283"
};

firebase.initializeApp(config);

let db = firebase.database();
let userLocationRef = db.ref("userLocation");

exports.handler = function (event, context, callback) {
    console.log("Lambda start");
    Promise.all(Object.keys(addedUserBots).map(userName => {
        console.log("Updating user : ", userName)
        let currentUserMeta = addedUserBots[userName];
        console.log("Meta info : ", currentUserMeta);
        return userLocationRef.child(currentUserMeta['boxKey']).child(userName).set({
            'lat': currentUserMeta['lat'],
            'long': currentUserMeta['long'],
            'mode': currentUserMeta['mode'],
            'timestamp': +new Date()
        }).then((response) => {
            console.log("Updated user location of user : ", userName);
            return response;
        });
    })).then(() => {
        db.goOffline();
        console.log("DB closed");
        context.done();
    }).catch(error => {
        console.log(error);
    });
}
