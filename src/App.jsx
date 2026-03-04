import { useState, useEffect } from "react";
import { STATUS, FILTERS } from "./constants/status";
import { STATUS_CONFIG } from "./constants/status";
import { generateId } from "./utils/generateId";
import { useWindowWidth } from "./hooks/useWindowWidth";
import TaskCard from "./components/TaskCard";
import Modal from "./components/Modal";
import StatCard from "./components/StatCard";
import "./styles/globals.css";

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try { return JSON.parse(localStorage.getItem("tasks_v1")) || []; }
    catch { return []; }
  });
  const [filter, setFilter]           = useState("All");
  const [modalOpen, setModalOpen]     = useState(false);
  const [editTask, setEditTask]       = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const w        = useWindowWidth();
  const isMobile = w < 600;

  useEffect(() => {
    localStorage.setItem("tasks_v1", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = ({ title, description, status }) => {
    setTasks((prev) => [
      { id: generateId(), title, description, status, createdAt: Date.now() },
      ...prev,
    ]);
    setModalOpen(false);
  };

  const updateTask = ({ title, description, status }) => {
    setTasks((prev) =>
      prev.map((t) => t.id === editTask.id ? { ...t, title, description, status } : t)
    );
    setEditTask(null);
  };

  const deleteTask = (id) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const changeStatus = (id, status) =>
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status } : t));

  const filteredTasks = tasks.filter((t) => {
    const matchStatus = filter === "All" || t.status === filter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const counts = {
    All: tasks.length,
    [STATUS.TODO]:        tasks.filter((t) => t.status === STATUS.TODO).length,
    [STATUS.IN_PROGRESS]: tasks.filter((t) => t.status === STATUS.IN_PROGRESS).length,
    [STATUS.COMPLETED]:   tasks.filter((t) => t.status === STATUS.COMPLETED).length,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0D0B14",
        backgroundImage: `
          radial-gradient(ellipse 90% 50% at 50% -10%, rgba(245,158,11,0.08) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 85% 85%, rgba(59,130,246,0.05) 0%, transparent 50%)
        `,
        paddingBottom: isMobile
          ? "calc(88px + env(safe-area-inset-bottom, 0px))"
          : "60px",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          padding: isMobile ? "36px 16px 24px" : "56px 20px 36px",
          animation: "fadeSlideIn 0.5s cubic-bezier(0.23,1,0.32,1) both",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: "0.68rem", letterSpacing: "0.18em",
              color: "#F59E0B", fontWeight: 700,
              textTransform: "uppercase", marginBottom: "8px",
            }}>
              Task Manager
            </div>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.75rem, 6vw, 2.8rem)",
              fontWeight: 900, color: "#F0EDE8",
              lineHeight: 1.1, letterSpacing: "-0.01em",
            }}>
              My Tasks
            </h1>
          </div>

          {!isMobile && (
            <button
              className="add-btn"
              onClick={() => setModalOpen(true)}
              style={{
                background: "linear-gradient(135deg, #F59E0B, #EF7C2A)",
                border: "none", borderRadius: "14px",
                padding: "12px 22px", color: "#0D0B14",
                fontWeight: 700, fontSize: "0.9rem",
                cursor: "pointer", display: "flex",
                alignItems: "center", gap: "7px",
                letterSpacing: "0.01em",
                boxShadow: "0 4px 15px rgba(245,158,11,0.25)",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap", flexShrink: 0,
                minHeight: "44px",
              }}
            >
              <span style={{ fontSize: "1.2rem", lineHeight: 1 }}>+</span>
              New Task
            </button>
          )}
        </div>

        {/* Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: isMobile ? "8px" : "14px",
          marginTop: "22px", paddingTop: "20px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}>
          {Object.values(STATUS).map((s) => (
            <StatCard
              key={s}
              status={s}
              count={counts[s]}
              active={filter === s}
              onClick={() => setFilter(filter === s ? "All" : s)}
            />
          ))}
        </div>
      </div>

      {/* ── Controls ── */}
      <div style={{
        maxWidth: "720px", margin: "0 auto",
        padding: isMobile ? "0 16px" : "0 20px",
        display: "flex", flexDirection: "column",
        gap: "12px", marginBottom: "18px",
        animation: "fadeSlideIn 0.5s 0.1s cubic-bezier(0.23,1,0.32,1) both",
      }}>
        {/* Search */}
        <div style={{ position: "relative" }}>
          <span style={{
            position: "absolute", left: "14px", top: "50%",
            transform: "translateY(-50%)",
            color: "rgba(255,255,255,0.3)", fontSize: "0.9rem",
            pointerEvents: "none",
          }}>🔍</span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks…"
            style={{
              width: "100%", padding: "12px 14px 12px 40px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px", color: "#F0EDE8",
              fontSize: "16px", outline: "none",
              transition: "border-color 0.2s ease",
              minHeight: "46px",
            }}
            onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
            onBlur={(e)  => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
          />
        </div>

        {/* Filters */}
        <div style={{
          display: "flex", gap: "7px",
          overflowX: "auto", paddingBottom: "2px",
          scrollbarWidth: "none", WebkitOverflowScrolling: "touch",
        }}>
          {FILTERS.map((f) => {
            const active = filter === f;
            const cfg = STATUS_CONFIG[f];
            return (
              <button
                key={f}
                className="filter-btn"
                onClick={() => setFilter(f)}
                style={{
                  padding: "7px 14px",
                  background: active
                    ? (f === "All" ? "rgba(240,237,232,0.12)" : cfg.bg)
                    : "transparent",
                  border: `1px solid ${active
                    ? (f === "All" ? "rgba(240,237,232,0.3)" : cfg.color)
                    : "rgba(255,255,255,0.1)"}`,
                  borderRadius: "20px",
                  color: active
                    ? (f === "All" ? "#F0EDE8" : cfg.color)
                    : "rgba(255,255,255,0.4)",
                  fontSize: "0.76rem", fontWeight: 600,
                  cursor: "pointer", transition: "all 0.15s ease",
                  letterSpacing: "0.02em", whiteSpace: "nowrap",
                  flexShrink: 0, minHeight: "34px",
                }}
              >
                {f}
                <span style={{ marginLeft: "5px", opacity: 0.6, fontSize: "0.68rem" }}>
                  {f === "All" ? counts.All : counts[f]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Task List ── */}
      <div style={{
        maxWidth: "720px", margin: "0 auto",
        padding: isMobile ? "0 16px" : "0 20px",
        display: "flex", flexDirection: "column", gap: "10px",
        animation: "fadeSlideIn 0.5s 0.15s cubic-bezier(0.23,1,0.32,1) both",
      }}>
        {filteredTasks.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 20px", color: "rgba(255,255,255,0.2)" }}>
            <div style={{ fontSize: "2.8rem", marginBottom: "16px" }}>
              {tasks.length === 0 ? "✦" : "◎"}
            </div>
            <div style={{
              fontFamily: "'Playfair Display', serif", fontSize: "1.05rem",
              marginBottom: "8px", color: "rgba(255,255,255,0.3)",
            }}>
              {tasks.length === 0 ? "No tasks yet" : "No tasks match"}
            </div>
            <div style={{ fontSize: "0.8rem" }}>
              {tasks.length === 0
                ? isMobile ? "Tap ＋ to get started" : "Click + New Task to get started"
                : "Try a different filter or search"}
            </div>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={(t) => setEditTask(t)}
              onDelete={deleteTask}
              onStatusChange={changeStatus}
            />
          ))
        )}
      </div>

      {/* ── Mobile FAB ── */}
      {isMobile && (
        <button
          className="fab"
          onClick={() => setModalOpen(true)}
          aria-label="Add new task"
          style={{
            position: "fixed",
            bottom: "calc(24px + env(safe-area-inset-bottom, 0px))",
            right: "20px",
            width: "58px", height: "58px",
            background: "linear-gradient(135deg, #F59E0B, #EF7C2A)",
            border: "none", borderRadius: "50%",
            color: "#0D0B14", fontSize: "1.75rem",
            lineHeight: 1, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 6px 20px rgba(245,158,11,0.38)",
            zIndex: 200, transition: "all 0.2s ease",
            animation: "fabPop 0.4s 0.3s cubic-bezier(0.23,1,0.32,1) both",
          }}
        >
          +
        </button>
      )}

      {/* ── Modals ── */}
      {modalOpen && (
        <Modal task={null} onSave={addTask} onClose={() => setModalOpen(false)} />
      )}
      {editTask && (
        <Modal task={editTask} onSave={updateTask} onClose={() => setEditTask(null)} />
      )}
    </div>
  );
}
