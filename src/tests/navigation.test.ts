import { describe, it, expect } from 'vitest';
import { isRouteActive } from '../lib/utils/navigation';

describe('isRouteActive utility', () => {
  it('returns true when currentPath matches itemHref exactly', () => {
    expect(isRouteActive('/mahasiswa/dashboard', '/mahasiswa/dashboard')).toBe(true);
    expect(isRouteActive('/tendik/pengajuan', '/tendik/pengajuan')).toBe(true);
  });

  it('respects isExact flag and returns false for nested child routes', () => {
    expect(isRouteActive('/mahasiswa/dashboard/detail', '/mahasiswa/dashboard', true)).toBe(false);
  });

  it('properly handles /pengajuan special rule: active on detail id, but false on /pengajuan/new', () => {
    // /pengajuan/new must NOT activate /pengajuan
    expect(isRouteActive('/mahasiswa/pengajuan/new', '/mahasiswa/pengajuan')).toBe(false);

    // /pengajuan/:id MUST activate /mahasiswa/pengajuan
    expect(isRouteActive('/mahasiswa/pengajuan/42', '/mahasiswa/pengajuan')).toBe(true);
    expect(isRouteActive('/mahasiswa/pengajuan/abc-xyz', '/mahasiswa/pengajuan')).toBe(true);
  });

  it('matches general hierarchical subroutes separated by slash', () => {
    expect(isRouteActive('/wadek/matriks/edit', '/wadek/matriks')).toBe(true);
    expect(isRouteActive('/wadek/matriks-lain', '/wadek/matriks')).toBe(false);
  });
});
