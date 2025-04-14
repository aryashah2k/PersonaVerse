import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Grid,
  Divider,
  CircularProgress,
  IconButton,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import TokenIcon from '@mui/icons-material/Token';
import { useUserProfile } from '../../hooks/useUserProfile';

interface TokenDialogProps {
  open: boolean;
  onClose: () => void;
}

const StyledRadio = styled(Radio)(() => ({
  padding: 8,
}));

const PackageCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
}));

const SelectedPackageCard = styled(PackageCard)(({ theme }) => ({
  borderColor: theme.palette.primary.main,
  backgroundColor: theme.palette.action.hover,
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
}));

const tokenPackages = [
  { id: '1', tokens: 100, price: 4.99, popular: false },
  { id: '2', tokens: 500, price: 19.99, popular: true },
  { id: '3', tokens: 1000, price: 34.99, popular: false },
  { id: '4', tokens: 3000, price: 89.99, popular: false },
];

const TokenDialog: React.FC<TokenDialogProps> = ({ open, onClose }) => {
  const { addUserTokens } = useUserProfile();
  const [selectedPackage, setSelectedPackage] = useState('2');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSelectPackage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPackage(event.target.value);
  };

  const handlePurchase = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const packageData = tokenPackages.find(p => p.id === selectedPackage);

      if (!packageData) {
        throw new Error('Invalid package selected');
      }

      // Add tokens in the fake API
      await addUserTokens(packageData.tokens);

      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      setError('Failed to process your purchase. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    // Reset state
    setSuccess(false);
    setError(null);
    setIsProcessing(false);

    // Close dialog
    onClose();
  };

  const selectedPkg = tokenPackages.find(p => p.id === selectedPackage);

  return (
    <Dialog
      open={open}
      onClose={isProcessing ? undefined : handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Purchase Tokens
        <IconButton
          aria-label="close"
          onClick={handleClose}
          disabled={isProcessing}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            Purchase successful! {selectedPkg?.tokens} tokens have been added to your account.
          </Alert>
        ) : (
          <>
            <Typography variant="body1" gutterBottom>
              Tokens are used to generate AI responses. More tokens allow you to create more diverse and detailed survey responses.
            </Typography>

            <Box sx={{ my: 3 }}>
              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  aria-label="token-package"
                  name="token-package"
                  value={selectedPackage}
                  onChange={handleSelectPackage}
                >
                  <Grid container spacing={2}>
                    {tokenPackages.map((pkg) => {
                      const CardComponent = pkg.id === selectedPackage ? SelectedPackageCard : PackageCard;

                      return (
                        <Grid item xs={12} sm={6} key={pkg.id}>
                          <CardComponent>
                            {pkg.popular && (
                              <Chip
                                label="Popular"
                                color="primary"
                                size="small"
                                sx={{
                                  position: 'absolute',
                                  top: -10,
                                  right: 16,
                                }}
                              />
                            )}

                            <FormControlLabel
                              value={pkg.id}
                              control={<StyledRadio />}
                              label={
                                <Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <TokenIcon sx={{ mr: 1, color: 'primary.main' }} />
                                    <Typography variant="h6" component="span">
                                      {pkg.tokens} Tokens
                                    </Typography>
                                  </Box>
                                  <Typography variant="h5" color="primary.main" fontWeight="bold" sx={{ mt: 1 }}>
                                    ${pkg.price}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                    ${(pkg.price / pkg.tokens * 100).toFixed(2)} per 100 tokens
                                  </Typography>
                                </Box>
                              }
                              sx={{ width: '100%', m: 0 }}
                            />
                          </CardComponent>
                        </Grid>
                      );
                    })}
                  </Grid>
                </RadioGroup>
              </FormControl>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" color="text.secondary" paragraph>
              By purchasing tokens, you agree to our Terms of Service and Privacy Policy.
            </Typography>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={handleClose}
          disabled={isProcessing}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handlePurchase}
          disabled={isProcessing || success}
          startIcon={isProcessing ? <CircularProgress size={20} /> : null}
        >
          {isProcessing ? 'Processing...' : `Purchase for $${selectedPkg?.price}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TokenDialog;
