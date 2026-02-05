import sanitizeHtml from 'sanitize-html';

type UnknownRecord = Record<string, unknown>;

const stripAll = (value: string) =>
  sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {}
  }).trim();

export function sanitizeString(value: string) {
  return stripAll(value);
}

export function sanitizeMarkdown(value: string) {
  return stripAll(value);
}

export function sanitizeObject<T extends UnknownRecord>(obj: T): T {
  const cleaned: UnknownRecord = Array.isArray(obj) ? ({} as UnknownRecord) : {};
  Object.entries(obj).forEach(([key, val]) => {
    if (typeof val === 'string') {
      cleaned[key] = stripAll(val);
    } else if (Array.isArray(val)) {
      cleaned[key] = val.map((item) =>
        typeof item === 'string'
          ? stripAll(item)
          : item && typeof item === 'object'
            ? sanitizeObject(item as UnknownRecord)
            : item
      );
    } else if (val && typeof val === 'object') {
      cleaned[key] = sanitizeObject(val as UnknownRecord);
    } else {
      cleaned[key] = val;
    }
  });
  return cleaned as T;
}
