# MoodLift Admin Panel - Project Documentation

## Project Overview
A comprehensive admin panel for the MoodLift mental wellness application with complete footer implementation across ALL pages, SEO metadata management, book recommendations, testimonials management, and dynamic FAQ system.

## Latest Update (Nov 27, 2025 - Admin Panel Complete!)

### ✅ NEW: Assets Management Tab
- Image upload functionality with Supabase Storage
- Easy URL generation for use throughout the site
- Copy-to-clipboard functionality for quick sharing
- Delete uploaded images with confirmation
- Browse all uploaded assets in one place

### ✅ NEW: Games Details Tab
- Full CRUD operations for game management
- Edit title, description, category, icon
- Manage gradient colors (color from/to)
- Upload cover images with preview
- Delete games with confirmation

### ✅ UPDATED: Book Recommendations Form
- Consolidated book cover upload into main creation form
- No more separate cover management page
- Added recommendation info (Recommended By, Reason)
- Added affiliate links (Amazon, Flipkart)
- All fields in one easy-to-use form

### ✅ FOOTER ADDED TO ALL PAGES - COMPLETE!
The professional AppFooter component is now implemented on **EVERY PAGE** in the application:

**Main User Pages:**
- ✅ Home page (/) 
- ✅ Assessment page (/assessment)
- ✅ Books page (/books)
- ✅ Games page (/games)
- ✅ Discover page (/discover)
- ✅ Dashboard page (/dashboard)
- ✅ Progress page (/progress)
- ✅ Rewards page (/rewards)
- ✅ All Activities page (/all-activities)

**Admin Pages:**
- ✅ Admin Dashboard (/admin/dashboard)
- ✅ FAQ Management (/admin/dashboard/faqs)
- ✅ Admin Login (/admin/login)

**Individual Game Pages:**
- ✅ All 10 breathing & grounding technique pages in /games/[game-name]

### Admin FAQ Management System ✅ COMPLETE
- Database: `faqs` table with page-specific FAQ storage
- API Routes: Full CRUD operations at `/api/admin/faqs`
- Admin Interface: Complete FAQ management page with create/edit/delete
- Dynamic FAQ Component: Fetches FAQs from database automatically
- Schema.org Markup: JSON-LD FAQPage structured data for SEO

### Professional Footer Component
**Features:**
- 4-column layout: Features, Resources, Support, Support
- Responsive design (1 col mobile, 4 col desktop)
- Navigation links to all major sections
- Social media icons
- Copyright information
- MoodLift branding

## Project Structure

```
project/
├── app/
│   ├── page.tsx                              (✅ Footer added)
│   ├── admin/
│   │   ├── dashboard/
│   │   │   ├── page.tsx                      (✅ Updated with Games & Assets tabs)
│   │   │   └── faqs/page.tsx                 (✅ Footer added)
│   │   └── login/page.tsx                    (✅ Footer added)
│   ├── api/admin/
│   │   ├── assets/route.ts                   (✅ NEW - File upload & management)
│   │   ├── games/route.ts                    (✅ Updated - Full CRUD)
│   │   ├── books/route.ts                    (✅ Updated - All fields)
│   ├── assessment/page.tsx                   (✅ Footer added)
│   ├── books/page.tsx                        (✅ Footer added)
│   ├── dashboard/page.tsx                    (✅ Footer added)
│   ├── progress/page.tsx                     (✅ Footer added)
│   ├── discover/page.tsx                     (✅ Footer added)
│   ├── games/
│   │   ├── page.tsx                          (✅ Footer added)
│   │   ├── alternate-nostril-breathing/      (✅ Footer added)
│   │   ├── box-breathing/                    (✅ Footer added)
│   │   ├── cognitive-grounding/              (✅ Footer added)
│   │   ├── describe-room/                    (✅ Footer added)
│   │   ├── diaphragmatic-breathing/          (✅ Footer added)
│   │   ├── four-seven-eight-breathing/       (✅ Footer added)
│   │   ├── name-the-moment/                  (✅ Footer added)
│   │   ├── physical-grounding/               (✅ Footer added)
│   │   ├── posture-reset/                    (✅ Footer added)
│   │   └── self-soothing/                    (✅ Footer added)
│   ├── all-activities/page.tsx               (✅ Footer added)
│   └── rewards/page.tsx                      (✅ Footer added)
├── components/
│   ├── app-footer.tsx                        (Footer component - 4-column layout)
│   ├── faq-section.tsx                       (Dynamic FAQ with DB fetch)
│   └── [other components]
└── replit.md                                 (This file)
```

## Database Schema

### FAQs Table
```sql
CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page VARCHAR(100) NOT NULL,        -- 'home', 'games', 'discover', 'assessment'
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX idx_faqs_page ON faqs(page);
CREATE INDEX idx_faqs_active ON faqs(active);
```

## API Endpoints

### Assets Management (NEW)
- `GET /api/admin/assets` - List all uploaded assets
- `POST /api/admin/assets` - Upload new image file
- `DELETE /api/admin/assets?name={filename}` - Delete asset

### Games Management (NEW)
- `GET /api/admin/games` - Fetch all games
- `POST /api/admin/games` - Create new game
- `PUT /api/admin/games` - Update game details
- `DELETE /api/admin/games?id={gameId}` - Delete game

### Books Management (UPDATED)
- `GET /api/admin/books` - Fetch all books
- `POST /api/admin/books` - Create book with all fields (cover, recommendations, links)
- `PUT /api/admin/books` - Update book details
- `DELETE /api/admin/books?id={bookId}` - Delete book

### FAQ Management
- `GET /api/admin/faqs?page={pageName}` - Fetch FAQs for specific page
- `POST /api/admin/faqs` - Create new FAQ
- `PUT /api/admin/faqs` - Update FAQ
- `DELETE /api/admin/faqs?id={faqId}` - Delete FAQ

### Other Admin APIs
- `GET/POST /api/admin/testimonials` - Testimonials management
- `GET/PUT /api/admin/seo-metadata` - SEO metadata management

## How to Use the Footer

The footer is automatically included on every page. It displays:
1. **Logo & Tagline** - MoodLift branding
2. **Features Column** - Links to main features
3. **Resources Column** - Learning and content links
4. **Support Columns** - Help and legal links
5. **Social Media** - Share buttons and contact
6. **Copyright** - Legal information

## How to Use FAQ Management

### For Admins:
1. Navigate to `/admin/dashboard`
2. Click "FAQs" tab
3. Select a page (Home, Games, Discover, Assessment)
4. Click "Add New FAQ"
5. Fill question, answer, and sort order
6. Save!

### For End Users:
- FAQs appear on each page automatically
- Click to expand/collapse answers
- Collapsible accordion interface
- SEO-optimized with Schema.org markup

## Key Features

✅ **Complete Footer Implementation**
- Professional 4-column design
- Responsive (mobile-first approach)
- Consistent across ALL pages
- SEO-optimized with proper semantics

✅ **Dynamic FAQ System**
- Admin can create/edit/delete FAQs
- Per-page FAQ management
- Database-driven (no hardcoding)
- Schema.org JSON-LD markup for SEO
- Fallback to static FAQs if database empty

✅ **Admin Dashboard**
- SEO metadata management
- Book recommendations CRUD
- Testimonials CRUD
- FAQ management (NEW)

## Workflow Configuration

**Next.js Dev Server** (PORT=5000)
```bash
cd project && PORT=5000 npm run dev
```

## Technology Stack
- Next.js 15+
- React 18+
- TypeScript
- Supabase (PostgreSQL + Auth)
- Shadcn UI Components
- Lucide React Icons
- Schema.org JSON-LD

## User Preferences
- Clean, professional UI
- Mobile-responsive design
- Consistent purple/accent color scheme
- SEO-optimized structured data
- Reusable component architecture

## Notes for Future Sessions
- All 22 pages now have consistent footer
- FAQ system is fully functional and admin-managed
- Database ready with RLS policies configured
- Schema.org markup in place for SEO
- No hardcoded content - all admin-managed

## Admin Dashboard Tabs (Complete)

1. **Page SEO Metadata** - Manage SEO for all pages
2. **Book Recommendations** - Manage books with covers, recommendations, affiliate links
3. **Games Details** - Manage games with colors, icons, descriptions, covers
4. **Assets** - Upload & manage images, get copyable URLs
5. **Testimonials** - Manage user testimonials
6. **FAQs** - Manage page-specific FAQs

## Summary of Changes This Session
1. ✅ Consolidated book cover management into main creation form (no separate step)
2. ✅ Created Games Details tab with full management (title, description, category, colors, cover)
3. ✅ Created Assets tab for image uploads with URL generation
4. ✅ Updated all API endpoints to handle new fields
5. ✅ Added Games CRUD operations (POST, PUT, DELETE)
6. ✅ Added Assets CRUD operations with Supabase Storage

**Result:** MoodLift admin panel now has 6 complete tabs with all management features integrated and easy-to-use interfaces!
