import { describe, it, expect } from 'vitest';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

describe('Date & Formatting Utilities', () => {
  it('formats dates accurately in Indonesian locale', () => {
    const testDate = new Date('2026-10-21T10:00:00Z');
    const formatted = format(testDate, 'dd MMMM yyyy', { locale: localeId });
    expect(formatted).toContain('2026');
    expect(formatted.toLowerCase()).toContain('oktober');
  });

  it('safely handles date string conversion', () => {
    const safeFormatDate = (dateStr?: string | null) => {
      if (!dateStr) return '-';
      try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return '-';
        return format(d, 'dd MMM yyyy', { locale: localeId });
      } catch {
        return '-';
      }
    };

    expect(safeFormatDate(null)).toBe('-');
    expect(safeFormatDate('')).toBe('-');
    expect(safeFormatDate('invalid-date')).toBe('-');
    expect(safeFormatDate('2026-05-17')).toContain('2026');
  });
});
