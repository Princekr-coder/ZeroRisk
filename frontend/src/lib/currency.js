export const RATES = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.009
};

export function convertValue(value, from, to) {
  if (from === to) return value;
  const inBase = value / RATES[from];
  return inBase * RATES[to];
}
