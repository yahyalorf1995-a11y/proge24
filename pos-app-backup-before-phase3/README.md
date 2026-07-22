# Personal Operating System (POS)

A production-ready, SaaS-grade Personal Operating System designed to help users build their identity, organize their lives, execute goals, review progress, and continuously improve. 

This is not a simple to-do list; it is a strategic execution engine.

## 🌟 Product Vision & Hierarchy
Everything in this system revolves around a strict hierarchy:
`Identity` → `Constitution` → `Vision` → `Life Areas` → `Goals` → `Projects` → `Tasks` → `Habits` → `Reviews` → `Analytics`.

## 🚀 Core Features
- **Command Center (Dashboard):** A unified view of top priorities, active projects, daily habits, and AI-driven insights.
- **Strategy Modules:** Define your Mission, Vision, and Constitution.
- **Execution Modules:** Break down Life Areas into Goals, Projects, and daily Tasks.
- **Tracking Modules:** Build consistency through Habits and log daily thoughts via the Journal.
- **Continuous Improvement:** Conduct Weekly/Monthly Reviews and track overall success through Analytics.
- **AI Coach Ready:** Context-gathering architecture built-in, ready to be plugged into any LLM (OpenAI, Claude) for personalized daily coaching.

## 🛠 Tech Stack
- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
- **Language:** TypeScript (Strict Mode)
- **Database:** PostgreSQL (via [Prisma ORM](https://www.prisma.com/)) *Currently running with a Mock DB for sandbox environments.*
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/) (Radix UI primitives)

## 📦 Local Setup & Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/pos_db"
   ```
   *(Note: The current repository uses an advanced in-memory Mock DB inside `src/lib/db.ts` for rapid prototyping. To switch to production DB, remove the mock and use standard Prisma client).*

3. **Database Migration**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗 Architecture
- Clean Architecture principles applied.
- **`src/app/`**: Contains the Next.js routes, loading states, and error boundaries.
- **`src/components/`**: Reusable UI components (Shadcn) and layout wrappers (AppSidebar).
- **`src/features/`**: Server actions and business logic segregated by module (e.g., `identity/actions.ts`).
- **`src/lib/`**: Core utilities, database client, and AI context gatherer.

## 🛡 License
MIT License.
