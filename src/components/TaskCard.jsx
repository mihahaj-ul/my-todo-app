import { useState, useEffect, useRef } from "react";
import { STATUS, STATUS_CONFIG } from "../constants/status";
import { useWindowWidth } from "../hooks/useWindowWidth";

const menuBtnStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  width: "100%",
  padding: "11px 16px",
  background: "transparent",
  border: "none",
  color: "#F0EDE8",
  textAlign: "left",
  cursor: "pointer",
  fontSize: "0.85rem",
  lineHeight: "1.4",
  fontFamily: "'DM Sans', sans-serif",
  whiteSpace: "nowrap",
  overflow: "visible",
  transition: "background 0.15s",
};

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const cfg = STATUS_CONFIG[task.status];
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const w = useWindowWidth();
  const isMobile = w < 480;

  useEffect(() => {
    const fn = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  return (
    <div
      className="task-card"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "16px",
        padding: isMobile ? "16px 16px 16px 20px" : "20px 22px 20px 26px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        transition: "all 0.2s ease",
        animation: "fadeSlideIn 0.35s cubic-bezier(0.23,1,0.32,1) both",
        position: "relative",
        overflow: "visible",
      }}
    >
      {/* Accent bar */}
      <div
        style={{
          position: "absolute", top: 0, left: 0,
          width: "3px", height: "100%",
          background: cfg.color,
          borderRadius: "16px 0 0 16px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Title row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
        <p
          style={{
            margin: 0,
            fontFamily: "'Playfair Display', serif",
            fontSize: isMobile ? "0.97rem" : "1.05rem",
            fontWeight: 600,
            color: task.status === STATUS.COMPLETED ? "rgba(255,255,255,0.3)" : "#F0EDE8",
            textDecoration: task.status === STATUS.COMPLETED ? "line-through" : "none",
            lineHeight: 1.45,
            flex: 1,
            wordBreak: "break-word",
            transition: "all 0.3s ease",
          }}
        >
          {task.title}
        </p>

        {/* Kebab menu */}
        <div ref={menuRef} style={{ position: "relative", flexShrink: 0 }}>
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="icon-btn"
            style={{
              background: "none", border: "none",
              color: "rgba(255,255,255,0.35)", cursor: "pointer",
              padding: "6px 8px", borderRadius: "8px",
              fontSize: "1.1rem", lineHeight: 1,
              minWidth: "36px", minHeight: "36px",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.15s, color 0.15s",
            }}
          >
            ···
          </button>

          {menuOpen && (
            <div
              style={{
                position: "absolute", top: "calc(100% + 6px)", right: 0,
                background: "#1E1C28",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "10px",
                overflow: "visible",
                zIndex: 200, minWidth: "140px",
                boxShadow: "0 12px 30px rgba(0,0,0,0.6)",
                animation: "fadeSlideIn 0.15s ease both",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <button
                onClick={() => { onEdit(task); setMenuOpen(false); }}
                className="menu-item"
                style={{
                  ...menuBtnStyle,
                  borderRadius: "10px 10px 0 0",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <span style={{ fontSize: "1rem", flexShrink: 0 }}>✏️</span>
                <span>Edit</span>
              </button>
              <button
                onClick={() => { onDelete(task.id); setMenuOpen(false); }}
                className="menu-item-danger"
                style={{
                  ...menuBtnStyle,
                  color: "#F87171",
                  borderRadius: "0 0 10px 10px",
                }}
              >
                <span style={{ fontSize: "1rem", flexShrink: 0 }}>🗑️</span>
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p
          style={{
            margin: 0, fontSize: "0.82rem",
            color: "rgba(255,255,255,0.45)",
            lineHeight: 1.6,
            fontFamily: "'DM Sans', sans-serif",
            wordBreak: "break-word",
          }}
        >
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: isMobile ? "flex-start" : "center",
          justifyContent: "space-between",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? "10px" : "0",
        }}
      >
        {/* Status buttons */}
        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
          {Object.values(STATUS).map((s) => {
            const c = STATUS_CONFIG[s];
            const active = task.status === s;
            return (
              <button
                key={s}
                onClick={() => onStatusChange(task.id, s)}
                title={s}
                style={{
                  background: active ? c.bg : "transparent",
                  border: `1px solid ${active ? c.color : "rgba(255,255,255,0.1)"}`,
                  borderRadius: "20px",
                  padding: isMobile ? "4px 9px" : "3px 10px",
                  fontSize: isMobile ? "0.68rem" : "0.7rem",
                  fontWeight: 600,
                  color: active ? c.color : "rgba(255,255,255,0.3)",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: "0.02em",
                  transition: "all 0.15s ease",
                  whiteSpace: "nowrap",
                  minHeight: "28px",
                }}
              >
                {s}
              </button>
            );
          })}
        </div>

        <span
          style={{
            fontSize: "0.67rem",
            color: "rgba(255,255,255,0.22)",
            fontFamily: "'DM Sans', sans-serif",
            flexShrink: 0,
          }}
        >
          {new Date(task.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
      </div>
    </div>
  );
}