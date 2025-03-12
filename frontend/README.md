# Grocery List Frontend

A Vue.js application for managing grocery shopping lists.

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment to Vercel

This project is configured for easy deployment to Vercel.

### Automatic Deployment (Recommended)

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import the project in Vercel dashboard: https://vercel.com/new
3. Select the repository and the frontend directory
4. Vercel will automatically detect the Vite configuration
5. Click "Deploy"

### Manual Deployment

If you prefer to deploy manually using Vercel CLI:

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from the frontend directory:
   ```bash
   cd frontend
   vercel
   ```

4. For production deployment:
   ```bash
   vercel --prod
   ```

## Environment Variables

The application uses the following environment variables:

- `VITE_API_URL`: The URL of the backend API (set automatically in production) 