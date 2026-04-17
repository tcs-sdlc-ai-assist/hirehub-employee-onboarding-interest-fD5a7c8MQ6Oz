# Deployment Guide

## Platform

This application is deployed on **Vercel** as a static Single Page Application (SPA) built with Vite and React.

---

## Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- A [Vercel](https://vercel.com) account linked to your Git repository

---

## Build Command

```bash
npm run build
```

This runs the Vite production build and outputs optimized static assets.

---

## Output Directory

```
dist
```

Vite outputs all compiled files (HTML, JS, CSS, and static assets) into the `dist` directory. When configuring the project on Vercel, set the **Output Directory** to `dist`.

---

## Vercel Configuration

A `vercel.json` file is included in the project root to handle SPA routing:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Why rewrites are needed

This is a client-side routed SPA. When a user navigates to a route like `/submissions` and refreshes the browser, the server receives a request for `/submissions`. Without the rewrite rule, Vercel would return a 404 because no physical file exists at that path. The rewrite rule ensures that **all requests** are served by `index.html`, allowing React Router to handle routing on the client side.

---

## Environment Variables

**None required.** This application does not depend on any environment variables. All data is managed client-side using local storage.

If environment variables are added in the future, they must be prefixed with `VITE_` to be accessible in the client bundle (e.g., `VITE_API_URL`). These can be configured in the Vercel dashboard under **Settings → Environment Variables**.

---

## CI/CD — Auto-Deploy on Push

When the repository is connected to Vercel:

1. **Production deploys** are triggered automatically on every push to the `main` branch.
2. **Preview deploys** are created for every pull request, providing a unique URL to review changes before merging.

No additional CI/CD configuration is required. Vercel detects the Vite framework automatically and applies the correct build settings.

### Recommended workflow

1. Create a feature branch from `main`.
2. Push changes and open a pull request.
3. Review the Vercel preview deployment URL attached to the PR.
4. Merge to `main` — production deployment happens automatically.

---

## Manual Deployment via Vercel CLI

If you prefer to deploy manually:

```bash
# Install the Vercel CLI globally
npm install -g vercel

# Deploy a preview build
vercel

# Deploy to production
vercel --prod
```

---

## Troubleshooting

### Page returns 404 on refresh

Ensure `vercel.json` exists in the project root with the SPA rewrite rule shown above. Without it, direct navigation to any route other than `/` will fail.

### Build fails with TypeScript errors

Run the build locally before pushing to verify there are no type errors:

```bash
npm run build
```

Fix any TypeScript compilation errors reported in the terminal output.

### Blank page after deployment

- Open the browser developer console and check for JavaScript errors.
- Verify that the **Output Directory** in Vercel project settings is set to `dist` (not `build` or `public`).
- Ensure `index.html` is present in the `dist` folder after building locally.

### Stale content after deployment

Vercel handles cache invalidation automatically on each deployment. If you see stale content:

- Hard-refresh the browser (`Ctrl+Shift+R` / `Cmd+Shift+R`).
- Clear the browser cache.
- Verify the deployment completed successfully in the Vercel dashboard.

### Node.js version mismatch

If the build fails due to Node.js version incompatibility, specify the version in Vercel project settings under **Settings → General → Node.js Version**, or add an `.nvmrc` file to the project root:

```
18
```

### Dependencies fail to install

Ensure `package-lock.json` is committed to the repository. Vercel uses `npm ci` by default, which requires a lockfile. If the lockfile is missing or out of sync, run locally:

```bash
npm install
```

Then commit the updated `package-lock.json`.