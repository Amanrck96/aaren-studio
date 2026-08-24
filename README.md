# Aaren Creative Studio

A 100% production-ready, premium website inspired by the design language, scrolling physics, animations, and user experience of STURDY.CO, completely custom-branded for **Aaren**.

## Tech Stack
* **Framework**: Next.js 16.2 (App Router)
* **Design & Animations**: Tailwind CSS, GSAP, Framer Motion, Lenis Smooth Scroll
* **Cloud Storage & Database**: Google Firebase Storage & Firebase Realtime Database Cloud Store
* **Authentication**: Firebase Authentication & Admin Credentials
* **Media & Optimization**: Google Firebase Storage & Edge CDN streaming integrations

---

## Features
1. **Dynamic Custom Cursor**: Spring-physics pointer animations that respond beautifully to page layouts and hover elements.
2. **Smooth Scrolling**: Implemented using Lenis for premium deceleration scrolling animations.
3. **Responsive Client CMS**: Includes admin dashboards allowing users to view, add, or delete projects, blogs, and careers.
4. **Interactive Form Workflows**: Fully custom resumes, portfolios, and contact triggers.
5. **Modern Layouts**: Services, Portfolio grids, Case Studies, About story pages.

---

## Run Locally

1. **Verify environment files**:
   Ensure `.env` in the root matches the requested Firebase credentials.
2. **Install modules**:
   ```bash
   npm install --legacy-peer-deps
   ```
3. **Launch development server**:
   ```bash
   npm run dev
   ```
4. **CMS Login Details**:
   - URL: `/admin/login`
   - Access: Configured via environment variables (`ADMIN_EMAIL` / `ADMIN_PASSWORD`)
   - Please configure your administrative credentials in your local `.env` or deployment environment settings.
