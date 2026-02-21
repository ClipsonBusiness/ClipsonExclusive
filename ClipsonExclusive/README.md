# ClipSon Exclusive Funnel - Affiliate System

A comprehensive affiliate marketing system built with Next.js, Prisma, PostgreSQL, and Stripe Connect for automated payouts.

## Features

- **Affiliate Registration & Login**: Secure authentication system
- **Referral Tracking**: Unique referral links with click tracking
- **Sales Attribution**: Automatic commission calculation (30%)
- **Stripe Connect Integration**: Automated payouts to affiliates
- **Dashboard**: Real-time statistics and earnings tracking
- **Webhook Processing**: Automatic sale attribution and payout status updates

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Custom email/password auth with bcrypt
- **Payments**: Stripe Connect for affiliate payouts
- **Styling**: Tailwind CSS with custom gradients

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/clipson_funnel"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret-key-here"
NEXTAUTH_URL="

# Stripe
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# Stripe Connect
STRIPE_CONNECT_CLIENT_ID="ca_your_stripe_connect_client_id"
```

### 2. Database Setup

1. Install PostgreSQL and create a database
2. Run Prisma migrations:

```bash
npx prisma migrate dev --name init
```

3. Generate Prisma client:

```bash
npx prisma generate
```

### 3. Stripe Setup

1. Create a Stripe account and get your API keys
2. Set up Stripe Connect for affiliate payouts
3. Configure webhook endpoints:
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `transfer.created`, `transfer.paid`, `transfer.failed`

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Development Server

```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new affiliate
- `POST /api/auth/login` - Affiliate login

### Affiliate Dashboard
- `GET /api/affiliates/dashboard` - Get affiliate statistics
- `POST /api/affiliates/payout` - Request payout
- `POST /api/affiliates/connect-stripe` - Connect Stripe account
- `POST /api/affiliates/track` - Track referral clicks

### Webhooks
- `POST /api/webhooks/stripe` - Stripe webhook handler

## Pages

- `/` - Main landing page with referral tracking
- `/affiliates/login` - Affiliate login page
- `/affiliates/signup` - Affiliate registration page
- `/affiliates/dashboard` - Affiliate dashboard

## Database Schema

### Users
- Basic user information (email, password, name)

### Affiliates
- Username (unique referral identifier)
- Stripe Connect account ID
- Earnings and statistics
- Pending payout amount

### Sales
- Tracked sales with commission calculations
- Stripe session ID for reference
- Sale metadata

### Payouts
- Payout history and status tracking
- Stripe payout ID for reference

## Referral System

1. **Referral Links**: Each affiliate gets a unique link like `/?ref=username`
2. **Click Tracking**: Visits to referral links increment click counts
3. **Sale Attribution**: When a purchase is made, the referral is stored in Stripe metadata
4. **Commission Calculation**: 30% of each sale is credited to the referring affiliate
5. **Automated Payouts**: Affiliates can request payouts through Stripe Connect

## Security Features

- Password hashing with bcrypt
- Input validation on all API routes
- Stripe webhook signature verification
- Secure session management

## Production Deployment

1. Set up a PostgreSQL database (e.g., Supabase, Railway, or AWS RDS)
2. Configure environment variables for production
3. Set up Stripe webhooks with your production domain
4. Deploy to Vercel, Netlify, or your preferred hosting platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is proprietary and confidential. 