import React, { useEffect, useState, useRef } from "react";
import { db } from "../firebase";
import {
  doc,
  collection,
  addDoc,
  updateDoc,
  getDoc,
  setDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

function composeChatId(a, b) {
  return a < b ? `${a}_${b}` : `${b}_${a}`;
}

export default function Chat({ user, activeChat }) {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [other, setOther] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages([]);
    setOther(null);
    if (!activeChat) return;

    // Get other participant's info
    const [a, b] = activeChat.split("_");
    const otherUid = user.uid === a ? b : a;
    getDoc(doc(db, "users", otherUid)).then((snap) => setOther(snap.data()));

    // Listen to messages in the chat
    const msgsRef = collection(db, "chats", activeChat, "messages");
    const qy = query(msgsRef, orderBy("createdAt", "asc"));
    const unsub = onSnapshot(qy, (qs) => {
      setMessages(qs.docs.map((d) => ({ id: d.id, ...d.data() })));
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
    return unsub;
  }, [activeChat, user.uid]);

  async function sendMessage() {
    if (!msg.trim() || !activeChat) return;
    const msgsRef = collection(db, "chats", activeChat, "messages");
    await addDoc(msgsRef, { text: msg, senderId: user.uid, createdAt: serverTimestamp() });
    setMsg("");

    // Update recent chat mirrors
    const chatRef = doc(db, "chats", activeChat);
    await updateDoc(chatRef, { lastMessage: msg, updatedAt: serverTimestamp() });

    const [a, b] = activeChat.split("_");
    const otherUid = user.uid === a ? b : a;

    await updateDoc(doc(db, "userChats", user.uid, "items", activeChat), { lastMessage: msg, updatedAt: serverTimestamp() });
    await updateDoc(doc(db, "userChats", otherUid, "items", activeChat), { lastMessage: msg, updatedAt: serverTimestamp() });
  }

  if (!activeChat) {
    return (
      <div className="empty" style={{ minHeight: 300 }}>
        <div className="pill">No chat selected</div>
      </div>
    );
  }

  return (
    <>
      <div className="topbar">
        <div className="title">
          <strong>{other?.name || "Chat"}</strong>
          <div className="muted" style={{ fontSize: ".9rem" }}>{other?.email}</div>
        </div>
      </div>
      <div className="content">
        <div className="messages">
          {messages.map((m) => (
            <div key={m.id} className={`bubble ${m.senderId === user.uid ? "me" : "you"}`}>{m.text}</div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>
        <div className="composer">
          <textarea
            value={msg}
            onChange={e => setMsg(e.target.value)}
            placeholder="Type a message…"
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button className="btn primary" onClick={sendMessage}>Send</button>
        </div>
      </div>
    </>
  );
}
