# MedTech News Digest

Latest medical technology news powered by **Groq AI** (llama-3.3-70b-versatile), deployed on **Cloudflare Pages**.

## Project Structure

```
├── index.html                  # Vite HTML entry point
├── public/
│   └── favicon.svg
├── src/
│   ├── main.jsx                # React root
│   └── medtech-news.jsx        # Main app component
├── functions/
│   └── api/
│       └── news.js             # Cloudflare Pages Function (calls Groq)
├── package.json
├── vite.config.js
└── wrangler.toml
```

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set your Groq API key locally** — create a `.env` file:
   ```
   GROQ_API_KEY=your_groq_key_here
   ```

3. **Build and run with Wrangler** (to test the Pages Function locally):
   ```bash
   npm run build
   npm run pages:dev
   ```
   Then open `http://localhost:8788`

   Or just run Vite for UI-only dev (API calls will fail without the function):
   ```bash
   npm run dev
   ```

## Deploy to Cloudflare Pages

1. Push this project to a GitHub repo.
2. In [Cloudflare Pages](https://pages.cloudflare.com), create a new project and connect your repo.
3. Set these build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Go to **Settings → Environment Variables** and add:
   - `GROQ_API_KEY` = your Groq API key
5. Deploy!

Cloudflare will automatically detect the `functions/` folder and deploy `functions/api/news.js` as a serverless endpoint at `/api/news`.
