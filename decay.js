// Spaceship You decay tuning: Very Fast should feel like a daily task, not an overnight alarm.
// Half-life is 8 hours: roughly 9h = ~54% condition, 16h = ~75%, 24h = ~88%.
if (typeof DECAY !== 'undefined' && DECAY.veryfast) {
  DECAY.veryfast.half = 8 / 24;
  DECAY.veryfast.label = 'Very fast';
}