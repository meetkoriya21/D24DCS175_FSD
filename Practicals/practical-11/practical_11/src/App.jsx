// import React, { useState, useEffect } from "react";
// import { auth } from "./firebase";
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import Sidebar from "./components/Sidebar";
// import Chat from "./components/Chat";
// import Login from "./components/Login";
// import "./App.css"; // Move your large style block from HTML here

// export default function App() {
//   const [user, setUser] = useState(null);
//   const [activeChat, setActiveChat] = useState(null);

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (user) => setUser(user));
//     return () => unsub();
//   }, []);

//   if (!user) return <Login />;

//   return (
//     <div className="app">
//       <Sidebar user={user} setActiveChat={setActiveChat} signOut={() => signOut(auth)} />
//       <main className="main">
//         <Chat user={user} activeChat={activeChat} />
//       </main>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import People from "./components/People";
import Login from "./components/Login";
import "./App.css";
import { db } from "./firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

export default function App() {
  const [user, setUser] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [activeTab, setActiveTab] = useState("chats"); // "chats" | "people" | "profile"

  console.log("App activeTab:", activeTab);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setUser(user));
    return () => unsub();
  }, []);

  // Called when People section requests to start a chat
  async function handleStartChat(otherUid) {
    const chatId = user.uid < otherUid ? `${user.uid}_${otherUid}` : `${otherUid}_${user.uid}`;
    const chatRef = doc(db, "chats", chatId);
    const chatSnap = await getDoc(chatRef);
    if (!chatSnap.exists()) {
      await setDoc(chatRef, {
        chatId,
        participants: [user.uid, otherUid],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastMessage: "",
      });
    }
    setActiveChat(chatId);
    setActiveTab("chats"); // Switch to chats tab after opening
  }

  if (!user) return <Login />;

  return (
    <div className="app">
      <Sidebar
        user={user}
        setActiveChat={setActiveChat}
        signOut={() => signOut(auth)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <main className="main">
        {activeTab === "chats" && <Chat user={user} activeChat={activeChat} />}
        {activeTab === "people" && <People user={user} onStartChat={handleStartChat} />}
        {activeTab === "profile" && (
          <div style={{ padding: 24 }}>
            <h2>Profile</h2>
            <p>Name: {user.displayName}</p>
            <p>Email: {user.email}</p>
            <img alt="avatar" src={user.photoURL} width={80} style={{ borderRadius: "40px" }} />
          </div>
        )}
      </main>
    </div>
  );
}
