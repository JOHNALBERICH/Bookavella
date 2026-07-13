import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '../../@/components/ui/button';

interface QueryErrorProps {
  error: Error | null;
  onRetry: () => void;
}

export default function QueryError({ error, onRetry }: QueryErrorProps) {
  return (
    <div className="p-6 border border-dashed border-error/30 rounded-lg bg-error/5 flex flex-col items-center justify-center text-center gap-4 font-body text-text-primary animate-in fade-in duration-normal">
      <div className="h-10 w-10 rounded-full bg-error/15 flex items-center justify-center text-error">
        <AlertCircle className="h-5 w-5" />
      </div>
      <div className="space-y-1">
        <h4 className="font-semibold text-sm">Failed to sync data</h4>
        <p className="text-xs text-text-secondary max-w-xs leading-relaxed">
          {error?.message || 'There was a communication problem with the server. Please check your connection.'}
        </p>
      </div>
      <Button 
        onClick={onRetry} 
        variant="outline" 
        className="h-8 text-xs flex items-center gap-1.5 cursor-pointer border-error/20 hover:bg-error/10 text-error focus:outline-none"
      >
        <RotateCcw className="h-3 w-3" />
        <span>Retry Connection</span>
      </Button>
    </div>
  );
}