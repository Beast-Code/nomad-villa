# Deployment Guide - Nomad Villa

This guide covers deploying Nomad Villa to Vercel.

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- Supabase project set up
- Razorpay account configured

## Step-by-Step Deployment

### 1. Prepare Your Code

Ensure all environment variables are documented in `.env.local` (not committed to git).

### 2. Push to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 3. Deploy to Vercel

1. **Sign in to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub

2. **Create New Project**
   - Click "Add New..." > "Project"
   - Import your GitHub repository
   - Select the repository

3. **Configure Project**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```

   **Important**: Add these for all environments (Production, Preview, Development)

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (2-3 minutes)

### 4. Post-Deployment Configuration

#### Update Supabase RLS Policies

If needed, update RLS policies in Supabase to allow your Vercel domain.

#### Update Razorpay Settings

1. Go to Razorpay Dashboard
2. Update callback URLs if needed
3. For production, switch from test mode to live mode

#### Test the Deployment

1. Visit your Vercel URL
2. Test public pages (landing, villas listing)
3. Test admin login
4. Test booking flow (use test mode)

### 5. Custom Domain (Optional)

1. Go to Vercel Project Settings > Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_APP_URL` with custom domain

## Environment-Specific Configuration

### Production
- Use production Supabase project
- Use live Razorpay keys
- Set `NEXT_PUBLIC_APP_URL` to production domain

### Preview (Staging)
- Can use test Supabase project
- Use test Razorpay keys
- Auto-generated preview URLs

## Monitoring

### Vercel Analytics
- Enable in Project Settings > Analytics
- Monitor performance and errors

### Supabase Dashboard
- Monitor database usage
- Check authentication logs
- Review API usage

### Razorpay Dashboard
- Monitor transactions
- Check webhook logs
- Review payment analytics

## Rollback

If deployment fails:

1. Go to Vercel Dashboard > Deployments
2. Find previous successful deployment
3. Click "..." > "Promote to Production"

## Continuous Deployment

Vercel automatically deploys on every push to:
- `main` branch → Production
- Other branches → Preview deployments

## Troubleshooting

### Build Failures
- Check build logs in Vercel
- Verify all dependencies are in `package.json`
- Ensure TypeScript errors are fixed

### Runtime Errors
- Check Vercel Function logs
- Verify environment variables are set
- Check Supabase connection

### Payment Issues
- Verify Razorpay keys are correct
- Check webhook configuration
- Review Razorpay dashboard logs

## Security Checklist

- [ ] Environment variables are set in Vercel (not in code)
- [ ] Service role key is not exposed
- [ ] RLS policies are configured correctly
- [ ] HTTPS is enabled (automatic with Vercel)
- [ ] Admin routes are protected
- [ ] Payment verification is server-side only

## Performance Optimization

1. **Image Optimization**
   - Use Next.js Image component
   - Optimize images before upload
   - Consider CDN for images

2. **Database Optimization**
   - Add indexes for frequently queried fields
   - Use pagination for large lists
   - Cache frequently accessed data

3. **Code Optimization**
   - Enable Vercel Edge Functions if needed
   - Use React Server Components
   - Minimize client-side JavaScript

---

Your app should now be live! 🎉
