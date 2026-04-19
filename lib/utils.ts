import { clsx } from 'clsx';

export function cn(...values: Array<string | false | null | undefined>) {
  return clsx(values);
}

export function apiUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) {
    return path;
  }

  return `${base.replace(/\/$/, '')}${path}`;
}
