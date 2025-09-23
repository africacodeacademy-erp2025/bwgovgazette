import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { user } = useAuth();

  useEffect(() => {
    if (sessionId && user) {
      const sendReceipt = async () => {
        try {
          const { error } = await supabase.functions.invoke('send-payment-receipt', {
            body: {
              email: user.email,
              name: user.user_metadata?.full_name || 'Valued Customer'
            },
          });
          if (error) throw error;
        } catch (error) {
          console.error('Failed to send payment receipt:', error);
          toast.error('Could not send payment receipt email.');
        }
      };
      sendReceipt();
    }
  }, [sessionId, user]);

  useEffect(() => {
    // Always attempt to fix state and redirect on entry
    if (sessionId) {
      toast.success('Payment successful! Welcome to your new plan.');
      localStorage.setItem('plan_choice', 'subscriber');
      const timer = setTimeout(() => {
        window.location.replace('/dashboard?session_id=' + sessionId);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      // Fallback: if we landed here without session id, just go home
      const timer = setTimeout(() => {
        navigate('/', { replace: true });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [sessionId, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-card border rounded-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
        
        <p className="text-muted-foreground mb-8">
          Thank you for your purchase. Your subscription is now active and you can start accessing your benefits immediately.
        </p>
        
        <div className="space-y-4">
          <Button 
            onClick={() => navigate('/dashboard')} 
            className="w-full"
          >
            Go to Dashboard
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="w-full"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}