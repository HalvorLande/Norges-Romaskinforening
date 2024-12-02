import { auth } from '../firebaseConfig';
import { useEffect, useState } from 'react';
import './Feed.css'; // Import the CSS file
import logo from '../assets/logo.png'; // Import the logo image

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchPosts = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('User is not signed in');
        return;
      }

      const token = await user.getIdToken();

      const response = await fetch('/.netlify/functions/get-feed', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }

      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handlePost = async () => {
    if (!message.trim()) {
      alert('Please enter a message before posting.');
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('User is not signed in');
        return;
      }

      const token = await user.getIdToken();

      const response = await fetch('/.netlify/functions/post-feed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: message, type: 'user_post' }),
      });

      if (!response.ok) {
        throw new Error(`Failed to post message: ${response.statusText}`);
      }

      const newPost = await response.json();
      setPosts((prevPosts) => [...prevPosts, newPost]);
      setMessage('');
    } catch (error) {
      console.error('Error posting message:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchPosts();
      } else {
        setPosts([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="feed-container">
      <header className="feed-header">
        <img src={logo} alt="Logo" className="feed-logo" />
        <h1>Welcome to Norges Romaskinforening</h1>
      </header>

      <div className="feed-post-box">
        <textarea
          rows="4"
          placeholder="Write your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="feed-textarea"
        ></textarea>
        <button onClick={handlePost} className="feed-post-button">Post Message</button>
      </div>

      <div className="feed-list">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="feed-item">
              <h3>{post.type}</h3>
              <p>{post.content}</p>
            </div>
          ))
        ) : (
          <p className="feed-empty">No posts to display</p>
        )}
      </div>
    </div>
  );
}

export default Feed;
