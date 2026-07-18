import { create } from 'zustand';
import { supabase } from '../lib/supabase';

// Função auxiliar para buscar a casa e membros do usuário
async function fetchUserCasa(userId) {
  // 1. Descobrir a qual casa o usuário pertence
  const { data: memberData, error: memberError } = await supabase
    .from('membros_casa')
    .select('casa_id')
    .eq('user_id', userId)
    .single();

  if (memberError || !memberData) return null;

  const casaId = memberData.casa_id;

  // 2. Buscar dados da casa
  const { data: casaData, error: casaError } = await supabase
    .from('casas')
    .select('*')
    .eq('id', casaId)
    .single();

  if (casaError) return null;

  // 3. Buscar os membros desta casa
  const { data: allMembers, error: allMembersError } = await supabase
    .from('membros_casa')
    .select(`
      user_id, 
      profiles ( nome, avatar_url )
    `)
    .eq('casa_id', casaId);

  if (allMembersError) return null;

  const membros = allMembers.map(m => ({
    id: m.user_id,
    nome: m.profiles?.nome,
    avatar: m.profiles?.avatar_url
  }));

  return {
    ...casaData,
    membros
  };
}

export const useAuthStore = create((set, get) => ({
  user: null,
  casa: null,
  isAuthenticated: false,
  isInitialized: false,

  init: async () => {
    // Buscar sessão atual
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      const casa = await fetchUserCasa(session.user.id);
      
      set({ 
        user: { ...session.user, ...profile, email: session.user.email }, 
        casa, 
        isAuthenticated: true,
        isInitialized: true 
      });
    } else {
      set({ isInitialized: true, isAuthenticated: false, user: null, casa: null });
    }

    // Escutar mudanças de autenticação (login, logout, refresh)
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        const casa = await fetchUserCasa(session.user.id);
        
        set({ 
          user: { ...session.user, ...profile, email: session.user.email }, 
          casa, 
          isAuthenticated: true 
        });
      } else {
        set({ user: null, casa: null, isAuthenticated: false });
      }
    });
  },

  login: async ({ email, senha }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });
    if (error) throw new Error(error.message);
    return data;
  },

  register: async ({ nome, email, senha, nomeCasa }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: { nome } // Trigger do DB vai criar o profile com este nome
      }
    });
    
    if (error) throw new Error(error.message);
    if (!data.user) throw new Error("Erro ao criar usuário. Verifique seu email.");

    // Criar a casa
    const { data: newCasa, error: casaError } = await supabase
      .from('casas')
      .insert([{ nome: nomeCasa || `${nome}'s Home` }])
      .select()
      .single();

    if (casaError) throw new Error("Usuário criado, mas erro ao criar casa: " + casaError.message);

    // Vincular usuário à casa
    const { error: membroError } = await supabase
      .from('membros_casa')
      .insert([{ user_id: data.user.id, casa_id: newCasa.id }]);

    if (membroError) throw new Error("Erro ao vincular usuário à casa.");

    return data;
  },

  generateInvite: async (casaId) => {
    const token = `tk_${Math.random().toString(36).slice(2)}`;
    const codigo = Math.random().toString(36).slice(2, 8).toUpperCase();
    
    const { data, error } = await supabase
      .from('casas')
      .update({ codigo_convite: codigo, token_convite: token })
      .eq('id', casaId)
      .select()
      .single();

    if (error) throw new Error("Erro ao gerar convite: " + error.message);

    const currentCasa = get().casa;
    if (currentCasa && currentCasa.id === casaId) {
       set({ casa: { ...currentCasa, codigo_convite: codigo, token_convite: token } });
    }

    return {
      codigo: data.codigo_convite,
      token: data.token_convite,
      link: `${window.location.origin}${window.location.pathname}#/convite/${data.token_convite}`,
    };
  },

  validateInvite: async (codigoOuToken) => {
    const termo = codigoOuToken.trim();
    const ehToken = termo.startsWith('tk_');
    
    let query = supabase.from('casas').select('*');
    if (ehToken) {
      query = query.eq('token_convite', termo);
    } else {
      query = query.eq('codigo_convite', termo.toUpperCase());
    }

    const { data, error } = await query.single();

    if (error || !data) {
      throw new Error('Convite inválido ou expirado.');
    }

    return { codigo: data.codigo_convite, token: data.token_convite, casa: data };
  },

  acceptInvite: async ({ codigo, nome, email, senha }) => {
    const { casa } = await get().validateInvite(codigo);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: senha,
      options: { data: { nome } }
    });

    if (authError) throw new Error(authError.message);
    if (!authData.user) throw new Error("Erro ao criar usuário.");

    const { error: membroError } = await supabase
      .from('membros_casa')
      .insert([{ user_id: authData.user.id, casa_id: casa.id }]);

    if (membroError) throw new Error("Erro ao entrar na casa.");

    return authData;
  },

  updateUser: async (updatedData) => {
    const currentUser = get().user;
    if (!currentUser) throw new Error('Nenhum usuário logado.');

    let newAvatarUrl = currentUser.avatar_url || currentUser.avatar; // compatibility
    
    if (updatedData.avatar && updatedData.avatar.startsWith('data:image')) {
      const base64Data = updatedData.avatar.split(',')[1];
      const contentType = updatedData.avatar.match(/data:(.*?);/)[1];
      const byteCharacters = atob(base64Data);
      const byteArrays = [];
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays.push(byteCharacters.charCodeAt(i));
      }
      const blob = new Blob([new Uint8Array(byteArrays)], { type: contentType });
      const fileExt = contentType.split('/')[1];
      const fileName = `${currentUser.id}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, blob, { upsert: true });

      if (uploadError) {
         throw new Error("Erro ao fazer upload da imagem. O bucket 'avatars' existe? " + uploadError.message);
      }

      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
        
      newAvatarUrl = publicUrlData.publicUrl;
    }

    // Update Profile DB
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .update({ nome: updatedData.nome, avatar_url: newAvatarUrl })
      .eq('id', currentUser.id)
      .select()
      .single();

    if (profileError) throw new Error(profileError.message);

    // Update Auth Email/Password
    if (updatedData.email !== currentUser.email || updatedData.senha) {
      const updates = {};
      if (updatedData.email !== currentUser.email) updates.email = updatedData.email;
      if (updatedData.senha) updates.password = updatedData.senha;

      const { error: authUpdateError } = await supabase.auth.updateUser(updates);
      if (authUpdateError) throw new Error(authUpdateError.message);
    }

    const newUser = { ...currentUser, ...profileData, email: updatedData.email || currentUser.email };
    set({ user: newUser });
    
    return newUser;
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, casa: null, isAuthenticated: false });
  },
}));