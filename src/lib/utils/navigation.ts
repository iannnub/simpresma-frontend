/**
 * Utility untuk menentukan apakah suatu menu navigasi aktif (active state).
 * Menjamin status aktif yang strictly exclusive agar tidak terjadi bentrok antar rute
 * (misal: /pengajuan/new tidak boleh mengaktifkan /pengajuan).
 */
export function isRouteActive(currentPath: string, itemHref: string, isExact?: boolean): boolean {
  // 1. Jika rute sama persis
  if (currentPath === itemHref) {
    return true;
  }

  // 2. Jika konfigurasi menu mewajibkan exact match
  if (isExact) {
    return false;
  }

  // 3. Penanganan khusus untuk rute pengajuan:
  // Menu 'Pengajuan Saya' (/mahasiswa/pengajuan) hanya aktif jika:
  // - URL sama persis (/mahasiswa/pengajuan), ATAU
  // - Halaman detail (/mahasiswa/pengajuan/:id)
  // DAN TIDAK BOLEH aktif jika URL adalah halaman tambah baru (/mahasiswa/pengajuan/new)
  if (itemHref.endsWith('/pengajuan')) {
    if (currentPath.endsWith('/pengajuan/new')) {
      return false;
    }
    return currentPath.startsWith(itemHref + '/');
  }

  // 4. Untuk menu berjenjang lainnya, pastikan mencocokkan prefix dengan boundary '/'
  return currentPath.startsWith(itemHref + '/');
}
