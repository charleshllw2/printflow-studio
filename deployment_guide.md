# Deployment Guide: Printflow Studio (AI-Free Version)

This guide outlines how to deploy the updated version of Printflow Studio, which has been converted to a "Human-Powered" more traditional service model.

## Prerequisites

1. **Node.js**: Ensure you have Node.js 18+ installed.
2. **Environment Variables**: Ensure your `.env.local` (or production environment) contains the following keys (non-AI keys are still required for Firebase and Stripe):
    - `NEXT_PUBLIC_FIREBASE_API_KEY`
    - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
    - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
    - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
    - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
    - `NEXT_PUBLIC_FIREBASE_APP_ID`
    - `STRIPE_SECRET_KEY`
    - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
    - `NEXT_PUBLIC_ADMIN_PASSWORD`

## Option 1: Vercel (Recommended)

Next.js projects are easiest to deploy on Vercel.

1. **Push to GitHub**: If you use GitHub, push your changes to your repository.
2. **Import to Vercel**: Go to [vercel.com](https://vercel.com) and import the project.
3. **Environment Variables**: Add the keys listed above in the Vercel project settings.
4. **Deploy**: Vercel will automatically build and deploy your site.

## Option 2: Custom Hosting (e.g., DigitalOcean, AWS, VPS)

If you are using a custom server with the provided `server.js`:

1. **Install Dependencies**:

    ```bash
    npm install
    ```

2. **Build the Project**:

    ```bash
    npm run build
    ```

3. **Start the Server**:
    We recommend using a process manager like `pm2`:

    ```bash
    pm2 start server.js --name "printflow-studio"
    ```

    Or simply:

    ```bash
    NODE_ENV=production node server.js
    ```

## Post-Deployment Verification

1. **Check Landing Page**: Ensure the "AI Motion Studio" buttons are gone and replaced with "Request Motion Design".
2. **Test Motion Art Request**: Upload a file in the Motion Art section and ensure it submits successfully (it should go to Firebase instead of calling an AI API).
3. **Verify Admin Panel**: Log in to the admin panel (`/admin`) and check that you can see the new Motion Art requests under the "Motion Art" tab.

## Support

If you encounter issues with environment variables or build errors, check the logs or contact your technical support lead.
