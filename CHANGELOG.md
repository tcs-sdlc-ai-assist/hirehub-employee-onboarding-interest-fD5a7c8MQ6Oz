# Changelog

All notable changes to the HireHub Onboarding Portal will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-15

### Added

- **Landing Page**: Welcome page introducing the HireHub Onboarding Portal with navigation to the interest form and admin dashboard.
- **Interest Form with Validation**:
  - Full name field with required validation.
  - Email field with format validation.
  - Mobile number field with pattern validation.
  - Department selection dropdown supporting Engineering, Design, Marketing, Sales, HR, and Finance.
  - Real-time inline error messages for all form fields.
  - Submission confirmation upon successful form completion.
- **Admin Login**: Secure login page for administrator access to the dashboard.
- **Admin Dashboard**:
  - View all submitted onboarding interest forms in a tabular layout.
  - Edit existing submissions (full name, mobile, department).
  - Delete submissions with confirmation.
  - Search and filter functionality for managing submissions.
- **localStorage Persistence**: All form submissions are persisted in the browser's localStorage, ensuring data is retained across page reloads and browser sessions.
- **Responsive Design**: Fully responsive layout optimized for desktop, tablet, and mobile viewports.
- **Vercel Deployment Configuration**: Project configured for seamless deployment on Vercel with proper build settings and SPA routing support.
- **TypeScript Support**: Full type safety across the application with typed components, form data, submissions, and department enums.
- **React 18+**: Built with React 18 using modern patterns including functional components and hooks.
- **Vite Build Tool**: Fast development server and optimized production builds powered by Vite.