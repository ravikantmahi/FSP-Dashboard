<div align="center">

# 📊 FSP Training Dashboard

### _Future Skills Program · Directorate of Technical Education, Punjab_

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-6366f1?style=for-the-badge&logoColor=white)](https://fsp-dashboard-nine.vercel.app/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-ec4899?style=for-the-badge)](LICENSE)

<br />

> An interactive, real-time analytics dashboard built for DTE Punjab's **Future Skills Program (FSP)** — tracking training participants across **Big Data** and **AR/VR** courses offered in government  School and colleges across Punjab.

<br />

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎯 **KPI Cards** | Animated counters for total participants, districts covered, top colleges & gender ratio |
| 📊 **Interactive Charts** | Recharts-powered bar, pie & line charts with smooth transitions |
| 🗺️ **District Map** | React Leaflet interactive map with custom animated markers per district |
| 🏆 **District Leaderboard** | Ranked list of top districts by participant count with progress bars |
| 📋 **Batch Breakdown** | Visual representation of Batch 1–4 distribution across courses |
| 🔍 **Participant Directory** | Searchable & filterable table by name, college, district, or email |
| 👩‍🏫 **Faculty Section** | Dedicated "About" panel for course faculty with social profiles |
| 🌙 **Dark / Light Mode** | Theme toggle with full CSS variable–driven dark mode support |
| ⏱️ **Live Clock** | Real-time clock display in the header |
| 📥 **CSV Export** | Download filtered participant data as a CSV file |
| 📱 **Fully Responsive** | Adapts gracefully from mobile to ultra-wide desktop screens |

---

## 🛠️ Tech Stack

```
Frontend Framework  →  React 19 + Vite 8
Styling             →  Tailwind CSS 4 + Vanilla CSS (CSS Variables)
Charts              →  Recharts 3
Maps                →  React Leaflet 5 + Leaflet 1.9
Icons               →  Lucide React
Fonts               →  Inter · Space Grotesk (Google Fonts)
Linting             →  ESLint 10 + eslint-plugin-react-hooks
```

---

## 📂 Project Structure

```
FSP DashBoard/
├── public/
│   ├── favicon.svg          # App favicon
│   └── icons.svg            # SVG icon sprites
├── src/
│   ├── assets/              # Static assets
│   ├── data/
│   │   └── participants.json  # Training participant dataset
│   ├── App.jsx              # Main dashboard component (~1300 lines)
│   ├── App.css              # Component-level styles
│   ├── index.css            # Global CSS design system & variables
│   └── main.jsx             # React DOM entry point
├── index.html               # SEO-optimised HTML shell
├── vite.config.js           # Vite + Tailwind config
├── eslint.config.js         # ESLint flat config
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x (or pnpm / yarn)

---

## 📊 Dashboard Sections

### 1 · Program Overview
Key metrics at a glance — total trainees, district coverage, top college & female participation rate — with animated count-up transitions.

### 2 · Analytics
Deep-dive charts:
- **Gender Distribution** — Donut pie chart
- **Role / Designation Breakdown** — Horizontal bar chart
- **District Heatmap** — Bar chart sorted by participant volume

### 3 · District Map
Interactive Leaflet map with custom glassmorphism bubble markers. Each marker shows the district name and participant count in a pop-up.

### 4 · Participant Directory
Full searchable roster with real-time filtering by name, email, college, or district. Supports CSV export of filtered results.

### 5 · About / Faculty
Faculty cards with name, specialisation, bio, and social profile links (GitHub, LinkedIn, Portfolio).

---

## 🎨 Design System

The dashboard uses a **CSS Variable–based design system** defined in `src/index.css`:

```css
--accent:        #6366f1   /* Indigo primary */
--accent-pink:   #ec4899   /* Pink accent    */
--accent-amber:  #f59e0b   /* Amber accent   */
--font-display:  'Space Grotesk', sans-serif
--font-body:     'Inter', sans-serif
--radius-lg:     16px
--radius-xl:     22px
```

Full dark-mode support via `[data-theme="dark"]` attribute toggled on `<html>`.

---

## 🔍 SEO Optimisation

The `index.html` includes:

- ✅ Descriptive `<title>` tag with primary keywords
- ✅ `<meta name="description">` with 155-character summary
- ✅ `<meta name="keywords">` for domain-relevant terms
- ✅ **Open Graph** tags for rich social media previews (Facebook, WhatsApp, etc.)
- ✅ **Twitter Card** (`summary_large_image`) for Twitter/X sharing
- ✅ **JSON-LD Structured Data** (`WebApplication` schema) for Google rich results
- ✅ `<link rel="canonical">` to prevent duplicate content issues
- ✅ `<meta name="theme-color">` for browser UI theming
- ✅ Google Fonts loaded with `rel="preconnect"` for performance

---

## 📡 Data Schema

Participant records are stored in `src/data/participants.json`.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. **Fork** the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a **Pull Request**

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

## 👨‍💻 Author

<div align="center">

**Ravikant Mahi**

_Full-Stack Developer · Data Enthusiast_

[![GitHub](https://img.shields.io/badge/GitHub-ravikantmahi-181717?style=flat-square&logo=github)](https://github.com/ravikantmahi)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-ravikantmahi-0077B5?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/ravikantmahi/)
[![Instagram](https://img.shields.io/badge/Instagram-ravikant.mahii-E4405F?style=flat-square&logo=instagram)](https://www.instagram.com/ravikant.mahii)
[![Medium](https://img.shields.io/badge/Medium-ravikantmahi-000000?style=flat-square&logo=medium)](https://ravikantmahi.medium.com/)

</div>

---

<div align="center">

Made with ❤️ for **FSP** · © 2025 Ravikant Mahi

_If you found this project useful, please ⭐ star the repository!_

</div>
