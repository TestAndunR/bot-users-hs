let AWS = require('aws-sdk');
let firebase = require("firebase-admin");
let fs = require('fs');
var users = require('./addedUserBots.json');

let serviceAccount = JSON.parse(process.env.service_token);
console.log(users);
let addedUserBots = {
  "Emma": {
    "boxKey": "578,1274",
    "lat": 37.4202761,
    "long": -122.1172404,
    "mode": 0
  },
  "Stel": {
    "boxKey": "578,1274",
    "lat": 37.4119038,
    "long": -122.1371564,
    "mode": 0
  },
  "Abigail": {
    "boxKey": "578,1274",
    "lat": 37.4202761,
    "long": -122.1172404,
    "mode": 0
  },
  "Freya12": {
    "boxKey": "578,1274",
    "lat": 37.4457387,
    "long": -122.153042,
    "mode": 0
  },
  "Mia": {
    "boxKey": "578,1274",
    "lat": 37.4457387,
    "long": -122.153042,
    "mode": 0
  },
  "Isabella2": {
    "boxKey": "578,1274",
    "lat": 37.4202761,
    "long": -122.1172404,
    "mode": 0
  },
  "GinnyWis": {
    "boxKey": "578,1274",
    "lat": 37.4423305,
    "long": -122.1704614,
    "mode": 0
  },
  "Emy": {
    "boxKey": "578,1274",
    "lat": 37.4472718,
    "long": -122.1428232,
    "mode": 0
  },
  "Dely": {
    "boxKey": "578,1274",
    "lat": 37.4423305,
    "long": -122.1704614,
    "mode": 0
  },
  "JKMadison": {
    "boxKey": "578,1274",
    "lat": 37.4457387,
    "long": -122.153042,
    "mode": 0
  },
  "GraceD": {
    "boxKey": "578,1274",
    "lat": 37.4472718,
    "long": -122.1428232,
    "mode": 0
  },
  "SarahHill": {
    "boxKey": "578,1274",
    "lat": 37.4304544,
    "long": -122.1175716,
    "mode": 0
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
