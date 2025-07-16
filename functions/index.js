/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const logger = require("firebase-functions/logger");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Liste tous les utilisateurs Auth
exports.listAuthUsers = functions.https.onRequest(async (req, res) => {
  const users = [];
  let nextPageToken;
  do {
    const result = await admin.auth().listUsers(1000, nextPageToken);
    users.push(...result.users.map(u => ({
      uid: u.uid,
      email: u.email,
      displayName: u.displayName,
      photoURL: u.photoURL
    })));
    nextPageToken = result.pageToken;
  } while (nextPageToken);
  res.json(users);
});

// Liste tous les IDs Firestore
exports.listFirestoreUsers = functions.https.onRequest(async (req, res) => {
  const snapshot = await admin.firestore().collection('users').get();
  const ids = snapshot.docs.map(doc => doc.id);
  res.json(ids);
});

// Supprime un utilisateur Auth
exports.deleteAuthUser = functions.https.onRequest(async (req, res) => {
  const uid = req.query.uid;
  if (!uid) return res.status(400).send('Missing uid');
  try {
    await admin.auth().deleteUser(uid);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});