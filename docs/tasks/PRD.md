# Product Requirements Document (PRD)

**Project**: Aaren Creative Studio  
**Framework**: Next.js 16.2 (App Router) | React 19 | Tailwind CSS v4  
**Status**: In Development  
**Version**: 0.1.0  

---

## 1. Project Overview
Aaren Creative Studio is a high-end, production-ready creative studio platform inspired by the interactive design language, physics-based animations, and visual aesthetic of modern design agencies. It combines dynamic 3D visuals, fluid cursor/scrolling animations, an administrative CMS, and interactive workflows.

---

## 2. Technical Stack & Architecture

- **Core Framework**: Next.js 16.2 (App Router) & React 19
- **Styling & UI**: Tailwind CSS v4, PostCSS, Lucide React
- **Animations & Physics**: GSAP, Framer Motion, Lenis Smooth Scroll, Three.js / React Three Fiber
- **Database & ORM**: Prisma ORM, SQLite / Cloud Database
- **Backend & Integrations**: Firebase (Storage & Auth), Stripe, Cloudinary, Nodemailer, Genkit AI Google AI
- **Document & Export Utilities**: jsPDF, PDF.js, XLSX

---

## 3. Core Modules & Feature Matrix

### 3.1 Public Website & Portfolio Experience
- [x] **Hero Section**: High-impact visual landing with custom spring cursor interactions.
- [x] **Smooth Scrolling**: Lenis smooth-scroll physics integration.
- [x] **Portfolio Showcase**: Interactive project gallery with filtering, dynamic modal/case study views (`/projects`, `/work`, `/all-projects`).
- [x] **Brand & Services Overview**: Agency capabilities, design philosophies, and brand case studies (`/services`, `/brands`, `/about`).
- [x] **Interactive Workflows**: Contact inquiry forms, career application uploads, and digital downloads (`/contact`, `/careers`, `/downloads`).
- [x] **Commerce & Shop**: Merch / digital assets showcase (`/shop`, `/catalogs`, `/products`).
- [ ] **SEO & Metadata Optimization**: Dynamic OpenGraph image generation, JSON-LD structured data, and complete sitemap coverage.

### 3.2 Administrative CMS & Dashboard (`/admin`)
- [x] **Authentication & Guarding**: Secure admin session management.
- [x] **Content Management**: Manage projects, client case studies, careers, and blog articles.
- [ ] **Asset Management UI**: Direct asset upload management with Cloudinary/Firebase preview and tagging.
- [ ] **Analytics & Lead Tracking**: Dashboard overview for contact inquiries and job applications.

### 3.3 AI & Automation Integrations
- [x] **Genkit AI Setup**: Automated creative drafting and smart tagging flow.
- [ ] **Interactive Assistant / Agency Bot**: Client-facing project estimator and interactive AI assistant.

---

## 4. Current Tasks & Roadmap

### Phase 1: Quality & Stability Audit
- [ ] Verify build health (`npm run build`) and fix any type/lint errors.
- [ ] Audit client vs. server component boundaries to optimize bundle size and hydration.
- [ ] Ensure smooth fallback rendering on mobile devices (disable or adapt custom cursor/heavy shaders).

### Phase 2: Performance & Asset Optimization
- [ ] Optimize large images and video backgrounds with responsive Next.js Image/Video loaders.
- [ ] Implement robust caching headers for static assets and public API endpoints.
- [ ] Fine-tune Lenis scroll damping and frame budgets for 60+ FPS performance.

### Phase 3: CMS & Content Polish
- [ ] Validate and sanitize all form submissions (contact, newsletter, career applications).
- [ ] Add toast notification system for CMS CRUD operations and public form feedback.
- [ ] Refine error boundaries and 404/500 custom error pages.

---

## 5. Acceptance Criteria

1. **Build & Type Safety**: `npm run build` passes with zero TypeScript or build errors.
2. **Animation Performance**: Interactions maintain consistent frame rate without layout shifts (CLS < 0.1).
3. **Responsive Design**: All screens function seamlessly across mobile (375px+), tablet, and ultra-wide desktops.
3. **Security**: Admin routes and API keys are strictly protected against unauthorized access.
