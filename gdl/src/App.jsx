import React, { useState, useEffect, useRef } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import './App.css';
import videoSource from './assets/video_new.mp4';

function App() {
  const [state, setState] = useState('idle'); // idle, countdown, play
  const [countdown, setCountdown] = useState(10);
  const [debugData, setDebugData] = useState(null);
  const [error, setError] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef(null);



  useEffect(() => {
    // Listen to the specific document in Firestore
    const unsub = onSnapshot(doc(db, "timestamp", "qJBuebid1gwnw5rYa5B5"),
      (doc) => {
        setError(null); // Clear errors on successful snapshot
        if (doc.exists()) {
          const data = doc.data();
          console.log("Current data: ", data);
          setDebugData(data); // Show raw data for debugging

          if (data.state) setState(data.state);
          // Handle string or number countdown
          if (data.countdown !== undefined) {
            setCountdown(parseInt(data.countdown));
          }
        } else {
          console.log("No such document!");
          setError("Document 'timestamp/qJBuebid1gwnw5rYa5B5' not found.");
        }
      },
      (err) => {
        console.error("Firestore Error:", err);
        setError(`Connection Error: ${err.message}`);
      }
    );

    return () => unsub();
  }, []);

  // Effect to handle video playback based on state
  useEffect(() => {
    if (state === 'play' && videoRef.current) {
      // Attempt to play with sound first
      videoRef.current.muted = false;
      setIsMuted(false);
      videoRef.current.play().catch((error) => {
        console.log("Browser prevented unmuted autoplay. Switching to muted.");
        // Fallback to muted playback
        videoRef.current.muted = true;
        setIsMuted(true);
        videoRef.current.play().catch((mutedError) => {
          console.error("Video play failed completely:", mutedError);
          setError(`Video Error: ${mutedError.message}`);
        });
      });
    } else if (state !== 'play' && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [state]);

  return (
    <div className="app-container">
      {state === 'idle' && (
        <div
          className="hero animate-fade-in"
          onClick={() => {
            // "Warm up" the video element to allow unmuted autoplay later
            if (videoRef.current) {
              videoRef.current.muted = false;
              setIsMuted(false);
              videoRef.current.play().catch(() => { }).then(() => {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
              });
            }
          }}
          style={{ cursor: 'pointer' }}
        >
          <h1 className="gradient-text">e-POD Launch</h1>
          <div className="animate-float">
            <p style={{ fontSize: '2rem', marginTop: '2rem' }}>
              Waiting for countdown
            </p>
          </div>
        </div>
      )}

      {state === 'countdown' && (
        <div
          className="hero"
          onClick={() => {
            if (videoRef.current) {
              videoRef.current.muted = false;
              setIsMuted(false);
              videoRef.current.play().catch(() => { }).then(() => {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
              });
            }
          }}
          style={{ cursor: 'pointer' }}
        >
          <h1 style={{ fontSize: '15rem', lineHeight: '1' }} className="gradient-text">
            {countdown}
          </h1>
        </div>
      )}

      <div
        className={`video-overlay ${state === 'play' ? 'visible' : 'hidden'}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#000',
          zIndex: 9999, // Max z-index
          display: state === 'play' ? 'flex' : 'none',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden'
        }}
      >
        <video
          ref={videoRef}
          src={videoSource}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          playsInline
          muted={isMuted}
          preload="auto"
          loop
        />

      </div>

    </div>
  );
}

export default App;
