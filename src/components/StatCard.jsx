import { STATUS_CONFIG } from "../constants/status";
import { useWindowWidth } from "../hooks/useWindowWidth";

export default function StatCard({ status, count, active, onClick }) {
  const c = STATUS_CONFIG[status];
  const w = useWindowWidth();
  const isMobile = w < 600;

  return (
    <div
      className="stat-card"
      onClick={onClick}
      style={{
        background: active ? c.bg : "rgba(255,255,255,0.03)",
        border: `1px solid ${active ? c.color : "rgba(255,255,255,0.07)"}`,
        borderRadius: "12px",
        padding: isMobile ? "12px 10px" : "14px 16px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        userSelect: "none",
      }}
    >
      <div
        style={{
          fontSize: isMobile ? "1.55rem" : "1.8rem",
          fontWeight: 700,
          color: c.color,
          fontFamily: "'Playfair Display', serif",
          lineHeight: 1,
        }}
      >
        {count}
      </div>
      <div
        style={{
          fontSize: isMobile ? "0.63rem" : "0.72rem",
          color: "rgba(255,255,255,0.4)",
          marginTop: "5px",
          fontWeight: 500,
          lineHeight: 1.3,
        }}
      >
        {status}
      </div>
    </div>
  );
}
