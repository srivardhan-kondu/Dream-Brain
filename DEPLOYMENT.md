# 🚀 Deployment Guide — Render (API) + Vercel (Client)

This guide deploys **Dream Brain** as two services:

| Piece | Platform | What runs |
|-------|----------|-----------|
| 🧠 Backend API | **Render** | Express + Mongoose (`server/`) |
| 🎨 Frontend | **Vercel** | Vite-built React static site (`client/`) |
| 💾 Database | **MongoDB Atlas** | the shared cluster |

```
   Browser ──▶ Vercel (React)  ──VITE_API_URL──▶  Render (Express)  ──▶  MongoDB Atlas
```

> Deploy the **backend first** — you'll need its URL to configure the frontend.

---

## 0 · Prerequisites

- Code pushed to GitHub: `https://github.com/srivardhan-kondu/Dream-Brain`
- A **MongoDB Atlas** cluster + connection string
- Free accounts on [Render](https://render.com) and [Vercel](https://vercel.com)

### Atlas: allow cloud access
Atlas blocks unknown IPs. Render's outbound IPs are dynamic, so:

1. Atlas → **Network Access** → **Add IP Address**
2. Choose **Allow access from anywhere** → `0.0.0.0/0` → Confirm

> 🔒 This is normal for PaaS hosting; your DB is still protected by the username/password in the connection string. For tighter security, upgrade to a paid Render plan with static outbound IPs and allowlist only those.

---

## 1 · Deploy the Backend to Render

### Create the service
1. Render Dashboard → **New +** → **Web Service**
2. Connect your GitHub repo → select **Dream-Brain**
3. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `dream-brain-api` |
| **Region** | closest to you (and ideally to your Atlas region) |
| **Root Directory** | `server` |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | Free (fine to start) |

### Add environment variables
Under **Environment** → **Add Environment Variable**:

| Key | Value |
|-----|-------|
| `MONGO_URI` | `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/dream_brain?retryWrites=true&w=majority` |
| `CLIENT_ORIGIN` | *(your Vercel URL — add after step 2, e.g. `https://dream-brain.vercel.app`)* |

> Don't set `PORT` — Render injects its own and Express already reads `process.env.PORT`.

4. Click **Create Web Service**. Watch the logs for:
   ```
   ✓ MongoDB connected: ...mongodb.net/dream_brain
   ✓ Dream Brain API listening on http://localhost:10000
   ```
5. Your API is now live at **`https://dream-brain-api.onrender.com`**. Verify:
   ```
   https://dream-brain-api.onrender.com/api/health   →  { "ok": true, ... }
   ```

### Seed the database (one time)
The app needs the 240 questions in Atlas. Easiest options:

- **Locally** (recommended): point `server/.env` at the same Atlas URI and run
  ```bash
  npm run seed
  ```
- **On Render**: open the service's **Shell** tab and run
  ```bash
  npm run seed
  ```

> ⚠️ **Free-tier cold starts:** Render free services sleep after ~15 min idle. The first request after sleeping takes ~30–50s to wake — that's why the app may feel slow on the very first load. Your DB connection has an 8s timeout, so the *second* request onward is fast.

---

## 2 · Deploy the Frontend to Vercel

1. Vercel Dashboard → **Add New** → **Project** → import **Dream-Brain**
2. Configure:

| Setting | Value |
|---------|-------|
| **Root Directory** | `client` |
| **Framework Preset** | Vite *(auto-detected)* |
| **Build Command** | `npm run build` *(default)* |
| **Output Directory** | `dist` *(default)* |

3. **Environment Variables** → add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://dream-brain-api.onrender.com` |

> ⚠️ No trailing slash, no `/api` — the client appends `/api` itself.
> Vite only exposes vars prefixed with `VITE_`, and they're baked in **at build time**, so set this *before* deploying (re-deploy if you change it later).

4. Click **Deploy**. You'll get a URL like **`https://dream-brain.vercel.app`**.

---

## 3 · Close the Loop (CORS)

The API must allow your Vercel origin or the browser will block requests.

1. Go back to **Render → your service → Environment**
2. Set `CLIENT_ORIGIN` to your Vercel URL:
   ```
   CLIENT_ORIGIN=https://dream-brain.vercel.app
   ```
   Multiple origins are supported (comma-separated) — handy for preview deploys:
   ```
   CLIENT_ORIGIN=https://dream-brain.vercel.app,http://localhost:5173
   ```
3. Render **redeploys automatically** on save.

---

## 4 · Verify End-to-End

1. Open your Vercel URL.
2. Pick an age group → the quiz should load 10 questions (this hits Render → Atlas).
3. Complete it → the report should render with the brain map.
4. In the browser DevTools **Network** tab, confirm calls go to
   `https://dream-brain-api.onrender.com/api/...` and return `200`.

✅ If questions load and a report saves, you're fully deployed.

---

## 🩺 Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| **CORS error** in console | `CLIENT_ORIGIN` doesn't match the Vercel URL exactly | Match scheme + host exactly, no trailing slash; redeploy. |
| Quiz: *"Has the database been seeded?"* | Atlas has no questions | Run `npm run seed` against the Atlas URI. |
| API requests go to `vercel.app/api/...` and 404 | `VITE_API_URL` wasn't set at build time | Set it in Vercel → **Redeploy**. |
| First load takes ~40s | Render free-tier cold start | Expected; upgrade plan or add an uptime pinger. |
| Render logs: *MongoDB connection failed* | Atlas IP block or bad URI | Allow `0.0.0.0/0` in Atlas; re-check `MONGO_URI` user/password. |
| `MONGO_URI` has special chars in password | `@ : / ?` break the URI | URL-encode them (e.g. `@` → `%40`). |

---

## 🔁 Continuous Deployment

Both platforms auto-deploy on every push to `main`:
- **Render** rebuilds the API.
- **Vercel** rebuilds the client (and creates preview URLs for PRs).

```bash
git add .
git commit -m "feat: ..."
git push        # → Render + Vercel both redeploy
```

---

## 🔐 Security Reminders

- **Never commit `server/.env`** — it's gitignored. Set secrets in each platform's dashboard.
- If your Atlas password was ever shared in plaintext, **rotate it** in Atlas → Database Access, then update `MONGO_URI` on Render.
- Prefer scoping Atlas network access to static IPs once you're on a paid Render tier.
