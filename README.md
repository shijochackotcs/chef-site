# chef-site
Chef Website

## Overview
This project is a React single-page application (SPA) you can build locally and deploy as static files to any host. You do not need React installed on the hosting server; only your development machine needs Node.js and npm.

## Prerequisites
- Node.js 18+ and npm installed on your development machine
- A domain (optional, for custom domain routing)

## Create Project (Vite + React)
```bash
# Run in the chef-site folder
npm create vite@latest app -- --template react
cd app
npm install
```

## Develop Locally
```bash
npm run dev
```
Open the local URL it prints (typically http://localhost:5173).

## Build for Production
```bash
npm run build
```
This creates production assets in the `dist/` folder.

## Deploy Options (Static Hosting)

### Netlify (recommended, simple)
1. Drag and drop the `dist/` folder in Netlify UI, or use CLI.
2. For SPA routing, add a `_redirects` file at the project root before building with:
```
/* /index.html 200
```
3. Connect a custom domain in Netlify and follow DNS prompts.

### Vercel
1. Import the repo in Vercel or run `npx vercel` in the `app` folder.
2. Set framework to Vite/React if not auto-detected.
3. Add custom domain and complete DNS setup.

### GitHub Pages
1. Push the project to GitHub.
2. Configure Pages to serve from the build output (use an action to build and publish `dist/`).
3. Note: SPA fallback may require additional configuration.

### cPanel / Shared Hosting (Apache)
1. Upload contents of the `dist/` folder to `public_html/`.
2. Create `.htaccess` in `public_html/` to enable SPA routing:
```
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

## Custom Domain (DNS)
- Netlify/Vercel: follow provider’s DNS instructions (add CNAME/A records). HTTPS is auto-provisioned.
- cPanel/Server: point your domain A record to your server IP. Use Let’s Encrypt for HTTPS.

## When You Need a Server
Only if you use server-side rendering (e.g., Next.js SSR) or host APIs on the same origin. For a standard React SPA, static hosting is sufficient.

## Useful Scripts
```bash
# Start dev server
npm run dev

# Build production assets
npm run build

# Preview local production build (optional)
npm run preview
```

## Notes
- Keep app code inside `app/` to separate sources from docs.
- Remember to include SPA routing fallback (`_redirects` or `.htaccess`) before deploying.

## React Without Vite (CDN-based)
If you prefer not to use Vite, you can run React without a bundler using CDN scripts and Babel Standalone for development.

### Files
- `public/index.html`: includes React/ReactDOM UMD and Babel Standalone.
- `src/app.jsx`: your JSX app code.
- `public/style.css`: optional styles.

### Develop Locally (no Node required)
Open `public/index.html` in a browser. Babel transforms JSX on the fly for development.

### Production Build (optional but recommended)
Compile JSX to plain JS, remove Babel, and switch to production React builds:
```bash
# Initialize npm and install Babel CLI + presets
npm init -y
npm install -D @babel/cli @babel/preset-env @babel/preset-react

# Compile JSX from src/ to public/
npx babel src --out-dir public --presets @babel/preset-env,@babel/preset-react

# Update public/index.html:
# - Replace development React scripts with production:
#   https://unpkg.com/react@18/umd/react.production.min.js
#   https://unpkg.com/react-dom@18/umd/react-dom.production.min.js
# - Remove the Babel Standalone script
# - Change the app script to ./app.js (compiled output)
```

### Deploy
Upload the contents of `public/` to any static host (Netlify, Vercel, GitHub Pages, cPanel). For SPA routing on Apache/cPanel, use the `.htaccess` example above.
