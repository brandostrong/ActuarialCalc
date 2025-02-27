# Deploying to GitHub Pages

This document outlines the steps to deploy your ActuarialCalc application to GitHub Pages.

## Prerequisites

- A GitHub account
- Your project pushed to a GitHub repository
- Git installed on your local machine

## Step 1: Install the gh-pages package

The `gh-pages` package simplifies the deployment process to GitHub Pages.

```bash
npm install gh-pages --save-dev
# or
yarn add gh-pages --dev
```

## Step 2: Update vite.config.ts

You need to update your Vite configuration to set the correct base path for GitHub Pages. The base path should match your repository name.

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/ActuarialCalc/', // Replace with your repository name
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
```

## Step 3: Update package.json

Add deployment scripts to your package.json file:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

## Step 4: Deploy to GitHub Pages

Run the deploy script to publish your site to GitHub Pages:

```bash
npm run deploy
# or
yarn deploy
```

This will:
1. Build your project (via the predeploy script)
2. Create a `gh-pages` branch in your repository (if it doesn't exist)
3. Push the contents of the `dist` directory to the `gh-pages` branch
4. Configure GitHub Pages to serve your site from this branch

## Step 5: Configure GitHub Pages in Repository Settings

1. Go to your GitHub repository
2. Click on "Settings"
3. Navigate to "Pages" in the sidebar
4. Under "Source", ensure "Deploy from a branch" is selected
5. Select the "gh-pages" branch and "/ (root)" folder
6. Click "Save"

## Step 6: Access Your Deployed Site

Your site will be available at:
```
https://[your-github-username].github.io/ActuarialCalc/
```

Replace `[your-github-username]` with your actual GitHub username and `ActuarialCalc` with your repository name.

## Optional: Set Up GitHub Actions for Automated Deployment

For automated deployments, you can set up a GitHub Actions workflow:

1. Create a directory `.github/workflows` in your project root
2. Create a file `deploy.yml` in this directory with the following content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]  # Set this to your default branch

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 16
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: dist
          branch: gh-pages
```

This workflow will automatically deploy your site to GitHub Pages whenever you push to the main branch.

## Troubleshooting

### 404 Errors on Routes

If you're using React Router and getting 404 errors when navigating to routes directly or refreshing, you need to:

1. Create a `404.html` file in the `public` directory that redirects to your index.html
2. Add a script to your index.html that handles the redirect

Or, use hash routing in your React Router configuration:

```jsx
import { HashRouter as Router } from 'react-router-dom';

// Use HashRouter instead of BrowserRouter
<Router>
  {/* Your routes */}
</Router>
```

### Custom Domain

If you want to use a custom domain:

1. Add a CNAME file to your `public` directory with your domain name
2. Update the DNS settings with your domain provider
3. Configure the custom domain in your GitHub repository settings