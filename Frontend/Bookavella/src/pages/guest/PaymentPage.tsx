import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

export default function PaymentPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Exibe notificação de contexto e direciona ao fluxo de reservas central
    toast.info('Payment processing is securely handled directly within our unified booking checkout flow.');
    navigate('/guest/booking', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-background text-text-primary font-body">
      <div className="flex flex-col items-center space-y-4 max-w-sm text-center">
        {/* Moldura de Acento Champagne Gold */}
        <div className="h-12 w-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent animate-pulse">
          <CreditCard className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-semibold">Redirecting to Checkout...</h3>
          <p className="text-xs text-text-secondary">
            Payment parameters are securely processed within our single-page reservation wizard.
          </p>
        </div>
        <Loader2 className="h-5 w-5 animate-spin text-accent" />
      </div>
    </div>
  );
}