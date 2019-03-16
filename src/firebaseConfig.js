import firebase from 'firebase'
import 'firebase/firestore'

// firebase init goes here
const config = {
    apiKey: "AIzaSyDI2Yk0Sv2FE6jJkjG-kEFxyWTtPuzp8QA",
    authDomain: "andrew-232321.firebaseapp.com",
    databaseURL: "https://andrew-232321.firebaseio.com",
    projectId: "andrew-232321",
    storageBucket: "andrew-232321.appspot.com",
    messagingSenderId: "217153714690"
}
firebase.initializeApp(config)

// firebase utils
const db = firebase.firestore()

db.settings({})

export {
    db,
    highScoresCollection
}