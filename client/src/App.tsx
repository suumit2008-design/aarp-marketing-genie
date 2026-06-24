import { createBrowserRouter, RouterProvider, Outlet, useNavigate, useLocation, useOutletContext } from 'react-router';
import { Icon } from './components/Icon';
import { GeniePage } from './pages/genie/GeniePage';
import { HomePage } from './pages/home/HomePage';
import { useCurrentUser, type CurrentUser } from './hooks/useCurrentUser';

export type Persona = 'Manager' | 'Executive';
type ShellContext = { persona: Persona; user: CurrentUser | null };
export const useShell = () => useOutletContext<ShellContext>();

/* ---------------- Brand lock ---------------- */
function BrandLock() {
  return (
    <div className="ag-brandlock">
      <span className="ag-wordmark">ASI</span>
      <span className="ag-divline" />
      <span className="ag-appname">
        <span style={{ width: 16, height: 16, color: 'var(--aarp-red)' }}>
          <Icon name="genie" size={16} color="var(--aarp-red)" />
        </span>
        ASI Marketing Insights Chatbot
      </span>
    </div>
  );
}

/* ---------------- Persona toggle (future state — disabled for now) ---------------- */
function PersonaToggle({ value }: { value: Persona }) {
  return (
    <div className="ag-persona-wrap" title="Manager / Executive views — coming soon">
      <div className="ag-persona is-future" aria-disabled="true">
        {(['Manager', 'Executive'] as Persona[]).map((p) => (
          <button key={p} className={value === p ? 'on' : ''} disabled tabIndex={-1}>
            {p}
          </button>
        ))}
      </div>
      <span className="ag-soon">Soon</span>
    </div>
  );
}

/* ---------------- App shell ---------------- */
function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  // Persona is a planned future capability — fixed to Manager for now.
  const persona: Persona = 'Manager';
  const user = useCurrentUser();

  const rail: Array<[string, string, string]> = [
    ['home', '/', 'Home'],
    ['chat', '/genie', 'Conversation'],
  ];
  const isActive = (path: string) => (path === '/' ? location.pathname === '/' : location.pathname.startsWith(path));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      <header className="ag-topbar">
        <button onClick={() => navigate('/')} title="Home" style={{ border: 0, background: 'transparent', padding: 0, cursor: 'pointer' }}>
          <BrandLock />
        </button>
        <div className="ag-top-right">
          <PersonaToggle value={persona} />
          <button className="ag-help" title="Help"><Icon name="help" size={17} /></button>
          <div className="ag-avatar" title={user?.displayName || 'Signed in'}>{user?.initials || '··'}</div>
        </div>
      </header>

      <div style={{ flex: '1 1 auto', display: 'flex', minHeight: 0 }}>
        <nav className="ag-rail">
          {rail.map(([ic, path, label]) => (
            <button
              key={path}
              className={'ag-railbtn' + (isActive(path) ? ' on' : '')}
              title={label}
              onClick={() => navigate(path)}
            >
              <Icon name={ic} size={20} stroke={isActive(path) ? 2 : 1.7} />
            </button>
          ))}
          <div className="ag-rail-spacer" />
          <button className="ag-railbtn" title="Help & feedback"><Icon name="help" size={20} /></button>
        </nav>
        <main style={{ flex: '1 1 auto', minWidth: 0, overflow: 'hidden', position: 'relative' }}>
          <Outlet context={{ persona, user } satisfies ShellContext} />
        </main>
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/genie', element: <GeniePage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
