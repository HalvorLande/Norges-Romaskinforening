import { db } from './firebaseConfig';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

// When fetching posts
const fetchPosts = async () => {
  try {
    if (!auth.currentUser) {
      console.log("No user signed in");
      return;
    }

    const postsRef = collection(db, 'posts');
    const querySnapshot = await getDocs(postsRef);
    const postsData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return postsData;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

// When creating a post
const createPost = async (postData) => {
  try {
    if (!auth.currentUser) {
      throw new Error("Must be signed in to create post");
    }

    const post = {
      ...postData,
      userId: auth.currentUser.uid,
      createdAt: new Date(),
    };

    const docRef = await addDoc(collection(db, 'posts'), post);
    return docRef;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}; 