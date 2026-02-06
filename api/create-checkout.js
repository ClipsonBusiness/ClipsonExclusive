const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if Stripe key is configured
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY is not set');
    return res.status(500).json({ 
      error: 'Server configuration error',
      message: 'STRIPE_SECRET_KEY environment variable is not set'
    });
  }

  try {
    const cookies = req.headers.cookie || '';
    const cookieMatch = cookies.match(/(?:^|;\s*)ca_affiliate_id=([^;]*)/);
    const affiliateId = cookieMatch ? decodeURIComponent(cookieMatch[1]) : null;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'price_1SxA7ELDafoVnYnRP2cB1iLA',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin || 'https://www.clipsonexclusive.com'}/?success=true`,
      cancel_url: `${req.headers.origin || 'https://www.clipsonexclusive.com'}/?canceled=true`,
      metadata: affiliateId ? {
        ca_affiliate_id: affiliateId,
      } : {},
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({ 
      error: 'Failed to create checkout session',
      message: error.message 
    });
  }
};
