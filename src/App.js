import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { auth, signInWithGoogle, logOut } from './firebaseConfig';
import Header from './components/Header';
import Footer from './components/Footer';
import Feed from './components/Feed';
import './App.css'; // Import the updated CSS

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="app-main">
          {user ? (
            <>
              <div className="auth-section">
                <button onClick={logOut} className="auth-button logout">
                  Sign Out
                </button>
              </div>
              <Routes>
                <Route path="/" element={<Feed />} />
              </Routes>
            </>
          ) : (
            <div className="auth-section">
              <h2>Please sign in to continue</h2>
              <button onClick={signInWithGoogle} className="auth-button signin">
                Sign in with Google
              </button>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
