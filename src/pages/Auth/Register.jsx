import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/primitives/Button';
import { Input } from '../../components/primitives/Input';
import { useAuthStore } from '../../stores/authStore';
import './Auth.css';
import './Register.css';

export function Register() {
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    nomeCasa: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validateStep1 = () => {
    const next = {};
    if (!form.nome.trim()) next.nome = 'Informe seu nome.';
    if (!form.email) next.email = 'Informe seu e-mail.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) next.email = 'E-mail inválido.';
    if (!form.senha) next.senha = 'Crie uma senha.';
    else if (form.senha.length < 6) next.senha = 'Senha deve ter ao menos 6 caracteres.';
    if (!form.confirmarSenha) next.confirmarSenha = 'Confirme sua senha.';
    else if (form.senha !== form.confirmarSenha) next.confirmarSenha = 'As senhas não coincidem.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateStep2 = () => {
    const next = {};
    if (!form.nomeCasa.trim()) next.nomeCasa = 'Dê um nome para sua casa.';
    else if (form.nomeCasa.length < 3) next.nomeCasa = 'Nome muito curto.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleNext = () => {
    setSubmitError(null);
    if (validateStep1()) setStep(2);
  };

  const handleBack = () => {
    setErrors({});
    setSubmitError(null);
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validateStep2()) return;

    setLoading(true);
    try {
      await register({
        nome: form.nome.trim(),
        email: form.email.trim(),
        senha: form.senha,
        nomeCasa: form.nomeCasa.trim(),
      });
      navigate('/modulos', { replace: true });
    } catch (err) {
      setSubmitError(err.message || 'Não foi possível criar a conta.');
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
          <h2 className="auth__brand-title">Comece agora</h2>
          <p className="auth__brand-text">
            Crie sua casa em segundos e convide quem mora com você.
            Todos compartilham listas, receitas e lembretes em tempo real.
          </p>
          <ul className="auth__features">
            <li><span aria-hidden="true">✓</span> Cadastro gratuito</li>
            <li><span aria-hidden="true">✓</span> Convide até 10 membros</li>
            <li><span aria-hidden="true">✓</span> Sincronização em tempo real</li>
            <li><span aria-hidden="true">✓</span> Disponível em qualquer dispositivo</li>
          </ul>
        </div>
      </div>

      <div className="auth__panel auth__panel--form">
        <div className="auth__form-wrapper">
          <div className="auth__header">
            <Stepper currentStep={step} totalSteps={2} />
            <h1 className="auth__title">
              {step === 1 ? 'Crie sua conta' : 'Vamos criar sua casa'}
            </h1>
            <p className="auth__subtitle">
              {step === 1
                ? 'Suas informações pessoais.'
                : 'Este será o espaço compartilhado da família.'}
            </p>
          </div>

          <form className="auth__form" onSubmit={handleSubmit} noValidate>
            {submitError && (
              <div className="auth__alert" role="alert">
                {submitError}
              </div>
            )}

            {step === 1 && (
              <>
                <Input
                  label="Nome completo"
                  type="text"
                  placeholder="Maria Silva"
                  autoComplete="name"
                  value={form.nome}
                  onChange={handleChange('nome')}
                  error={errors.nome}
                  isRequired
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
                <Input
                  label="Confirmar senha"
                  type="password"
                  placeholder="Digite novamente"
                  autoComplete="new-password"
                  value={form.confirmarSenha}
                  onChange={handleChange('confirmarSenha')}
                  error={errors.confirmarSenha}
                  isRequired
                />

                <div className="register__actions">
                  <Button
                    type="button"
                    variant="primary"
                    size="large"
                    onClick={handleNext}
                    isBlock
                  >
                    Continuar
                  </Button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="register__house-preview">
                  <div className="register__house-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M3 12 L12 3 L21 12 V20 a1 1 0 0 1 -1 1 H4 a1 1 0 0 1 -1 -1 V12 Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="register__house-text">
                    <strong>Sua casa no Casa Inteligente</strong>
                    <span>Você poderá renomear depois nas configurações.</span>
                  </div>
                </div>

                <Input
                  label="Nome da casa"
                  type="text"
                  placeholder="Ex: Apartamento Centro, Casa da Praia..."
                  value={form.nomeCasa}
                  onChange={handleChange('nomeCasa')}
                  error={errors.nomeCasa}
                  hint="Como você quer chamar esse espaço compartilhado?"
                  isRequired
                  autoFocus
                />

                <div className="register__info-box">
                  <strong>Após criar a conta</strong>
                  <p>Você receberá um <strong>código de convite</strong> para compartilhar
                  com quem mora com você. Eles só precisam informar o código para entrar.</p>
                </div>

                <div className="register__actions register__actions--split">
                  <Button
                    type="button"
                    variant="subtle"
                    size="large"
                    onClick={handleBack}
                    disabled={loading}
                  >
                    Voltar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="large"
                    isLoading={loading}
                    isBlock
                  >
                    Criar casa
                  </Button>
                </div>
              </>
            )}
          </form>

          <p className="auth__footer">
            Já tem uma conta?{' '}
            <Link to="/login" className="auth__link auth__link--bold">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Stepper({ currentStep, totalSteps }) {
  return (
    <div className="stepper" aria-label={`Passo ${currentStep} de ${totalSteps}`}>
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((n) => (
        <div
          key={n}
          className={`stepper__item ${n <= currentStep ? 'stepper__item--active' : ''} ${
            n < currentStep ? 'stepper__item--done' : ''
          }`}
        >
          <span className="stepper__bullet">
            {n < currentStep ? (
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3 8 L7 12 L13 4" stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              n
            )}
          </span>
          {n < totalSteps && <span className="stepper__line" />}
        </div>
      ))}
    </div>
  );
}