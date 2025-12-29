type RateEntry = {
  count: number;
  last: number;
};

const rateStore = new Map<string, RateEntry>();

export function checkRateLimit(key: string, limit = 3, windowMs = 60_000) {
  const now = Date.now();
  const entry = rateStore.get(key);

  if (!entry || now - entry.last > windowMs) {
    rateStore.set(key, { count: 1, last: now });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  entry.last = now;
  rateStore.set(key, entry);
  return { allowed: true, remaining: limit - entry.count };
}
