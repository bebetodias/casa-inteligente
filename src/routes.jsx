import { createHashRouter, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { Splash } from './pages/Splash/Splash';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { Invite } from './pages/Auth/Invite';
import { InviteLanding } from './pages/Auth/InviteLanding';
import { InviteShare } from './pages/Auth/InviteShare';
import { Modules } from './pages/Modules/Modules';
import { Shopping } from './pages/Shopping/Shopping';
import { Plants } from './pages/Plants/Plants';
import { ComingSoon } from './pages/ComingSoon/ComingSoon';
import { Profile } from './pages/Profile/Profile';
import { PrivateRoute } from './components/PrivateRoute';

export const router = createHashRouter([
  { path: '/', element: <Navigate to="/splash" replace /> },
  { path: '/splash', element: <Splash /> },
  { path: '/login', element: <Login /> },
  { path: '/cadastro', element: <Register /> },
  { path: '/convite', element: <InviteLanding /> },
  { path: '/convite/:code', element: <Invite /> },
  {
    path: '/',
    element: <PrivateRoute><AppShell /></PrivateRoute>,
    children: [
      { path: 'modulos', element: <Modules /> },
      { path: 'compras', element: <Shopping /> },
      { path: 'convite/compartilhar', element: <InviteShare /> },
      { path: 'receitas', element: <ComingSoon title="SuperCook" icon="🍳" /> },
      { path: 'plantas', element: <Plants /> },
      { path: 'manutencao', element: <ComingSoon title="Manutenção da Casa" icon="🛠️" /> },
      { path: 'tarefas', element: <ComingSoon title="Tarefas" icon="📋" /> },
      { path: 'contas', element: <ComingSoon title="Contas a Pagar" icon="💸" /> },
      { path: 'perfil', element: <Profile /> },
    ],
  },
]);