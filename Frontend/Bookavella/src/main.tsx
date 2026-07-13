import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '../@/components/ui/sonner';
import App from './App';

// Importação das diretivas CSS e variáveis do Tailwind CSS v4
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Fornece gerenciamento de estado de rede e cache (TanStack Query v5) */}
    <QueryClientProvider client={queryClient}>
      
      {/* Fornece controle de tema de luxo (Obsidian/Gold) */}
      <ThemeProvider>
        
        {/* Fornece controle de autenticação e sessão local */}
        <AuthProvider>
          
          {/* Exibidor global de alertas modernos do Sonner adaptado ao tema ativo */}
          <Toaster position="top-right" closeButton richColors={false} />
          
          {/* Inicializador do roteador principal do aplicativo */}
          <App />
          
        </AuthProvider>
      </ThemeProvider>
      
    </QueryClientProvider>
  </StrictMode>
);