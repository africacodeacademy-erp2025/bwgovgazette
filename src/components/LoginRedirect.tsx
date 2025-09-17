import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useStripe } from '@/hooks/useStripe';

export function LoginRedirect() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { createCheckoutSession } = useStripe();

  useEffect(() => {
    if (user) {
      // Check if there's a pending purchase
      const pendingPurchase = sessionStorage.getItem('pendingPurchase');
      
      if (pendingPurchase) {
        const { planType, gazetteId } = JSON.parse(pendingPurchase);
        sessionStorage.removeItem('pendingPurchase');
        
        // Create checkout session
        createCheckoutSession(planType, gazetteId);
      } else {
        // Regular login redirect
        navigate('/dashboard');
      }
    }
  }, [user, navigate, createCheckoutSession]);

  return null;
}