import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '@/types';

// Interface representando o estado síncrono interno de autenticação
export interface AuthState {
  currentUser: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Interface estendida expondo as capacidades e mutadores globais do contexto
export interface AuthContextValue extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Inicializa o estado diretamente do localStorage para sincronização imediata
  const [state, setState] = useState<AuthState>(() => {
    const token = localStorage.getItem('bookavella_token');
    const userJson = localStorage.getItem('bookavella_user');
    let currentUser: User | null = null;

    if (token && userJson) {
      try {
        currentUser = JSON.parse(userJson) as User;
        return {
          currentUser,
          token,
          isAuthenticated: true,
          isLoading: false,
        };
      } catch {
        // Trata chaves locais corrompidas limpando o armazenamento
        localStorage.removeItem('bookavella_token');
        localStorage.removeItem('bookavella_user');
      }
    }

    return {
      currentUser: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    };
  });

  // Listener para sincronização multi-abas em tempo real (Storage Event)
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'bookavella_token' && !event.newValue) {
        // Se o token foi removido em outra aba, desloga a sessão localmente
        setState({
          currentUser: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Mutador: Efetua o login salvando o JWT e o Perfil reativamente
  const login = useCallback((token: string, user: User) => {
    localStorage.setItem('bookavella_token', token);
    localStorage.setItem('bookavella_user', JSON.stringify(user));

    setState({
      currentUser: user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  // Mutador: Limpa a sessão de forma atômica
  const logout = useCallback(() => {
    localStorage.removeItem('bookavella_token');
    localStorage.removeItem('bookavella_user');

    setState({
      currentUser: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  // Mutador: Atualiza o cadastro do usuário atual de forma incremental (Ex: upload de avatar ou perfil)
  const updateUser = useCallback((updatedFields: Partial<User>) => {
    setState((prevState) => {
      if (!prevState.currentUser) return prevState;

      const mergedUser = { ...prevState.currentUser, ...updatedFields };
      localStorage.setItem('bookavella_user', JSON.stringify(mergedUser));

      return {
        ...prevState,
        currentUser: mergedUser,
      };
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook Customizado de Consumo Prático com Validação de Escopo
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth deve ser utilizado obrigatoriamente dentro de um AuthProvider');
  }
  
  return context;
}