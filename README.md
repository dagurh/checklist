# Ævintýralisti — Shared Checklist

A shared checklist for ~10 people. Checkmarks are stored in Vercel KV (Redis) and sync across all users every 5 seconds.

## Deploy to Vercel

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "init"
gh repo create checklist --public --push
```

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your GitHub repo
2. Click **Deploy** (no build settings needed)

### 3. Add Vercel KV (the database)
1. In your Vercel project → **Storage** tab → **Create Database** → choose **KV**
2. Click **Connect** — this auto-adds the environment variables your API needs
3. Redeploy once (Vercel dashboard → **Deployments** → **Redeploy**)

That's it — your checklist is live!

## Adding or changing items

Edit `items.js`, then push to GitHub:
```bash
git add items.js
git commit -m "update items"
git push
```
Vercel auto-redeploys in ~30 seconds. Checked state is preserved in the database.

## File structure
```
index.html      ← the UI
items.js        ← edit this to change checklist items
api/checks.js   ← serverless API (read/write checkmarks)
vercel.json     ← routing config
package.json    ← @vercel/kv dependency
```
