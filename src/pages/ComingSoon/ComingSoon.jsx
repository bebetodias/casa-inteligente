import { useNavigate } from 'react-router-dom';
import { EmptyState } from '../../components/primitives/EmptyState';
import { Button } from '../../components/primitives/Button';
import './ComingSoon.css';

export function ComingSoon({ title, icon, returnTo = '/modulos' }) {
  const navigate = useNavigate();

  return (
    <div className="coming-soon">
      <header className="coming-soon__header">
        <button className="coming-soon__back" onClick={() => navigate(returnTo)} aria-label="Voltar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18 L9 12 L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="coming-soon__title">{title || 'Módulo'}</h1>
      </header>

      <div className="coming-soon__content">
        <EmptyState
          icon={icon || "🚧"}
          title="Em Breve!"
          description={`O módulo de ${title || 'novas funcionalidades'} ainda está sendo construído. Fique de olho nas próximas atualizações!`}
          action={
            <Button variant="primary" size="medium" onClick={() => navigate(returnTo)}>
              Voltar para Módulos
            </Button>
          }
        />
      </div>
    </div>
  );
}
