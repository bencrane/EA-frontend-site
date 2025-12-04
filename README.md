# Everything Automation - CMS-Driven Catalog

A full-stack CMS-driven web application for showcasing automation systems. Built with Next.js (App Router), Supabase, and TailwindCSS.

## Features

- **Public Catalog**: Card-based grid layout showcasing automation systems
- **System Detail Pages**: Rich detail pages with structured attributes
- **Admin Dashboard**: Protected admin panel for content management
- **Image Upload**: Hero image upload with Supabase Storage
- **Authentication**: Secure admin access with Supabase Auth

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Styling**: TailwindCSS
- **Language**: TypeScript (strict mode)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project

### 1. Clone and Install

```bash
git clone <repository-url>
cd ea-frontend-site
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Settings > API** to find your credentials

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 4. Run Database Migrations

In your Supabase Dashboard, go to **SQL Editor** and run the following scripts in order:

1. **Migration** (`supabase/migration.sql`): Creates the `ea_systems` table and indexes
2. **Storage** (`supabase/storage.sql`): Creates the `system-images` storage bucket
3. **Seed** (`supabase/seed.sql`): Populates sample automation systems (optional)

### 5. Create Admin User

In Supabase Dashboard:

1. Go to **Authentication > Users**
2. Click **Add user** > **Create new user**
3. Enter email and password for your admin account

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the public catalog.

Access [http://localhost:3000/admin](http://localhost:3000/admin) to log in to the admin panel.

## Project Structure

```
ea-frontend-site/
├── app/                      # Next.js App Router pages
│   ├── admin/               # Admin panel pages
│   │   ├── [id]/edit/      # Edit system page
│   │   ├── login/          # Login page
│   │   ├── new/            # Create system page
│   │   └── page.tsx        # Admin dashboard
│   ├── api/admin/          # Admin API routes
│   │   ├── delete/         # Delete system endpoint
│   │   ├── save/           # Create/update endpoint
│   │   └── upload/         # Image upload endpoint
│   ├── systems/[slug]/     # Public system detail page
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Public homepage
├── components/              # React components
│   ├── admin/              # Admin-specific components
│   │   ├── AdminLayout.tsx
│   │   ├── ImageUploader.tsx
│   │   ├── StatusBadge.tsx
│   │   └── SystemForm.tsx
│   ├── ui/                 # Reusable UI components
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Label.tsx
│   │   ├── Select.tsx
│   │   └── Textarea.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── Layout.tsx
│   ├── SystemCard.tsx
│   ├── SystemDetailSections.tsx
│   └── SystemGrid.tsx
├── lib/                     # Utility functions
│   ├── supabase.ts         # Supabase client
│   ├── supabase-server.ts  # Server-side Supabase
│   └── systems.ts          # System data functions
├── supabase/               # Database scripts
│   ├── migration.sql       # Table creation
│   ├── seed.sql            # Sample data
│   └── storage.sql         # Storage bucket setup
├── types/                   # TypeScript types
│   └── database.ts         # Database schema types
├── middleware.ts           # Auth middleware
├── .env.example            # Environment template
├── next.config.js          # Next.js config
├── tailwind.config.js      # Tailwind config
└── tsconfig.json           # TypeScript config
```

## Database Schema

### ea_systems Table

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| slug | text | URL-safe identifier (unique) |
| title | text | System title |
| short_description | text | Card description |
| long_description | text | Detail page description |
| category | text | System category |
| status | text | draft / live / hidden |
| order_index | int | Display order |
| hero_image_url | text | Hero image URL |
| attributes | jsonb | Structured data (steps, tools, outputs, benefits) |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update timestamp |

## Deployment to Vercel

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy

## Admin Panel Usage

### Creating a System

1. Log in at `/admin/login`
2. Click "New System"
3. Fill in the form:
   - **Title**: System name
   - **Slug**: Auto-generated from title (editable)
   - **Category**: Select from predefined list
   - **Status**: Draft (hidden), Live (visible), Hidden
   - **Descriptions**: Short (for cards) and long (for detail page)
   - **Hero Image**: Upload an image
   - **Attributes**: Enter steps, tools, outputs, and benefits (one per line)
4. Click "Create System"

### Editing a System

1. Go to `/admin`
2. Click "Edit" next to any system
3. Make changes and click "Save Changes"

## Security Notes

- Admin routes are protected by Supabase Auth middleware
- Row Level Security (RLS) policies restrict public access to live systems only
- Service role key is only used server-side for admin operations
- Never expose the service role key in client-side code

## License

Private - All rights reserved
