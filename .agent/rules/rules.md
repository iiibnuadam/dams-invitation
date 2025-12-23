---
trigger: always_on
---

# ROLE & CONTEXT
You are a Senior Full-stack Developer & UI/UX Designer. You are building a "Premium Wedding Invitation & CMS" with a "Modern, Clean, & Editorial" vibe. The design must be sophisticated, minimalist, responsive and high-end.

# TECH STACK
- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS.
- **UI Components:** shadcn/ui.
- **Icons:** Iconify (use `@iconify/react`).
- **Animation:** Framer Motion (essential for the opening transition and scroll reveals).
- **Database:** MongoDB (Mongoose) with a collection named `invitation`.

# DESIGN LANGUAGE (CLEAN MODERN EDITORIAL)
- **Color Palette:** - Primary: Slate Black (#1A1A1A).
  - Secondary: Soft Pearl / Off-White (#F9F9F9).
  - Accents: Champagne Gold (#C5A059) for highlights.
- **Visuals:** Heavy use of whitespace, thin lines (1px borders), asymmetrical layouts, and glassmorphism. Avoid heavy traditional patterns. Use high-quality photography as the main focus.
- **Typography:** - Headings: Modern Serif (e.g., Cormorant Garamond / Bodoni).
  - Accents: Elegant Minimalist Script or Spaced Sans-serif.
  - Body: Geometric Sans-serif (e.g., Jost / Montserrat).

# OPENING OVERLAY (The "Buka Undangan" Logic)
- **Requirement**: Full-screen fixed overlay (`z-50`) that prevents scrolling upon first load.
- **Features**: 
  - Displays "The Wedding of Sasti & Adam".
  - Dynamic Guest Name from URL Params (`?to=Guest+Name`).
  - "Open Invitation" Button (shadcn/ui Button with Iconify icon).
- **Behavior**: Clicking the button triggers a Framer Motion exit animation (e.g., slide up or fade), enables body scrolling, and triggers the Hero section's entrance animation.

# DATABASE SCHEMA (Collection: invitation)
{
  "slug": "String (Unique)",
  "hero": {
    "heading": "The Wedding of",
    "names": "Sasti & Adam",
    "date": "17.07.26",
    "quote": {
      "arabic": "وَمِن كُلِّ شَيْءٍ خَلَقْنَا زَوْجَيْنِ لَعَلَّكُمْ تَذَكَّرُونَ",
      "translation": "Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah).",
      "source": "QS. Az-Zariyat: 49"
    }
  },
  "mempelai": {
    "pria": { "namaLengkap": "String", "putraDari": "String", "fotoUrl": "String" },
    "wanita": { "namaLengkap": "String", "putriDari": "String", "fotoUrl": "String" }
  },
  "acara": {
    "akad": { "tanggal": "Date", "jam": "String", "tempat": "String", "maps": "String" },
    "resepsi": { "tanggal": "Date", "jam": "String", "tempat": "String", "maps": "String" }
  },
  "weddingStory": [{ "year": "String", "title": "String", "content": "String" }],
  "paymentMethods": [{ "bank": "String", "number": "String", "holder": "String", "type": "bank|address" }],
  "comments": [{ "name": "String", "message": "String", "timestamp": "Date" }]
}

# SECTION STRUCTURE (In Order)
1. **Opening Overlay**: Full-screen welcome with "Open Invitation" button.
2. **Hero Section**: Editorial layout with large photo, clean date, and Quranic Quote.
3. **Countdown & Reminder**: Minimalist timer with "Save to Google Calendar" button.
4. **Mempelai Section**: Clean profile cards using `pria.png` and `wanita.png`.
5. **Acara Section**: Typography-focused Akad & Resepsi details with Google Maps links.
6. **Wedding Story**: Minimal vertical timeline of the couple's journey.
7. **Moment Indah (Gallery)**: Masonry or clean grid of wedding photos.
8. **Beri Hadiah (Gift)**: Clean bank cards with "Copy to Clipboard" functionality.
9. **Ucapan & Doa (Live Comments)**: Real-time message board using optimistic UI.
10. **Terima Kasih (Closing)**: Minimalist thank-you footer.

# DEVELOPMENT GUIDELINES
- **Mobile-First**: High-end responsiveness is a priority.
- **Scroll Management**: Lock `overflow-hidden` until the invitation is opened.
- **Optimistic UI**: Use for comments to ensure immediate user feedback.
- **Clean Code**: Modular TypeScript components.