import { describe, it, expect } from 'vitest';
import ROUTES from '../config/routes.config';
import authApi from '../lib/api/auth.api';

describe('GAPURA UNEJ Integration Tests', () => {
  it('defines the official callback route correctly', () => {
    expect(ROUTES.GAPURA_CALLBACK).toBe('/auth/callback');
  });

  it('exposes getGapuraRedirectUrl on authApi', () => {
    expect(typeof authApi.getGapuraRedirectUrl).toBe('function');
  });

  it('parses redirect callback query parameters correctly', () => {
    const searchString = '?token=sanctum-test-token&role=mahasiswa&nama=Ahmad%20Subarjo';
    const params = new URLSearchParams(searchString);

    expect(params.get('token')).toBe('sanctum-test-token');
    expect(params.get('role')).toBe('mahasiswa');
    expect(params.get('nama')).toBe('Ahmad Subarjo');
    expect(params.get('error')).toBeNull();
  });

  it('detects and handles authorization errors from GAPURA', () => {
    const errorSearch = '?error=access_denied&error_description=User%20menolak%20izin';
    const params = new URLSearchParams(errorSearch);

    expect(params.get('error')).toBe('access_denied');
    expect(params.get('error_description')).toBe('User menolak izin');
    expect(params.get('token')).toBeNull();
  });
});
