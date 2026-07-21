import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useToastStore } from '../../hooks/useToast';
import { usePlants } from '../../hooks/usePlants';
import { EmptyState } from '../../components/primitives/EmptyState';
import { AddPlantModal } from './AddPlantModal';
import './Plants.css';

function calculateStatus(ultimaRega, frequencia) {
  const lastWatered = new Date(ultimaRega);
  const now = new Date();
  
  // Zera as horas para comparar apenas os dias
  lastWatered.setHours(0,0,0,0);
  const today = new Date(now.setHours(0,0,0,0));
  
  const nextWater = new Date(lastWatered);
  nextWater.setDate(nextWater.getDate() + frequencia);
  
  const diffTime = nextWater - today;
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (daysLeft < 0) return { state: 'urgent', text: `Atrasada há ${Math.abs(daysLeft)} dia(s)` };
  if (daysLeft === 0) return { state: 'warning', text: 'Regar hoje' };
  if (daysLeft === 1) return { state: 'good', text: 'Regar amanhã' };
  return { state: 'good', text: `Regar em ${daysLeft} dias` };
}

export function Plants() {
  const { casa, user } = useAuthStore();
  const { showToast } = useToastStore();
  const { plantas, loading, adicionar, regar, remover } = usePlants(casa?.id, user?.id);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleWater = async (planta) => {
    try {
      await regar(planta.id);
      showToast(`${planta.nome} foi regada!`, 'success');
    } catch (err) {
      showToast('Erro ao registrar rega.', 'error');
    }
  };

  const handleDelete = async (plantaId) => {
    if (window.confirm('Tem certeza que deseja remover esta planta?')) {
      try {
        await remover(plantaId);
        showToast('Planta removida.', 'success');
      } catch (err) {
        showToast('Erro ao remover planta.', 'error');
      }
    }
  };

  if (loading && plantas.length === 0) {
    return <div style={{ padding: '20px' }}>Carregando plantas...</div>;
  }

  return (
    <div className="plants-page">
      <header className="plants__header">
        <div>
          <h1 className="plants__title">Plantas & Jardim</h1>
          <p className="plants__subtitle">{plantas.length} {plantas.length === 1 ? 'planta cadastrada' : 'plantas cadastradas'}</p>
        </div>
      </header>

      {plantas.length === 0 ? (
        <EmptyState
          icon="🪴"
          title="Nenhuma planta cadastrada"
          description="Adicione suas plantas para receber lembretes de rega."
        />
      ) : (
        <div className="plants__grid">
          {plantas.map((planta) => {
            const status = calculateStatus(planta.ultima_rega, planta.frequencia_rega);
            
            return (
              <article key={planta.id} className="plant-card">
                <div className={`plant-card__status-bar plant-card__status-bar--${status.state}`} />
                
                <div className="plant-card__header">
                  <div className="plant-card__icon">🪴</div>
                  <div className="plant-card__info">
                    <h3 className="plant-card__name">{planta.nome}</h3>
                    <div className="plant-card__specie">{planta.local || 'Sem local'}</div>
                  </div>
                </div>

                <div className="plant-card__details">
                  <div className="plant-card__detail-item">
                    <span className="plant-card__detail-label">Próxima Rega</span>
                    <span className="plant-card__detail-value" style={{ 
                      color: status.state === 'urgent' ? 'var(--color-danger)' : 
                             status.state === 'warning' ? 'var(--color-warning)' : 'var(--color-text-dark)'
                    }}>
                      {status.text}
                    </span>
                  </div>
                  <div className="plant-card__detail-item">
                    <span className="plant-card__detail-label">Frequência</span>
                    <span className="plant-card__detail-value">{planta.frequencia_rega} dias</span>
                  </div>
                </div>

                <div className="plant-card__actions">
                  <button 
                    className="plant-card__btn-regar" 
                    onClick={() => handleWater(planta)}
                  >
                    💧 Regar
                  </button>
                  <button 
                    className="plant-card__btn-delete"
                    onClick={() => handleDelete(planta.id)}
                    title="Remover planta"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <button className="plants__fab" onClick={() => setIsAddModalOpen(true)} title="Adicionar Planta">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>

      {isAddModalOpen && (
        <AddPlantModal 
          onClose={() => setIsAddModalOpen(false)} 
          onAdd={async (dados) => {
            await adicionar(dados);
            showToast('Planta adicionada com sucesso!', 'success');
            setIsAddModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
