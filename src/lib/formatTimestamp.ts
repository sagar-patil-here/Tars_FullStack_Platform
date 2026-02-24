export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const isSameYear = date.getFullYear() === now.getFullYear();

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  if (isToday) return time;

  const month = date.toLocaleString("default", { month: "short" });
  const day = date.getDate();

  if (isSameYear) return `${month} ${day}, ${time}`;

  return `${month} ${day}, ${date.getFullYear()}, ${time}`;
}
