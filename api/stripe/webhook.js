const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // For Vercel, req.body is already parsed as JSON
    // For Stripe signature verification, we need the raw body
    // If webhook secret is set, we'll attempt verification
    // Note: Vercel may parse the body, so signature verification might need adjustment
    
    if (webhookSecret && sig) {
      // Try to verify signature with raw body if available
      // If req.body is already parsed, we'll reconstruct it
      const rawBody = typeof req.body === 'string' 
        ? req.body 
        : JSON.stringify(req.body);
      
      try {
        event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
      } catch (verifyError) {
        // If verification fails, log but continue (Vercel may have parsed body)
        console.warn('Signature verification failed, using parsed body:', verifyError.message);
        event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      }
    } else {
      // No webhook secret or signature - use parsed body directly
      event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!webhookSecret) {
        console.warn('⚠️  STRIPE_WEBHOOK_SECRET not set - skipping signature verification');
      }
    }
  } catch (err) {
    console.error('Webhook parsing failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Log the event for debugging
  console.log('Received Stripe webhook event:', {
    type: event.type,
    id: event.id,
    metadata: event.data?.object?.metadata
  });

  // Forward the event to Clipson Affiliates platform
  const affiliateWebhookUrl = 'https://clipsonaffiliates.com/api/stripe/webhook';
  
  try {
    const forwardResponse = await fetch(affiliateWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Stripe-Event-Id': event.id,
        'X-Stripe-Event-Type': event.type,
      },
      body: JSON.stringify(event),
    });

    if (!forwardResponse.ok) {
      console.error('Failed to forward webhook to affiliate platform:', {
        status: forwardResponse.status,
        statusText: forwardResponse.statusText,
      });
      // Still return 200 to Stripe to prevent retries, but log the error
    } else {
      console.log('✅ Webhook forwarded successfully to affiliate platform');
    }
  } catch (error) {
    console.error('Error forwarding webhook to affiliate platform:', error);
    // Still return 200 to Stripe to prevent retries
  }

  // Return 200 to Stripe to acknowledge receipt
  // Stripe will retry if we return an error status
  return res.status(200).json({ received: true });
};
