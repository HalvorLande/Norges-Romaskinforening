const admin = require('firebase-admin');
const serviceAccount = require('./service-account-key.json'); // Ensure this file is properly set up

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore(); // Firestore instance

exports.handler = async (event, context) => {
  try {
    // Extract and validate the authorization token from headers
    const token = event.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Unauthorized: No token provided' }),
      };
    }

    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
      console.log('Authenticated user:', decodedToken.uid);
    } catch (authError) {
      console.error('Authentication failed:', authError);
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Forbidden: Invalid token' }),
      };
    }

    // Fetch data from the Firestore collection "feed"
    console.log('Fetching feed for user:', decodedToken.uid);
    
    const snapshot = await db.collection('feed').get();
    const feed = snapshot.docs.map((doc) => ({
      id: doc.id, // Document ID
      ...doc.data(), // Document data
    }));

    console.log('Database query results:', feed);
    // Return the fetched feed
    return {
      statusCode: 200,
      body: JSON.stringify(feed),
    };
  } catch (error) {
    console.error('Error in get-feed function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
