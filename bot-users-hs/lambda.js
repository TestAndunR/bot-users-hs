let AWS = require('aws-sdk');
let firebase = require("firebase-admin");
// let fs = require('fs');
let {users} = require('./bot-users');

let serviceAccount = JSON.parse(process.env.service_token);
console.log(users);

let config = {
    credential: firebase.credential.cert(serviceAccount),
    authDomain: "hotspa-beta.firebaseapp.com",
    databaseURL: "https://hotspa-beta.firebaseio.com",
    projectId: "hotspa-beta",
    storageBucket: "hotspa-beta.appspot.com",
    messagingSenderId: "803881221797"
};

firebase.initializeApp(config);

let db = firebase.database();
let userLocationRef = db.ref("userLocation");

exports.handler = function (event, context, callback) {
  console.log("Lambda start", users);
  Promise.all(Object.keys(users).map(userName => {
    console.log("Updating user : ", userName)
    let currentUserMeta = users[userName];
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
  // callback(null, {"a":"a"})
}