import { type Normalized } from './types';

export function normalize<T>(alreadyNormalized: T): Normalized<T> {
  return alreadyNormalized;
}