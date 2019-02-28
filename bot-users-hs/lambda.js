let AWS = require('aws-sdk');
let firebase = require("firebase-admin");
let fs = require('fs');

let serviceAccount = (process.env.serviceAccount);
let addedUserBots = require('./addedUserBots.json');
console.log(serviceAccount);
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
