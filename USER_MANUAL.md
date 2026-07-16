# SYAM INFRA MANAGEMENT SYSTEM (CMS)
## Official User Manual & Client Handover Guide

---

## 🏢 1. Welcome to SYAM INFRA CMS
The **SYAM INFRA Management System** is a powerful, centralized digital portal designed specifically for construction companies, interior designers, and project managers. It streamlines everything from milestone-based client payments and daily site expenses to BOQ document management, materials tracking, and executive financial reporting.

---

## 🔐 2. Getting Started & User Roles

### Accessing the Portal & Default Login Credentials
To get started right away, use the default administrator credentials created when the system initializes:

> [!IMPORTANT]
> **Default Initial Login Credentials**
> - **Username**: `admin`
> - **Password**: `admin123`
> *(Note: We strongly advise logging into the Profile page after your first login to change your password for security.)*

1. Open the web portal URL provided by your system administrator.
2. Enter your **Username (`admin`)** and **Password (`admin123`)** on the secure login screen.
3. Click **Login** to enter your personalized dashboard.

### Understanding User Roles
The platform operates on a multi-tier role hierarchy to protect sensitive financial data:
- **👑 Admin**: Full access across the entire platform. Can create new users, manage company-wide financial reports, delete records, and download complete database backups.
- **🛠️ Manager**: Can create and update projects, record daily site expenses, log stage payments, update site progress, and upload project documents.
- **👁️ Viewer**: Read-only access to view project progress, schedules, and reports without the ability to modify or delete sensitive financial records.

---

## 📊 3. Dashboard Overview
When you log in, the **Dashboard** gives you an instant, real-time pulse of your entire construction business.

### Key Metrics at a Glance
- **Active Projects**: Total number of ongoing construction and interior projects.
- **Completed Projects**: Total projects successfully handed over to clients.
- **Total Revenue**: Cumulative earnings across all projects and stage collections.
- **Pending Payments**: Total outstanding balances yet to be collected from clients.
- **Total Expenses**: Overall expenditure spent on labor, materials, machinery, and transport.

### 🖨️ Instant Reports & Printing
- **`Download Export PDF`**: Generates a high-resolution, branded PDF overview of your company statistics.
- **`🖨️ Print`**: Instantly launches your printer dialog to print out a hard copy of the executive dashboard for office meetings.

---

## 🏗️ 4. Project Management Hub (`/projects`)

### Creating a New Project
1. Navigate to **Projects** from the left sidebar and click **`+ New Project`**.
2. Fill in the required project details:
   - **Project Name & ID**: e.g., *Greenwood Villa (PRJ-101)*
   - **Client Information**: Client Name & Contact Number
   - **Site Location**: Site address or landmark
   - **Contract Value**: Total estimated project cost in ₹
   - **Timeline**: Start Date & Expected Completion Date
   - **Project Type**: Select from:
     - `Cement + Interiors`
     - `Cement Work Only`
     - `Interiors`
     - `Designs And Supervision`
3. Click **Create Project**.

### Searching & Filtering
Use the top search bar to instantly find projects by **Client Name** or **Project ID**. You can also click on the Category Cards at the top (`Cement Work Only`, `Interiors`, etc.) to filter projects by division.

---

## 📑 5. Project Details (The 6-In-1 Operations Center)
Clicking on any project opens its dedicated **Operations Center**. Navigate between the 6 distinct tabs to manage day-to-day site activities:

### 1️⃣ Overview Tab
Displays core contract details, client contact numbers, timeline status, and quick access to the **Client Ledger Report**.

### 2️⃣ Payment Schedules Tab
Track client billing stages and record money received:
- **Create Stage Dues**: Click `+ Add Stage` to define milestones (e.g., *Stage 1: Plinth & Foundation - ₹5,00,000* due on a specific date).
- **Collect Payments**: Click **`Collect`** on any pending stage to record incoming funds. Enter the exact amount received, date of receipt, and payment mode/notes.
- **Payment History**: View a complete chronological log of every installment received.

### 3️⃣ Site Expenses Tab
Record all money spent on the project site to maintain transparency:
- **Log Expense**: Click `+ Add Expense` and categorize it under:
  - `Material` (Cement, Steel, Bricks, Tiles)
  - `Labor` (Daily wage workers, contractors)
  - `Machinery` (JCB, mixers, cranes)
  - `Transportation` (Freight, delivery trucks)
  - `Miscellaneous`
- **Attach Receipts**: Upload digital copies of vendor bills or vouchers directly to each expense entry for audit verification.

### 4️⃣ Documents Tab
Your digital site binder:
- Upload and download critical project files such as **Agreements**, **BOQ (Bill of Quantities)**, **Architectural Floor Plans**, and **Legal Approvals**.

### 5️⃣ Site Progress Tab
Keep clients and managers updated on actual physical work:
- Record completion milestones (e.g., *Brickwork Completed - 45%*) along with site inspection notes. This automatically updates the project's overall progress bar on the main dashboard.

### 6️⃣ Materials Inventory Tab
Monitor construction material usage on site:
- Track items like **Cement Bags**, **Steel (Tons)**, **Sand (Cu. Ft.)**, and **Tiles (Sq. Ft.)**.
- View **Total Ordered Quantity** vs. **Used Quantity** to prevent site shortages or material wastage.

---

## 📜 6. Executive Client Ledger Reports
Generate professional, audit-ready financial statements for your clients at any time from the Project Overview page:

- **`👁️ View Ledger`**: Opens the formatted PDF ledger inside your browser in a new tab.
- **`🖨️ Print Ledger`**: Instantly formats the ledger with corporate branding, right-aligned currency columns, and page numbering, then triggers your native printer dialog.
- **`📥 Export`**: Downloads the ledger (`Ledger_PRJ-101.pdf`) directly to your computer to share via email or WhatsApp.

---

## 🧾 7. Invoices Management (`/invoices`)
The **Invoices** module allows you to issue formal billing requests and track status (`Draft`, `Sent`, `Paid`, `Overdue`):
1. Click **`+ Create Invoice`** and select the target project.
2. Add line items describing the work done and individual costs.
3. Save or issue the invoice.
4. Click **`View / Print`** on any invoice to generate a clean, executive PDF invoice ready for client delivery.

---

## 📈 8. Financial Reports & Profitability Analytics (`/reports`)
For company executives and accountants, the **Reports** section offers deep insights into overall financial health:
1. Select a **Start Date** and **End Date** range.
2. Click **`Generate Report`** to view comprehensive totals for:
   - **Total Company Revenue**
   - **Total Site & Overhead Expenses**
   - **Net Profit / Loss Calculation**
3. Use the **`🖨️ Print`** or **`📥 Export`** buttons to produce official management summary sheets.

---

## 👥 9. Team Administration (`/team`)
*(Admin Access Required)*
Manage staff accounts and login permissions:
- Click **`+ Add Member`** to create new credentials for site engineers, accountants, or project managers.
- Assign the appropriate security role (`Admin`, `Manager`, or `Viewer`).
- Easily deactivate or remove users when staff responsibilities change.

---

## 🛡️ 10. Data Security & Database Backups (`/profile`)
Your profile page allows you to update personal passwords and select a custom profile avatar.

### 1-Click Database Safety (For Admins)
To protect against accidental deletions or server failures, Admins have access to the **Database Safety & Data Export** tool:
- **`🗄️ Universal Backup (JSON)`**: Generates and downloads a complete, structured snapshot of every project, payment record, bill, user account, and material log in your company database. Works flawlessly on cloud servers (PostgreSQL / Supabase).
- **`📥 Download SQLite File (.db)`**: Allows local server installations to download the raw binary database directly.

> **💡 Best Practice**: We recommend Administrators download a **Universal Backup (JSON)** once every week and save it to a secure external drive or cloud storage (Google Drive / OneDrive) for total peace of mind.

---

## ❓ 11. Quick Troubleshooting & Tips
- **Page Feels Slow or Data Not Showing?** Check your internet connection. The system automatically displays smooth gray placeholder animations while loading data from the cloud.
- **Need to Change Password?** Go to **Profile Settings** from the bottom-left of your sidebar, enter your current password along with your new password, and save.
- **Accidental Deletion?** Every major deletion requires a double confirmation. If you accidentally delete a stage payment or material item, immediately check your latest Universal Database Backup or contact your system administrator.

---
*Generated for SYAM INFRA Management System • All Rights Reserved.*
