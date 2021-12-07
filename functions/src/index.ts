import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

admin.initializeApp();
exports.getCollections = functions.https.onCall(async () => {
  // const ref = admin.firestore().collection('rooms').listDocuments();
  // ref.then(docs => {
  //   docs.map(doc => doc.path);
  // })
  const collections = await admin.firestore()
    .doc("rooms/CtG76RZ7LJ1ACjrmwBih").listCollections();
  return collections.map((col) => col.path);
});
