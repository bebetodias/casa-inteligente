import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Avatar } from '../primitives/Avatar';
import { Toast } from '../primitives/Toast';
import { useToastStore } from '../../hooks/useToast';
import { ModulesIcon, CloseIcon, HamburgerIcon, PowerIcon } from '../../utils/Icons';
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
        <div>
          <div className="app-shell__brand">
            <div className="app-shell__brand-logo">
              <img src="/casa-inteligente/logo-homecare.svg" alt="Casa Inteligente" />
            </div>
            <button className="app-shell__sidebar-close" onClick={closeSidebar} aria-label="Fechar menu">
              <CloseIcon size={24} />
            </button>
          </div>
          <nav className="app-shell__nav">
            <NavLink to="/modulos" className="app-shell__link" onClick={closeSidebar}><ModulesIcon size={16} /> Módulos</NavLink>
            <NavLink to="/compras" className="app-shell__link" onClick={closeSidebar}>Compras</NavLink>
            <NavLink to="/receitas" className="app-shell__link" onClick={closeSidebar}>Receitas</NavLink>
            <NavLink to="/plantas" className="app-shell__link" onClick={closeSidebar}>Plantas</NavLink>
            <NavLink to="/manutencao" className="app-shell__link" onClick={closeSidebar}>Manutenção</NavLink>
          </nav>
        </div>
        <div className="app-shell__footer">
          <button onClick={() => { logout(); navigate('/login'); }}>
            <PowerIcon size={16} /> Sair
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="app-shell__overlay" onClick={closeSidebar} />}

      <div className="app-shell__main">
        <header className="app-shell__header">
          
          <div className="app-shell__user">
            <div className="app-shell__user-info" onClick={() => navigate('/perfil')} role="button" tabIndex={0}>
              <Avatar name={user?.nome} src={user?.avatar_url || user?.avatar} size="small" />
              <span>Olá, {user?.nome}</span>
            </div>
            
          </div>
          <button className="app-shell__burger" onClick={() => setSidebarOpen(true)} aria-label="Abrir menu">
            <HamburgerIcon size={24} />
          </button>
        </header>
        <main className="app-shell__content">
          <Outlet />
        </main>
      </div>
      <Toast visible={visible} mensagem={mensagem} variant={variant} onClose={hideToast} />
    </div>
  );
}