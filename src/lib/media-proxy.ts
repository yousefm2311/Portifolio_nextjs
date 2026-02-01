export function toBase64Url(input: string) {
  const encoded = btoa(input);
  return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function shouldProxyMedia(url?: string | null) {
  if (!url) return false;
  return /aliyuncs\.com/i.test(url);
}

export function withMediaProxy(url?: string | null) {
  if (!url) return url ?? '';
  if (!shouldProxyMedia(url)) return url;
  const encoded = toBase64Url(url);
  return `/media-proxy/${encoded}`;
}
