# Hardware Hub: frontend

The website for Hardware Hub, a chatbot-first PC troubleshooting and hardware education platform.
It talks to the separate **backend** repository (FastAPI). Every answer the chat gives comes from a
hand-written decision tree on the server; this app only shows it.

Built with Next.js (App Router), React, TypeScript, Tailwind CSS (v4), Zustand and Zod.
The exact versions are in `package.json`.

## Run it

You need Node.js and the backend running (see the backend README).

```powershell
cd frontend
npm install
npm run dev          # http://localhost:3000
```

Create `frontend/.env.local`:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:8000
# Optional. The public address of the site, for the sitemap and canonical links.
# NEXT_PUBLIC_SITE_URL=https://yourapp.vercel.app
```

| Variable               | Meaning                                                                                            |
| ---------------------- | -------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`  | Where the backend is. Required: pages that need the API stop with a clear error if it is missing.  |
| `NEXT_PUBLIC_SITE_URL` | Optional. Without it the site works, but `sitemap.xml` is empty and canonical links stay relative. |

The backend's `CORS_ORIGIN` must include the address this site is served from.

Check the code compiles: `npx tsc --noEmit`. There are no frontend tests yet; the backend has the test suite.

## Pages

| Route                         | What it is                                                                                                                                          |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                           | Home: the five bots with clickable example questions, how we compare, why the answers can be trusted                                                |
| `/guides`                     | Every troubleshooting guide, grouped by bot and category                                                                                            |
| `/guides/[slug]`              | One guide with its whole decision tree as plain HTML (crawlable), a safety note, related guides, and a button that opens the chat inside that guide |
| `/products`, `/products/[id]` | Catalog and product pages: photo, plain-English write-up with jargon tooltips, specs, video, where to buy, "having trouble?" buttons                |
| `/compare`                    | Side-by-side comparison of 2 or 3 products from one category                                                                                        |
| `/admin/*`                    | Admin panel (login, bulk import, products, categories, blog, guide keywords, feedback, missed queries)                                              |
| `/sitemap.xml`, `/robots.txt` | Generated; `/admin` is blocked in robots.txt                                                                                                        |

The chat widget floats on the public pages. The guide pages, the product detail page and the
sitemap are rendered on the server so search engines can read them.

## The chat

`components/ChatWidget.tsx` is driven by one Zustand store, `lib/store/chatStore.ts`, which calls the backend
through `lib/api.ts` and checks every response with the Zod schemas in `lib/validations/chat.ts`.

- A message gives up to 3 suggested guides (and a "None of these" button), or a list to choose from.
- Each answer is sent as the whole path so far; the server holds no conversation state.
- A final answer asks "Did this fix it?" (anonymous vote). When it is "needs a professional" it also
  offers **Prepare a summary for a technician**: a sheet with the questions asked, the answers given and
  what the guide found, ready to copy or save as a text file. The two optional fields on that sheet
  (device, other details) are typed in the browser and never sent anywhere.
- **Photos of error screens and part labels.** The camera button next to the message box opens a picture,
  reads its text **in the browser** with tesseract.js (nothing is uploaded or stored; the picture is shrunk and redrawn first,
  which also removes camera metadata), shows the text so the person can fix or trim it, and only then sends it to the chat as
  `source: "photo"`. The reader is loaded only when someone attaches a picture. It needs its files served from your own site:
  `npm install tesseract.js @tesseract.js-data/eng`, then add to `package.json` scripts
  `"copy-ocr": "node scripts/copy-ocr-assets.mjs"`, `"predev": "npm run copy-ocr"` and `"prebuild": "npm run copy-ocr"`,
  and add `/public/ocr/` to `.gitignore` (about 17 MB, copied at build time, not committed). Set `NEXT_PUBLIC_OCR_BASE` only if you host them elsewhere.
  Without the files the camera button shows "I could not read that picture here" and everything else keeps working.
- The newest message scrolls into view, and a safety note about switching off and unplugging stays visible.

## Admin panel

Open `/admin/login` and enter the `ADMIN_ID` and `ADMIN_SECRET` from the backend's `.env`. They are kept in
`sessionStorage` (cleared when the tab closes) and sent as headers on admin requests. Pages:

- **Bulk import**: guides (JSON), products with write-ups, and images, videos and store links
- **Keywords**: edit the casual phrases a guide is found by
- **Missed queries**: what people typed that matched no guide; add a phrase to the right guide in one click, dismiss junk, or download them as an evaluation set
- **Feedback**: how often a final answer fixed the problem
- **Products, Categories, Blog**: single-item forms

## Project layout

```
frontend/
  app/            routes (see Pages), layout, sitemap, robots, global styles
  components/     ChatWidget, PhotoReader, TechnicianReport, GuideTree, SiteHeader, ProductMedia, CompareClient, glossary tooltips ...
    admin/        shared pieces of the admin pages
  lib/
    api.ts            chat calls (validated with Zod)
    guides.ts         guide list and detail for the public guide pages
    catalog.ts        products and categories
    adminApi.ts       admin calls (sends the admin headers)
    store/chatStore.ts  chat state
    validations/      Zod schemas
    reportText.ts     builds the technician summary text
    ocr.ts            reads the text in a picture, in the browser
    theme.tsx         light and dark mode
    glossary.ts       jargon definitions for tooltips
```

## Light and dark mode

Tailwind's dark variant is switched by a `dark` class on `<html>`. A small script in `app/layout.tsx`
applies the saved choice before the page paints, so there is no flash. Light is the default.

## Deploying (Vercel)

1. Set `NEXT_PUBLIC_API_URL` to the deployed backend and `NEXT_PUBLIC_SITE_URL` to the site's own address.
2. Deploy the backend first. The guide pages and the sitemap call `/api/v1/guides`.
3. Make sure the backend's `CORS_ORIGIN` includes the site's address.
