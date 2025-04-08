import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useSelector } from 'react-redux';

// Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StripeCheckout } from '@/components/StripeCheckout';
import { useToast } from '@/hooks/use-toast';

// Stripe
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe';

// State management
import { selectUser, selectProfile } from '@/store/slices/userSlice';

// Pricing plans
const pricingPlans = [
  {
    id: 'free',
    name: 'Free',
    description: 'For individuals just getting started',
    price: 0,
    billingPeriod: 'forever',
    tagline: 'Basic features to get you started',
    tokenAmount: 1000,
    features: [
      'Upload documents up to 10MB',
      '5 personas per document',
      'Basic model (GPT-Mini)',
      'Standard response time',
      'Email support',
    ],
    limitations: [
      'Limited document types (.txt, .doc)',
      'No custom personas',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For professionals who need more power',
    price: 19,
    billingPeriod: 'month',
    tagline: 'Everything in Free, plus:',
    tokenAmount: 10000,
    features: [
      'Upload documents up to 25MB',
      'Unlimited personas per document',
      'Advanced model (GPT-4o)',
      'Priority response time',
      'Priority email support',
      'All document types supported',
      'Document history (30 days)',
    ],
    limitations: [],
    cta: 'Upgrade to Pro',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For teams and businesses with advanced needs',
    price: 49,
    billingPeriod: 'month',
    tagline: 'Everything in Pro, plus:',
    tokenAmount: 30000,
    features: [
      'Upload documents up to 50MB',
      'Custom personas',
      'Premium models (All models)',
      'Immediate response time',
      'Phone & email support',
      'Unlimited document history',
      'API access',
      'Team collaboration',
      'Custom integration',
    ],
    limitations: [],
    cta: 'Contact Sales',
    popular: false,
  },
];

export default function PricingPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = useSelector(selectUser);
  const profile = useSelector(selectProfile);
  const [annual, setAnnual] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<(typeof pricingPlans)[0] | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const handleSubscribe = (plan: typeof pricingPlans[0]) => {
    if (!user) {
      navigate('/auth/login', {
        state: {
          redirectAfterAuth: '/pricing',
          message: 'Please log in to subscribe to a plan'
        }
      });
      return;
    }

    // Set the selected plan and open the checkout modal
    setSelectedPlan(plan);
    setCheckoutOpen(true);
  };

  return (
    <Elements stripe={stripePromise}>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Choose the plan that's right for you and start gaining insights from diverse perspectives.
            </p>

            {/* Billing toggle */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <span className={`text-sm ${!annual ? 'font-medium' : 'text-muted-foreground'}`}>
                Monthly
              </span>
              <button
                type="button"
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  annual ? 'bg-primary' : 'bg-input'
                }`}
                onClick={() => setAnnual(!annual)}
              >
                <span
                  className={`inline-block h-5 w-5 rounded-full bg-background transition-transform ${
                    annual ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm flex items-center gap-2 ${annual ? 'font-medium' : 'text-muted-foreground'}`}>
                Yearly
                <Badge variant="secondary" className="ml-1">Save 20%</Badge>
              </span>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => {
              // Calculate annual price (20% discount)
              const yearlyPrice = plan.price * 12 * 0.8;
              const displayPrice = annual && plan.price > 0 ? yearlyPrice : plan.price;

              return (
                <Card
                  key={plan.id}
                  className={`flex flex-col ${
                    plan.popular ? 'border-primary shadow-lg relative' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                      <Badge>Most Popular</Badge>
                    </div>
                  )}

                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1">
                    <div className="mb-6">
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold">
                          {displayPrice === 0 ? 'Free' : `$${displayPrice}`}
                        </span>
                        {displayPrice > 0 && (
                          <span className="text-muted-foreground ml-2">
                            /{annual ? 'year' : 'month'}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {plan.tokenAmount.toLocaleString()} tokens included
                      </p>
                    </div>

                    <h4 className="font-medium mb-4">{plan.tagline}</h4>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {plan.limitations.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium mb-2 text-muted-foreground">Limitations:</h4>
                        <ul className="space-y-2">
                          {plan.limitations.map((limitation, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-center">
                              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground mr-2" />
                              {limitation}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter>
                    {plan.id === profile?.current_plan ? (
                      <Button disabled className="w-full">Current Plan</Button>
                    ) : (
                      <Button
                        onClick={() => handleSubscribe(plan)}
                        className="w-full"
                        variant={plan.popular ? 'default' : 'outline'}
                      >
                        {plan.cta}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          {/* FAQs */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">What are tokens?</h3>
                <p className="text-muted-foreground">
                  Tokens are the credits you use when processing documents. Each document analysis consumes tokens based on its size, the number of personas selected, and the model used.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Can I upgrade or downgrade at any time?</h3>
                <p className="text-muted-foreground">
                  Yes, you can change your plan at any time. When upgrading, you'll be charged the prorated amount for the remainder of your billing cycle. When downgrading, the changes will take effect at the end of your current billing cycle.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Is there a refund policy?</h3>
                <p className="text-muted-foreground">
                  We offer a 14-day money-back guarantee for all paid plans. If you're not satisfied with our service, contact our support team within 14 days of your purchase for a full refund.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Do unused tokens expire?</h3>
                <p className="text-muted-foreground">
                  Tokens roll over month to month but expire after 12 months from the date they were added to your account.
                </p>
              </div>
            </div>
          </div>

          {/* Call to action */}
          <div className="mt-20 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to gain valuable insights?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Start using ChantriBucket today and see how different perspectives can improve your content.
            </p>
            {user ? (
              <Button asChild size="lg">
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <Button asChild size="lg">
                <Link to="/auth/signup">Create Free Account</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Stripe Checkout Dialog */}
      {selectedPlan && (
        <StripeCheckout
          open={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          plan={selectedPlan}
          isAnnual={annual}
        />
      )}
    </Elements>
  );
}
