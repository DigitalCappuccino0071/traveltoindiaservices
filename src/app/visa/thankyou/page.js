'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Alert,
} from '@mui/material';
import { ImSpinner2 } from 'react-icons/im';
import { toast } from 'react-hot-toast';
import usePaymentVerification from '@/hooks/usePaymentVerification';

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const orderId = searchParams.get('orderId');
  const sessionId = searchParams.get('session_id');

  const {
    verificationStatus,
    paymentData,
    error,
    retryCount,
    verifyPayment,
    redirectToApplication,
  } = usePaymentVerification(
    sessionId,
    orderId,
    process.env.NEXT_PUBLIC_API_URL
  );

  // Show a message for different verification statuses
  const renderStatusMessage = () => {
    switch (verificationStatus) {
      case 'success':
        return (
          <Alert severity="success" sx={{ mt: 3, mb: 3 }}>
            Payment successful! Your application has been received.
          </Alert>
        );
      case 'error':
        return (
          <Alert severity="error" sx={{ mt: 3, mb: 3 }}>
            {error ||
              "We couldn't verify your payment. Please contact support."}
          </Alert>
        );
      case 'pending':
      default:
        return (
          <Alert severity="info" sx={{ mt: 3, mb: 3 }}>
            Verifying your payment... (Attempt {retryCount + 1})
          </Alert>
        );
    }
  };

  // Rendering logic based on the success parameter
  if (success !== 'true') {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Payment Unsuccessful
          </Typography>
          <Typography variant="body1">
            It seems there was an issue with your payment. Please try again or
            contact support.
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, my: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Thank You for Your Payment
          </Typography>

          {renderStatusMessage()}

          {verificationStatus === 'pending' && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
              <ImSpinner2 className="animate-spin text-3xl" />
            </Box>
          )}

          <Typography variant="body1" sx={{ mb: 4 }}>
            {verificationStatus === 'success'
              ? 'Your India eVisa application has been submitted successfully. We will process your application and send you updates via email.'
              : 'We are processing your payment. Please wait while we verify your transaction.'}
          </Typography>

          {verificationStatus === 'success' && (
            <Button
              variant="contained"
              color="primary"
              onClick={redirectToApplication}
              sx={{ mt: 2 }}
            >
              View Your Application
            </Button>
          )}

          {verificationStatus === 'error' && (
            <Button
              variant="contained"
              color="primary"
              onClick={verifyPayment}
              sx={{ mt: 2 }}
            >
              Retry Verification
            </Button>
          )}

          <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
            Application ID: {orderId}
            <br />
            {sessionId && `Session ID: ${sessionId}`}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
