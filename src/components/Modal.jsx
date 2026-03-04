import { useState, useEffect, useRef } from "react";
import { STATUS, STATUS_CONFIG } from "../constants/status";
import { useWindowWidth } from "../hooks/useWindowWidth";
import { inputStyle, labelStyle } from "../styles/sharedStyles";

export default function Modal({ task, onSave, onClose }) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState(task?.status || STATUS.TODO);
  const titleRef = useRef(null);
  const w = useWindowWidth();
  const isMobile = w < 600;

  useEffect(() => {
    const t = setTimeout(() => titleRef.current?.focus(), 100);
    const handleKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSave({ title: title.trim(), description: description.trim(), status });
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(8,7,15,0.88)",
        backdropFilter: "blur(8px)",
        zIndex: 1000,
        display: "flex",
        alignItems: isMobile ? "flex-end" : "center",
        justifyContent: "center",
        padding: isMobile ? "0" : "20px",
        animation: "fadeIn 0.2s ease both",
      }}
    >
      <div
        style={{
          background: "#16141F",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: isMobile ? "20px 20px 0 0" : "20px",
          padding: isMobile
            ? "24px 20px calc(28px + env(safe-area-inset-bottom, 0px))"
            : "32px",
          width: "100%",
          maxWidth: isMobile ? "100%" : "480px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
          animation: isMobile
            ? "sheetIn 0.32s cubic-bezier(0.23,1,0.32,1) both"
            : "modalIn 0.3s cubic-bezier(0.23,1,0.32,1) both",
          maxHeight: isMobile ? "92dvh" : "none",
          overflowY: "auto",
        }}
      >
        {/* Drag handle (mobile only) */}
        {isMobile && (
          <div
            style={{
              width: "36px", height: "4px",
              background: "rgba(255,255,255,0.15)",
              borderRadius: "4px",
              margin: "0 auto 20px",
            }}
          />
        )}

        <h2
          style={{
            margin: "0 0 22px",
            fontFamily: "'Playfair Display', serif",
            fontSize: isMobile ? "1.25rem" : "1.4rem",
            color: "#F0EDE8",
            fontWeight: 700,
          }}
        >
          {task ? "Edit Task" : "New Task"}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Title */}
          <div>
            <label style={labelStyle}>Title *</label>
            <input
              ref={titleRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="What needs to be done?"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.6)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add some context… (optional)"
              rows={3}
              style={{ ...inputStyle, resize: "vertical", minHeight: "80px" }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.6)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>

          {/* Status */}
          <div>
            <label style={labelStyle}>Status</label>
            <div style={{ display: "flex", gap: "8px" }}>
              {Object.values(STATUS).map((s) => {
                const c = STATUS_CONFIG[s];
                return (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    style={{
                      flex: 1,
                      padding: "9px 4px",
                      background: status === s ? c.bg : "transparent",
                      border: `1px solid ${status === s ? c.color : "rgba(255,255,255,0.1)"}`,
                      borderRadius: "10px",
                      color: status === s ? c.color : "rgba(255,255,255,0.4)",
                      fontSize: isMobile ? "0.7rem" : "0.75rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                      transition: "all 0.15s ease",
                      minHeight: "42px",
                    }}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
          <button
            onClick={onClose}
            style={{
              flex: "0 0 auto",
              padding: "13px 20px",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              color: "rgba(255,255,255,0.5)",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
              minHeight: "48px",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim()}
            style={{
              flex: 1,
              padding: "13px",
              background: title.trim()
                ? "linear-gradient(135deg, #F59E0B, #EF7C2A)"
                : "rgba(255,255,255,0.08)",
              border: "none",
              borderRadius: "12px",
              color: title.trim() ? "#0D0B14" : "rgba(255,255,255,0.25)",
              fontWeight: 700,
              fontSize: "0.9rem",
              cursor: title.trim() ? "pointer" : "not-allowed",
              transition: "all 0.2s ease",
              letterSpacing: "0.02em",
              minHeight: "48px",
            }}
          >
            {task ? "Save Changes" : "Add Task"}
          </button>
        </div>
      </div>
    </div>
  );
}
