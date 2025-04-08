import { loadStripe } from '@stripe/stripe-js';

// Replace with your Stripe publishable key
// In a real app, this would come from an environment variable
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51OrtdvDjFq9RZn1QVK0tg3Oe49oTMPrCTnVBdG3vDcq22fwRHtfr8vPNFnGYqRkm1bxZfvvwrHU8JqW28STdHOUc00NTMCzEXe';

// Initialize Stripe
export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

/**
 * Creates a checkout session for the specified plan
 * @param planId - The ID of the plan to purchase
 * @param isAnnual - Whether the plan is annual (vs monthly)
 * @returns The session ID
 */
export const createCheckoutSession = async (
  planId: string,
  isAnnual: boolean,
  userId: string
): Promise<string> => {
  try {
    // In a real application, this would be an API call to your backend
    // which would create a Stripe checkout session server-side

    // For now, we'll simulate a successful response
    // This would normally come from your server after creating a checkout session
    console.log(`Creating checkout session for plan: ${planId}, annual: ${isAnnual}, user: ${userId}`);

    // Simulated checkout session ID
    return `cs_test_${Math.random().toString(36).substring(2, 15)}`;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new Error('Failed to create checkout session. Please try again.');
  }
};

/**
 * Redirects to Stripe Checkout with the given session ID
 * @param sessionId - The Stripe Checkout session ID
 */
export const redirectToCheckout = async (sessionId: string): Promise<void> => {
  try {
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe failed to initialize');
    }

    // Redirect to checkout
    const { error } = await stripe.redirectToCheckout({
      sessionId,
    });

    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
    throw error;
  }
};

// Function to simulate a Stripe webhook processing a successful payment
// In a real app, this would be handled by your backend
export const simulateSuccessfulPayment = async (
  planId: string,
  userId: string
): Promise<boolean> => {
  console.log(`Processing successful payment for plan: ${planId}, user: ${userId}`);
  // In a real app, this would update the user's plan in your database
  return true;
};
