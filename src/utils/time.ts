const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

export const formatRelativeTime = (timestamp: number, now: number = Date.now()) => {
  const diff = Math.max(0, now - timestamp);

  if (diff < MINUTE_MS) {
    return "Just now";
  }

  if (diff < HOUR_MS) {
    const minutes = Math.floor(diff / MINUTE_MS);
    return `${minutes}m ago`;
  }

  if (diff < DAY_MS) {
    const hours = Math.floor(diff / HOUR_MS);
    return `${hours}h ago`;
  }

  const days = Math.floor(diff / DAY_MS);
  return `${days}d ago`;
};