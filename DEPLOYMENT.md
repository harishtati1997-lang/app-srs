# Deployment guide (quick steps)

Frontend (Vercel):

1. Sign in to https://vercel.com with your GitHub account.
2. Import Project -> select repository `harishtati1997-lang/app-srs`.
3. During Import:
   - Root Directory: `frontend`
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Add Environment Variable: `VITE_API_BASE` = `https://<your-backend>/api`
4. Deploy. Copy the production URL (e.g. `https://frontend-....vercel.app`).

Backend (Render) using `render.yaml` (recommended):

1. Sign in to https://dashboard.render.com and connect your GitHub account.
2. In Render dashboard choose "New -> Import from GitHub" and pick `harishtati1997-lang/app-srs`.
3. Render will read `render.yaml` in the repo and create the service `sree-srs-api` and a managed Postgres `sree-srs-db`.
4. In the service Environment settings, ensure the following env vars are present:
   - `DATABASE_URL` (Render sets this automatically for the managed DB)
   - `FRONTEND_URL` = the Vercel frontend URL from earlier (to restrict CORS)
5. Deploy the service; note the service URL (e.g. `https://sree-srs-api.onrender.com`).

Post-deploy steps:

- On Vercel, set `VITE_API_BASE` to `https://<render-service>/api` and redeploy frontend if needed.
- Verify API health:
  - `curl https://<render-service>/`
  - Visit the frontend URL and test login/workflows.
- Security:
  - Replace the default admin password after first login.
  - Keep `FRONTEND_URL` restricted; do NOT leave CORS set to `*` in production.
