# HireHub Onboarding Portal

A modern employee onboarding portal built with React 18, TypeScript, and Vite. This application streamlines the new hire onboarding process by providing a clean interface for submitting and managing employee information across departments.

## Tech Stack

- **React 18** — UI library with functional components and hooks
- **TypeScript** — Static type checking
- **Vite** — Fast build tool and dev server
- **React Router v6** — Client-side routing
- **Plain CSS** — Styling without external UI frameworks

## Features

- **Onboarding Form** — New hire submission form with full validation (name, email, mobile, department)
- **Department Selection** — Support for Engineering, Design, Marketing, Sales, HR, and Finance departments
- **Submissions Dashboard** — View all submitted onboarding entries in a structured table
- **Edit Submissions** — Update employee details (name, mobile, department) after submission
- **Delete Submissions** — Remove onboarding entries with confirmation
- **Form Validation** — Real-time client-side validation with descriptive error messages
- **Responsive Design** — Works across desktop and mobile devices

## Folder Structure

```
src/
├── components/        # Reusable UI components
├── pages/             # Route-level page components
├── types/             # TypeScript type definitions and interfaces
│   └── index.ts       # Shared types (Department, Submission, FormErrors, EditFormData)
├── App.tsx            # Root component with routing
├── main.tsx           # Application entry point
└── index.css          # Global styles
```

## Getting Started

### Prerequisites

- **Node.js** >= 16
- **npm** >= 8

### Installation

```bash
npm install
```

### Development

Start the local development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build

Create a production build:

```bash
npm run build
```

The output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Deployment (Vercel)

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Go to [vercel.com](https://vercel.com) and import the repository.
3. Vercel will auto-detect the Vite framework. Confirm the following settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. Click **Deploy**.

For client-side routing to work correctly on Vercel, add a `vercel.json` file to the project root:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## Admin Credentials

This application does not currently require authentication. All onboarding features are accessible without login credentials.

## License

Private — All rights reserved.