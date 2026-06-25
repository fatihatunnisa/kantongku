# 💳 Kantongku — Modern Bento Finance Dashboard

Kantongku is a visually stunning, responsive, full-featured personal finance application designed with a clean, modular **Bento Grid** aesthetic. It simplifies budgeting, tracks cashflow, provides intelligent financial advice, and features an integrated OCR-powered bill splitter to manage expenses effortlessly with friends.

---

## ✨ Features

### 1.  Bento Grid Layout & Responsive Design
- A modular, structured interface with spacious gaps, rounded corners, and subtle interactive hover shadows.
- Beautiful, high-contrast typography pairing displaying clean **Display Headings** and technical status indicators.
- Seamlessly switches to an optimized mobile view with simple controls.

### 2. 📊 Dynamic Cashflow & Interactive Charts
- Tracks total income, total expenses, and your net cashflow in real-time.
- Supports flexible period filtering (**Daily**, **Monthly**, and **Yearly**) to zoom into your financial habits.
- Interactive, responsive line charts visualizing your cumulative income versus expenses over time.

### 3. 🛡️ Mode Aman (Secure Mode) with Eye Icons
- Easily toggle balance visibility directly on each summary card (**Total Income**, **Total Expense**, and **Net Cashflow**) using a modern and convenient eye icon (`Eye` / `EyeOff`).
- Instantly censors sensitive financial amounts (`Rp ••••••`) to keep your balances secure when showing the dashboard to others.
- Eliminates unnecessary sidebar clutter by placing the security control exactly where it is needed most.

### 4. 🤖 AI Budget Planner & Payday Survival
- Dynamically calculates your **Safe Daily Budget** based on your net cashflow and days remaining until your next payday.
- Alerts you when your daily budget is too tight, or gives you a green light when you are in a safe spending position.

### 5. 🧠 Smart Advisor
- Evaluates your current transaction logs and saving rate.
- Provides real-time context-specific financial guidance, rating your health (e.g., Warning, Danger, Stable, or Success) with corresponding warm or crisp color cards.

### 6. 👥 OCR-Powered Split Bill Assistant (Patungan / Split Bill)
- **Image Scanning (OCR)**: Upload an image of a physical receipt to auto-extract items, quantities, and prices using **Tesseract.js**.
- **Manual Adjustments**: Missing an item or don't have a receipt? Add items manually with a single click, edit item names, and adjust prices dynamically.
- **Flexible Assignments**: Add custom friend names and split individual items between multiple people. The app automatically calculates precise split totals.
- **Durable Export**: Download beautiful, crisp PDF receipt summaries for your group using **jsPDF** and **html2canvas**.
- **Auto-Sync**: Clicking "Done & Save" automatically commits your own personal portion of the split bill back to your recent expenses!
- **Optimized Mobile UX**: Features a streamlined mobile trigger button specifically scaled to stay clean, compact, and perfectly proportioned on compact screens.

---

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript + Vite (for lightning-fast builds)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **OCR Engine**: Tesseract.js
- **PDF Generation**: jsPDF + html2canvas
- **State Management**: Zustand (for clean, reactive local persistence)
- **Date Utilities**: date-fns
- **Charts & Visualization**: Recharts (for fluid, accurate line visualizers)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The application will run locally and can be accessed at `http://localhost:3000`.

---

## 🎨 Layout & Design Guidelines

This app adheres strictly to the **Bento Grid** theme:
- **Card Styling**: High-contrast white background cards with a slate border (`border-slate-200`), comfortable padding (`p-6`), and highly rounded corners (`rounded-3xl`).
- **Interactive States**: Smooth, modern transition speeds (`transition-all hover:shadow-md hover:-translate-y-0.5`).
- **Accent Theme**: Elegant Royal Blue (`blue-600`), Emerald (`emerald-600`), and Rose (`rose-600`) color scales to guide focus without visual clutter.
