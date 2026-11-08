/** Jembatan ke aplikasi Android (WebView). Di browser biasa, objek ini tidak ada. */
interface AndroidBridge {
  saveBackup(name: string, content: string): void;
  platform(): string;
}

declare global {
  interface Window {
    AndroidBridge?: AndroidBridge;
    __backupSaved?: (ok: boolean, msg: string) => void;
  }
}

export const isNative = typeof window !== 'undefined' && !!window.AndroidBridge;

/** Simpan file lewat pemilih lokasi Android. Hasil dikirim balik oleh aplikasi lewat window.__backupSaved. */
export function saveWithAndroid(name: string, content: string): Promise<{ ok: boolean; msg: string }> {
  return new Promise((resolve) => {
    window.__backupSaved = (ok, msg) => {
      window.__backupSaved = undefined;
      resolve({ ok, msg });
    };
    window.AndroidBridge!.saveBackup(name, content);
  });
}
