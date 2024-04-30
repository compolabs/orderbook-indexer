export default function formatCountdown(seconds: number) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const result = [];
  if (days > 0) result.push(`${days} day${days > 1 ? "s" : ""}`);
  if (hours > 0) result.push(`${hours} hour${hours > 1 ? "s" : ""}`);
  if (minutes > 0) result.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
  if (remainingSeconds > 0)
    result.push(`${Math.round(remainingSeconds)} second${remainingSeconds > 1 ? "s" : ""}`);

  return result.join(" ");
}
