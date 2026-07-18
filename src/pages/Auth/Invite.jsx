import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button } from '../../components/primitives/Button';
import { Input } from '../../components/primitives/Input';
import { useAuthStore } from '../../stores/authStore';
import './Auth.css';
import './Register.css';

export function Invite() {
  const { code } = useParams();
  const navigate = useNavigate();
  const validateInvite = useAuthStore((s) => s.validateInvite);
  const acceptInvite = useAuthStore((s) => s.acceptInvite);

  const [casaInfo, setCasaInfo] = useState(null);
  const [validating, setValidating] = useState(true);
  const [validationError, setValidationError] = useState(null);

  const [form, setForm] = useState({ nome: '', email: '', senha: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const result = await validateInvite(code);
        if (mounted) setCasaInfo(result.casa);
      } catch (err) {
        if (mounted) setValidationError(err.message);
      } finally {
        if (mounted) setValidating(false);
      }
    })();
    return () => { mounted = false; };
  }, [code, validateInvite]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const next = {};
    if (!form.nome.trim()) next.nome = 'Informe seu nome.';
    if (!form.email) next.email = 'Informe seu e-mail.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) next.email = 'E-mail inválido.';
    if (!form.senha) next.senha = 'Crie uma senha.';
    else if (form.senha.length < 6) next.senha = 'Senha deve ter ao menos 6 caracteres.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;
    setLoading(true);
    try {
      await acceptInvite({
        codigo: code,
        nome: form.nome.trim(),
        email: form.email.trim(),
        senha: form.senha,
      });
      navigate('/modulos', { replace: true });
    } catch (err) {
      setSubmitError(err.message || 'Não foi possível aceitar o convite.');
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="auth auth--centered">
        <div className="auth__loader-card">
          <div className="splash__loader">
            <span></span><span></span><span></span>
          </div>
          <p>Validando convite...</p>
        </div>
      </div>
    );
  }

  if (validationError) {
    return (
      <div className="auth auth--centered">
        <div className="auth__error-card">
          <div className="auth__error-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M12 7 V13 M12 16.5 V17" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="auth__title">Convite inválido</h1>
          <p className="auth__subtitle">{validationError}</p>
          <div className="auth__error-actions">
            <Button variant="primary" size="medium" onClick={() => navigate('/convite')}>
              Tentar outro código
            </Button>
            <Link to="/login" className="auth__link auth__link--bold">
              Já tenho conta
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth">
      <div className="auth__panel auth__panel--brand">
        <div className="auth__brand-content">
          <div className="auth__brand-logo">
            <svg viewBox="0 0 64 64" aria-hidden="true">
              <path
                d="M32 4 L60 24 V58 H40 V40 H24 V58 H4 V24 Z"
                fill="var(--color-text-inverse)"
              />
            </svg>
          </div>
          <h2 className="auth__brand-title">Bem-vindo à casa!</h2>
          <p className="auth__brand-text">
            Você está prestes a se juntar à <strong>{casaInfo?.nome}</strong>.
            Crie sua conta para começar a colaborar com sua família.
          </p>
          {casaInfo?.membros?.length > 0 && (
            <div className="invite__members">
              <strong>Já participa da casa:</strong>
              <ul>
                {casaInfo.membros.map((m) => (
                  <li key={m.id}>
                    <span className="invite__avatar" aria-hidden="true">
                      {m.nome.charAt(0).toUpperCase()}
                    </span>
                    {m.nome}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="auth__panel auth__panel--form">
        <div className="auth__form-wrapper">
          <div className="auth__header">
            <div className="invite__badge">
              <span>Código:</span> <code>{code}</code>
            </div>
            <h1 className="auth__title">Crie sua conta</h1>
            <p className="auth__subtitle">
              Para entrar na <strong>{casaInfo?.nome}</strong>.
            </p>
          </div>

          <form className="auth__form" onSubmit={handleSubmit} noValidate>
            {submitError && (
              <div className="auth__alert" role="alert">
                {submitError}
              </div>
            )}

            <Input
              label="Nome completo"
              type="text"
              placeholder="Maria Silva"
              autoComplete="name"
              value={form.nome}
              onChange={handleChange('nome')}
              error={errors.nome}
              isRequired
              autoFocus
            />
            <Input
              label="E-mail"
              type="email"
              placeholder="voce@email.com"
              autoComplete="email"
              value={form.email}
              onChange={handleChange('email')}
              error={errors.email}
              isRequired
            />
            <Input
              label="Senha"
              type="password"
              placeholder="Crie uma senha"
              autoComplete="new-password"
              hint="Mínimo 6 caracteres."
              value={form.senha}
              onChange={handleChange('senha')}
              error={errors.senha}
              isRequired
            />

            <Button
              type="submit"
              variant="primary"
              size="large"
              isLoading={loading}
              isBlock
            >
              Entrar na casa
            </Button>
          </form>

          <p className="auth__footer">
            Já tem conta?{' '}
            <Link to="/login" className="auth__link auth__link--bold">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}