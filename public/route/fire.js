var firebase = require('firebase');

var config = {
    apiKey: "AIzaSyDIgY9Qel51pgVl5SxLhmhla-C9CLFREoU",
    authDomain: "el-hogar-project-22.firebaseapp.com",
    databaseURL: "https://el-hogar-project-22.firebaseio.com",
    projectId: "el-hogar-project-22",
    storageBucket: "el-hogar-project-22.appspot.com",
    messagingSenderId: "348294361641",
    appId: "1:348294361641:web:5fd4bf8ff3e69b728f6238"
  };

  var fire = firebase.initializeApp(config);
  module.exports = fire