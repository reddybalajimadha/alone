# Alone: The Anatomy of Cooperation

> *"If you wish to make an apple pie — or a sandwich — from scratch, you must first invent the universe."*
> — Carl Sagan, Cosmos

**Alone** is a web monograph and interactive catalog that explores what it would take to build everyday objects entirely by yourself, from raw earth, in one lifetime. 

When you upload a photo of a common item (like a pencil, ceramic mug, or sandwich), the application decomposes its manufacturing chain down to the base geological, chemical, and agricultural elements. It computes the decades of sequential labor, the processing heat thresholds, the stack of prerequisite tools, and the physical hazards required to assemble it alone.

This project is a monument to the fact that you have never been alone. It is a quiet study in the staggering depth of human cooperation.

---

## Features

- **VLM supply chain analysis**: Connects to the Gemini 2.5 Flash API to identify objects and dynamically generate complete manufacturing reports.
- **Interactive Dependency Tree**: A horizontal collapsible SVG tree displaying every processed material component down to its raw extraction method.
- **Thermal Threshold Gauge**: A visual vertical heat scale outlining the extreme furnace temperatures required for each step of production.
- **Tooling Stack & Hazards Log**: A chronological timeline of the tools you must build to make other tools, alongside a ledger of the chemical and physical risks involved.
- **Library Monograph Feed**: A blog-style public archive of previously analyzed objects, stored permanently in the database.
- **Admin Deletion Controls**: Clean UI buttons (hidden behind an admin password configuration) to delete saved monographs from the feed and database.
- **"Sagan's Paradox" Easter Egg**: Automatically triggers a handcrafted six-month chicken sandwich agricultural monograph when sandwich-related files are uploaded.

---

## Technical Stack

- **Core**: Next.js 16 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, Vanilla CSS (designed with a minimalist cream-and-charcoal book aesthetic, featuring *EB Garamond* typography)
- **Database**: SQLite (local development) / PostgreSQL (production deployment)
- **ORM**: Prisma ORM (client client-generation, automatic migrations, and schema syncs)
- **AI**: Google Gemini 2.5 Flash API (via Server Route proxy)

---

## Getting Started

### 1. Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/reddybalajimadha/alone.git
cd alone
npm install
```

### 2. Local Database Configuration

For local development, copy the `.env` template or create a `.env` file in the root directory:

```bash
DATABASE_URL="file:./dev.db"
```

Sync the SQLite database schema and generate the Prisma Client:

```bash
npx prisma generate
npx prisma db push
```

### 3. Running Locally

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Configurations

Click **Configure API & Admin** in the top-right corner of the homepage to access local configurations (saved securely in your browser's `localStorage`):

1. **Gemini API Key**: If left blank, the application runs in offline mode using pre-authored mock reports. To analyze custom objects, paste your own API Key (obtained for free from [Google AI Studio](https://aistudio.google.com/)).
2. **Admin Password**: Enter the server's configured admin password (defaults to `admin`) to unlock deletion buttons on cards and details pages.

---

## Offline Local Generation (Alternative)

To run the application entirely offline and isolated, you can host local LLMs using Ollama:

1. Install [Ollama](https://ollama.com) on a machine with a WebGPU-enabled graphics card.
2. Pull the lightweight Gemma model:
   ```bash
   ollama run gemma2:2b
   ```
3. Run the Next.js development server locally.

---

## Production Deployment (Vercel & Supabase)

### 1. Database Setup
1. Create a free database project on [Supabase](https://supabase.com) or [Neon](https://neon.tech).
2. Go to **Settings > Database** and copy the **URI connection strings**:
   - `DATABASE_URL`: The pooled connection string (port `6543`).
   - `DIRECT_URL`: The direct connection string (port `5432`) used for schema migrations.

### 2. Vercel Settings
1. Import your GitHub repository to Vercel.
2. In **Build and Development Settings**, override the **Build Command** to:
   ```bash
   npx prisma generate && npx prisma db push && npm run build
   ```
3. In **Environment Variables**, add the following keys:
   - `DATABASE_URL`: (Paste your Supabase pooled connection string).
   - `DIRECT_URL`: (Paste your Supabase direct connection string).
   - `ADMIN_PASSWORD`: (Your custom admin password for deleting items).
   - `GEMINI_API_KEY`: (Optional API Key if you wish to fund visitor requests).
4. Click **Deploy**.

---

## License

This project is licensed under the [MIT License](LICENSE).
