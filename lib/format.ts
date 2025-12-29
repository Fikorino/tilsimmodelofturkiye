export function formatDateTR(date: Date) {
  return date.toLocaleDateString("tr-TR");
}

export function formatReference() {
  const now = new Date();
  const stamp = now
    .toISOString()
    .replace(/[-:T]/g, "")
    .slice(0, 12);
  const rand = Math.floor(Math.random() * 900 + 100);
  return `TM-${stamp}-${rand}`;
}
