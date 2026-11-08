import { useEffect, useState } from 'preact/hooks';
import { useRoute } from './lib/router';
import { AppProvider, useApp } from './lib/store';
import { pickDue } from './lib/leitner';
import { IconBook, IconChart, IconHome, IconRepeat } from './components/icons';
import { Home } from './screens/Home';
import { UnitList } from './screens/UnitList';
import { Lesson } from './screens/Lesson';
import { Practice, Review } from './screens/Sessions';
import { Bank } from './screens/Bank';
import { Progress } from './screens/Progress';
import { Settings } from './screens/Settings';

function TabBar({ active }: { active: string }) {
  const { review, today } = useApp();
  const due = pickDue(review, today, 999).length;
  const tab = (name: string, href: string, label: string, icon: preact.ComponentChildren, badge?: number) => (
    <a href={href} aria-current={active === name ? 'page' : undefined}>
      {icon}
      {label}
      {badge ? (
        <span class="badge" aria-label={`${badge} soal jatuh tempo`}>
          {badge > 99 ? '99+' : badge}
        </span>
      ) : null}
    </a>
  );
  return (
    <nav class="tabbar" aria-label="Navigasi utama">
      {tab('home', '#/', 'Beranda', <IconHome />)}
      {tab('units', '#/unit', 'Unit', <IconBook />)}
      {tab('bank', '#/review', 'Ulangan', <IconRepeat />, due)}
      {tab('progress', '#/progress', 'Progres', <IconChart />)}
    </nav>
  );
}

function Screens() {
  const r = useRoute();
  if (r.name === 'practice') return <Practice key={r.unitNo} unitNo={r.unitNo!} />;
  if (r.name === 'review') return <Review />;
  if (r.name === 'settings') return <Settings />;
  const active = r.name === 'lesson' ? 'units' : r.name;
  return (
    <div class="app">
      {r.name === 'home' && <Home />}
      {r.name === 'units' && <UnitList />}
      {r.name === 'lesson' && <Lesson key={r.unitNo} unitNo={r.unitNo!} />}
      {r.name === 'bank' && <Bank />}
      {r.name === 'progress' && <Progress />}
      <TabBar active={active} />
    </div>
  );
}

export function UpdateToast() {
  const [update, setUpdate] = useState<null | (() => void)>(null);
  useEffect(() => {
    const on = (e: Event) => setUpdate(() => (e as CustomEvent).detail as () => void);
    addEventListener('app-update', on);
    return () => removeEventListener('app-update', on);
  }, []);
  if (!update) return null;
  return (
    <div class="toast" role="status">
      <span>Versi baru siap.</span>
      <button onClick={() => setUpdate(null)}>Nanti</button>
      <button onClick={update}>Muat ulang</button>
    </div>
  );
}

export function App() {
  return (
    <AppProvider>
      <Screens />
      <UpdateToast />
    </AppProvider>
  );
}
