const ENTITY_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;'
};

const ENTITY_REGEX = /[&<>"'/]/g;

export function sanitizeHtml(input: string): string {
  return input.replace(ENTITY_REGEX, (char) => ENTITY_MAP[char] || char);
}

export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = { ...obj };
  for (const key of Object.keys(sanitized)) {
    const value = sanitized[key];
    if (typeof value === 'string') {
      (sanitized as Record<string, unknown>)[key] = sanitizeHtml(value);
    }
  }
  return sanitized;
}
