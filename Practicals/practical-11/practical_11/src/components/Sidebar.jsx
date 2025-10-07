// import React, { useState, useEffect } from "react";
// import { db } from "../firebase";
// import { collection, query, orderBy, onSnapshot, getDocs } from "firebase/firestore";

// export default function Sidebar({ user, setActiveChat, signOut }) {
//   const [recentChats, setRecentChats] = useState([]);

//   useEffect(() => {
//     // Listen to recent chat list
//     if (!user) return;
//     const ucRef = collection(db, "userChats", user.uid, "items");
//     const qy = query(ucRef, orderBy("updatedAt", "desc"));
//     const unsub = onSnapshot(qy, (qs) => {
//       setRecentChats(
//         qs.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }))
//       );
//     });
//     return unsub;
//   }, [user]);

//   return (
//     <aside className="sidebar">
//       <div className="logo"><span className="dot"></span><span>Chatter</span></div>
//       <div className="card user-card">
//         <img src={user.photoURL || `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(user.uid)}`} alt="me" />
//         <div>
//           <div style={{ fontWeight: 600 }}>{user.displayName || "Anonymous"}</div>
//           <div className="muted">{user.email}</div>
//         </div>
//       </div>
//       <div className="nav card">
//         <div className="item active">💬 Chats</div>
//         <div className="item">👥 People</div>
//         <div className="item">🙍 Profile</div>
//         <div className="item" onClick={signOut}>🚪 Logout</div>
//       </div>
//       <div className="card" style={{ padding: 8 }}>
//         <div className="muted" style={{ padding: "8px 8px 0" }}>Recent chats</div>
//         <div className="chats">
//           {recentChats.map((c) => (
//             <div key={c.id} className="chat-row" onClick={() => setActiveChat(c.chatId)}>
//               <img src={c.otherPhoto || `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(c.otherUid)}`} alt="pfp" />
//               <div>
//                 <div className="name">{c.otherName || "User"}</div>
//                 <div className="last">{c.lastMessage || "Say hi 👋"}</div>
//               </div>
//               <div className="muted">{/* Optional: show time or new badge */}</div>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="muted" style={{ padding: 8, textAlign: "center" }}>Built with Firebase</div>
//     </aside>
//   );
// }


import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

export default function Sidebar({ user, setActiveChat, signOut, activeTab, setActiveTab }) {
  const [recentChats, setRecentChats] = useState([]);

  useEffect(() => {
    if (!user) return;
    const ucRef = collection(db, "userChats", user.uid, "items");
    const qy = query(ucRef, orderBy("updatedAt", "desc"));
    const unsub = onSnapshot(qy, (qs) => {
      setRecentChats(
        qs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });
    return unsub;
  }, [user]);

  return (
    <aside className="sidebar">
      <div className="logo"><span className="dot"></span><span>Chatter</span></div>
      <div className="card user-card">
        <img src={user.photoURL || `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(user.uid)}`} alt="me" />
        <div>
          <div style={{ fontWeight: 600 }}>{user.displayName || "Anonymous"}</div>
          <div className="muted">{user.email}</div>
        </div>
      </div>
      <div className="nav card">
        <div className={`item ${activeTab === "chats" ? "active" : ""}`} onClick={() => setActiveTab("chats")}>💬 Chats</div>
        <div className={`item ${activeTab === "people" ? "active" : ""}`} onClick={() => setActiveTab("people")}>👥 People</div>
        <div className={`item ${activeTab === "profile" ? "active" : ""}`} onClick={() => setActiveTab("profile")}>🙍 Profile</div>
        <div className="item" onClick={signOut}>🚪 Logout</div>
      </div>
      {activeTab === "chats" && (
        <div className="card" style={{ padding: 8 }}>
          <div className="muted" style={{ padding: "8px 8px 0" }}>Recent chats</div>
          <div className="chats">
            {recentChats.map((c) => (
              <div key={c.id} className="chat-row" onClick={() => setActiveChat(c.chatId)}>
                <img src={c.otherPhoto || `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(c.otherUid)}`} alt="pfp" />
                <div>
                  <div className="name">{c.otherName || "User"}</div>
                  <div className="last">{c.lastMessage || "Say hi 👋"}</div>
                </div>
                <div className="muted">{/* Optional: show time or badge */}</div>
              </div>
              
            ))}
          </div>
        </div>
      )}
      <div className="muted" style={{ padding: 8, textAlign: "center" }}>Built with Firebase</div>
    </aside>
  );
}
