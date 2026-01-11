# ChefSite (Vite + React)

## Scripts

- `npm run dev`: Start local dev server
- `npm run build`: Build production assets
- `npm run preview`: Preview the build locally

## Pages

- Home: Hero + featured dishes
- Dishes: Grid of dishes with images
- Reviews: Add comments + star ratings (localStorage)
- Contact: Info + Netlify-ready form
- About: Bio, specialties, experience
- Admin: Password-gated uploads for images/videos via Cloudinary

## Deploy

- Static hosts (Netlify/Vercel/GitHub Pages/cPanel). For SPA routing, `_redirects` is included for Netlify. For Apache, use the `.htaccess` rule in the root README.

## Admin Setup

1. Copy `.env.example` to `.env` and set:
   - `VITE_ADMIN_PASSWORD` (simple client-side gate; not secure for real production)
   - `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET` for unsigned uploads
   - `VITE_UPLOAD_TARGET` set to `local` (uses Node server) or `cloudinary` (direct uploads)
   - Optional: `VITE_OWNER_TOKEN` to gate the owner setup route with a query token
2. Restart dev server after changing `.env`.

### Cloudinary Notes

- Create an unsigned upload preset in Cloudinary, enable for image/video.
- Images: uploaded to `https://api.cloudinary.com/v1_1/<cloud_name>/image/upload`
- Videos: uploaded to `https://api.cloudinary.com/v1_1/<cloud_name>/video/upload`
- The Admin page shows the uploaded asset URL and public ID.

### Security Note

- Client-side passwords and unsigned uploads are convenience-only.
- For production, use real auth (e.g., Netlify Identity, Auth0, Clerk, Supabase Auth) and signed/upload endpoints on a server or serverless function.

## Local Uploads vs Static Hosting

- Static hosts (Netlify/Vercel/GitHub Pages/Cloudflare Pages) do not run Node servers. Use `VITE_UPLOAD_TARGET=cloudinary` for deployment there.
- For local development, you can use `VITE_UPLOAD_TARGET=local` and run the Node server to store files under `app/uploads`.
- If you want a backend in production, host the Node API separately (e.g., Render, Railway, Fly.io) and point the client to that API.

## Owner Setup (No .env)

- If deploying without `.env`, you can set the admin password at runtime.
- Navigate to `/owner-setup`. If no admin password exists, the page is accessible.
- To protect access after the first-time setup, use a token: `/owner-setup?token=YOUR_TOKEN`.
- Configure a token via `VITE_OWNER_TOKEN` in `.env` or set it on the Owner Setup page (saved in localStorage).
- A subtle "Owner Setup" link appears in the footer only when no admin password is set yet, or when the current URL includes a valid `?token=`.
