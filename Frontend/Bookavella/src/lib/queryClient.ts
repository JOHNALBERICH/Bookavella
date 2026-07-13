import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { toast } from 'sonner';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos de cache em estado "fresco"
      retry: 1, // Limita a 1 tentativa adicional em caso de falha de conexão
      refetchOnWindowFocus: false, // Desativa atualizações ao focar a aba para evitar consumo desnecessário
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Falha na comunicação com o servidor Bookavella.';
      toast.error(errorMessage);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro ao processar a requisição.';
      toast.error(errorMessage);
    },
  }),
});