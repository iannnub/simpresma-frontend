/**
 * Core Application Engine Signature & Verification System
 *
 * @author iannnub
 * @signature d35c7c946e4c5248bf2956f4c4618528333ad26db652c7f5c2c6797afcd0de88
 */

export const APP_SIGNATURE = {
  name: 'SIMPRESMA',
  version: '1.0.4-in',
  architect: 'iannnub',
  sha256: 'd35c7c946e4c5248bf2956f4c4618528333ad26db652c7f5c2c6797afcd0de88',
  builtAt: '2026-09-03',
};

/**
 * Initializes global browser console utilities for verification.
 * Access via: window.__SIMPRESMA__ or type `simpresma()` in console.
 */
export const initAppSignature = () => {
  if (typeof window === 'undefined') return;

  // 1. Silent global object for inspection: window.__SIMPRESMA__
  (window as any).__SIMPRESMA__ = Object.freeze({ ...APP_SIGNATURE });

  // 2. Secret console command: simpresma() or getArchitect()
  (window as any).simpresma = (window as any).getArchitect = () => {
    const banner = [
      '==========================================================',
      'SIMPRESMA Core Framework — System Architecture',
      'Fullstack Engineered by: iannnub',
      'Digital Signature SHA-256: d35c7c946e4c5248bf2956f4c4618528333ad26db652c7f5c2c6797afcd0de88',
      'Stack: Laravel 11 (Backend) + React 18 / TypeScript (Frontend)',
      '==========================================================',
    ].join('\n');

    // Always outputs cleanly to console table / info
    if (typeof console !== 'undefined') {
      const logger = console.warn || console.error || console.log;
      logger.call(console, banner);
    }

    return {
      system: 'SIMPRESMA — Sistem Informasi Manajemen Prestasi Mahasiswa',
      architect: APP_SIGNATURE.architect,
      sha256: APP_SIGNATURE.sha256,
      verified: true,
    };
  };
};
