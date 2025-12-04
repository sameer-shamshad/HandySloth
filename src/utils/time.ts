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

/**
 * Formats a date string to "Joined [Month] [Year]" format
 * @param dateString - ISO date string (e.g., "2024-11-15T10:00:00Z")
 * @returns Formatted string like "Joined Nov 2024"
 */
export const formatAccountCreationDate = (dateString: string): string => {
  const date = new Date(dateString);
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const year = date.getFullYear();
  return `Joined ${month} ${year}`;
};