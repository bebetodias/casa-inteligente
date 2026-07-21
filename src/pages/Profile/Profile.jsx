import { useState, useRef } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useToastStore } from '../../hooks/useToast';
import { Avatar } from '../../components/primitives/Avatar';
import './Profile.css';

export function Profile() {
  const { user, updateUser } = useAuthStore();
  const { showToast } = useToastStore();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    nome: user?.nome || '',
    email: user?.email || '',
    senha: '',
    avatar: user?.avatar_url || user?.avatar || ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updatedInfo = {
        nome: formData.nome,
        email: formData.email,
        avatar: formData.avatar
      };
      if (formData.senha) {
        updatedInfo.senha = formData.senha; // In a real app this would be hashed/handled by backend
      }
      await updateUser(updatedInfo);
      showToast('Perfil atualizado com sucesso!', 'success');
      // Limpar senha se houver
      setFormData(prev => ({ ...prev, senha: '' }));
    } catch (err) {
      showToast(err.message || 'Erro ao atualizar perfil.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile">
      <header className="profile__header">
        <h1 className="profile__title">Meu Perfil</h1>
        <p className="profile__subtitle">Gerencie suas informações e preferências</p>
      </header>

      <form className="profile__form" onSubmit={handleSubmit}>
        <div className="profile__avatar-section">
          <Avatar name={formData.nome} src={formData.avatar} size="large" />
          <button 
            type="button" 
            className="profile__avatar-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            Alterar Foto
          </button>
          <input 
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
        </div>

        <div className="profile__field">
          <label htmlFor="nome">Nome</label>
          <input 
            type="text" 
            id="nome" 
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </div>

        <div className="profile__field">
          <label htmlFor="email">E-mail</label>
          <input 
            type="email" 
            id="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="profile__field">
          <label htmlFor="senha">Nova Senha (opcional)</label>
          <input 
            type="password" 
            id="senha" 
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            placeholder="Deixe em branco para manter a atual"
          />
        </div>

        <button 
          type="submit" 
          className="profile__submit-btn"
          disabled={isLoading}
        >
          {isLoading ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  );
}
