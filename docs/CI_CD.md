# GitHub Actions CI/CD Pipeline

Automated testing, building, and deployment for CoachSwap.

## Workflows

### 1. Run Tests on Push

File: `.github/workflows/test.yml`

Automatically runs tests when code is pushed to any branch.

**Triggers:**
- Push to any branch
- Pull requests

**Steps:**
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Lint code
5. Run backend tests
6. Run frontend tests

### 2. Build on Main Branch

File: `.github/workflows/build.yml`

Builds production artifacts when merged to main.

**Triggers:**
- Push to main branch

**Steps:**
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Build backend
5. Build frontend
6. Upload artifacts

### 3. Deploy to Production

File: `.github/workflows/deploy.yml`

Automated deployment to production.

**Triggers:**
- Release created
- Manual dispatch

**Backend Deployment:**
- Deploy to Heroku/Railway/Render
- Run database migrations
- Health check

**Frontend Deployment:**
- Deploy to Vercel/Netlify
- Invalidate CDN cache
- Verify deployment

## Setting Up CI/CD

### 1. Create GitHub Secrets

Go to `Settings > Secrets and variables > Actions`

Add these secrets:

```
# Backend
BACKEND_DATABASE_URL=postgresql://...
BACKEND_JWT_SECRET=your_secret_key
BACKEND_STRIPE_SECRET=sk_test_...

# Deployment
HEROKU_API_KEY=your_heroku_api_key
VERCEL_TOKEN=your_vercel_token
AWS_ACCESS_KEY=your_aws_key
AWS_SECRET_KEY=your_aws_secret
```

### 2. Create Workflow Files

Workflow files are in `.github/workflows/`

---

## Manual Testing Before Deployment

```bash
# Backend
cd backend
npm test
npm run lint

# Frontend
cd frontend
npm test
npm run lint

# Build check
npm run build
```

## Monitoring Deployments

1. Check GitHub Actions tab for workflow status
2. View logs for any failures
3. Monitor production via Sentry/DataDog
4. Set up alerts for critical errors

## Rollback Procedure

If deployment fails:

1. Revert commit: `git revert <commit_hash>`
2. Push to main: `git push origin main`
3. Verify rollback completed
4. Investigate issue in development branch
5. Re-deploy when fixed
