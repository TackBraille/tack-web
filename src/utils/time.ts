export function getCurrentDateTimeString(): string {
  const now = new Date();
  // e.g. 2025-10-07 16:45:00 GMT-0700 (PDT)
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  return `${date} ${time} (${tz})`;
}
