import { render } from 'preact';
import { registerSW } from 'virtual:pwa-register';
import { App } from './App';
import './styles/app.css';

render(<App />, document.getElementById('app')!);

// Minta penyimpanan permanen sekali; browser yang memutuskan.
navigator.storage?.persisted?.().then((p) => {
  if (!p) navigator.storage.persist?.().catch(() => undefined);
});

if ('serviceWorker' in navigator) {
  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      // Jangan memotong sesi latihan: tawarkan lewat banner, pengguna yang memilih kapan.
      dispatchEvent(new CustomEvent('app-update', { detail: () => updateSW(true) }));
    }
  });
}
