import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  CircularProgress,
  Switch,
  FormControlLabel,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  IconButton,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import CheckIcon from "@mui/icons-material/Check";
import TokenIcon from "@mui/icons-material/Token";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
import LockIcon from "@mui/icons-material/Lock";
import Layout from "../../components/layout/Layout";
import { pricingService } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  tokenAmount: number;
  features: string[];
  popular?: boolean;
}

interface PaymentFormData {
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  name: string;
}

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: theme.shape.borderRadius * 2,
  transition: "all 0.3s ease",
  position: "relative",
  overflow: "visible",
}));

const PopularBadge = styled(Chip)(() => ({
  position: "absolute",
  top: -12,
  right: 24,
  fontWeight: "bold",
  zIndex: 1,
}));

const FeatureList = styled(List)(() => ({
  padding: 0,
  "& .MuiListItem-root": {
    paddingLeft: 0,
    paddingRight: 0,
  },
}));

const TokenChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  fontSize: "0.9rem",
  fontWeight: "bold",
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(0.5, 0),
}));

const BillingSwitch = styled(FormControlLabel)(({ theme }) => ({
  margin: theme.spacing(4, 0),
  display: "flex",
  justifyContent: "center",
}));

const Pricing: React.FC = () => {
  const theme = useTheme();
  const { isAuthenticated } = useAuth();
  const [annualBilling, setAnnualBilling] = useState(false);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openStripeDialog, setOpenStripeDialog] = useState(false);
  const [paymentFormData, setPaymentFormData] = useState<PaymentFormData>({
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    name: "",
  });
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const pricingPlans = await pricingService.getPricingPlans();
        setPlans(pricingPlans);
      } catch (error) {
        console.error("Failed to fetch pricing plans:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleBillingChange = () => {
    setAnnualBilling(!annualBilling);
  };

  const getAdjustedPrice = (price: number) => {
    const adjusted = annualBilling ? price * 10 : price;
    return Math.ceil(parseFloat(adjusted.toFixed(1)));
  };

  const getBillingLabel = () => {
    return annualBilling ? "/year" : "/month";
  };

  const getDiscountPercentage = () => {
    return 16; // 16% discount for annual billing
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      window.location.href = "/signup";
      return;
    }

    setOpenStripeDialog(true);
  };

  const handlePaymentFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentFormData({
      ...paymentFormData,
      [name]: value,
    });
  };

  const handleStripeSubmit = async () => {
    setPaymentSubmitting(true);
    setPaymentError(null);

    // Validate form
    if (
      !paymentFormData.cardNumber ||
      !paymentFormData.expiryDate ||
      !paymentFormData.cvc ||
      !paymentFormData.name
    ) {
      setPaymentError("Please fill out all fields");
      setPaymentSubmitting(false);
      return;
    }

    // Mock successful payment processing
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setPaymentSuccess(true);

      // Close dialog after showing success message
      setTimeout(() => {
        setOpenStripeDialog(false);
        setPaymentSuccess(false);
        setPaymentFormData({
          cardNumber: "",
          expiryDate: "",
          cvc: "",
          name: "",
        });
      }, 2000);
    } catch (error) {
      setPaymentError("Payment processing failed. Please try again.");
    } finally {
      setPaymentSubmitting(false);
    }
  };

  const handleCloseStripeDialog = () => {
    if (!paymentSubmitting) {
      setOpenStripeDialog(false);
      setPaymentSuccess(false);
      setPaymentError(null);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <Container>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "60vh",
            }}
          >
            <CircularProgress />
          </Box>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ mt: 8, mb: 6, textAlign: "center" }}>
          <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
            Simple, Transparent Pricing
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 700, mx: "auto" }}
          >
            Choose the perfect plan for your needs. All plans include full
            access to our AI-powered persona response generation.
          </Typography>

          <BillingSwitch
            control={
              <Switch
                checked={annualBilling}
                onChange={handleBillingChange}
                color="primary"
              />
            }
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="body1"
                  color={annualBilling ? "primary" : "text.secondary"}
                  fontWeight={annualBilling ? 700 : 400}
                  sx={{ ml: 1 }}
                >
                  Annual
                </Typography>
                <Chip
                  label={`Save ${getDiscountPercentage()}%`}
                  size="small"
                  color="primary"
                  sx={{ ml: 1, height: 20, fontSize: "0.7rem" }}
                  disabled={!annualBilling}
                />
              </Box>
            }
            labelPlacement="end"
          />
        </Box>

        <Grid container spacing={4} alignItems="stretch">
          {plans.map((plan) => (
            <Grid item xs={12} md={4} key={plan.id}>
              <StyledCard
                elevation={plan.popular ? 6 : 1}
                sx={{
                  transform: plan.popular ? "scale(1.05)" : "none",
                  border: plan.popular
                    ? `2px solid ${theme.palette.primary.main}`
                    : "none",
                  zIndex: plan.popular ? 1 : 0,
                  [theme.breakpoints.down("md")]: {
                    transform: "none",
                  },
                }}
              >
                {plan.popular && (
                  <PopularBadge color="primary" label="Most Popular" />
                )}

                <CardHeader
                  title={
                    <Typography variant="h5" component="h2" fontWeight={600}>
                      {plan.name}
                    </Typography>
                  }
                  subheader={
                    <TokenChip
                      icon={<TokenIcon />}
                      label={`${plan.tokenAmount} Tokens`}
                    />
                  }
                  sx={{ pb: 0 }}
                />

                <CardContent sx={{ flexGrow: 1, pb: 0 }}>
                  <Box sx={{ my: 2 }}>
                    <Typography variant="h3" component="p" fontWeight={700}>
                      ${getAdjustedPrice(plan.price)}
                      <Typography
                        component="span"
                        variant="body1"
                        color="text.secondary"
                        fontWeight={400}
                      >
                        {getBillingLabel()}
                      </Typography>
                    </Typography>
                    {plan.price === 0 && (
                      <Typography variant="body2" color="text.secondary">
                        Free forever
                      </Typography>
                    )}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <FeatureList>
                    {plan.features.map((feature, index) => (
                      <ListItem
                        key={index}
                        disableGutters
                        disablePadding
                        sx={{ py: 1 }}
                      >
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckIcon color="primary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary={feature}
                          primaryTypographyProps={{
                            variant: "body2",
                            color: "text.primary",
                          }}
                        />
                      </ListItem>
                    ))}
                  </FeatureList>
                </CardContent>

                <CardActions sx={{ p: 3 }}>
                  {plan.price === 0 ? (
                    <Button
                      fullWidth
                      variant="outlined"
                      size="large"
                      component={RouterLink}
                      to={isAuthenticated ? "/dashboard" : "/signup"}
                      endIcon={<ArrowForwardIcon />}
                      color="primary"
                    >
                      {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      variant={plan.popular ? "contained" : "outlined"}
                      size="large"
                      color="primary"
                      endIcon={<ArrowForwardIcon />}
                      onClick={handleCheckout}
                    >
                      Subscribe Now
                    </Button>
                  )}
                </CardActions>
              </StyledCard>
            </Grid>
          ))}
        </Grid>

        <Paper sx={{ mt: 10, p: 4, borderRadius: 4 }}>
          <Typography
            variant="h5"
            component="h3"
            gutterBottom
            fontWeight={600}
            textAlign="center"
          >
            Need a custom plan for your enterprise?
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            paragraph
            textAlign="center"
          >
            Contact our sales team for volume discounts and custom solutions for
            your organization.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              component="a"
              href="mailto:sales@personaverse.ai"
            >
              Contact Sales
            </Button>
          </Box>
        </Paper>

        {/* Stripe payment dialog */}
        <Dialog
          open={openStripeDialog}
          onClose={handleCloseStripeDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Secure Payment
            <IconButton
              sx={{ position: "absolute", right: 8, top: 8 }}
              onClick={handleCloseStripeDialog}
              disabled={paymentSubmitting}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {paymentSuccess ? (
              <Box sx={{ textAlign: "center", py: 3 }}>
                <CheckIcon
                  sx={{ fontSize: 60, color: "success.main", mb: 2 }}
                />
                <Typography variant="h5" gutterBottom>
                  Payment Successful!
                </Typography>
                <Typography>
                  Your subscription has been activated. Thank you for your
                  purchase!
                </Typography>
              </Box>
            ) : (
              <>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <LockIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">
                    Secure payment through Stripe
                  </Typography>
                </Box>

                {paymentError && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {paymentError}
                  </Alert>
                )}

                <TextField
                  label="Card Number"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="cardNumber"
                  value={paymentFormData.cardNumber}
                  onChange={handlePaymentFormChange}
                  placeholder="1234 5678 9012 3456"
                  disabled={paymentSubmitting}
                  InputProps={{
                    inputProps: {
                      maxLength: 19,
                    },
                  }}
                />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="Expiry Date"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      name="expiryDate"
                      value={paymentFormData.expiryDate}
                      onChange={handlePaymentFormChange}
                      placeholder="MM/YY"
                      disabled={paymentSubmitting}
                      InputProps={{
                        inputProps: {
                          maxLength: 5,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="CVC"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      name="cvc"
                      value={paymentFormData.cvc}
                      onChange={handlePaymentFormChange}
                      placeholder="123"
                      disabled={paymentSubmitting}
                      InputProps={{
                        inputProps: {
                          maxLength: 3,
                        },
                      }}
                    />
                  </Grid>
                </Grid>

                <TextField
                  label="Cardholder Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="name"
                  value={paymentFormData.name}
                  onChange={handlePaymentFormChange}
                  placeholder="John Smith"
                  disabled={paymentSubmitting}
                />

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mt: 2 }}
                >
                  Your payment is secured with SSL encryption. We never store
                  your card details.
                </Typography>
              </>
            )}
          </DialogContent>
          {!paymentSuccess && (
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button
                disabled={paymentSubmitting}
                onClick={handleCloseStripeDialog}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleStripeSubmit}
                disabled={paymentSubmitting}
                startIcon={
                  paymentSubmitting ? <CircularProgress size={20} /> : null
                }
              >
                {paymentSubmitting ? "Processing..." : "Pay Now"}
              </Button>
            </DialogActions>
          )}
        </Dialog>
      </Container>
    </Layout>
  );
};

export default Pricing;
