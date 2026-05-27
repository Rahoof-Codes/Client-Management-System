# ClientOS — Client Management System (CRM)

ClientOS is a private, full-stack CRM built for freelancers and small agencies to manage clients, track payments, and delegate work to staff — all in one clean and modern dashboard. Built entirely with React, Tailwind CSS 4.0, and Supabase, it features a role-based access system where Admin has full control over client data and financials, while Staff gets a clean view-only interface showing only what they need to work.

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS 4.0 |
| Backend | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Hosting | GitHub Codespaces |

## ✨ Features

### 🔐 Authentication
- Role-based login page with Admin and Staff sections
- Server-side role verification via Supabase profiles table
- Row Level Security (RLS) — data fully protected at database level

### 👑 Admin Dashboard
- Add, edit, and delete clients
- Two client types — **Monthly** (recurring billing with cycle start date and monthly rate) and **One-Time** (fixed project with total value and deadline)
- Payment status tracking — Pending, Paid, Overdue
- One-click Mark as Paid for monthly clients
- Outstanding balance counter
- Search clients by name, email, or company
- Filter by client type and sort by newest, name, or payment status
- Export full client list to CSV

### 👥 Staff Dashboard
- View-only access — no financials visible
- See client name, company, and project requirements only
- Simple search to find clients quickly


## 🗄 Database Schema

### profiles
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | References auth.users |
| role | text | admin or staff 
| full_name | text | Optional display name |

## 🔒 Security
- All routes protected behind AuthGuard
- Supabase RLS policies ensure users only access their own data
- Staff accounts have read-only database access enforced at DB level
- Role verified server-side on every login attempt

## 📄 License
Private — for personal use only.
