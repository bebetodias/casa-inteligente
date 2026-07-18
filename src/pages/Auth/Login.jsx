import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/primitives/Button';
import { Input } from '../../components/primitives/Input';
import { useAuthStore } from '../../stores/authStore';
import './Auth.css';

export function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [form, setForm] = useState({ email: '', senha: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const next = {};
    if (!form.email) next.email = 'Informe seu e-mail.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) next.email = 'E-mail inválido.';
    if (!form.senha) next.senha = 'Informe sua senha.';
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
      await login(form);
      navigate('/modulos', { replace: true });
    } catch (err) {
      setSubmitError('Não foi possível entrar. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

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
          <h2 className="auth__brand-title">Casa Inteligente</h2>
          <p className="auth__brand-text">
            Organize compras, descubra receitas, cuide das plantas e da manutenção
            da sua casa — tudo em um só lugar, com toda a família.
          </p>
          <ul className="auth__features">
            <li><span aria-hidden="true">✓</span> Lista de compras inteligente</li>
            <li><span aria-hidden="true">✓</span> Sugestões de receitas por ingredientes</li>
            <li><span aria-hidden="true">✓</span> Lembretes de cuidados com plantas</li>
            <li><span aria-hidden="true">✓</span> Manutenção preventiva da casa</li>
          </ul>
        </div>
      </div>

      <div className="auth__panel auth__panel--form">
        <div className="auth__form-wrapper">
          <div className="auth__header">
            <h1 className="auth__title">Bem-vindo de volta</h1>
            <p className="auth__subtitle">Entre na sua conta para continuar.</p>
          </div>

          <form className="auth__form" onSubmit={handleSubmit} noValidate>
            {submitError && (
              <div className="auth__alert" role="alert">
                {submitError}
              </div>
            )}

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
              placeholder="••••••••"
              autoComplete="current-password"
              value={form.senha}
              onChange={handleChange('senha')}
              error={errors.senha}
              isRequired
            />

            <div className="auth__row-between">
              <label className="auth__checkbox">
                <input type="checkbox" />
                <span>Lembrar de mim</span>
              </label>
              <Link to="/recuperar" className="auth__link">
                Esqueceu a senha?
              </Link>
            </div>

            <Button type="submit" variant="primary" size="large" isLoading={loading} isBlock>
              Entrar
            </Button>

            <div className="auth__divider"><span>ou</span></div>

            <Button
              type="button"
              variant="secondary"
              size="large"
              iconBefore={<InviteIcon />}
              onClick={() => navigate('/convite')}
              isBlock
              >
              Entrar com código de convite
            </Button> 
          </form>

          <p className="auth__footer">
            Ainda não tem uma conta?{' '}
            <Link to="/cadastro" className="auth__link auth__link--bold">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function InviteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M19 11h-1V7a4 4 0 0 0-8 0v4H9a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Zm-7-4a2 2 0 1 1 4 0v4h-4V7Z"
        fill="currentColor"
      />
    </svg>
  );
}