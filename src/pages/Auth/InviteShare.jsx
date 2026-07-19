import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../../components/primitives/Button';
import { useToast } from '../../hooks/useToast';
import './InviteShare.css';
import './Auth.css';

export function InviteShare() {
  const navigate = useNavigate();
  const { casa, user, generateInvite } = useAuthStore();
  const { showToast } = useToast();
  
  const [inviteData, setInviteData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!casa || !user) {
      navigate('/login');
      return;
    }

    // Se a casa já tiver um código válido, não precisamos ficar gerando um novo toda hora.
    // Assim evitamos sobrescrever o código que a pessoa acabou de compartilhar.
    if (casa.codigo_convite && casa.token_convite) {
      setInviteData({
        codigo: casa.codigo_convite,
        token: casa.token_convite,
        link: `${window.location.origin}${window.location.pathname}#/convite/${casa.token_convite}`,
      });
      setLoading(false);
      return;
    }

    generateInvite(casa.id, user.id)
      .then(data => setInviteData(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [casa?.id, user?.id, generateInvite, navigate]); // Dependências corrigidas para IDs, não o objeto casa

  const handleCopyLink = async () => {
    if (!inviteData) return;
    await navigator.clipboard.writeText(inviteData.link);
    showToast({
      tipo: 'success',
      descricao: 'Link copiado para a área de transferência!'
    });
  };

  const handleWhatsApp = () => {
    if (!inviteData || !casa) return;
    const text = `Oi! Você foi convidado para a casa *${casa.nome}* no Casa Inteligente. Acesse pelo link: ${inviteData.link} ou use o código ${inviteData.codigo}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleEmail = () => {
    if (!inviteData || !casa) return;
    const subject = `Convite para ${casa.nome} no Casa Inteligente`;
    const body = `Oi!\n\nVocê foi convidado para participar da casa "${casa.nome}" no Casa Inteligente.\n\nAcesse pelo link: ${inviteData.link}\nOu use o código: ${inviteData.codigo}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  if (loading) {
    return (
      <div className="auth auth--centered">
        <div className="auth__loader-card">
          <div className="splash__loader">
            <span></span><span></span><span></span>
          </div>
          <p>Gerando convite...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth auth--centered">
      <div className="invite-share__card">
        <header className="invite-share__header">
          <button className="invite-share__back" onClick={() => navigate(-1)} aria-label="Voltar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18 L9 12 L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h2>Convidar Família</h2>
        </header>

        <div className="invite-share__content">
          <p className="invite-share__desc">
            Compartilhe este link para que outras pessoas entrem na <strong>{casa?.nome}</strong>.
          </p>

          <div className="invite-share__link-box">
            <input type="text" readOnly value={inviteData?.link || ''} />
            <Button variant="subtle" onClick={handleCopyLink}>Copiar</Button>
          </div>

          <div className="invite-share__actions">
            <Button variant="primary" isBlock onClick={handleWhatsApp} iconBefore={<WhatsAppIcon />}>
              Enviar pelo WhatsApp
            </Button>
            <Button variant="secondary" isBlock onClick={handleEmail} iconBefore={<EmailIcon />}>
              Enviar por E-mail
            </Button>
          </div>

          <div className="invite-share__divider"><span>OU</span></div>

          <p className="invite-share__desc">
            Eles também podem entrar usando o código curto manualmente:
          </p>
          <div className="invite-share__code">
            <code>{inviteData?.codigo}</code>
          </div>
        </div>
      </div>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}
