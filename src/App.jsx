import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { useAuthStore } from './stores/authStore';
import './styles/globals.css';

export default function App() {
  const init = useAuthStore(state => state.init);
  const isInitialized = useAuthStore(state => state.isInitialized);

  useEffect(() => {
    init();
  }, [init]);

  if (!isInitialized) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <p>Carregando...</p>
      </div>
    );
  }

  return <RouterProvider router={router} />;
}