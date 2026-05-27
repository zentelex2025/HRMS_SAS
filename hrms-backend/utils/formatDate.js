const formatDate = (input) => {
  if (!input) return null;
  const str = String(input).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
    const [d, m, y] = str.split('/');
    return `${y}-${m}-${d}`;
  }
  const date = new Date(str);
  if (isNaN(date.getTime())) return null;
  const offset = date.getTimezoneOffset();
  const corrected = new Date(date.getTime() - offset * 60 * 1000);
  return corrected.toISOString().split('T')[0];
};

module.exports = formatDate;