import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatIndianNumber(number) {
  return new Intl.NumberFormat('en-IN').format(number);
}

export function formatIndianCurrency(number, compact = false) {
  if (compact) {
    if (number >= 10000000) return `₹${(number / 10000000).toFixed(2)} Cr`;
    if (number >= 100000) return `₹${(number / 100000).toFixed(2)} L`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(number);
}
