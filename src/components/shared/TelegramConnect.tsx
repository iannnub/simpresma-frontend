import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  MessageCircle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Loader2,
  Copy,
  Unplug,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

interface TelegramConnectProps {
  /** Called after successfully connect/disconnect to update parent state */
  onStatusChange?: (connected: boolean) => void;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api';
const BOT_USERNAME = import.meta.env.VITE_TELEGRAM_BOT_USERNAME ?? 'simpresma_unej_bot';

export const TelegramConnect: React.FC<TelegramConnectProps> = ({ onStatusChange }) => {
  const { user, token, updateUser } = useAuthStore();

  const isConnected = (user as any)?.telegram_connected ?? false;
  const connectedAt = (user as any)?.telegram_connected_at;

  const [chatId, setChatId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const handleConnect = async () => {
    if (!chatId.trim()) {
      toast.error('Chat ID wajib diisi');
      return;
    }
    if (!/^\d+$/.test(chatId.trim())) {
      toast.error('Chat ID harus berupa angka');
      return;
    }

    setIsConnecting(true);
    try {
      const res = await fetch(`${API_BASE}/auth/connect-telegram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ telegram_chat_id: chatId.trim() }),
      });

      const json = await res.json();

      if (!res.ok) {
        const errMsg =
          json?.errors?.telegram_chat_id?.[0] ?? json?.message ?? 'Gagal menghubungkan';
        throw new Error(errMsg);
      }

      // Update local user state
      updateUser({ ...user, ...json.data } as any);
      setChatId('');
      toast.success('Telegram berhasil dihubungkan!', {
        description: 'Cek Telegram kamu untuk pesan konfirmasi dari bot.',
      });
      onStatusChange?.(true);
    } catch (err: unknown) {
      toast.error('Gagal', {
        description: err instanceof Error ? err.message : 'Terjadi kesalahan',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      const res = await fetch(`${API_BASE}/auth/disconnect-telegram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json?.message ?? 'Gagal memutus koneksi');

      updateUser({ ...user, ...json.data } as any);
      toast.success('Koneksi Telegram diputus.');
      onStatusChange?.(false);
    } catch (err: unknown) {
      toast.error('Gagal', {
        description: err instanceof Error ? err.message : 'Terjadi kesalahan',
      });
    } finally {
      setIsDisconnecting(false);
    }
  };

  const copyBotLink = () => {
    navigator.clipboard.writeText(`https://t.me/${BOT_USERNAME}`).then(() => {
      toast.success('Link bot disalin!');
    });
  };

  return (
    <Card className="border border-slate-200 dark:border-slate-700 shadow-soft-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-100 dark:bg-sky-900/30">
            <MessageCircle className="w-5 h-5 text-sky-600 dark:text-sky-400" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Notifikasi Telegram
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Hubungkan akun Telegram untuk menerima update status pengajuan secara real-time.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isConnected ? (
          /* ─── Status: Terhubung ──────────────────────────────── */
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                  Terhubung dengan Telegram
                </p>
                {connectedAt && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-500">
                    Sejak {new Date(connectedAt).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </p>
                )}
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Bot akan mengirim notifikasi saat status pengajuan Anda berubah menjadi{' '}
              <span className="font-semibold text-sky-600 dark:text-sky-400">Diterima</span>,{' '}
              <span className="font-semibold text-red-600 dark:text-red-400">Ditolak</span>, atau{' '}
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Selesai</span>.
            </p>

            <Button
              id="telegram-disconnect-btn"
              variant="outline"
              size="sm"
              className="gap-2 text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
              onClick={handleDisconnect}
              disabled={isDisconnecting}
            >
              {isDisconnecting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Unplug className="w-3.5 h-3.5" />
              )}
              Putuskan Koneksi
            </Button>
          </div>
        ) : (
          /* ─── Status: Belum Terhubung ────────────────────────── */
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
              <XCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                Belum terhubung
              </p>
            </div>

            {/* Langkah-langkah */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Cara Menghubungkan:
              </p>
              <ol className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex gap-2">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <span>
                    Buka{' '}
                    <a
                      href={`https://t.me/${BOT_USERNAME}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-600 dark:text-sky-400 hover:underline font-medium inline-flex items-center gap-1"
                    >
                      @{BOT_USERNAME}
                      <ExternalLink className="w-3 h-3" />
                    </a>{' '}
                    di Telegram.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <span>
                    Klik <kbd className="px-1.5 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 font-mono">/start</kbd> untuk mendapatkan <strong>Chat ID</strong> kamu.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <span>Salin angka Chat ID dan tempel di kolom di bawah, lalu klik Hubungkan.</span>
                </li>
              </ol>
            </div>

            {/* Form Chat ID */}
            <div className="space-y-2">
              <Label htmlFor="telegram-chat-id" className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Chat ID dari Bot
              </Label>
              <div className="flex gap-2">
                <Input
                  id="telegram-chat-id"
                  type="text"
                  inputMode="numeric"
                  placeholder="Contoh: 1234567890"
                  value={chatId}
                  onChange={(e) => setChatId(e.target.value.replace(/\D/g, ''))}
                  className="font-mono dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                  onKeyDown={(e) => e.key === 'Enter' && handleConnect()}
                />
                <Button
                  id="telegram-connect-btn"
                  onClick={handleConnect}
                  disabled={isConnecting || !chatId.trim()}
                  className="gap-2 bg-sky-600 hover:bg-sky-700 text-white shrink-0"
                >
                  {isConnecting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <MessageCircle className="w-4 h-4" />
                  )}
                  {isConnecting ? 'Menghubungkan...' : 'Hubungkan'}
                </Button>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs text-muted-foreground hover:text-sky-600"
              onClick={copyBotLink}
            >
              <Copy className="w-3 h-3" />
              Salin link bot
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TelegramConnect;
