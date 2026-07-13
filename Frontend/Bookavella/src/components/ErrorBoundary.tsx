import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '../../@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Atualiza o estado para que a próxima renderização exiba a UI de contingência (fallback)
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // TODO: Injetar ferramenta de monitoramento externa em produção (ex: Sentry.captureException)
    console.error('Bookavella ErrorBoundary capturou uma falha não tratada:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    // Força um recarregamento limpo de rotas como contingência final do navegador
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      // Se houver um fallback customizado específico para a seção, renderiza-o
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Fallback padrão administrativo e de hóspedes
      return (
        <div className="min-h-[250px] w-full border border-border bg-surface p-6 rounded-lg flex flex-col items-center justify-center text-center gap-4 font-body text-text-primary">
          <div className="h-12 w-12 rounded-full bg-error/15 flex items-center justify-center text-error">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-heading font-semibold text-sm">Something went wrong</h3>
            <p className="text-xs text-text-secondary max-w-sm">
              The application crashed while trying to render this section. Our engineering team has been notified.
            </p>
          </div>
          <Button onClick={this.handleReset} variant="outline" className="h-9 text-xs flex items-center gap-1.5 cursor-pointer">
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Try again</span>
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}