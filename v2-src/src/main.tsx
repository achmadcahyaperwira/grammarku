import { render } from 'preact';
import { registerSW } from 'virtual:pwa-register';
import { App } from './App';
import './styles/app.css';
import { isNative } from './lib/native';

render(<App />, document.getElementById('app')!);

// Minta penyimpanan permanen sekali; browser yang memutuskan. Di aplikasi Android tidak perlu.
if (!isNative)
  navigator.storage?.persisted?.().then((p) => {
    if (!p) navigator.storage.persist?.().catch(() => undefined);
  });

// Di aplikasi Android semua file sudah ada di dalam APK, jadi service worker tidak dipakai.
if (!isNative && 'serviceWorker' in navigator) {
  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      // Jangan memotong sesi latihan: tawarkan lewat banner, pengguna yang memilih kapan.
      dispatchEvent(new CustomEvent('app-update', { detail: () => updateSW(true) }));
    }
  });
}
