const digitsOnly = (value: string): string => value.replace(/\D/g, "");

export const normalizePhone = (value: string): string => {
  const digits = digitsOnly(value);
  if (digits.startsWith("998") && digits.length === 12) {
    return `+${digits}`;
  }
  if (digits.length === 9) {
    return `+998${digits}`;
  }
  if (value.trim().startsWith("+") && digits.length === 12) {
    return `+${digits}`;
  }
  return `+${digits}`;
};

export const isUzbekPhone = (value: string): boolean =>
  /^\+998\d{9}$/.test(normalizePhone(value));

export const formatPhoneDisplay = (value: string): string => {
  const normalized = normalizePhone(value);
  const match = normalized.match(/^\+998(\d{2})(\d{3})(\d{2})(\d{2})$/);
  if (!match) {
    return value;
  }
  return `+998 ${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
};
