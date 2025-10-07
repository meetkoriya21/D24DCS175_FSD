import React, { useState } from "react";
import { auth, provider, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";

export default function Login() {
  const [isSignup, setIsSignup] = useState(true);
  const [email, setEmail] = useState("");
  const [passwd, setPasswd] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  async function ensureUserDoc(user) {
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        uid: user.uid,
        name: user.displayName || "Anonymous",
        email: user.email,
        photoURL: user.photoURL || "",
        createdAt: serverTimestamp(),
      });
    }
  }

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isSignup) {
        const cred = await createUserWithEmailAndPassword(auth, email, passwd);
        await updateProfile(cred.user, {
          displayName: name || email.split("@")[0],
          photoURL: `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(name || email)}`
        });
        await ensureUserDoc(cred.user);
      } else {
        const cred = await signInWithEmailAndPassword(auth, email, passwd);
        await ensureUserDoc(cred.user);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogle = async () => {
    try {
      const cred = await signInWithPopup(auth, provider);
      await ensureUserDoc(cred.user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth card">
      <div className="logo" style={{ marginBottom: 12 }}>
        <span className="dot"></span>
        <span>Chatter</span>
      </div>
      <h2>{isSignup ? "Create account" : "Sign In"}</h2>
      <form onSubmit={handleAuth}>
        {isSignup && (
          <div className="group">
            <label>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Lovelace" />
          </div>
        )}
        <div className="group">
          <label>Email</label>
          <input type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} required placeholder="you@chat.com" />
        </div>
        <div className="group">
          <label>Password</label>
          <input type="password" value={passwd}
            onChange={(e) => setPasswd(e.target.value)} required placeholder="••••••••" />
        </div>
        <div className="group">
          <button className="btn primary full" type="submit">
            {isSignup ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </form>
      <div className="group">
        <button className="btn full" onClick={handleGoogle}>Continue with Google</button>
      </div>
      <div className="switch" style={{ marginTop: 6 }}>
        {isSignup ? (
          <>Already have an account? <button onClick={() => setIsSignup(false)}>Sign in</button></>
        ) : (
          <>Don't have an account? <button onClick={() => setIsSignup(true)}>Create one</button></>
        )}
      </div>
      {error && <p className="muted" style={{ color: "var(--danger)" }}>{error}</p>}
      <p className="muted" style={{ marginTop: 8 }}>Fill your Firebase config in the script to run locally.</p>
    </div>
  );
}
