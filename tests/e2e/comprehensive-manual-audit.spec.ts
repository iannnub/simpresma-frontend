import { test, expect } from '@playwright/test';

const SCREENSHOT_DIR = '../docs/audit-screenshots';

test.describe.serial('Audit Menyeluruh & Testing Manual Lintas Semua Role SIMPRESMA', () => {
  test.setTimeout(60000);

  test('1. Role Mahasiswa: Login, Cek Dashboard & Pengisian Formulir Pengajuan Lengkap', async ({ page }) => {
    // A. Login Mahasiswa
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/01-login-page.png`, fullPage: true });

    await page.fill('#email', 'mhs.si@test.com');
    await page.fill('#password', 'password');
    await page.click('button[type="submit"]');

    // B. Dashboard Mahasiswa
    await page.waitForURL('**/mahasiswa/dashboard', { timeout: 15000 });
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Mahasiswa').first()).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/02-mahasiswa-dashboard.png`, fullPage: true });

    // C. Buka Formulir Pengajuan Baru
    await page.goto('/mahasiswa/pengajuan/new');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('#nama_lomba')).toBeVisible();

    // D. Pengisian Langkah 1: Informasi Perlombaan
    const dummyTimestamp = Date.now().toString().slice(-4);
    const namaLombaDummy = `GEMASTIK XVI 2026 - Bidang Pemrograman Web #${dummyTimestamp}`;
    await page.fill('#nama_lomba', namaLombaDummy);
    await page.fill('#nama_tim', 'Tim UNEJ Cyber Inovasi');
    await page.fill('#no_whatsapp', '081234567890');
    await page.fill('#detail_juara', 'Juara 1 Medali Emas');

    // Pilih Bidang Lomba (Click trigger lalu pilih option)
    await page.click('#bidang_id');
    await page.waitForTimeout(300);
    const bidangOption = page.locator('[role="option"]').first();
    await bidangOption.click();

    // Pilih Semester
    await page.click('#semester');
    await page.waitForTimeout(300);
    const semOption = page.locator('[role="option"]:has-text("Semester 5"), [role="option"]').first();
    await semOption.click();

    // Pilih Tingkatan Lomba
    await page.click('#tingkatan_id');
    await page.waitForTimeout(300);
    const tingkatanOption = page.locator('[role="option"]').first();
    await tingkatanOption.click();

    // Pilih Tahapan Juara
    await page.click('#tahapan_id');
    await page.waitForTimeout(300);
    const tahapanOption = page.locator('[role="option"]').first();
    await tahapanOption.click();

    await page.screenshot({ path: `${SCREENSHOT_DIR}/03-mahasiswa-form-step1.png`, fullPage: true });

    // Klik Lanjut ke Langkah 2
    const btnNext1 = page.locator('button:has-text("Lanjut ke Dokumen"), button:has-text("Lanjut")').first();
    await btnNext1.click();

    // E. Pengisian Langkah 2: Dokumen & Tautan Bukti Prestasi
    await page.waitForSelector('#link_sertifikat', { timeout: 10000 });
    await page.fill('#link_sertifikat', 'https://drive.google.com/file/d/sertifikat-gemastik-2026/view');
    await page.fill('#link_surat_tugas_mahasiswa', 'https://drive.google.com/file/d/sk-tugas-mahasiswa-2026/view');
    await page.fill('#link_surat_tugas_dosen', 'https://drive.google.com/file/d/sk-tugas-dosen-2026/view');
    await page.fill('#link_poster', 'https://instagram.com/p/poster-lomba-gemastik');
    await page.fill('#link_sosmed', 'https://instagram.com/p/publikasi-prestasi-unej');
    await page.fill('#keterangan', 'Dokumen dan bukti fisik telah diverifikasi oleh dosen pembimbing.');

    await page.screenshot({ path: `${SCREENSHOT_DIR}/04-mahasiswa-form-step2.png`, fullPage: true });

    // Klik Lanjut ke Langkah 3
    const btnNext2 = page.locator('button:has-text("Lanjut ke Pemilihan"), button:has-text("Lanjut")').first();
    await btnNext2.click();

    // F. Langkah 3: Pemilihan Mata Kuliah Konversi
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/05-mahasiswa-form-step3.png`, fullPage: true });

    // Pilih mata kuliah jika tersedia
    const mkCheckbox = page.locator('button[role="checkbox"], input[type="checkbox"]').first();
    if (await mkCheckbox.isVisible()) {
      await mkCheckbox.click();
    }

    // Klik Lanjut ke Langkah 4 (Pratinjau)
    const btnNext3 = page.locator('button:has-text("Lanjut ke Pratinjau"), button:has-text("Lanjut")').first();
    await btnNext3.click();

    // G. Langkah 4: Pratinjau & Submit Pengajuan
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/06-mahasiswa-form-step4-preview.png`, fullPage: true });

    const btnSubmit = page.locator('button:has-text("Ajukan Prestasi Sekarang")').first();
    await btnSubmit.click();

    // Dialog Konfirmasi Submit
    await page.waitForTimeout(500);
    const btnConfirmSubmit = page.locator('button:has-text("Ya, Kirim Sekarang")');
    if (await btnConfirmSubmit.isVisible()) {
      await btnConfirmSubmit.click();
    }

    // Tunggu redirect ke daftar pengajuan atau detail
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/07-mahasiswa-pengajuan-berhasil.png`, fullPage: true });

    // Buka Riwayat Pengajuan Mahasiswa
    await page.goto('/mahasiswa/pengajuan');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/08-mahasiswa-daftar-pengajuan.png`, fullPage: true });

    // Buka Direktori Verifikator (Shared page)
    await page.goto('/direktori-verifikator');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/09-mahasiswa-direktori-verifikator.png`, fullPage: true });
  });

  test('2. Role Verifikator: Login, Cek Antrean & Verifikasi Pengajuan', async ({ page }) => {
    // A. Login Verifikator SI
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.fill('#email', 'verif.si@test.com');
    await page.fill('#password', 'password');
    await page.click('button[type="submit"]');

    // B. Dashboard Verifikator
    await page.waitForURL('**/verifikator/dashboard', { timeout: 15000 });
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/10-verifikator-dashboard.png`, fullPage: true });

    // C. Buka Daftar Antrean Pengajuan
    await page.goto('/verifikator/pengajuan');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/11-verifikator-antrean-pengajuan.png`, fullPage: true });

    // D. Buka Detail Pengajuan Pertama
    const firstRowLink = page.locator('tbody tr a, tbody tr button').first();
    if (await firstRowLink.isVisible()) {
      await firstRowLink.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/12-verifikator-detail-pengajuan.png`, fullPage: true });

      // Cek apakah tombol persetujuan aktif
      const btnApprove = page.locator('button:has-text("Setujui"), button:has-text("Terima")').first();
      if (await btnApprove.isVisible()) {
        await btnApprove.click();
        await page.waitForTimeout(500);
        await page.screenshot({ path: `${SCREENSHOT_DIR}/13-verifikator-modal-konfirmasi.png` });

        // Isi catatan verifikasi dan konfirmasi
        const feedbackInput = page.locator('textarea').first();
        if (await feedbackInput.isVisible()) {
          await feedbackInput.fill('Berkas sertifikat, SK tugas, dan bukti publikasi sah dan valid.');
        }
        const confirmBtn = page.locator('button:has-text("Konfirmasi Setujui"), button:has-text("Setujui")').last();
        await confirmBtn.click();
        await page.waitForTimeout(2000);
        await page.screenshot({ path: `${SCREENSHOT_DIR}/14-verifikator-status-disetujui.png`, fullPage: true });
      }
    }
  });

  test('3. Role Tendik: Login, Cek Pengajuan Diterima & Finalisasi SK', async ({ page }) => {
    // A. Login Staff Tendik
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.fill('#email', 'tendik@test.com');
    await page.fill('#password', 'password');
    await page.click('button[type="submit"]');

    // B. Dashboard Tendik
    await page.waitForURL('**/tendik/dashboard', { timeout: 15000 });
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/15-tendik-dashboard.png`, fullPage: true });

    // C. Buka Daftar Pengajuan Siap Finalisasi
    await page.goto('/tendik/pengajuan');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/16-tendik-daftar-pengajuan.png`, fullPage: true });

    // D. Buka Detail Pengajuan Diterima
    const detailLink = page.locator('tbody tr a, tbody tr button').first();
    if (await detailLink.isVisible()) {
      await detailLink.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/17-tendik-detail-pengajuan.png`, fullPage: true });

      // Cek formulir finalisasi SK
      const skInput = page.locator('#link_sk_konversi');
      if (await skInput.isVisible()) {
        await skInput.fill('https://sister.unej.ac.id/sk-konversi/2026/sk-8921.pdf');
        const noSkInput = page.locator('#nomor_sk_konversi');
        if (await noSkInput.isVisible()) {
          await noSkInput.fill('SK/UN25.1.15/KM/2026');
        }
        await page.screenshot({ path: `${SCREENSHOT_DIR}/18-tendik-form-finalisasi.png`, fullPage: true });

        const btnFinalize = page.locator('button:has-text("Simpan & Terbitkan"), button:has-text("Finalisasi")').first();
        if (await btnFinalize.isVisible()) {
          await btnFinalize.click();
          await page.waitForTimeout(2000);
          await page.screenshot({ path: `${SCREENSHOT_DIR}/19-tendik-selesai-finalisasi.png`, fullPage: true });
        }
      }
    }
  });

  test('4. Role Wakil Dekan I (Wadek): Login, Dashboard Statistik & Manajemen Matriks/Verifikator', async ({ page }) => {
    // A. Login Wadek
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.fill('#email', 'wadek@test.com');
    await page.fill('#password', 'password');
    await page.click('button[type="submit"]');

    // B. Dashboard Wadek (Statistik & Visual Charts)
    await page.waitForURL('**/wadek/dashboard', { timeout: 15000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/20-wadek-dashboard.png`, fullPage: true });

    // C. Halaman Kelola Matriks Konversi SKS
    await page.goto('/wadek/matriks');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await expect(page.locator('text=Matriks Konversi').first()).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/21-wadek-matriks-konversi.png`, fullPage: true });

    // D. Halaman Kelola Tim Verifikator
    await page.goto('/wadek/verifikator');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await expect(page.locator('text=Verifikator').first()).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/22-wadek-tim-verifikator.png`, fullPage: true });

    // E. Halaman Pemetaan Bidang Mata Kuliah
    await page.goto('/wadek/bidang-mk');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await expect(page.locator('text=Bidang').first()).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/23-wadek-pemetaan-bidang-mk.png`, fullPage: true });
  });

  test('5. Role Super Administrator: Login & Kelola Role Pengguna', async ({ page }) => {
    // A. Login Admin
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.fill('#email', 'admin@simpresma.unej.ac.id');
    await page.fill('#password', 'admin123');
    await page.click('button[type="submit"]');

    // B. Halaman Kelola Role Pengguna
    await page.waitForURL('**/admin/kelola-role', { timeout: 15000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await expect(page.locator('text=Kelola Role').first()).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/24-admin-kelola-role.png`, fullPage: true });

    // C. Modal Edit Role Pengguna
    const editRoleBtn = page.locator('tbody tr button:has-text("Edit"), tbody tr button:has-text("Ubah")').first();
    if (await editRoleBtn.isVisible()) {
      await editRoleBtn.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/25-admin-modal-edit-role.png` });
      // Tutup dialog
      await page.keyboard.press('Escape');
    }
  });

});
