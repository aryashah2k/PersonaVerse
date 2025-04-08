import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

// Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

// State management
import { selectUser, updateUserProfile } from '@/store/slices/userSlice';
import { AppDispatch } from '@/store';

// Stripe
import { simulateSuccessfulPayment } from '@/lib/stripe';

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const user = useSelector(selectUser);

  // Loading and success states
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Get the session_id and plan_id from the URL
  const sessionId = searchParams.get('session_id');
  const planId = searchParams.get('plan_id');
  const isAnnual = searchParams.get('annual') === 'true';

  useEffect(() => {
    // This would be where we'd validate the payment with our backend
    // For now, we'll simulate a successful payment
    const validatePayment = async () => {
      if (!sessionId || !planId || !user?.id) {
        setLoading(false);
        setError('Invalid payment session. Please try again.');
        return;
      }

      try {
        setLoading(true);

        // Simulate a payment validation with the backend
        const paymentSuccessful = await simulateSuccessfulPayment(planId, user.id);

        if (paymentSuccessful) {
          // Update the user's plan in Redux
          await dispatch(updateUserProfile({
            userId: user.id,
            updates: {
              current_plan: planId,
              // Add tokens based on the plan
              tokens_left: planId === 'pro' ? 10000 : planId === 'enterprise' ? 30000 : 1000,
            }
          })).unwrap();

          setSuccess(true);

          toast({
            title: 'Payment Successful',
            description: `Your subscription to the ${planId.charAt(0).toUpperCase() + planId.slice(1)} plan was successful.`,
          });
        } else {
          setError('Payment validation failed. Please contact support.');
        }
      } catch (err) {
        console.error('Error validating payment:', err);
        setError('An error occurred while validating your payment. Please contact support.');
      } finally {
        setLoading(false);
      }
    };

    validatePayment();
  }, [sessionId, planId, user, dispatch, toast]);

  return (
    <div className="container mx-auto py-12 px-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {loading ? 'Processing Your Payment' : success ? 'Payment Successful!' : 'Payment Issue'}
          </CardTitle>
          <CardDescription className="text-center">
            {loading
              ? 'Please wait while we confirm your payment...'
              : success
              ? 'Your subscription has been activated'
              : 'We encountered an issue with your payment'}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center py-8">
          {loading ? (
            // Loading spinner
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary" />
          ) : success ? (
            // Success message
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 mx-auto w-fit mb-6">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>

              <h3 className="text-xl font-medium mb-4">Thank you for your subscription!</h3>

              <p className="text-muted-foreground mb-6">
                Your {planId && planId.charAt(0).toUpperCase() + planId.slice(1)} plan is now active.
                You can now enjoy all the benefits of your subscription.
              </p>

              <div className="border rounded-lg p-4 bg-muted/30 mb-6">
                <h4 className="font-medium mb-2">Subscription Details:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>Plan:</span>
                    <span className="font-medium">{planId && planId.charAt(0).toUpperCase() + planId.slice(1)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Billing Period:</span>
                    <span className="font-medium">{isAnnual ? 'Annual' : 'Monthly'}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Status:</span>
                    <span className="text-green-600 font-medium">Active</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            // Error message
            <div className="text-center">
              <div className="bg-red-100 rounded-full p-4 mx-auto w-fit mb-6">
                <svg className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <h3 className="text-xl font-medium mb-4">Payment Error</h3>

              <p className="text-muted-foreground mb-6">
                {error || 'An error occurred while processing your payment. Please try again or contact support.'}
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button
            onClick={() => navigate('/dashboard')}
            disabled={loading}
          >
            {success ? (
              <>
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : error ? (
              'Return to Dashboard'
            ) : (
              'Please wait...'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
