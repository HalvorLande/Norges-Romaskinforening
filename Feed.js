import { auth } from './firebaseConfig';
import { useEffect, useState } from 'react';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, now fetch posts
        fetchPosts();
      } else {
        // User is not signed in, clear posts
        setPosts([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ... rest of your component
} 