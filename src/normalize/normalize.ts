import { type Normalized } from './types';

function upcaseFirst(s: string): string {
  return `${s[0].toUpperCase()}${s.slice(1)}`;
}

function normalizeString(key: string): string {
  return key.split("_")
    .map((part, index) => index === 0 ? part : upcaseFirst(part))
    .join('');
}

export function normalize<T extends object>(toBeNormalized: T): Normalized<T>
export function normalize(toBeNormalized: object): object {
  const normalized = Object.entries(toBeNormalized)
    .reduce((acc, [key, value]) => {
      return Object.assign(acc, {[normalizeString(key)]: value});
    }, {} as object);

  return normalized;
}