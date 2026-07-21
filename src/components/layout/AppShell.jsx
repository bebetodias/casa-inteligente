import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Avatar } from '../primitives/Avatar';
import { Toast } from '../primitives/Toast';
import { useToastStore } from '../../hooks/useToast';
import './AppShell.css';

export function AppShell() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { visible, mensagem, variant, hideToast } = useToastStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className={`app-shell ${sidebarOpen ? 'app-shell--sidebar-open' : ''}`}>
      <aside className={`app-shell__sidebar ${sidebarOpen ? 'app-shell__sidebar--open' : ''}`}>
        <div className="app-shell__brand">
          <div className="app-shell__brand-logo">
            <img src="/casa-inteligente/logo-homecare.svg" alt="Casa Inteligente" />
          </div>
          <button className="app-shell__sidebar-close" onClick={closeSidebar} aria-label="Fechar menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="app-shell__nav">
          <NavLink to="/modulos" className="app-shell__link" onClick={closeSidebar}>Módulos</NavLink>
          <NavLink to="/compras" className="app-shell__link" onClick={closeSidebar}>Compras</NavLink>
          <NavLink to="/receitas" className="app-shell__link" onClick={closeSidebar}>Receitas</NavLink>
          <NavLink to="/plantas" className="app-shell__link" onClick={closeSidebar}>Plantas</NavLink>
          <NavLink to="/manutencao" className="app-shell__link" onClick={closeSidebar}>Manutenção</NavLink>
        </nav>
      </aside>

      {sidebarOpen && <div className="app-shell__overlay" onClick={closeSidebar} />}

      <div className="app-shell__main">
        <header className="app-shell__header">
          <button className="app-shell__burger" onClick={() => setSidebarOpen(true)} aria-label="Abrir menu">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/></svg>
          </button>
          <div className="app-shell__user">
            <div className="app-shell__user-info" onClick={() => navigate('/perfil')} role="button" tabIndex={0}>
              <Avatar name={user?.nome} src={user?.avatar_url || user?.avatar} size="small" />
              <span>{user?.nome}</span>
            </div>
            <button onClick={() => { logout(); navigate('/login'); }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-power-icon lucide-power"><path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.77.04"/></svg>
            </button>
          </div>
        </header>
        <main className="app-shell__content">
          <Outlet />
        </main>
      </div>
      <Toast visible={visible} mensagem={mensagem} variant={variant} onClose={hideToast} />
    </div>
  );
}