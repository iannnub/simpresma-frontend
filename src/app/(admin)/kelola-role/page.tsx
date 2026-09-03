import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  UserPlus,
  History,
  X,
  AlertCircle,
  Loader2,
  Users,
  Shield,
  Clock,
  ArrowRight,
  Filter,
  Building2,
  Plus,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  useAdminUsers,
  useAssignRole,
  useRevokeRole,
  useAssignVerifikatorProdi,
  useRevokeVerifikatorProdi,
  useRoleHistory,
  useAvailableRoles,
} from '@/lib/hooks/useAdmin';
import { useProdi } from '@/lib/hooks/useRefData';
import type { UserRole } from '@/types';

// Palette badge role
const ROLE_BADGE_STYLES: Record<string, { label: string; badgeClass: string }> = {
  admin: {
    label: 'Super Admin',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
  },
  wadek: {
    label: 'Wakil Dekan',
    badgeClass: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800',
  },
  tendik: {
    label: 'Staff Tendik',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
  },
  verifikator: {
    label: 'Verifikator',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
  },
  dosen: {
    label: 'Dosen',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
  },
  mahasiswa: {
    label: 'Mahasiswa',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800',
  },
};

export default function AdminKelolaRolePage() {
  // Filters State
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedProdi, setSelectedProdi] = useState<string>('all');
  const [page, setPage] = useState(1);

  // Queries
  const { data: usersData, isLoading: isLoadingUsers } = useAdminUsers({
    search: search || undefined,
    role: selectedRole !== 'all' ? selectedRole : undefined,
    prodi_id: selectedProdi !== 'all' ? Number(selectedProdi) : undefined,
    page,
  });

  const { data: prodiList = [] } = useProdi();
  const { data: availableRoles = [] } = useAvailableRoles();

  // Mutations
  const assignRoleMutation = useAssignRole();
  const revokeRoleMutation = useRevokeRole();
  const assignScopeMutation = useAssignVerifikatorProdi();
  const revokeScopeMutation = useRevokeVerifikatorProdi();

  // Dialog State: Tambah Role
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [targetUserForAssign, setTargetUserForAssign] = useState<any>(null);
  const [roleToAssign, setRoleToAssign] = useState('');
  const [assignProdiId, setAssignProdiId] = useState('');
  const [assignNotes, setAssignNotes] = useState('');

  // Dialog State: Kelola Scope Prodi Verifikator
  const [isScopeOpen, setIsScopeOpen] = useState(false);
  const [targetUserForScope, setTargetUserForScope] = useState<any>(null);
  const [newScopeProdiId, setNewScopeProdiId] = useState('');
  const [scopeNotes, setScopeNotes] = useState('');

  // Dialog State: Revoke Role
  const [isRevokeOpen, setIsRevokeOpen] = useState(false);
  const [targetUserForRevoke, setTargetUserForRevoke] = useState<any>(null);
  const [roleToRevoke, setRoleToRevoke] = useState('');
  const [revokeNotes, setRevokeNotes] = useState('');

  // Dialog State: Audit Trail
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyUserId, setHistoryUserId] = useState<number | undefined>(undefined);
  const [historyUserName, setHistoryUserName] = useState<string>('');
  const { data: historyData, isLoading: isLoadingHistory } = useRoleHistory({
    user_id: historyUserId,
  });

  // Handlers
  const handleOpenAssign = (user: any) => {
    setTargetUserForAssign(user);
    setRoleToAssign('');
    setAssignProdiId('');
    setAssignNotes('');
    setIsAssignOpen(true);
  };

  const handleOpenRevoke = (user: any, role: string) => {
    setTargetUserForRevoke(user);
    setRoleToRevoke(role);
    setRevokeNotes('');
    setIsRevokeOpen(true);
  };

  const handleOpenScope = (user: any) => {
    setTargetUserForScope(user);
    setNewScopeProdiId('');
    setScopeNotes('');
    setIsScopeOpen(true);
  };

  const submitAddScope = async () => {
    if (!targetUserForScope || !newScopeProdiId) {
      toast.error('Pilih program studi terlebih dahulu');
      return;
    }

    try {
      await assignScopeMutation.mutateAsync({
        userId: targetUserForScope.id,
        prodiId: Number(newScopeProdiId),
        notes: scopeNotes.trim() || undefined,
      });

      const selectedProdiObj = prodiList.find((p: any) => p.id === Number(newScopeProdiId));
      toast.success('Lingkup Prodi Berhasil Ditambahkan', {
        description: `${targetUserForScope.nama} kini bertugas sebagai Verifikator ${selectedProdiObj?.singkatan || ''}`,
      });
      setNewScopeProdiId('');
      setScopeNotes('');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Gagal menambahkan lingkup prodi';
      toast.error('Gagal Tambah Scope', { description: msg });
    }
  };

  const submitRemoveScope = async (prodiId: number, prodiSingkatan?: string) => {
    if (!targetUserForScope) return;

    try {
      await revokeScopeMutation.mutateAsync({
        userId: targetUserForScope.id,
        prodiId,
      });

      toast.success('Lingkup Prodi Berhasil Dicabut', {
        description: `Lingkup ${prodiSingkatan || 'prodi'} dicabut dari ${targetUserForScope.nama}`,
      });
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Gagal mencabut lingkup prodi';
      toast.error('Gagal Cabut Scope', { description: msg });
    }
  };

  const handleOpenHistory = (user?: any) => {
    if (user) {
      setHistoryUserId(user.id);
      setHistoryUserName(user.nama);
    } else {
      setHistoryUserId(undefined);
      setHistoryUserName('Semua User');
    }
    setIsHistoryOpen(true);
  };

  const submitAssign = async () => {
    if (!targetUserForAssign || !roleToAssign) {
      toast.error('Pilih role terlebih dahulu');
      return;
    }

    if (roleToAssign === 'verifikator' && !assignProdiId) {
      toast.error('Pilih program studi verifikasi (SI, TI, atau IF)');
      return;
    }

    try {
      await assignRoleMutation.mutateAsync({
        userId: targetUserForAssign.id,
        payload: {
          role_name: roleToAssign,
          prodi_id: roleToAssign === 'verifikator' && assignProdiId ? Number(assignProdiId) : undefined,
          notes: assignNotes.trim() || undefined,
        },
      });

      toast.success('Role berhasil ditambahkan', {
        description: `Role ${roleToAssign} ditugaskan kepada ${targetUserForAssign.nama}`,
      });
      setIsAssignOpen(false);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Gagal menambahkan role';
      toast.error('Gagal Tambah Role', { description: msg });
    }
  };

  const submitRevoke = async () => {
    if (!targetUserForRevoke || !roleToRevoke) return;

    try {
      await revokeRoleMutation.mutateAsync({
        userId: targetUserForRevoke.id,
        roleName: roleToRevoke,
        payload: {
          notes: revokeNotes.trim() || undefined,
        },
      });

      toast.success('Role berhasil dicabut', {
        description: `Role ${roleToRevoke} dicabut dari ${targetUserForRevoke.nama}`,
      });
      setIsRevokeOpen(false);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Gagal mencabut role';
      toast.error('Gagal Cabut Role', { description: msg });
    }
  };

  const usersList = usersData?.items || [];
  const meta = usersData?.meta;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 inline-flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
            Role Management & Audit Trail System
          </span>
          <h1 className="text-2xl font-bold tracking-tight">Manajemen Multi-Role Pengguna</h1>
          <p className="text-sm text-slate-300 max-w-2xl">
            Kelola penugasan peran ganda (multi-role) secara fleksibel tanpa edit database manual.
            Setiap perubahan tersimpan otomatis di catatan riwayat (audit trail).
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <Button
            id="open-global-history-btn"
            variant="outline"
            onClick={() => handleOpenHistory(undefined)}
            className="gap-2 bg-white/10 hover:bg-white/20 border-white/20 text-white font-medium"
          >
            <History className="w-4 h-4 text-rose-300" />
            Riwayat Audit Trail
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card className="border border-slate-200 dark:border-slate-800 shadow-soft-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search */}
            <div className="sm:col-span-5 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="search-users-input"
                placeholder="Cari nama, email, atau NIM/NIP..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9 dark:bg-slate-900 dark:border-slate-700"
              />
            </div>

            {/* Filter Role */}
            <div className="sm:col-span-4">
              <Select
                value={selectedRole}
                onValueChange={(val) => {
                  setSelectedRole(val);
                  setPage(1);
                }}
              >
                <SelectTrigger id="filter-role-select" className="dark:bg-slate-900 dark:border-slate-700">
                  <SelectValue placeholder="Semua Role" />
                </SelectTrigger>
                <SelectContent className="dark:bg-slate-900 dark:border-slate-700">
                  <SelectItem value="all">Semua Role</SelectItem>
                  <SelectItem value="admin">Super Admin</SelectItem>
                  <SelectItem value="wadek">Wakil Dekan</SelectItem>
                  <SelectItem value="tendik">Staff Tendik</SelectItem>
                  <SelectItem value="verifikator">Verifikator</SelectItem>
                  <SelectItem value="dosen">Dosen</SelectItem>
                  <SelectItem value="mahasiswa">Mahasiswa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter Prodi */}
            <div className="sm:col-span-3">
              <Select
                value={selectedProdi}
                onValueChange={(val) => {
                  setSelectedProdi(val);
                  setPage(1);
                }}
              >
                <SelectTrigger id="filter-prodi-select" className="dark:bg-slate-900 dark:border-slate-700">
                  <SelectValue placeholder="Semua Prodi" />
                </SelectTrigger>
                <SelectContent className="dark:bg-slate-900 dark:border-slate-700">
                  <SelectItem value="all">Semua Program Studi</SelectItem>
                  {prodiList.map((p: any) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.singkatan} - {p.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabel Pengguna & Role */}
      <Card className="border border-slate-200 dark:border-slate-800 shadow-soft-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Daftar Pengguna ({meta?.total ?? usersList.length})
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Klik tombol <span className="font-semibold text-primary">+ Role</span> untuk menambah role, atau klik tanda <span className="font-semibold text-rose-500">×</span> pada badge untuk mencabut role.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/80 dark:bg-slate-900/80">
                <TableRow className="border-b border-slate-200 dark:border-slate-800">
                  <TableHead className="w-12 text-center text-xs font-semibold uppercase">No</TableHead>
                  <TableHead className="text-xs font-semibold uppercase">Pengguna</TableHead>
                  <TableHead className="text-xs font-semibold uppercase">NIM / NIP</TableHead>
                  <TableHead className="text-xs font-semibold uppercase">Program Studi</TableHead>
                  <TableHead className="text-xs font-semibold uppercase">Role Aktif (Multi-Role)</TableHead>
                  <TableHead className="text-right text-xs font-semibold uppercase pr-6">Aksi</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoadingUsers ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">Memuat data pengguna...</p>
                    </TableCell>
                  </TableRow>
                ) : usersList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <Users className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Tidak ada pengguna ditemukan</p>
                      <p className="text-xs text-muted-foreground">Coba ubah kata kunci atau filter pencarian Anda.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  usersList.map((user: any, idx: number) => {
                    const rowNumber = meta ? (meta.current_page - 1) * meta.per_page + (idx + 1) : idx + 1;
                    const userRoles: string[] = Array.isArray(user.role)
                      ? user.role
                      : user.roles?.map((r: any) => r.name) || ['mahasiswa'];

                    return (
                      <TableRow
                        key={user.id}
                        className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800/60 transition-colors"
                      >
                        <TableCell className="text-center text-xs font-mono text-muted-foreground">
                          {rowNumber}
                        </TableCell>

                        {/* Pengguna */}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center shrink-0">
                              {user.nama?.charAt(0) || 'U'}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-tight truncate">
                                {user.nama}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>

                        {/* NIM/NIP */}
                        <TableCell>
                          <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
                            {user.nim_nip || '-'}
                          </span>
                        </TableCell>

                        {/* Program Studi */}
                        <TableCell>
                          {user.prodi ? (
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                              {user.prodi.singkatan}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </TableCell>

                        {/* Multi-Role Badges */}
                        <TableCell>
                          <div className="flex flex-wrap gap-1.5 items-center">
                            {userRoles.map((roleName) => {
                              const style = ROLE_BADGE_STYLES[roleName] || {
                                label: roleName,
                                badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
                              };

                              const activeProdis = (user.verifikator_prodis || user.verifikatorProdis || [])
                                .map((vp: any) => vp.prodi?.singkatan || `Prodi ${vp.prodi_id}`);

                              return (
                                <Badge
                                  key={roleName}
                                  variant="outline"
                                  className={`text-xs pl-2 pr-1 py-0.5 border font-medium inline-flex items-center gap-1 ${style.badgeClass}`}
                                >
                                  <span>{style.label}</span>
                                  {roleName === 'verifikator' && (
                                    <button
                                      type="button"
                                      onClick={() => handleOpenScope(user)}
                                      title="Klik untuk atur lingkup Prodi Verifikator"
                                      className="font-bold text-[10px] px-1 rounded bg-purple-200/80 dark:bg-purple-900/80 text-purple-900 dark:text-purple-200 hover:bg-purple-300 transition-colors inline-flex items-center gap-0.5"
                                    >
                                      <Building2 className="w-2.5 h-2.5" />
                                      {activeProdis.length > 0 ? activeProdis.join(', ') : 'Pilih Prodi'}
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleOpenRevoke(user, roleName)}
                                    title={`Cabut role ${style.label}`}
                                    className="hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors ml-0.5"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </Badge>
                              );
                            })}
                          </div>
                        </TableCell>

                        {/* Aksi */}
                        <TableCell className="text-right pr-6">
                          <div className="inline-flex items-center gap-1.5">
                            {userRoles.includes('verifikator') && (
                              <Button
                                id={`scope-prodi-btn-${user.id}`}
                                size="sm"
                                variant="outline"
                                onClick={() => handleOpenScope(user)}
                                title="Atur Lingkup Program Studi Verifikasi (SI/TI/IF)"
                                className="h-7 text-xs gap-1 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/30"
                              >
                                <Building2 className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                                Atur Prodi ({user.verifikator_prodis?.length || 0})
                              </Button>
                            )}

                            <Button
                              id={`add-role-btn-${user.id}`}
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenAssign(user)}
                              className="h-7 text-xs gap-1 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <UserPlus className="w-3 h-3 text-primary" />
                              Tambah Role
                            </Button>

                            <Button
                              id={`history-role-btn-${user.id}`}
                              size="sm"
                              variant="ghost"
                              onClick={() => handleOpenHistory(user)}
                              title="Lihat Riwayat Audit Trail"
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-slate-900 dark:hover:text-slate-100"
                            >
                              <History className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Footer */}
          {meta && meta.last_page > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <span className="text-xs text-muted-foreground">
                Halaman {meta.current_page} dari {meta.last_page} ({meta.total} pengguna)
              </span>
              <div className="flex gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="h-8 text-xs"
                >
                  Sebelumnya
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page >= meta.last_page}
                  onClick={() => setPage((p) => p + 1)}
                  className="h-8 text-xs"
                >
                  Selanjutnya
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ─── Dialog: Tambah Role ─────────────────────────────────── */}
      <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
        <DialogContent className="sm:max-w-md dark:bg-slate-900 dark:border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <UserPlus className="w-5 h-5 text-primary" />
              Tambah Role Pengguna
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Tetapkan peran baru untuk <strong>{targetUserForAssign?.nama}</strong> ({targetUserForAssign?.email}).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="assign-role-select" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Pilih Role yang Ditugaskan
              </Label>
              <Select value={roleToAssign} onValueChange={setRoleToAssign}>
                <SelectTrigger id="assign-role-select" className="dark:bg-slate-800 dark:border-slate-700">
                  <SelectValue placeholder="-- Pilih Role --" />
                </SelectTrigger>
                <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                  {availableRoles
                    .filter((r: any) => {
                      const userRoles: string[] = Array.isArray(targetUserForAssign?.role)
                        ? targetUserForAssign.role
                        : targetUserForAssign?.roles?.map((x: any) => x.name) || [];
                      return !userRoles.includes(r.name);
                    })
                    .map((r: any) => (
                      <SelectItem key={r.id} value={r.name}>
                        {r.display_name} ({r.name})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {roleToAssign === 'verifikator' && (
              <div className="space-y-1.5 p-3 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50">
                <Label htmlFor="assign-prodi-select" className="text-xs font-semibold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-purple-600" />
                  Program Studi Verifikasi (Wajib untuk Verifikator)
                </Label>
                <Select value={assignProdiId} onValueChange={setAssignProdiId}>
                  <SelectTrigger id="assign-prodi-select" className="bg-white dark:bg-slate-800 dark:border-slate-700 text-xs">
                    <SelectValue placeholder="-- Pilih Program Studi (SI, TI, IF) --" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                    {prodiList.map((p: any) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.singkatan} — {p.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground">
                  Verifikator hanya dapat memvalidasi pengajuan dari mahasiswa pada Program Studi yang dipilih.
                </p>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="assign-notes-input" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Catatan / Alasan Penugasan (Audit Trail)
              </Label>
              <Textarea
                id="assign-notes-input"
                placeholder="Contoh: SK Dekan No. 45/UN25/2026 tentang penugasan Dosen Verifikator prodi SI"
                value={assignNotes}
                onChange={(e) => setAssignNotes(e.target.value)}
                className="text-xs resize-none h-20 dark:bg-slate-800 dark:border-slate-700"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAssignOpen(false)}
              disabled={assignRoleMutation.isPending}
            >
              Batal
            </Button>
            <Button
              id="submit-assign-role-btn"
              size="sm"
              onClick={submitAssign}
              disabled={assignRoleMutation.isPending || !roleToAssign}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {assignRoleMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Tetapkan Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Dialog: Konfirmasi Cabut Role ──────────────────────── */}
      <Dialog open={isRevokeOpen} onOpenChange={setIsRevokeOpen}>
        <DialogContent className="sm:max-w-md dark:bg-slate-900 dark:border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-5 h-5" />
              Cabut Role Pengguna
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Apakah Anda yakin ingin mencabut role{' '}
              <strong className="capitalize text-slate-900 dark:text-slate-100">
                {ROLE_BADGE_STYLES[roleToRevoke]?.label || roleToRevoke}
              </strong>{' '}
              dari <strong>{targetUserForRevoke?.nama}</strong>?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                User harus memiliki <strong>minimal 1 role aktif</strong>. Role admin terakhir di sistem tidak dapat dicabut.
              </span>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="revoke-notes-input" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Alasan Pencabutan Role (Audit Trail)
              </Label>
              <Textarea
                id="revoke-notes-input"
                placeholder="Contoh: Masa jabatan Wadek telah selesai periode 2025/2026"
                value={revokeNotes}
                onChange={(e) => setRevokeNotes(e.target.value)}
                className="text-xs resize-none h-16 dark:bg-slate-800 dark:border-slate-700"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRevokeOpen(false)}
              disabled={revokeRoleMutation.isPending}
            >
              Batal
            </Button>
            <Button
              id="confirm-revoke-role-btn"
              variant="destructive"
              size="sm"
              onClick={submitRevoke}
              disabled={revokeRoleMutation.isPending}
              className="gap-2"
            >
              {revokeRoleMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Ya, Cabut Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Dialog: Audit Trail Riwayat Role ───────────────────── */}
      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col dark:bg-slate-900 dark:border-slate-700">
          <DialogHeader className="shrink-0">
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <History className="w-5 h-5 text-primary" />
              Audit Trail Perubahan Role
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Catatan riwayat penugasan dan pencabutan role ({historyUserName}).
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-2 pr-1 space-y-3">
            {isLoadingHistory ? (
              <div className="py-12 text-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Memuat audit trail...</p>
              </div>
            ) : !historyData?.items || historyData.items.length === 0 ? (
              <div className="py-12 text-center">
                <History className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Belum ada riwayat audit trail</p>
                <p className="text-xs text-muted-foreground">Perubahan role yang dilakukan admin akan tercatat di sini.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {historyData.items.map((log: any) => {
                  const isAssign = log.action === 'assign';
                  const roleStyle = ROLE_BADGE_STYLES[log.role_name] || {
                    label: log.role_name,
                    badgeClass: 'bg-slate-100 text-slate-700',
                  };

                  return (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-soft-sm space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-bold uppercase tracking-wider ${
                              isAssign
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                                : 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
                            }`}
                          >
                            {isAssign ? 'Penugasan' : 'Pencabutan'}
                          </Badge>

                          <Badge variant="outline" className={`text-xs ${roleStyle.badgeClass}`}>
                            {roleStyle.label}
                          </Badge>

                          <span className="text-xs text-muted-foreground">untuk</span>
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {log.user?.nama || `User #${log.user_id}`}
                          </span>
                        </div>

                        <span className="text-[11px] text-muted-foreground font-mono">
                          {new Date(log.created_at).toLocaleString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      {log.notes && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-md italic">
                          "{log.notes}"
                        </p>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-slate-100 dark:border-slate-800">
                        <span>
                          Dilakukan oleh:{' '}
                          <strong className="text-slate-700 dark:text-slate-300">
                            {log.changed_by_user?.nama || log.changed_by?.nama || 'Admin Sistem'}
                          </strong>
                        </span>
                        {log.user?.nim_nip && (
                          <span className="font-mono text-[10px]">NIM/NIP: {log.user.nim_nip}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <DialogFooter className="shrink-0 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button size="sm" variant="outline" onClick={() => setIsHistoryOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Dialog: Atur Scope Prodi Verifikator ───────────────── */}
      <Dialog open={isScopeOpen} onOpenChange={setIsScopeOpen}>
        <DialogContent className="sm:max-w-md dark:bg-slate-900 dark:border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-purple-700 dark:text-purple-300">
              <Building2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Atur Program Studi Verifikator
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Kelola lingkup program studi (SI, TI, IF) yang dapat diverifikasi oleh{' '}
              <strong>{targetUserForScope?.nama}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Scope Aktif Saat Ini */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Lingkup Prodi Aktif:
              </Label>
              {(() => {
                const currentUser = usersList.find((u: any) => u.id === targetUserForScope?.id) || targetUserForScope;
                const activeScopes = currentUser?.verifikator_prodis || currentUser?.verifikatorProdis || [];

                if (activeScopes.length === 0) {
                  return (
                    <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-800 dark:text-amber-300">
                      User ini belum ditugaskan ke program studi manapun. Pilih program studi di bawah.
                    </div>
                  );
                }

                return (
                  <div className="space-y-1.5">
                    {activeScopes.map((scope: any) => {
                      const prodiName = scope.prodi?.nama || `Prodi #${scope.prodi_id}`;
                      const prodiSingkatan = scope.prodi?.singkatan || `P${scope.prodi_id}`;

                      return (
                        <div
                          key={scope.id || scope.prodi_id}
                          className="flex items-center justify-between p-2.5 rounded-lg border border-purple-200 dark:border-purple-800/60 bg-purple-50/50 dark:bg-purple-950/20"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-md bg-purple-200 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200 font-bold text-xs flex items-center justify-center">
                              {prodiSingkatan}
                            </span>
                            <div>
                              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                                {prodiName}
                              </p>
                              <span className="text-[10px] text-muted-foreground">Status: Aktif Memvalidasi</span>
                            </div>
                          </div>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => submitRemoveScope(scope.prodi_id, prodiSingkatan)}
                            disabled={revokeScopeMutation.isPending}
                            title={`Cabut hak verifikasi prodi ${prodiSingkatan}`}
                            className="h-7 px-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs gap-1"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Cabut</span>
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Tambah Scope Baru */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-primary" />
                Tambah Lingkup Prodi Baru:
              </p>

              <div className="space-y-1.5">
                <Select value={newScopeProdiId} onValueChange={setNewScopeProdiId}>
                  <SelectTrigger id="new-scope-prodi-select" className="bg-white dark:bg-slate-800 dark:border-slate-700 text-xs">
                    <SelectValue placeholder="-- Pilih Prodi (SI / TI / IF) --" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                    {(() => {
                      const currentUser = usersList.find((u: any) => u.id === targetUserForScope?.id) || targetUserForScope;
                      const activeProdiIds = (currentUser?.verifikator_prodis || currentUser?.verifikatorProdis || [])
                        .map((x: any) => x.prodi_id);

                      return prodiList
                        .filter((p: any) => !activeProdiIds.includes(p.id))
                        .map((p: any) => (
                          <SelectItem key={p.id} value={String(p.id)}>
                            {p.singkatan} — {p.nama}
                          </SelectItem>
                        ));
                    })()}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Input
                  id="scope-notes-input"
                  placeholder="Keterangan SK penugasan (opsional)..."
                  value={scopeNotes}
                  onChange={(e) => setScopeNotes(e.target.value)}
                  className="text-xs h-8 bg-white dark:bg-slate-800 dark:border-slate-700"
                />
              </div>

              <Button
                id="submit-add-scope-btn"
                size="sm"
                onClick={submitAddScope}
                disabled={assignScopeMutation.isPending || !newScopeProdiId}
                className="w-full gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs h-8"
              >
                {assignScopeMutation.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )}
                Tugaskan ke Prodi Terpilih
              </Button>
            </div>
          </div>

          <DialogFooter className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button size="sm" variant="outline" onClick={() => setIsScopeOpen(false)}>
              Selesai
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
