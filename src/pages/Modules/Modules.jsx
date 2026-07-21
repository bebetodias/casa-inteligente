import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/primitives/Card';
import { Badge } from '../../components/primitives/Badge';
import { Avatar } from '../../components/primitives/Avatar';
import { Button } from '../../components/primitives/Button';
import { ModuleIcon } from './ModuleIcon';
import { getModulos } from '../../services/mock/modulesMock';
import { useAuthStore } from '../../stores/authStore';
import { supabase } from '../../lib/supabase';
import './Modules.css';

export function Modules() {
  const navigate = useNavigate();
  const { user, casa } = useAuthStore();
  const [modulos, setModulos] = useState([]);
  const [stats, setStats] = useState(null);
  const [atividade, setAtividade] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      const mods = await getModulos();
      if (!mounted) return;
      setModulos(mods);

      if (casa?.id) {
        // Buscar compras da casa
        const { data: compras, error } = await supabase
          .from('compras')
          .select('*, profiles(nome)')
          .eq('casa_id', casa.id)
          .order('criado_em', { ascending: false });

        if (!error && compras) {
          const pendentes = compras.filter(c => !c.comprado);
          const compradosNoMes = compras.filter(c => {
            if (!c.comprado) return false;
            const itemDate = new Date(c.criado_em);
            const agora = new Date();
            return itemDate.getMonth() === agora.getMonth() && itemDate.getFullYear() === agora.getFullYear();
          });

          // Gasto do mês inclui as compras já feitas no mês MAIS a estimativa do que está na lista (pendente)
          const gastoComprasMes = compradosNoMes.reduce((acc, c) => acc + (Number(c.preco_sugerido) || 0) * (Number(c.quantidade) || 1), 0);
          const gastoPendentes = pendentes.reduce((acc, c) => acc + (Number(c.preco_sugerido) || 0) * (Number(c.quantidade) || 1), 0);
          const gastoTotalEstimado = gastoComprasMes + gastoPendentes;

          setStats({
            compras: {
              itensNaLista: pendentes.length,
              comprasNoMes: compradosNoMes.length,
              gastoEstimado: gastoTotalEstimado,
            },
            receitas: { receitasFavoritas: 0, ingredientesDisponiveis: 0 },
            plantas: { total: 0, precisamCuidado: 0 },
            manutencao: { pendentes: 0, concluidasNoMes: 0 },
          });

          // Gerar atividades a partir das compras
          const atividadesCompras = compras.slice(0, 5).map(c => ({
            id: c.id,
            tipo: 'cart',
            usuario: c.profiles?.nome || 'Alguém',
            texto: c.comprado ? `comprou **${c.nome}**` : `adicionou **${c.nome}** à lista`,
            quando: new Date(c.criado_em).toLocaleDateString(), // Simplificado
          }));

          setAtividade(atividadesCompras);
        }
      }
      setLoading(false);
    }
    
    loadData();

    return () => { mounted = false; };
  }, [casa?.id]);

  const hora = new Date().getHours();
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';
  const primeiroNome = user?.nome?.split(' ')[0] || '';

  if (loading) {
    return (
      <div className="modules modules--loading">
        <div className="modules__loader">
          <div className="splash__loader">
            <span></span><span></span><span></span>
          </div>
          <p>Carregando módulos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modules">
      <header className="modules__header">
        <div className="modules__greeting">
          <p className="modules__subtitle">
            {saudacao}, {primeiroNome}!
          </p>
          <h1 className="modules__title">
            O que vamos cuidar hoje na <strong>{casa?.nome}</strong>?
          </h1>
          
        </div>
        <div className="modules__invite">
          <Button
            variant="secondary"
            size="medium"
            iconBefore={<ShareIcon />}
            onClick={() => navigate('/convite/compartilhar')}
          >
            Convidar família
          </Button>
        </div>
      </header>

      {stats && <StatsRow stats={stats} />}

      <section className="modules__section">
        <div className="modules__section-header">
          <h2 className="modules__section-title">Módulos</h2>
          <span className="modules__section-meta">{modulos.length} disponíveis</span>
        </div>
        <div className="modules__grid">
          {modulos.map((m) => (
            <ModuleCard key={m.id} modulo={m} stats={stats?.[m.id]} />
          ))}
        </div>
      </section>

      <div className="modules__columns">
        <section className="modules__section modules__activity">
          <div className="modules__section-header">
            <h2 className="modules__section-title">Atividade recente</h2>
            <Badge variant="neutral">Tempo real</Badge>
          </div>
          <ActivityList items={atividade} />
        </section>

        <section className="modules__section modules__family">
          <div className="modules__section-header">
            <h2 className="modules__section-title">Sua família</h2>
            <span className="modules__section-meta">
              {casa?.membros?.length || 0} membros
            </span>
          </div>
          <FamilyList membros={casa?.membros || []} codigoConvite={casa?.codigo_convite} />
        </section>
      </div>
    </div>
  );
}

function StatsRow({ stats }) {
  const items = [
    {
      label: 'Itens na lista',
      value: stats.compras.itensNaLista,
      hint: 'pendentes para comprar',
      icon: 'cart',
      color: 'shopping-list',
      to: '/compras',
    },
    {
      label: 'Plantas precisam de cuidado',
      value: stats.plantas.precisamCuidado,
      hint: `de ${stats.plantas.total} cadastradas`,
      icon: 'plant',
      color: 'plants',
      to: '/plantas',
    },
    {
      label: 'Tarefas pendentes',
      value: stats.manutencao.pendentes,
      hint: `${stats.manutencao.concluidasNoMes} concluídas este mês`,
      icon: 'tools',
      color: 'maintenance',
      to: '/manutencao',
    },
    {
      label: 'Gasto estimado do mês',
      value: stats.compras.gastoEstimado.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
      hint: `${stats.compras.comprasNoMes} compras realizadas`,
      icon: 'money',
      color: 'spent',
      to: '/compras',
    },
  ];

  return (
    <section className="stats-row">
      {items.map((item, idx) => (
        <button
          key={idx}
          className={`stat stat--${item.color}`}
          onClick={() => item.to && (window.location.hash = item.to)}
        >
          <div className="stat__content">
            <div className="stat__value">{item.value}</div>
            <div className="stat__label">{item.label}</div>
            <div className="stat__hint">{item.hint}</div>
          </div>
        </button>
      ))}
    </section>
  );
}

function ModuleCard({ modulo, stats }) {
  const navigate = useNavigate();

  return (
    <Card isInteractive onClick={() => navigate(modulo.rota)} className="module-card">
      <div className={`module-card__icon module-card__icon--${modulo.cor}`}>
        <ModuleIcon name={modulo.icon} size={28} />
        {modulo.badge && (
          <Badge variant={modulo.badge.variant} className="module-card__badge">
            {modulo.badge.texto}
          </Badge>
        )}
      </div>
      <div className="module-card__body">
        <h3 className="module-card__title">{modulo.nome}</h3>
        <p className="module-card__desc">{modulo.descricao}</p>
      </div>
      <div className="module-card__footer">
        {stats ? <ModuleStat stats={stats} id={modulo.id} /> : <span />}
        <span className="module-card__arrow" aria-hidden="true">→</span>
      </div>
    </Card>
  );
}

function ModuleStat({ stats, id }) {
  if (id === 'compras' && stats.itensNaLista) {
    return <Badge variant="brand">{stats.itensNaLista} pendentes</Badge>;
  }
  if (id === 'plantas' && stats.precisamCuidado) {
    return <Badge variant="warning">{stats.precisamCuidado} precisam cuidado</Badge>;
  }
  if (id === 'manutencao' && stats.pendentes) {
    return <Badge variant="warning">{stats.pendentes} pendentes</Badge>;
  }
  if (id === 'receitas') {
    return <Badge variant="neutral">{stats.receitasFavoritas} favoritas</Badge>;
  }
  return null;
}

function ActivityList({ items }) {
  if (!items.length) {
    return (
      <div className="empty-state">
        <p>Nenhuma atividade ainda. Comece a usar os módulos!</p>
      </div>
    );
  }

  return (
    <ul className="activity-list">
      {items.map((item) => (
        <li key={item.id} className={`activity-item activity-item--${item.tipo}`}>
          <div className="activity-item__icon">
            <ModuleIcon name={item.tipo} size={16} />
          </div>
          <div className="activity-item__content">
            <p className="activity-item__text">
              <strong>{item.usuario}</strong> {item.texto}
            </p>
            <span className="activity-item__time">{item.quando}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

function FamilyList({ membros, codigoConvite }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codigoConvite || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="family-list">
      <ul className="family-list__members">
        {membros.map((m) => (
          <li key={m.id} className="family-list__member">
            <Avatar name={m.nome} size="medium" status="online" />
            <div className="family-list__info">
              <strong>{m.nome}</strong>
              <span>{m.email}</span>
            </div>
          </li>
        ))}
      </ul>
      {codigoConvite && (
        <div className="family-list__invite">
          <div className="family-list__invite-text">
            <strong>Código da casa</strong>
            <span>Compartilhe com quem mora com você</span>
          </div>
          <button className="family-list__code" onClick={handleCopy}>
            <code>{codigoConvite}</code>
            <span className="family-list__copy-icon" aria-hidden="true">
              {copied ? '✓' : '⧉'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="2" />
      <path d="M8.5 10.5 L15.5 6.5 M8.5 13.5 L15.5 17.5"
        stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}