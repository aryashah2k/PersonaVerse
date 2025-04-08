import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CreditCard, Loader2 } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

// Stripe
import { createCheckoutSession, redirectToCheckout } from '@/lib/stripe';

// State management
import { selectUser } from '@/store/slices/userSlice';

// Types for the pricing plans
interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingPeriod: string;
  tokenAmount: number;
}

interface StripeCheckoutProps {
  open: boolean;
  onClose: () => void;
  plan: Plan;
  isAnnual: boolean;
}

export function StripeCheckout({ open, onClose, plan, isAnnual }: StripeCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = useSelector(selectUser);

  // Calculate the actual price based on billing period
  const actualPrice = isAnnual ? Math.round(plan.price * 12 * 0.8) : plan.price;
  const billingPeriod = isAnnual ? 'year' : 'month';

  const handleCheckout = async () => {
    if (!user || !user.id) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to continue with your purchase.',
        variant: 'destructive',
      });
      navigate('/auth/login');
      return;
    }

    setLoading(true);

    try {
      // Create a checkout session
      const sessionId = await createCheckoutSession(plan.id, isAnnual, user.id);

      // Redirect to Stripe Checkout
      await redirectToCheckout(sessionId);
    } catch (error) {
      console.error('Checkout error:', error);

      toast({
        title: 'Checkout failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upgrade to {plan.name}</DialogTitle>
          <DialogDescription>
            {isAnnual
              ? `You will be charged $${actualPrice} per year.`
              : `You will be charged $${actualPrice} per month.`}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="rounded-lg border p-4 mb-4">
            <h3 className="text-lg font-medium mb-2">{plan.name} Plan</h3>
            <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Price</span>
              <span className="font-medium">${actualPrice}/{billingPeriod}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm">Tokens</span>
              <span className="font-medium">{plan.tokenAmount.toLocaleString()}</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            By clicking continue, you'll be redirected to Stripe to complete your purchase securely.
          </p>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>

          <Button onClick={handleCheckout} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Continue to Checkout
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
