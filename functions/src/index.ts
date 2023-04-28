// import * as functions from "firebase-functions";
// import * as admin from "firebase-admin";


// ***********IMPORTANT***********************
// This is static script. Runs only in the firebase server
// Whatever you do here, it wont reflect on firebase
// You have to RE-DELPOY this script when you change something in the file to UPDATE script in firebase server
// To do so, run "firebase deploy --only functions" 

// ***********INFO***********************
// This will trigger when new user is created
// After the user has been created, this script will grab the new user from Authentication and save to Firestore

// admin.initializeApp();
// const db = admin.firestore();

// export const createUserDocument = functions.auth
//   .user()
//   .onCreate(async (user) => {
//     db.collection("users")
//       .doc(user.uid)
//       .set(JSON.parse(JSON.stringify(user)));
// });

