import { describe, it, expect } from 'vitest';
import { cn } from '../lib/utils/cn';

describe('cn utility (clsx + twMerge)', () => {
  it('correctly merges class strings and removes conflicts', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2');
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
  });

  it('handles conditional class expressions correctly', () => {
    const isActive = true;
    const isPending = false;
    expect(cn('font-bold', isActive && 'text-emerald-600', isPending && 'text-amber-600')).toBe(
      'font-bold text-emerald-600'
    );
  });

  it('handles falsy values, undefined, and null gracefully', () => {
    expect(cn('base-class', null, undefined, false, '')).toBe('base-class');
  });
});
