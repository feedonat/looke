import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


export const myUppercaseFunction = functions.https.onCall((data, context) => {
  console.log("message received "+data.coolMsg.toUpperCase())
  return { msg: data.coolMsg.toUpperCase(), date: new Date().getTime() };
});

exports.createTeamMember = functions.firestore
  .document(`post-comment/{newComment}`)
  .onCreate(async (snap, context) => {
    const newValue = snap.data();
      // access a particular field as you would any JS property
     // console.log("function executed !!!!! ")
      const comm = newValue?.comment;
     // console.log("onCreate called" +comm);
      const increment = admin.firestore.FieldValue.increment(1);
      admin.firestore().doc(`post/${newValue?.postId}`).update({ commentCount: increment })
  });