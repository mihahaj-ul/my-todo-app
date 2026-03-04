export const STATUS = {
  TODO: "Todo",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

export const STATUS_CONFIG = {
  [STATUS.TODO]: {
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.12)",
  },
  [STATUS.IN_PROGRESS]: {
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.12)",
  },
  [STATUS.COMPLETED]: {
    color: "#10B981",
    bg: "rgba(16,185,129,0.12)",
  },
};

export const FILTERS = ["All", STATUS.TODO, STATUS.IN_PROGRESS, STATUS.COMPLETED];
