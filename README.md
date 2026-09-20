# InvoBazar ⚡

> Smart Invoicing for Indian Businesses

**InvoBazar** is a streamlined SaaS-grade web application built to create, manage, preview, and download professional **Proforma and Tax Invoices** with automated GST calculations, item cataloging, client records, custom invoice templates, and instant print/PDF export.

---

## 🌟 Key Features

- **Authentication & Multi-Tenant Isolation:** Secure user registration, credential hashing with bcryptjs, and edge-compatible JWT session management via HTTP-only cookies.
- **Dynamic Proforma Invoice Builder:**
  - Auto-generated sequential invoice numbers (e.g., `PI-2026-001`).
  - 1-Click client auto-fill from saved client directory or ad-hoc custom entry.
  - Multi-item line builder with item selection from pre-saved catalog.
  - Automatic real-time calculations for:
    - Item totals & GST tax amounts (`qty * rate + tax`).
    - Subtotal (pre-tax).
    - Percentage or fixed discount deductions.
    - Estimated GST aggregate.
    - Grand total.
  - Real-time number-to-words conversion for legal invoice accuracy (e.g. *One Lakh Twenty Thousand Rupees Only*).
- **Pixel-Perfect Print & PDF Export:**
  - Designed with customized `@media print` stylesheets for standard A4 portrait output.
  - Direct browser "Save as PDF" / printer dialogue with clutter-free branding, GSTIN breakdown, seller/buyer details, and authorized signatory blocks.
- **Product & Inventory Catalog:**
  - Create, view, edit, and delete products with SKU, description, pricing, GST tax rates (0%, 5%, 12%, 18%, 28%), unit types (`PCS`, `NOS`, `BOX`, `KG`, `MTR`, `HRS`, `SET`), and categories.
  - Real-time search and category filtering.
- **Client Directory:**
  - Manage company name, contact person, email, phone, billing address, shipping address, and GSTIN numbers.
  - Integrated "Same as billing address" synchronization.
- **Live Invoice History & Status Workflow:**
  - Filter and track invoice lifecycle: `DRAFT`, `SENT`, `ACCEPTED`, `DECLINED`, and `EXPIRED`.
  - Full edit and delete capabilities with relational cascade management.
- **SaaS Executive Dashboard:**
  - Key Performance Indicators (KPIs): Total Invoices, Cumulative Invoice Value, Active Products, and Saved Clients.
  - Recent invoices activity table with quick preview and status indicators.
  - 1-Click "Load Demo Data" seed button to instantly populate realistic sample data.
- **Business Profile Settings:**
  - Configure seller company name, registered business address, GSTIN, and default currency symbols (`₹`, `$`, `€`, `£`, `AED`).

---

## 🛠️ Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router) | Server-side rendering, React Server Components, and optimized API routes |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Strict static type safety across client, server, and database models |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Modern utility-first responsive styling and dedicated `@media print` rules |
| **Database & ORM** | [Prisma ORM](https://www.prisma.io/) with [SQLite](https://www.sqlite.org/) | Zero-config, zero-friction local persistence with instant migration support |
| **Security & Auth** | [bcryptjs](https://github.com/dcodeIO/bcrypt.js) + [jose](https://github.com/panva/jose) | Edge-compatible JWT signing and secure password salting |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, consistent UI iconography |

---

## 🏛️ Architecture & Scalability

InvoiceFlow follows a modular, layered architecture separating concerns across the stack:

```
┌────────────────────────────────────────────────────────┐
│                   Presentation Layer                   │
│   (Next.js App Router Pages, Tailwind CSS & Modals)    │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                    Component Layer                     │
│  (InvoiceForm, InvoicePreview, ProductModal, Sidebar)  │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                   API / Route Handlers                 │
│      (/api/invoices, /api/products, /api/clients)      │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                Business Logic & Utilities              │
│       (JWT Auth, GST Calculators, Number-to-Words)     │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                   Data Access Layer                    │
│            (Prisma ORM Client Singleton)               │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                       Database                         │
│             (SQLite - dev.db / PostgreSQL)             │
└────────────────────────────────────────────────────────┘
```

---

## 📁 Folder Structure

```
InvoiceFlow/
├── prisma/
│   ├── schema.prisma        # Database schema definitions (User, Product, Client, Invoice, InvoiceItem)
│   └── seed.ts              # Database seeding script with realistic dummy records
├── src/
│   ├── app/
│   │   ├── (dashboard)/     # Authenticated dashboard route group
│   │   │   ├── layout.tsx   # Dashboard layout shell with responsive sidebar & topbar
│   │   │   ├── dashboard/   # Dashboard overview with KPI stats and recent activity
│   │   │   ├── products/    # Product catalog list, filter, and CRUD
│   │   │   ├── clients/     # Client directory and management
│   │   │   ├── invoices/    # Invoices list and status filters
│   │   │   │   ├── new/     # New invoice builder
│   │   │   │   └── [id]/    # Invoice view / print sheet
│   │   │   │       └── edit/# Invoice editor
│   │   │   └── settings/    # Seller company and GST settings
│   │   ├── api/             # RESTful API route endpoints
│   │   │   ├── auth/        # /login, /register, /logout, /me
│   │   │   ├── products/    # /products & /products/[id]
│   │   │   ├── clients/     # /clients & /clients/[id]
│   │   │   ├── invoices/    # /invoices, /invoices/[id], /invoices/next-number
│   │   │   ├── dashboard/   # /dashboard/stats
│   │   │   ├── user/        # /user/profile
│   │   │   └── seed/        # 1-Click demo seeder endpoint
│   │   ├── login/           # User sign-in page
│   │   ├── register/        # User registration page
│   │   ├── globals.css      # Tailwind base and @media print rules
│   │   ├── layout.tsx       # Root application layout
│   │   └── page.tsx         # Modern landing page
│   ├── components/
│   │   ├── layout/          # Sidebar, Header
│   │   ├── invoices/        # InvoiceForm (live builder), InvoicePreview (printable sheet)
│   │   ├── products/        # ProductModal
│   │   ├── clients/         # ClientModal
│   │   └── ui/              # Reusable modal and input components
│   ├── lib/
│   │   ├── auth.ts          # Edge-compatible JWT sign & verification with jose
│   │   ├── db.ts            # Prisma client singleton
│   │   ├── types.ts         # TypeScript interfaces
│   │   └── utils.ts         # GST calculators, date formatting, and number-to-words
│   └── middleware.ts        # Next.js authentication route guard
├── .env.example             # Example environment variables
├── .gitignore               # Comprehensive Git exclusions
├── package.json             # NPM dependencies and scripts
├── tailwind.config.ts       # Tailwind CSS theme configuration
└── tsconfig.json            # TypeScript configuration
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.17.0 or newer (tested with Node v22)
- **npm** or **yarn** / **pnpm**

### 2. Installation

Clone the repository and install dependencies:

```bash
npm install
```

### 3. Environment Variables Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Contents of `.env`:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="invoiceflow-super-secret-key-change-in-production-min32chars"
```

### 4. Database Setup & Seeding

Initialize the SQLite database and generate the Prisma Client:

```bash
npx prisma db push
```

*(Optional)* Seed sample products, clients, and a demo invoice:

```bash
npm run seed
```

**Pre-seeded Demo Credentials:**
- **Email:** `demo@invoiceflow.io`
- **Password:** `DemoPassword123!`
*(Or click "Fill Demo Credentials" on the login screen, or create your own account)*

### 5. Running Locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Building for Production

To create an optimized production build:

```bash
npm run build
```

To run the production server:

```bash
npm start
```

---

## 🔮 Future Roadmap

- [ ] Multi-currency real-time exchange rate conversion
- [ ] Export directly to downloadable `.xlsx` and `.csv` sheets
- [ ] Email invoice directly to client via SendGrid / Resend with tracking
- [ ] Multiple customizable invoice PDF color schemes and templates
- [ ] Recurring invoice automation & payment gateway integration (Stripe / Razorpay)
- [ ] Multi-user team workspace permissions (Admin, Accountant, Viewer)

---

## 👨‍💻 Author

Developed with care by **Rajan Puri** ([GitHub](https://github.com/rajan-puri)).
