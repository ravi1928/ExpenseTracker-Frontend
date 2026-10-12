# Expense Tracker — Frontend Application

Modern, responsive personal financial dashboard built with **React 18**, **Vite**, **Tailwind CSS**, and **Recharts**.

---

## 🚀 Technology Stack
* **Framework**: React 18 (Vite)
* **Styling**: Tailwind CSS, Custom Navy & Emerald color theme
* **Routing**: React Router DOM v6
* **Data Visualization**: Recharts (Pie charts, Monthly trend bar charts, Donut breakdown)
* **Icons**: Lucide React
* **HTTP Client**: Axios with Bearer token interceptors

---

## 🌟 Key Features
* **Authentication**: Login & Registration forms with client-side validation and JWT persistence
* **Dashboard Overview**: Available balance, total income, total expenses, and monthly savings cards
* **Transaction Management**: Add, view, edit, search, and delete expenses and incomes
* **Monthly Budgets**: Category spend limits with visual progress bars and warnings
* **Analytics & Reports**: Visual charts, date-range filtering, and CSV export
* **Responsive Design**: Full mobile and desktop navigation support with optional Dark Mode

---

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Backend API URL
Create a `.env` file in the root of `frontend` (optional for production):
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

### 3. Run Development Server
```bash
npm run dev
```

Application will run locally on `http://localhost:5173`.
