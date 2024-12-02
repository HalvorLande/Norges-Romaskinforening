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
    // Validate HTTP Method
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' }),
      };
    }

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

    // Parse the incoming request body
    const newItem = JSON.parse(event.body);
    console.log('New feed item received:', newItem);

    if (!newItem.content || !newItem.type) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Bad Request: Missing required fields' }),
      };
    }

    // Add metadata to the new item
    const itemWithMetadata = {
      ...newItem,
      userId: decodedToken.uid, // Associate the item with the authenticated user
      createdAt: new Date().toISOString(), // Add a timestamp
    };

    // Store the new item in Firestore
    const docRef = await db.collection('feed').add(itemWithMetadata);
    console.log('Database document created with ID:', docRef.id);

    // Return success response with the created document ID
    return {
      statusCode: 201,
      body: JSON.stringify({ id: docRef.id, ...itemWithMetadata }),
    };
  } catch (error) {
    console.error('Error in post-feed function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
