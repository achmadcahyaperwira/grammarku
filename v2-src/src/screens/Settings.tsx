import { useEffect, useRef, useState } from 'preact/hooks';
import { buildBackup, backupFileName, parseBackup, restoreBackup, summarize, type BackupFile } from '../lib/backup';
import { getMeta, setMeta } from '../lib/db';
import { daysBetween, formatDate, localDate } from '../lib/dates';
import { back } from '../lib/router';
import { useApp } from '../lib/store';
import { IconBack } from '../components/icons';
import { isNative, saveWithAndroid } from '../lib/native';

declare const __APP_VERSION__: string;

type Msg = { kind: 'ok' | 'bad' | 'info'; text: string } | null;

export function Settings() {
  const { catalog, refresh, today } = useApp();
  const [lastBackup, setLastBackup] = useState<string | null>(null);
  const [persisted, setPersisted] = useState<boolean | null>(null);
  const [offline, setOffline] = useState<'ready' | 'pending' | 'unsupported' | 'native'>(isNative ? 'native' : 'pending');
  const [exportMsg, setExportMsg] = useState<Msg>(null);
  const [importMsg, setImportMsg] = useState<Msg>(null);
  const [pending, setPending] = useState<BackupFile | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getMeta<string>('lastBackupAt').then((v) => setLastBackup(v ?? null));
    if (isNative) return;
    navigator.storage?.persisted?.().then(setPersisted).catch(() => setPersisted(null));
    if (!('serviceWorker' in navigator)) setOffline('unsupported');
    else navigator.serviceWorker.ready.then(() => setOffline(navigator.serviceWorker.controller ? 'ready' : 'pending'));
  }, []);

  async function doExport() {
    setExportMsg(null);
    try {
      const data = await buildBackup(catalog.contentVersion);
      const name = backupFileName();
      if (isNative) {
        const r = await saveWithAndroid(name, JSON.stringify(data, null, 1));
        if (!r.ok) {
          setExportMsg(r.msg === 'cancel' ? { kind: 'info', text: 'Ekspor dibatalkan.' } : { kind: 'bad', text: 'Ekspor gagal: ' + r.msg });
          return;
        }
        const now = new Date().toISOString();
        await setMeta('lastBackupAt', now);
        setLastBackup(now);
        setExportMsg({ kind: 'ok', text: `Cadangan disimpan sebagai ${name}. Simpan salinannya di tempat aman, misalnya Google Drive.` });
        return;
      }
      const blob = new Blob([JSON.stringify(data, null, 1)], { type: 'application/json' });
      const file = new File([blob], name, { type: 'application/json' });
      const isIOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      let shared = false;
      if (isIOS && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: name });
          shared = true;
        } catch (e) {
          if ((e as DOMException).name === 'AbortError') return;
        }
      }
      if (!shared) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      }
      const now = new Date().toISOString();
      await setMeta('lastBackupAt', now);
      setLastBackup(now);
      setExportMsg({ kind: 'ok', text: `Cadangan disimpan sebagai ${name}. Simpan file ini di tempat aman, misalnya Google Drive.` });
    } catch (e) {
      setExportMsg({ kind: 'bad', text: 'Ekspor gagal: ' + String((e as Error)?.message ?? e) });
    }
  }

  async function onFile(e: Event) {
    setImportMsg(null);
    setPending(null);
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    try {
      const parsed = parseBackup(await f.text());
      setPending(parsed);
    } catch (err) {
      setImportMsg({ kind: 'bad', text: String((err as Error).message) });
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  async function confirmImport() {
    if (!pending) return;
    try {
      await restoreBackup(pending);
      setPending(null);
      await refresh();
      setLastBackup((await getMeta<string>('lastBackupAt')) ?? null);
      setImportMsg({ kind: 'ok', text: 'Impor berhasil. Progres sudah dipulihkan.' });
    } catch (err) {
      setPending(null);
      setImportMsg({ kind: 'bad', text: String((err as Error).message) });
    }
  }

  async function askPersist() {
    const ok = await navigator.storage?.persist?.().catch(() => false);
    setPersisted(!!ok);
  }

  const lb = lastBackup ? localDate(new Date(lastBackup)) : null;
  const sum = pending ? summarize(pending) : null;

  return (
    <div class="app">
      <header class="topbar">
        <button class="icon-btn" aria-label="Kembali" onClick={() => back('#/')}>
          <IconBack />
        </button>
        <div class="title">Pengaturan</div>
      </header>
      <main class="page">
        <section class="setting">
          <h2>Cadangan progres</h2>
          <p class="muted small" style={{ margin: 0 }}>
            {lb
              ? `Cadangan terakhir: ${formatDate(lb)} (${daysBetween(lb, today) === 0 ? 'hari ini' : `${daysBetween(lb, today)} hari lalu`}).`
              : 'Belum pernah membuat cadangan.'}{' '}
            Progres hanya tersimpan di HP ini. Simpan cadangan sesekali supaya aman kalau HP direset.
          </p>
          <button class="btn block" onClick={doExport}>
            Ekspor cadangan
          </button>
          {exportMsg && <div class={`notice ${exportMsg.kind}`}>{exportMsg.text}</div>}
        </section>

        <section class="setting">
          <h2>Pulihkan dari cadangan</h2>
          <p class="muted small" style={{ margin: 0 }}>
            Pilih file <span lang="en">grammar-backup-….json</span>. Data di HP ini akan diganti dengan isi file.
          </p>
          <input ref={fileRef} type="file" accept="application/json,.json" class="visually-hidden" id="imp" onChange={onFile} />
          <label for="imp" class="btn block secondary" style={{ marginTop: 10 }}>
            Pilih file cadangan
          </label>
          {pending && sum && (
            <div class="notice">
              <p style={{ marginBottom: 8 }}>
                File dari {formatDate(localDate(new Date(pending.exportedAt)))} berisi {sum.done} unit selesai, {sum.attempts} jawaban, dan {sum.review}{' '}
                soal di bank kesalahan. Ganti semua data di HP ini?
              </p>
              <div class="btn-row">
                <button class="btn quiet" onClick={() => setPending(null)}>
                  Batal
                </button>
                <button class="btn" onClick={confirmImport}>
                  Ya, ganti data
                </button>
              </div>
            </div>
          )}
          {importMsg && <div class={`notice ${importMsg.kind}`}>{importMsg.text}</div>}
        </section>

        <section class="setting">
          <h2>Mode offline dan penyimpanan</h2>
          <dl class="facts">
            <dt>Offline</dt>
            <dd>
              {offline === 'native'
                ? 'Selalu offline (materi ada di dalam aplikasi)'
                : offline === 'ready'
                  ? 'Siap dipakai offline'
                  : offline === 'unsupported'
                    ? 'Browser ini tidak mendukung'
                    : 'Sedang disiapkan, buka sekali lagi saat online'}
            </dd>
            <dt>Penyimpanan</dt>
            <dd>
              {isNative
                ? 'Di dalam aplikasi, sampai aplikasi dihapus'
                : persisted
                  ? 'Permanen'
                  : persisted === false
                    ? 'Bisa dihapus sistem bila memori penuh'
                    : 'Tidak diketahui'}
            </dd>
          </dl>
          {persisted === false && (
            <button class="btn block quiet" onClick={askPersist}>
              Minta penyimpanan permanen
            </button>
          )}
        </section>

        <section class="setting">
          <h2>Tentang</h2>
          <dl class="facts">
            <dt>Versi aplikasi</dt>
            <dd>
              {__APP_VERSION__}
              {isNative ? ' (Android)' : ' (web)'}
            </dd>
            <dt>Versi materi</dt>
            <dd>{catalog.contentVersion}</dd>
            <dt>Unit tersedia</dt>
            <dd>
              {catalog.units.filter((u) => u.released).length} dari {catalog.units.length}
            </dd>
          </dl>
          <p class="muted small" style={{ marginTop: 10 }}>
            Kurikulum mengikuti urutan unit <i>English Grammar in Use</i> edisi kelima (Raymond Murphy, Cambridge University Press, 2019). Semua
            penjelasan, contoh, dan soal ditulis ulang, bukan disalin dari buku.
          </p>
        </section>
      </main>
    </div>
  );
}
