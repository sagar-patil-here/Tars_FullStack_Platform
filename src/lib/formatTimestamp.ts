export function formatMessageTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDateSeparator(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";

  const month = date.toLocaleString("default", { month: "short" });
  const day = date.getDate();
  const isSameYear = date.getFullYear() === now.getFullYear();

  if (isSameYear) return `${month} ${day}`;
  return `${month} ${day}, ${date.getFullYear()}`;
}

/**
 * Returns true if two timestamps are on different calendar days.
 */
export function isDifferentDay(ts1: number, ts2: number): boolean {
  const d1 = new Date(ts1);
  const d2 = new Date(ts2);
  return (
    d1.getDate() !== d2.getDate() ||
    d1.getMonth() !== d2.getMonth() ||
    d1.getFullYear() !== d2.getFullYear()
  );
}
