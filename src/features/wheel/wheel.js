// Degrees per millisecond; stopping starts at this same velocity.
export const SPIN_SPEED = 1.1;
export const STORAGE_KEY = 'lunch_roulette_list';
export const COLORS = ['#eda0b9', '#b69cdd', '#8ebfdf', '#8ecbb9', '#dfbb78', '#c4a5cd'];
export function parseItems(text) {
  return text.split('\n').map((name) => name.trim()).filter(Boolean);
}
export function getTargetAngle(angle, index, count) {
  const target = 360 - (index + 0.5) * (360 / count);
  return angle + 1080 + ((target - angle % 360 + 360) % 360);
}

export function getStopDuration(from, to) {
  // Cubic ease-out starts at 3 * distance / duration.
  return 3 * (to - from) / SPIN_SPEED;
}
