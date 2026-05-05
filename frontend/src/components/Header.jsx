import { Leaf, LogOut, Moon, Sun } from 'lucide-react';

export default function Header({ auth, onLogout, darkMode, onToggleDark }) {
  return (
    <header className="app-header">
      <div className="brand">
        <Leaf size={24} />
        <div>
          <h1>Ethical Supply Chain Tracker</h1>
          <p>SDG 12 transparency for everyday products</p>
        </div>
      </div>
      <div className="header-actions">
        {auth?.user ? (
          <div className="user-chip">
            <span>{auth.user.name}</span>
            <small>{auth.user.role}</small>
          </div>
        ) : null}
        <button className="icon-button" type="button" onClick={onToggleDark} title="Toggle dark mode">
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        {auth?.user ? (
          <button className="icon-button" type="button" onClick={onLogout} title="Log out">
            <LogOut size={18} />
          </button>
        ) : null}
      </div>
    </header>
  );
}
