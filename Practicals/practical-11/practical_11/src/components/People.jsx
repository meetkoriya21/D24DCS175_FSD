import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

// Utility for safe display
function escapeHtml(s) {
  return s?.replace(/[&<>"']/g, c => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c]
  ));
}

export default function People({ user, onStartChat }) {
  const [people, setPeople] = useState([]);
  const [term, setTerm] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      const qs = await getDocs(collection(db, "users"));
      const items = qs.docs
        .map(d => d.data())
        .filter(u => u.uid !== user.uid);
      setPeople(items);
    }
    fetchUsers();
  }, [user.uid]);

  // Live filter
  const filtered = people.filter(
    u =>
      (u.name || "")
        .toLowerCase()
        .includes(term.trim().toLowerCase()) ||
      (u.email || "")
        .toLowerCase()
        .includes(term.trim().toLowerCase())
  );

  return (
    <div style={{ padding: "8px" }}>
      <div style={{ marginBottom: "10px" }}>
        <input
          placeholder="Search users by name/email"
          value={term}
          onChange={e => setTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "9px",
            borderRadius: "9px",
            border: "1px solid #384883",
            background: "rgba(0,0,0,.15)",
            color: "#e8eeff"
          }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
        {filtered.map(u => (
          <div
            key={u.uid}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "11px",
              borderRadius: "13px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,.08)",
              cursor: "pointer"
            }}
            onClick={() => onStartChat(u.uid)}
            title="Start chat"
          >
            <img
              src={u.photoURL || `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(u.name || u.uid)}`}
              alt={u.name}
              style={{ width: 38, height: 38, borderRadius: "50%" }}
            />
            <div>
              <div style={{ fontWeight: 600 }}>{escapeHtml(u.name || "User")}</div>
              <div style={{ color: "#a8b0d6", fontSize: ".95rem" }}>{escapeHtml(u.email || "")}</div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ color: "#aeb7e9", marginTop: 30, textAlign: "center" }}>No users found</div>
        )}
      </div>
    </div>
  );
}
