# FleetFlow - Fleet Management System

## Overview
FleetFlow is a comprehensive web-based dashboard designed to manage vehicle fleets, trip bookings, driver logistics, and financial analytics. It provides a centralized interface for fleet operators to track vehicles, manage expenses, and monitor performance.

## Key Features
- **Vehicle Management**: Track fleet status, maintenance, and documentation.
- **Trip Tracking**: Monitor ongoing, completed, and pending trips with detailed logs.
- **Driver Portal**: Manage driver profiles, documents, and assignments.
- **Financial Analytics**: Dashboard for viewing revenue, expenses (fuel, tolls), and payments.
- **Booking System**: Interface for creating and managing new trip bookings.
- **Notifications & Alerts**: Real-time updates for fleet events and document expirations.

## Tech Stack
- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **State Management & Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) primitives with [Shadcn UI](https://ui.shadcn.com/) styling.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) validation.
- **Charts**: [Recharts](https://recharts.org/) for analytics visualization.
- **Testing**: [Vitest](https://vitest.dev/) (Unit) & [Playwright](https://playwright.dev/) (E2E).

## Project Structure
- `src/pages`: Main application views (Vehicles, Drivers, Trips, Finance, etc.).
- `src/components`: Reusable UI components (Buttons, Modals, Layouts).
- `src/hooks`: Custom React hooks for business logic and state.
- `src/lib`: Utility functions and configuration (API clients, shadcn utils).
- `src/data`: Mock data and static schemas for the application.

## Getting Started
1. **Install Dependencies**:
   ```bash
   npm install
