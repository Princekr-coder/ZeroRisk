export function formatCurrency(value, currency, compact = false) {
  const options = {
    style: "currency",
    currency: currency,
    maximumFractionDigits: compact ? 1 : 0,
  };

  const locale = currency === "INR" ? "en-IN" : "en-US";
  
  if (compact) {
    if (currency === "INR") {
      if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
      if (value >= 100000) return `₹${(value / 100000).toFixed(2)} Lakh`;
    } else {
      // Simple compact for others
      if (value >= 1000000) return `${getCurrencySymbol(currency)}${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `${getCurrencySymbol(currency)}${(value / 1000).toFixed(1)}K`;
    }
  }

  return new Intl.NumberFormat(locale, options).format(value);
}

function getCurrencySymbol(currency) {
  switch (currency) {
    case "USD": return "$";
    case "EUR": return "€";
    case "GBP": return "£";
    default: return "₹";
  }
}
