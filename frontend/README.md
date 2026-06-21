# ⚡ TaskFlow — Deep Work Task Management

TaskFlow is a premium, high-efficiency task management frontend application built using **React 19**, **TanStack Start**, and **Tailwind CSS v4**. It features a modern, dark-first "Deep Work" aesthetic designed to optimize focus, minimize clutter, and streamline task orchestration.

> [!IMPORTANT]
> This repository is the **Frontend** component of TaskFlow. By default, it expects a backend server running at `http://localhost:8080`.

---

## ✨ Features

- **🎯 Deep Work Aesthetic**: An immersive, high-contrast dark-first interface with Material You-inspired color tokens, glassmorphism, responsive grid structures, and micro-animations.
- **🔐 Secure Authentication**: Full user signup and login flow. Seamless session preservation and JWT access/refresh token rotation handled gracefully via Axios interceptors.
- **📋 Precision Task Management**:
  - Full CRUD operations (Create, Read, Update, Delete) on tasks.
  - Granular control over **Priority** (`URGENT`, `HIGH`, `MEDIUM`, `LOW`) and **Status** (`TODO`, `IN_PROGRESS`, `COMPLETED`, `ARCHIVED`).
  - Immersive task detail modals and action-specific confirmation dialogs.
- **🔍 Advanced Searching & Filtering**:
  - Live search filtering by title/description with custom debouncing.
  - Multi-dimensional status and priority selection.
  - Multi-parameter sorting (Creation Date or Due Date).
- **📟 Pagination**: Efficient grid layouts with server-side page navigation.
- **🌗 Theme Toggle**: Instant transition between dark-first and light-first themes.
- **🔔 Toast System**: Contextual success/error notifications powered by `sonner`.

---

## 🛠️ Technology Stack

- **Core**: React 19, TypeScript
- **Meta-Framework**: [TanStack Start](https://tanstack.com/router/latest/docs/start/overview) (featuring file-based routing and SSR)
- **Styling**: Tailwind CSS v4 + `tw-animate-css`
- **Data Fetching & State**: TanStack React Query + Axios
- **Icons**: Google Material Symbols Outlined
- **Package Manager**: Bun (fallback: npm / yarn)

---

## 📂 Project Structure

```
Frontend/
├── .lovable/             # Lovable integration configuration
├── src/
│   ├── components/       # Reusable UI components & dialogs
│   │   ├── ui/           # Primitive shadcn/ui components
│   │   ├── TaskModal.tsx # Task creation & editing modal
│   │   ├── Icon.tsx      # Unified Material Symbols component
│   │   └── ...
│   ├── context/          # Application global contexts (Auth, Theme)
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Error boundary logging & page reporting
│   ├── pages/            # Core views (Home, Login, Register, Dashboard)
│   ├── routes/           # TanStack Start file-based route definitions
│   │   ├── __root.tsx    # App Shell with meta headers & font preconnects
│   │   └── ...
│   ├── services/         # API integration (Axios client & interceptors)
│   │   ├── api.ts        # Axios base, request & response interceptors
│   │   └── taskService.ts# Task management endpoints & TS types
│   ├── styles.css        # Material Design tokens & base global classes
│   ├── router.tsx        # TanStack router bootstrap
│   ├── server.ts         # Nitro server-side rendering handler
│   └── start.ts          # Client-side mounting entrypoint
├── components.json       # Shadcn UI configuration
├── tsconfig.json         # TypeScript configurations
└── vite.config.ts        # Vite building configurations
```

---

## 🚀 Getting Started

### 1. Prerequisites
Make sure you have [Bun](https://bun.sh/) (recommended) or [Node.js](https://nodejs.org/) (v18+) installed.

### 2. Install Dependencies
Run the install command using Bun:
```bash
bun install
```
Or if using npm:
```bash
npm install
```

### 3. Running the Development Server
To launch the Vite development server with hot-module reloading:
```bash
bun dev
```
Or with npm:
```bash
npm run dev
```
Once started, open [http://localhost:3000](http://localhost:3000) (or the port specified in terminal) in your browser.

### 4. Code Quality & Formatting
Run the linter and auto-formatter to maintain clean style guidelines:
```bash
# Run ESLint validation
bun run lint

# Auto-format codebase using Prettier
bun run format
```

### 5. Production Build
To build the application for production deployment:
```bash
bun run build
```

---

## 🌐 API & Integration

The network layer interacts with the backend endpoints via [src/services/api.ts](file:///d:/Taskflow/Frontend/src/services/api.ts).

### Custom Base URL
By default, the client points to `http://localhost:8080`. To change this, you can configure the environment variable `VITE_API_URL` (for example, in a `.env` file in the project root):
```env
VITE_API_URL=https://your-api-server.com
```
The application will dynamically use `import.meta.env.VITE_API_URL` for all API calls, falling back to `http://localhost:8080` if not set.

### Authorization Interceptor
All outgoing requests are intercepted to dynamically attach the `taskflow_access_token` stored in LocalStorage. If a request returns a `401 Unauthorized` response, the client uses a queue mechanism to call `/api/auth/refresh`, rotate JWT credentials, update LocalStorage, and automatically retry any failed requests in the pipeline transparently to the user.
