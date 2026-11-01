// One sliding window per process, shared by all anonymous MCP clients.
export function createRateLimit(limit, now = () => performance.now()) {
  if (!Number.isSafeInteger(limit) || limit < 1) {
    throw new Error('MCP_CALL_RATE_LIMIT_PER_MINUTE must be a positive integer.');
  }
  const timestamps = [];
  let oldest = 0;
  return function retryAfter() {
    const time = now();
    if (timestamps.length < limit) {
      timestamps.push(time);
      return 0;
    }
    const remaining = timestamps[oldest] + 60_000 - time;
    if (remaining > 0) return Math.ceil(remaining / 1000);
    timestamps[oldest] = time;
    oldest = (oldest + 1) % limit;
    return 0;
  };
}
