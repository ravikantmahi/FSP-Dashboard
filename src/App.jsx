import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, LineChart, Line, CartesianGrid, Legend
} from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import {
  Users, MapPin, Sparkles, Layers, Search, GraduationCap,
  Mail, Download, Briefcase, Building2, Moon, Sun, TrendingUp,
  Award, Activity, Filter, ChevronRight, BarChart2, Map,
  BookOpen, UserCheck, Globe, Info, Zap, Target, Shield,
  Clock, DollarSign, Star, ExternalLink
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import './App.css';
import trainingData from './data/participants.json';

/* ── Inline SVG social icons (version-safe) ── */
const GithubIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedinIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   MAP MARKER — Glassmorphism bubble with live count
═══════════════════════════════════════════════════════════ */
const createCustomIcon = (count) =>
  L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="position:relative;display:flex;align-items:center;justify-content:center;width:44px;height:44px;">
        <span style="position:absolute;inset:0;border-radius:50%;background:rgba(99,102,241,0.22);animation:ping 1.6s cubic-bezier(0,0,0.2,1) infinite;"></span>
        <div style="
          position:relative;
          width:38px;height:38px;
          border-radius:50%;
          background:linear-gradient(135deg,#6366f1,#8b5cf6);
          color:#fff;
          font-family:'Space Grotesk','Inter',sans-serif;
          font-weight:800;
          font-size:13px;
          display:flex;align-items:center;justify-content:center;
          box-shadow:0 4px 18px rgba(99,102,241,0.45),0 0 0 3px rgba(255,255,255,0.9);
          letter-spacing:-0.5px;
        ">${count}</div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -24],
  });

/* ═══════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════ */
const CHART_COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6', '#3b82f6'];

const BATCH_COLORS = {
  'Batch 1': '#6366f1',
  'Batch 2': '#ec4899',
  'Batch 3': '#f59e0b',
  'Batch 4': '#10b981',
};

/* ═══════════════════════════════════════════════════════════
   ANIMATED COUNTER HOOK
═══════════════════════════════════════════════════════════ */
function useCountUp(target, duration = 700) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (typeof target !== 'number') return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setCount(start);
      if (start >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return typeof target === 'number' ? count : target;
}

/* ═══════════════════════════════════════════════════════════
   KPI CARD COMPONENT
═══════════════════════════════════════════════════════════ */
function KpiCard({ label, value, sub, icon: Icon, color, bg, trend, delay = 0 }) {
  const animated = useCountUp(typeof value === 'number' ? value : NaN);
  const displayVal = typeof value === 'number' ? animated : value;

  return (
    <div
      className={`glass-card glass-card-lift fade-in-${delay + 1}`}
      style={{ borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div
          style={{
            width: 48, height: 48, borderRadius: 14,
            background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: color, flexShrink: 0,
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
          }}
        >
          <Icon size={22} strokeWidth={2.2} />
        </div>
        {trend !== undefined && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 700, color: '#10b981', background: 'rgba(16,185,129,0.10)', borderRadius: 99, padding: '3px 8px' }}>
            <TrendingUp size={10} /> {trend}
          </span>
        )}
      </div>
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
          {label}
        </p>
        <p style={{
          fontFamily: 'var(--font-display)', fontSize: '1.9rem', fontWeight: 800,
          color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '-0.04em',
          wordBreak: 'break-word'
        }}>
          {displayVal}
        </p>
        {sub && (
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginTop: 4 }}>{sub}</p>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DISTRICT LEADERBOARD COMPONENT (NEW)
═══════════════════════════════════════════════════════════ */
function DistrictLeaderboard({ districtCounts }) {
  const sorted = [...districtCounts].sort((a, b) => b.count - a.count).slice(0, 8);
  const max = sorted[0]?.count || 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
      {sorted.map((d, i) => (
        <div key={d.district} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 800,
            color: i < 3 ? '#6366f1' : 'var(--text-muted)',
            width: 20, textAlign: 'center', flexShrink: 0
          }}>
            {i + 1 <= 3 ? ['🥇', '🥈', '🥉'][i] : `#${i + 1}`}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.district}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 800, color: 'var(--accent)', marginLeft: 8, flexShrink: 0 }}>{d.count}</span>
            </div>
            <div style={{ height: 5, borderRadius: 99, background: 'var(--border)', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${(d.count / max) * 100}%`,
                  borderRadius: 99,
                  background: `linear-gradient(90deg, #6366f1, #8b5cf6)`,
                  transition: 'width 0.8s cubic-bezier(0.22,1,0.36,1)'
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   BATCH BREAKDOWN (NEW)
═══════════════════════════════════════════════════════════ */
function BatchBreakdown({ filteredData }) {
  const batchCounts = useMemo(() => {
    const acc = {};
    filteredData.forEach(p => {
      acc[p.batch] = (acc[p.batch] || 0) + 1;
    });
    return Object.entries(acc).map(([name, count]) => ({ name, count })).sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredData]);

  const total = filteredData.length || 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
      {batchCounts.map(b => (
        <div key={b.name}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>{b.name}</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 800, color: BATCH_COLORS[b.name] || 'var(--accent)' }}>
              {b.count} <span style={{ fontWeight: 500, color: 'var(--text-muted)', fontSize: 11 }}>({Math.round((b.count / total) * 100)}%)</span>
            </span>
          </div>
          <div style={{ height: 7, borderRadius: 99, background: 'var(--border)', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${(b.count / total) * 100}%`,
              borderRadius: 99,
              background: BATCH_COLORS[b.name] || '#6366f1',
              opacity: 0.85,
              transition: 'width 0.8s cubic-bezier(0.22,1,0.36,1)'
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CUSTOM PIE LABEL
═══════════════════════════════════════════════════════════ */
const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 1.35;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (percent < 0.05) return null;
  return (
    <text x={x} y={y} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central"
      style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-display)', fill: 'var(--text-secondary)' }}>
      {name} {(percent * 100).toFixed(0)}%
    </text>
  );
};

/* ═══════════════════════════════════════════════════════════
   MAIN DASHBOARD
═══════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const [activeCourse, setActiveCourse] = useState('Big Data');
  const [activeBatch, setActiveBatch] = useState('All');
  const [activeTab, setActiveTab] = useState('program');
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  /* ── Clock ── */
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  /* ── Dark mode ── */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  /* ── 1. Course + Batch filter ── */
  const filteredData = useMemo(() =>
    trainingData.filter(item => {
      let matchCourse = false;
      if (activeCourse === 'Big Data') {
        matchCourse = item.course === 'Big  Data & Data Science' || item.course === 'Big Data' || item.course === 'Big Data & Data Science';
      } else if (activeCourse === 'ARVR') {
        matchCourse = item.course === 'Augmented Reality and Virtual Reality' || item.course === 'ARVR';
      } else {
        matchCourse = item.course === activeCourse;
      }
      const matchBatch = activeBatch === 'All' || item.batch === activeBatch;
      return matchCourse && matchBatch;
    }), [activeCourse, activeBatch]);

  /* ── 2. Directory search ── */
  const directoryData = useMemo(() =>
    filteredData.filter(item =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.college?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase())
    ), [filteredData, searchTerm]);

  /* ── 3. Map data ── */
  const districtCounts = useMemo(() => {
    const acc = {};
    filteredData.forEach(p => {
      if (p.lat && p.lng && p.district) {
        if (!acc[p.district]) acc[p.district] = { district: p.district, lat: p.lat, lng: p.lng, count: 0 };
        acc[p.district].count += 1;
      }
    });
    return Object.values(acc);
  }, [filteredData]);

  /* ── 4. Gender chart ── */
  const genderData = useMemo(() => {
    const counts = filteredData.reduce((acc, curr) => {
      if (curr.gender) acc[curr.gender] = (acc[curr.gender] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).map(k => ({ name: k, value: counts[k] }));
  }, [filteredData]);

  /* ── 5. Designation chart ── */
  const designationData = useMemo(() => {
    const counts = filteredData.reduce((acc, curr) => {
      const role = curr.designation || 'Other';
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count).slice(0, 6);
  }, [filteredData]);

  /* ── 6. KPI values ── */
  const topDistrict = districtCounts.length
    ? [...districtCounts].sort((a, b) => b.count - a.count)[0]
    : { district: 'N/A', count: 0 };

  const topCollege = useMemo(() => {
    const counts = filteredData.reduce((acc, curr) => {
      if (curr.college) acc[curr.college] = (acc[curr.college] || 0) + 1;
      return acc;
    }, {});
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted.length ? { name: sorted[0][0], count: sorted[0][1] } : { name: 'N/A', count: 0 };
  }, [filteredData]);

  /* Top 5 colleges for Overview insights panel — must be outside any conditional */
  const topCollegesRows = useMemo(() => {
    const counts = filteredData.reduce((acc, curr) => {
      if (curr.college) acc[curr.college] = (acc[curr.college] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count], i) => (
        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: 12 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 800, color: 'var(--accent)', width: 20, textAlign: 'center' }}>#{i + 1}</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={name}>{name.split(',')[0]}</p>
            <div style={{ height: 4, borderRadius: 99, background: 'var(--border)' }}>
              <div style={{ height: '100%', width: `${(count / (filteredData.length || 1)) * 100}%`, background: CHART_COLORS[i], borderRadius: 99 }} />
            </div>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 800, color: CHART_COLORS[i], flexShrink: 0 }}>{count}</span>
        </div>
      ));
  }, [filteredData]);

  /* ── Female % for quick stats ── */
  const femaleCount = genderData.find(g => g.name?.toLowerCase() === 'female')?.value || 0;
  const femalePct = filteredData.length > 0 ? Math.round((femaleCount / filteredData.length) * 100) : 0;

  /* ── Time formatting ── */
  const timeStr = currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  const dateStr = currentTime.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });

  /* ─────────────────────────────────────────────────────────
     STYLES (inline for Tailwind-independent control)
  ───────────────────────────────────────────────────────── */
  const s = {
    container: {
      padding: '1.5rem',
      maxWidth: 1440,
      margin: '0 auto',
    },
    header: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      padding: '1.25rem 1.75rem',
      borderRadius: 'var(--radius-xl)',
      marginBottom: '1.75rem',
      borderBottom: '1px solid var(--border)',
    },
    sectionTitle: {
      fontFamily: 'var(--font-display)',
      fontSize: '1rem',
      fontWeight: 700,
      color: 'var(--text-primary)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      letterSpacing: '-0.02em',
    },
    tabBtn: (active) => ({
      padding: '0.55rem 1.1rem',
      borderRadius: 10,
      fontSize: 13,
      fontWeight: 700,
      fontFamily: 'var(--font-display)',
      cursor: 'pointer',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      transition: 'all 0.2s',
      background: active ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'transparent',
      color: active ? '#fff' : 'var(--text-secondary)',
      boxShadow: active ? '0 4px 14px rgba(99,102,241,0.35)' : 'none',
    }),
    courseBtn: (active) => ({
      padding: '0.5rem 1.25rem',
      borderRadius: 10,
      fontSize: 13,
      fontWeight: 700,
      fontFamily: 'var(--font-display)',
      cursor: 'pointer',
      border: 'none',
      transition: 'all 0.25s',
      background: active ? 'var(--bg-surface-solid)' : 'transparent',
      color: active ? 'var(--accent)' : 'var(--text-muted)',
      boxShadow: active ? 'var(--shadow-sm)' : 'none',
    }),
    batchBtn: (active) => ({
      padding: '0.4rem 0.9rem',
      borderRadius: 8,
      fontSize: 12,
      fontWeight: 700,
      fontFamily: 'var(--font-display)',
      cursor: 'pointer',
      border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
      transition: 'all 0.2s',
      background: active ? 'var(--accent)' : 'var(--bg-input)',
      color: active ? '#fff' : 'var(--text-secondary)',
      whiteSpace: 'nowrap',
    }),
  };

  return (
    <div className="dash-bg">
      <div className="dash-content" style={s.container}>

        {/* ══════════════════════════════════════════════
            HEADER
        ══════════════════════════════════════════════ */}
        <header className="glass-card fade-in" style={s.header}>

          {/* Brand */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 800, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              <Sparkles size={13} style={{ animation: 'pulse 2s infinite' }} />
              DTE Punjab · Future Skills Program
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3vw,2.25rem)', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text-primary)', margin: 0 }}>
              Training Analytics
              <span className="gradient-text" style={{ marginLeft: 10 }}>Dashboard</span>
            </h1>
          </div>

          {/* Right controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>

            {/* Live clock */}
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>{timeStr}</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{dateStr}</span>
            </div>

            {/* Export button */}
            <button
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '0.55rem 1.1rem', borderRadius: 10,
                border: '1px solid var(--border)',
                background: 'var(--bg-input)', color: 'var(--text-secondary)',
                fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-display)',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              <Download size={14} /> Export
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(d => !d)}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              style={{
                width: 40, height: 40, borderRadius: 10,
                border: '1px solid var(--border)',
                background: darkMode ? 'rgba(99,102,241,0.15)' : 'var(--bg-input)',
                color: darkMode ? '#a78bfa' : '#64748b',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.25s',
              }}
            >
              {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Course toggle */}
            <div style={{
              display: 'flex', background: darkMode ? 'rgba(99,102,241,0.08)' : 'rgba(241,245,249,0.8)',
              padding: 4, borderRadius: 12, border: '1px solid var(--border)'
            }}>
              {['Big Data', 'ARVR'].map(course => (
                <button
                  key={course}
                  onClick={() => { setActiveCourse(course); setActiveBatch('All'); }}
                  style={s.courseBtn(activeCourse === course)}
                >
                  {course === 'ARVR' ? 'AR / VR' : course}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* ══════════════════════════════════════════════
            KPI CARDS ROW
        ══════════════════════════════════════════════ */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.75rem'
        }}>
          <KpiCard label="Total Enrolled" value={filteredData.length} icon={Users}
            color="#6366f1" bg="rgba(99,102,241,0.1)" trend="+100%" delay={0} />
          <KpiCard label="Active Districts" value={districtCounts.length} icon={Globe}
            color="#10b981" bg="rgba(16,185,129,0.1)" delay={1} />
          <KpiCard label="Top Region" value={topDistrict.district} sub={`${topDistrict.count} participants`}
            icon={Building2} color="#8b5cf6" bg="rgba(139,92,246,0.1)" delay={2} />
          <KpiCard label="Top Institute" value={topCollege.name !== 'N/A' ? topCollege.name.split(',')[0] : 'N/A'}
            sub={topCollege.count > 0 ? `${topCollege.count} participants` : ''} icon={GraduationCap}
            color="#f59e0b" bg="rgba(245,158,11,0.1)" delay={3} />
        </div>

        {/* ══════════════════════════════════════════════
            FILTER + NAV BAR
        ══════════════════════════════════════════════ */}
        <div className="glass-card fade-in-2" style={{
          display: 'flex', flexWrap: 'wrap', alignItems: 'center',
          justifyContent: 'space-between', gap: '0.75rem',
          padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-lg)',
          marginBottom: '1.75rem',
        }}>
          {/* Tab navigation */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <button onClick={() => setActiveTab('overview')} style={s.tabBtn(activeTab === 'overview')}>
              <Map size={15} /> Overview
            </button>

            <button onClick={() => setActiveTab('directory')} style={s.tabBtn(activeTab === 'directory')}>
              <Users size={15} /> Directory
            </button>
            <button onClick={() => setActiveTab('program')} style={s.tabBtn(activeTab === 'program')}>
              <Info size={15} /> Program
            </button>
          </div>

          {/* Batch filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Batch:
            </span>
            {['All', 'Batch 1', 'Batch 2', 'Batch 3', 'Batch 4'].map(batch => (
              <button key={batch} onClick={() => setActiveBatch(batch)} style={s.batchBtn(activeBatch === batch)}>
                {batch}
              </button>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            TAB 1: OVERVIEW (Map + Charts + Leaderboard)
        ══════════════════════════════════════════════ */}
        {activeTab === 'overview' && (
          <>
            <div className="overview-grid fade-in">
              {/* Left column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', minWidth: 0 }}>

                {/* MAP */}
                <div className="glass-card map-card" style={{ borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ ...s.sectionTitle, marginBottom: '1rem' }}>
                    <MapPin size={18} style={{ color: 'var(--accent)' }} />
                    Geographic Distribution
                    <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
                      {districtCounts.length} districts
                    </span>
                  </div>
                  <div style={{ flex: 1, borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)', position: 'relative' }}>
                    <MapContainer
                      center={[31.1471, 75.3412]}
                      zoom={8}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                    >
                      <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                      {districtCounts.map((m, i) => (
                        <Marker key={i} position={[m.lat, m.lng]} icon={createCustomIcon(m.count)}>
                          <Popup>
                            <div style={{ textAlign: 'center', padding: '0.5rem 0.75rem', minWidth: 130, fontFamily: 'var(--font-display)' }}>
                              <p style={{ fontSize: 10, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{m.district}</p>
                              <p style={{ fontSize: 32, fontWeight: 900, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>{m.count}</p>
                              <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginTop: 2 }}>Participants</p>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                    </MapContainer>
                  </div>
                </div>

                {/* Designation Bar Chart */}
                <div className="glass-card" style={{ borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
                  <div style={{ ...s.sectionTitle, marginBottom: '1.25rem' }}>
                    <Briefcase size={18} style={{ color: '#8b5cf6' }} /> Top Designations
                  </div>
                  <div style={{ height: 200 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={designationData} layout="vertical" margin={{ top: 0, right: 24, left: 0, bottom: 0 }}>
                        <XAxis type="number" hide />
                        <YAxis
                          dataKey="name" type="category"
                          axisLine={false} tickLine={false}
                          tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 600, fontFamily: 'Inter' }}
                          width={110}
                        />
                        <RechartsTooltip
                          cursor={{ fill: 'rgba(99,102,241,0.05)' }}
                          contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg-surface-solid)', fontFamily: 'Inter', boxShadow: 'var(--shadow-lg)' }}
                        />
                        <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={14}>
                          {designationData.map((_, i) => (
                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Right sidebar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                {/* Gender Donut */}
                <div className="glass-card" style={{ borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
                  <div style={{ ...s.sectionTitle, marginBottom: '0.75rem' }}>
                    <Activity size={18} style={{ color: '#ec4899' }} /> Gender Split
                  </div>
                  <div style={{ height: 190 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={genderData} dataKey="value" nameKey="name"
                          cx="50%" cy="50%"
                          innerRadius={52} outerRadius={78}
                          paddingAngle={4} stroke="none"
                          labelLine={false}
                          label={renderPieLabel}
                        >
                          {genderData.map((_, i) => (
                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg-surface-solid)', fontFamily: 'Inter', boxShadow: 'var(--shadow-lg)' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Gender legend */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: 4 }}>
                    {genderData.map((g, i) => (
                      <div key={g.name} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: CHART_COLORS[i], display: 'inline-block' }} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)' }}>{g.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* District Leaderboard (NEW) */}
                <div className="glass-card" style={{ borderRadius: 'var(--radius-lg)', padding: '1.5rem', flex: 1 }}>
                  <div style={{ ...s.sectionTitle, marginBottom: '1rem' }}>
                    <Award size={18} style={{ color: '#f59e0b' }} /> District Ranking
                  </div>
                  <DistrictLeaderboard districtCounts={districtCounts} />
                </div>
              </div>
            </div>

            {/* ── Insights (merged from Analytics) ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))', gap: '1.25rem', marginTop: '1.25rem' }}
              className="fade-in">

              {/* Batch Breakdown */}
              <div className="glass-card" style={{ borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
                <div style={{ ...s.sectionTitle, marginBottom: '1.25rem' }}>
                  <Layers size={18} style={{ color: '#6366f1' }} /> Batch Breakdown
                </div>
                <BatchBreakdown filteredData={filteredData} />
              </div>

              {/* Role Distribution Donut */}
              <div className="glass-card" style={{ borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
                <div style={{ ...s.sectionTitle, marginBottom: '0.75rem' }}>
                  <Briefcase size={18} style={{ color: '#8b5cf6' }} /> Role Distribution
                </div>
                <div style={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={designationData} dataKey="count" nameKey="name"
                        cx="50%" cy="50%" outerRadius={90} paddingAngle={3} stroke="none">
                        {designationData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                      </Pie>
                      <RechartsTooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg-surface-solid)', fontFamily: 'Inter', boxShadow: 'var(--shadow-lg)' }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontWeight: 700, fontFamily: 'Inter', color: 'var(--text-secondary)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Quick Insights */}
              <div className="glass-card" style={{ borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
                <div style={{ ...s.sectionTitle, marginBottom: '1.25rem' }}>
                  <TrendingUp size={18} style={{ color: '#10b981' }} /> Quick Insights
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { label: 'Total Participants', value: filteredData.length, color: '#6366f1', icon: Users },
                    { label: 'Female Representation', value: `${femalePct}%`, color: '#ec4899', icon: UserCheck },
                    { label: 'Unique Districts', value: districtCounts.length, color: '#10b981', icon: MapPin },
                    { label: 'Unique Colleges', value: Object.keys(filteredData.reduce((a, c) => { if (c.college) a[c.college] = 1; return a; }, {})).length, color: '#f59e0b', icon: GraduationCap },
                    { label: 'Unique Roles', value: Object.keys(filteredData.reduce((a, c) => { if (c.designation) a[c.designation] = 1; return a; }, {})).length, color: '#8b5cf6', icon: Briefcase },
                  ].map(({ label, value, color, icon: Ic }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderRadius: 12, background: `${color}0d`, border: `1px solid ${color}22` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <Ic size={15} style={{ color }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</span>
                      </div>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top 5 Colleges */}
              <div className="glass-card" style={{ borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
                <div style={{ ...s.sectionTitle, marginBottom: '1.25rem' }}>
                  <BookOpen size={18} style={{ color: '#3b82f6' }} /> Top Colleges
                </div>
                {topCollegesRows}
              </div>

            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════
            TAB 3: PARTICIPANT DIRECTORY
        ══════════════════════════════════════════════ */}
        {activeTab === 'directory' && (
          <div className="glass-card fade-in" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            {/* Toolbar */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', alignItems: 'center',
              justifyContent: 'space-between', gap: '0.75rem',
              padding: '1.1rem 1.5rem',
              borderBottom: '1px solid var(--border)',
              background: 'rgba(99,102,241,0.02)',
            }}>
              <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: 420 }}>
                <Search style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
                <input
                  type="text"
                  placeholder="Search by name, email, college, district…"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%', paddingLeft: 42, paddingRight: 16, paddingTop: 10, paddingBottom: 10,
                    fontSize: 13, fontWeight: 500, fontFamily: 'var(--font-body)',
                    background: 'var(--bg-input)', border: '1px solid var(--border)',
                    borderRadius: 10, color: 'var(--text-primary)', outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = 'var(--shadow-glow)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)' }}>
                <span className="gradient-text" style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800 }}>{directoryData.length}</span>
                &nbsp;records found
              </div>
            </div>

            {/* Table */}
            <div className="scrollbar-thin" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'rgba(99,102,241,0.04)', borderBottom: '1px solid var(--border)' }}>
                    {['#', 'Participant', 'Email', 'Batch', 'Role', 'Institution', 'District'].map(h => (
                      <th key={h} style={{
                        padding: '0.9rem 1.1rem', textAlign: 'left',
                        fontSize: 10, fontWeight: 800, letterSpacing: '0.08em',
                        textTransform: 'uppercase', color: 'var(--text-muted)',
                        whiteSpace: 'nowrap', fontFamily: 'var(--font-display)',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {directoryData.map((person, i) => (
                    <tr
                      key={i}
                      className="table-row-alt"
                      style={{
                        borderBottom: '1px solid var(--border)',
                        transition: 'background 0.15s',
                        cursor: 'default',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.04)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = ''; }}
                    >
                      <td style={{ padding: '0.9rem 1.1rem', fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 800, color: 'var(--text-muted)' }}>{i + 1}</td>
                      <td style={{ padding: '0.9rem 1.1rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', fontFamily: 'var(--font-display)' }}>{person.name}</td>
                      <td style={{ padding: '0.9rem 1.1rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Mail size={13} style={{ color: 'var(--text-muted)' }} />
                          {person.email || '—'}
                        </span>
                      </td>
                      <td style={{ padding: '0.9rem 1.1rem' }}>
                        <span style={{
                          display: 'inline-block', padding: '2px 10px',
                          borderRadius: 99, fontSize: 11, fontWeight: 800,
                          fontFamily: 'var(--font-display)',
                          background: `${BATCH_COLORS[person.batch] || '#6366f1'}18`,
                          color: BATCH_COLORS[person.batch] || '#6366f1',
                          border: `1px solid ${BATCH_COLORS[person.batch] || '#6366f1'}30`,
                        }}>{person.batch}</span>
                      </td>
                      <td style={{ padding: '0.9rem 1.1rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{person.designation || '—'}</td>
                      <td style={{ padding: '0.9rem 1.1rem', color: 'var(--text-secondary)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={person.college}>{person.college || '—'}</td>
                      <td style={{ padding: '0.9rem 1.1rem', whiteSpace: 'nowrap' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', fontSize: 12 }}>
                          <MapPin size={12} style={{ color: 'var(--accent)' }} />{person.district}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {directoryData.length === 0 && (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14, fontWeight: 600 }}>
                  <Search size={32} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />
                  No participants match your search criteria.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════
            TAB 4: PROGRAM INFO
        ══════════════════════════════════════════════ */}
        {activeTab === 'program' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* ── Hero Banner ── */}
            <div style={{
              borderRadius: 'var(--radius-xl)',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #6366f1 100%)',
              padding: 'clamp(2rem,5vw,3.5rem)',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Decorative blobs */}
              <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>MeitY Initiative</span>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }} />
                  <span style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>NIELIT Chandigarh</span>
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem,4vw,3rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', marginBottom: 10, lineHeight: 1.1 }}>
                  FutureSkills PRIME
                </h2>
                <p style={{ fontSize: 'clamp(0.9rem,2vw,1.1rem)', color: 'rgba(255,255,255,0.82)', fontWeight: 500, marginBottom: 24, maxWidth: 600 }}>
                  Bridging the Industry Skill Gap &nbsp;•&nbsp; NIELIT Chandigarh
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {[
                    { icon: Clock, label: '1 Week • 5 Days' },
                    { icon: Zap, label: '6 Hours Daily' },
                    { icon: DollarSign, label: 'Free for Eligible' },
                  ].map(({ icon: Ic, label }) => (
                    <span key={label} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255,255,255,0.22)',
                      borderRadius: 99, padding: '6px 16px',
                      fontSize: 13, fontWeight: 700, color: '#fff',
                    }}>
                      <Ic size={13} /> {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Program Stats ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '1rem' }}>
              {[
                { val: '6', label: 'Courses Offered', color: '#6366f1' },
                { val: '40h', label: 'Max Training', color: '#8b5cf6' },
                { val: '2', label: 'Technology Tracks', color: '#ec4899' },
                { val: 'Free', label: 'For Eligible', color: '#10b981' },
              ].map(({ val, label, color }) => (
                <div key={label} className="glass-card glass-card-lift" style={{ borderRadius: 'var(--radius-lg)', padding: '1.5rem', textAlign: 'center' }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,2.5rem)', fontWeight: 900, color, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 6 }}>{val}</p>
                  <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</p>
                </div>
              ))}
            </div>

            {/* ── About + NIELIT Role ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '1.25rem' }}>

              {/* About the Program */}
              <div className="glass-card" style={{ borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}><Info size={18} /></div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>About the Program</h3>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: 12 }}>
                  FutureSkills PRIME (Programme for Re-skilling / Up-skilling of IT Manpower for Employability) is an industry-focused scheme sponsored by the <strong style={{ color: 'var(--text-primary)' }}>Ministry of Electronics and Information Technology (MeitY)</strong>, Government of India, with the goal to build skills in 10 emerging technologies in Information Technology.
                </p>
                <p style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: 16 }}>
                  NIELIT Chandigarh serves as a <strong style={{ color: 'var(--accent)' }}>Co-Lead Resource Centre</strong> for Big Data Analytics and Augmented &amp; Virtual Reality.
                </p>
                <a href="https://www.futureskillsprime.in" target="_blank" rel="noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: 'var(--accent)', textDecoration: 'none' }}>
                  <ExternalLink size={13} /> www.futureskillsprime.in
                </a>
              </div>

              {/* Key Implementation Partner */}
              <div className="glass-card" style={{ borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}><Building2 size={18} /></div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Role of NIELIT Chandigarh</h3>
                </div>
                <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>As a Co-Lead Resource Centre for Big Data &amp; Data Science and AR/VR</p>
                {[
                  { emoji: '📊', title: 'Big Data & Data Science', items: ['Curriculum Development – Designing industry-relevant training modules from foundational data skills to advanced analytics', 'Capacity Building – Training students, professionals, and government officials', 'Hands-On Exposure – Python, Hadoop, Spark, and TensorFlow'] },
                  { emoji: '🎮', title: 'Augmented & Virtual Reality', items: ['Skill Development – 3D modeling, Unity/Unreal Engine, XR development', 'Application-Oriented Training – Education, healthcare, industry, and governance', 'Innovation Enablement – Promoting immersive experiences that drive digital innovation'] },
                ].map(track => (
                  <div key={track.title} style={{ marginBottom: 16 }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>{track.emoji}</span> {track.title}
                    </p>
                    <ul style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 5 }}>
                      {track.items.map(item => (
                        <li key={item} style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                          <span style={{ color: 'var(--accent)', marginTop: 3, flexShrink: 0 }}>›</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Flagship Programs ── */}
            <div className="glass-card" style={{ borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}><Star size={18} /></div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Flagship Programs</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1rem' }}>
                {[
                  { title: 'Government Officials Training (GoT)', color: '#6366f1', bg: 'rgba(99,102,241,0.07)', desc: 'Custom-tailored programs to upskill employees from Central and State Government departments, PSUs, and Autonomous Bodies, with the objective of building technical competence for improved public service delivery and digital governance.' },
                  { title: 'Bootcamps', color: '#10b981', bg: 'rgba(16,185,129,0.07)', desc: 'Intensive, outcome-oriented programs for students and aspiring professionals, delivered in collaboration with C-DAC under MeitY\'s guidance, with emphasis on job-ready skills and practical, project-based learning.' },
                ].map(p => (
                  <div key={p.title} style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: p.bg, border: `1px solid ${p.color}22` }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 800, color: p.color, marginBottom: 8 }}>{p.title}</p>
                    <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--text-secondary)' }}>{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── MeitY About FutureSkills PRIME ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '1.25rem', alignItems: 'start' }}>

              <div className="glass-card" style={{ borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>MeitY Initiative</span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em', margin: '8px 0 12px' }}>About FutureSkills PRIME</h3>
                <p style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: 16 }}>
                  An industry-aligned skilling initiative building competencies in 10 emerging technologies. The program is designed to build digital competencies and enhance the employability of IT professionals and government officials.
                </p>
                <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.08))', border: '1px solid rgba(99,102,241,0.15)', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>🏆</span>
                  <p style={{ fontSize: 13, lineHeight: 1.65, color: 'var(--text-secondary)', fontWeight: 500 }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Ranked 3rd</strong> among 47 global digital skilling initiatives in the European Commission's 2024 Pact for Skills Report
                  </p>
                </div>
              </div>

              {/* 10 Emerging Technologies */}
              <div className="glass-card" style={{ borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '1rem' }}>10 Emerging Technologies</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '0.6rem' }}>
                  {[
                    { emoji: '🤖', label: 'Artificial Intelligence' },
                    { emoji: '📊', label: 'Big Data & Data Science' },
                    { emoji: '🎮', label: 'Augmented & Virtual Reality' },
                    { emoji: '🔒', label: 'Cyber Security' },
                    { emoji: '☁', label: 'Cloud Computing' },
                    { emoji: '🔗', label: 'Blockchain Technology' },
                    { emoji: '📱', label: 'Internet of Things' },
                    { emoji: '👾', label: 'Robotics Process Automation' },
                    { emoji: '📸', label: '3D Printing / Additive Mfg' },
                    { emoji: '📲', label: 'Social & Mobile' },
                  ].map(({ emoji, label }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.5rem 0.75rem', borderRadius: 10, background: 'rgba(99,102,241,0.04)', border: '1px solid var(--border)' }}>
                      <span style={{ fontSize: 16, flexShrink: 0 }}>{emoji}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', lineHeight: 1.3 }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Courses Conducted ── */}
            <div className="glass-card" style={{ borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}><BookOpen size={18} /></div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Courses Conducted Under the Scheme</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '1rem' }}>
                {[
                  { tag: 'GoT Advanced', title: 'Government Official Training – Advanced', color: '#6366f1', bg: 'rgba(99,102,241,0.06)', items: ['Core concepts and advanced modules', 'Cutting-edge tools and frameworks', 'Big Data, AI, Blockchain, AR/VR, Cybersecurity', 'Conducted by C-DAC & NIELIT under MeitY'] },
                  { tag: 'GoT Basic', title: 'Government Official Training – Basic', color: '#10b981', bg: 'rgba(16,185,129,0.06)', items: ['Technical literacy and digital adaptability', '10 emerging technology domains covered', 'Designed for government officials', 'Conducted by C-DAC & NIELIT under MeitY'] },
                  { tag: 'Bootcamp', title: 'Bootcamps', color: '#f59e0b', bg: 'rgba(245,158,11,0.06)', items: ['Hands-on, practical, industry-relevant', 'Led by C-DAC & NIELIT under MeitY', 'Job-ready skills focus', 'Project-based learning'] },
                ].map(c => (
                  <div key={c.title} style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: c.bg, border: `1px solid ${c.color}22` }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: c.color, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>{c.tag}</span>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12, lineHeight: 1.3 }}>{c.title}</p>
                    <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: 5 }}>
                      {c.items.map(item => (
                        <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                          <span style={{ color: c.color, flexShrink: 0, marginTop: 2 }}>✓</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Key Objectives ── */}
            <div className="glass-card" style={{ borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(236,72,153,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ec4899' }}><Target size={18} /></div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Key Objectives</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '0.85rem' }}>
                {[
                  { emoji: '⚡', title: 'Reskilling & Upskilling', desc: 'Enhance digital competencies of IT professionals and government officials in line with industry demands.' },
                  { emoji: '🎯', title: 'Emerging Technologies', desc: 'Build expertise in 10 key technology domains including AI, Big Data, Cybersecurity, Blockchain, and more.' },
                  { emoji: '🏛', title: 'Empower Government', desc: 'Enable government officials to adopt cutting-edge technologies in governance and public service delivery.' },
                  { emoji: '💼', title: 'Industry-Relevant', desc: 'Align curriculum with industry standards to bridge the skill gap and improve employability.' },
                  { emoji: '📖', title: 'Lifelong Learning', desc: 'Foster continuous learning through modular, self-paced, and hybrid learning formats.' },
                  { emoji: '🌐', title: 'National Infrastructure', desc: 'Leverage a nationwide network of resource centres and virtual labs for accessible, high-quality training.' },
                  { emoji: '🔧', title: 'Hands-On Learning', desc: 'Emphasize experiential learning through real-world projects, labs, and use-case-driven sessions.' },
                  { emoji: '🤝', title: 'Public-Private Collaboration', desc: 'Create a collaborative ecosystem involving academia, industry, and government for sustainable skill development.' },
                ].map(obj => (
                  <div key={obj.title} style={{ padding: '1.1rem', borderRadius: 'var(--radius-md)', background: 'rgba(99,102,241,0.03)', border: '1px solid var(--border)', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.07)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.03)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                  >
                    <span style={{ fontSize: 20, display: 'block', marginBottom: 7 }}>{obj.emoji}</span>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 5 }}>{obj.title}</p>
                    <p style={{ fontSize: 12.5, lineHeight: 1.6, color: 'var(--text-secondary)' }}>{obj.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Target Beneficiaries ── */}
            <div className="glass-card" style={{ borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}><Users size={18} /></div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Target Beneficiaries</h3>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: 20 }}>
                {['Government Officials', 'Students & Career Aspirants', 'Working Professionals', 'PSU Employees'].map(b => (
                  <span key={b} style={{ padding: '8px 18px', borderRadius: 99, fontSize: 13, fontWeight: 700, background: 'rgba(16,185,129,0.08)', color: '#059669', border: '1px solid rgba(16,185,129,0.2)' }}>{b}</span>
                ))}
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Implementing Agencies</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: 8 }}>
                  {['NIELIT', 'C-DAC', 'NASSCOM'].map(a => (
                    <span key={a} style={{ padding: '5px 14px', borderRadius: 8, fontSize: 13, fontWeight: 800, fontFamily: 'var(--font-display)', background: 'rgba(99,102,241,0.08)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.18)' }}>{a}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Offered Courses ── */}
            <div>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Our Programs</p>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.3rem,3vw,1.75rem)', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: 6 }}>Offered Courses</h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 500 }}>Comprehensive training in cutting-edge technologies at NIELIT Chandigarh</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1.1rem' }}>
                {[
                  { track: 'AR/VR', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', title: 'ARVR Govt. Official Training – Advanced', desc: 'Hands-on AR experience using Unity and Vuforia, suitable for those with some Unity knowledge.', faculty: 'Dr. Sarwan Singh · Mr. Nikshep Paliwal · Ms. Manjinder Kaur', brochure: 'https://www.nielit.gov.in/Fileviewer?fileId=ZrheEAKFUILW4aJqougv3A==' },
                  { track: 'AR/VR', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', title: 'ARVR Govt. Official Training – Basic', desc: 'Perfect for beginners to explore AR/VR fundamentals and get started with Unity.', faculty: 'Dr. Sarwan Singh · Mr. Nikshep Paliwal · Ms. Manjinder Kaur', brochure: 'https://www.nielit.gov.in/Fileviewer?fileId=lWG3s6JCBbMEa4mjEdSMcA==' },
                  { track: 'AR/VR Bootcamp', color: '#ec4899', bg: 'rgba(236,72,153,0.08)', title: 'ARVR Bootcamp', desc: 'Intensive, fast-paced coverage from basics to project in a compact timeline.', faculty: 'Dr. Sarwan Singh · Mr. Nikshep Paliwal · Ms. Manjinder Kaur', brochure: 'https://www.nielit.gov.in/Fileviewer?fileId=r46lwNAugNYq1AO8b5dZ4A==' },
                  { track: 'Big Data', color: '#6366f1', bg: 'rgba(99,102,241,0.08)', title: 'BDDS Govt. Official Training – Advanced', desc: 'Deep dive into Big Data, Machine Learning, Neural Networks, and AI applications.', faculty: 'Dr. Sarwan Singh · Mr. Lovnish Verma · Mr. Ravi Kant', brochure: 'https://www.nielit.gov.in/Fileviewer?fileId=lzXvjxUqJpUAdtWvmI3zAQ==' },
                  { track: 'Big Data', color: '#6366f1', bg: 'rgba(99,102,241,0.08)', title: 'BDDS Govt. Official Training – Basic', desc: 'Foundation in Big Data concepts, Hadoop ecosystem, Python, and Data Science basics.', faculty: 'Dr. Sarwan Singh · Mr. Lovnish Verma · Mr. Ravi Kant', brochure: 'https://www.nielit.gov.in/Fileviewer?fileId=lLek7gHMRFY70XQ7P3wWKA==' },
                  { track: 'Data Science Bootcamp', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', title: 'BDDS Bootcamp', desc: 'Fast-paced introduction to Big Data, SQL, Hadoop, Python, and Data Science essentials.', faculty: 'Dr. Sarwan Singh · Mr. Lovnish Verma · Mr. Ravi Kant', brochure: 'https://www.nielit.gov.in/Fileviewer?fileId=o5ghFZyJjZq0Krxp/fK8gA==' },
                ].map((course, i) => (
                  <div key={i} className="glass-card glass-card-lift" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                    <div style={{ padding: '4px 16px', background: course.bg, borderBottom: `2px solid ${course.color}30` }}>
                      <span style={{ fontSize: 10, fontWeight: 800, color: course.color, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{course.track}</span>
                    </div>
                    <div style={{ padding: '1.25rem' }}>
                      <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.35, letterSpacing: '-0.02em' }}>{course.title}</h4>
                      <p style={{ fontSize: 13, lineHeight: 1.65, color: 'var(--text-secondary)', marginBottom: 14 }}>{course.desc}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                        <Users size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                        <span style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 600, lineHeight: 1.4 }}>{course.faculty}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.6rem', marginTop: 12 }}>
                        <a href={course.brochure} target="_blank" rel="noreferrer" style={{ flex: 1, padding: '7px 0', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-display)', cursor: 'pointer', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                          <Download size={12} /> Brochure
                        </a>
                        <button style={{ flex: 1, padding: '7px 0', borderRadius: 8, border: `1px solid ${course.color}40`, background: course.bg, color: course.color, fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-display)', cursor: 'pointer' }}>Details</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Faculty ── */}
            <div>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Faculty</p>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.3rem,3vw,1.75rem)', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: 6 }}>Distinguished Speakers</h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 500 }}>Learn from industry experts and academic leaders</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: '1.25rem' }}>
                {[
                  {
                    initials: 'DW', name: 'Sh. Deepak Wasan', role: 'Executive Director', org: 'NIELIT Chandigarh',
                    spec: 'AI & Machine Learning', color: '#6366f1',
                    desc: 'Leads NIELIT Chandigarh with expertise in AI and IT skill development, driving national upskilling initiatives.',
                    photo: 'https://raw.githubusercontent.com/nielitropar/computer-vision/refs/heads/main/assets/ED%20NIELIT%20ROPAR.jpg',
                    socials: [
                      { type: 'website', url: 'https://www.nielit.gov.in/NielitMain/CDG' },
                    ]
                  },
                  {
                    initials: 'AB', name: 'Ms. Anita Budhiraja', role: 'Scientist-E / Program Chief Investigator', org: 'NIELIT Chandigarh',
                    spec: 'AI & Machine Learning', color: '#ec4899',
                    desc: 'Scientist-E and Program Chief Investigator, Specialising in AI and Machine Learning research and training.',
                    photo: 'https://raw.githubusercontent.com/nielitropar/computer-vision/refs/heads/main/assets/Anita%20Budhiraja%20Madam.jpg',
                    socials: [
                      { type: 'github', url: 'https://github.com/anitabudhiraja' },
                      { type: 'linkedin', url: 'https://www.linkedin.com/in/anita-budhiraja-958944350/' },
                      { type: 'website', url: 'https://anitabudhiraja.github.io/' },
                    ]
                  },
                  {
                    initials: 'SS', name: 'Dr. Sarwan Singh', role: 'Scientist-D / Co-Investigator', org: 'NIELIT Chandigarh',
                    spec: 'AI, AR/VR & Big Data', color: '#8b5cf6',
                    desc: 'Co-Investigator for AR/VR and Big Data, with expertise in AI/ML and Immersive technologies.',
                    photo: 'https://raw.githubusercontent.com/nielitropar/computer-vision/refs/heads/main/assets/Sarwan_Singh.JPG',
                    socials: [
                      { type: 'github', url: 'https://github.com/sarwansingh' },
                      { type: 'linkedin', url: 'https://www.linkedin.com/in/sarwan-singh-31372217/' },
                      { type: 'website', url: 'https://sarwansingh.github.io/' },
                    ]
                  },
                  {
                    initials: 'LV', name: 'Mr. Lovnish Verma', role: 'Project Engineer', org: 'NIELIT Chandigarh',
                    spec: 'Artificial Intelligence', color: '#10b981',
                    desc: 'Focuses on AI and Machine Learning applications, conducting hands-on training in deep learning frameworks.',
                    photo: 'https://raw.githubusercontent.com/lovnishverma/datasets/refs/heads/main/Lovnish.jpg',
                    socials: [
                      { type: 'github', url: 'https://github.com/lovnishverma' },
                      { type: 'linkedin', url: 'https://www.linkedin.com/in/lovnishverma' },
                      { type: 'website', url: 'https://www.lovnishverma.in/' },
                    ]
                  },
                  {
                    initials: 'NP', name: 'Mr. Nikshep Paliwal', role: 'Project Engineer', org: 'NIELIT Chandigarh',
                    spec: 'AR/VR & Mobile Dev', color: '#3b82f6',
                    desc: 'Specialises in AR/VR development using Unity, Vuforia, and A-Frame, delivering immersive tech training.',
                    photo: 'https://raw.githubusercontent.com/nielitropar/computer-vision/refs/heads/main/assets/nikshep%20paliwal.jpg',
                    socials: [
                      { type: 'github', url: 'https://github.com/niksheppaliwal' },
                      { type: 'linkedin', url: 'https://www.linkedin.com/in/nikshep-paliwal-5099971b3/' },
                      { type: 'website', url: 'https://niksheppaliwal.github.io/' },
                    ]
                  },
                  {
                    initials: 'MK', name: 'Ms. Manjinder Kaur', role: 'Assistant Project Engineer', org: 'NIELIT Chandigarh',
                    spec: 'AR/VR & Web Development', color: '#7c3aed',
                    desc: 'Works on AR/VR and web application projects at NIELIT Chandigarh, supporting Unity and A-Frame Training.',
                    photo: 'https://media.licdn.com/dms/image/v2/D5635AQHUfdr87EuYNw/profile-framedphoto-shrink_800_800/B56Z_gaSiqJsAc-/0/1786176416610?e=1787562000&v=beta&t=RbLRAnCyn1pLVTFi_bg0cVXR5hx1mkORdVgVr4u4FkM',
                    socials: [
                      { type: 'github', url: 'https://github.com/manjinderkaurrai' },
                      { type: 'linkedin', url: 'https://www.linkedin.com/in/immanjinderkaur/' },
                      { type: 'website', url: 'https://manjinderkaurrai.github.io/' },
                    ]
                  },
                  {
                    initials: 'RK', name: 'Mr. Ravi Kant', role: 'Project Assistant', org: 'NIELIT Chandigarh',
                    spec: 'Big Data, Web Development', color: '#f59e0b',
                    desc: 'Expertise in Big Data & Data Science, Web Development & Graphic Design, and supporting BDDS FSP Training.',
                    photo: 'https://raw.githubusercontent.com/nielitropar/computer-vision/refs/heads/main/assets/ravi%20kant%20nielit.jpg',
                    socials: [
                      { type: 'github', url: 'https://github.com/ravikantmahi' },
                      { type: 'linkedin', url: 'https://www.linkedin.com/in/ravikantmahi/' },
                      { type: 'website', url: 'https://ravikant-mahi.vercel.app/' },
                    ]
                  },
                ].map((f, i) => (
                  <div key={i} className="glass-card glass-card-lift" style={{ borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.65rem' }}>
                    {/* Photo or Gradient Avatar */}
                    <div style={{ position: 'relative', width: 80, height: 80, borderRadius: '50%', flexShrink: 0 }}>
                      {f.photo ? (
                        <img
                          src={f.photo}
                          alt={f.name}
                          onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
                          style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${f.color}50`, boxShadow: `0 4px 18px ${f.color}35`, display: 'block' }}
                        />
                      ) : null}
                      <div style={{
                        display: f.photo ? 'none' : 'flex',
                        width: '100%', height: '100%', borderRadius: '50%',
                        background: `linear-gradient(135deg, ${f.color}cc, ${f.color}77)`,
                        alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900, color: '#fff',
                        boxShadow: `0 4px 18px ${f.color}40`,
                        border: `3px solid ${f.color}50`,
                        position: 'absolute', inset: 0,
                      }}>{f.initials}</div>
                    </div>

                    {/* Name / Role / Org */}
                    <div>
                      <p style={{ fontFamily: 'var(--font-display)', fontSize: 14.5, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 2, letterSpacing: '-0.02em' }}>{f.name}</p>
                      <p style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 3, lineHeight: 1.35 }}>{f.role}</p>
                      <p style={{ fontSize: 11, fontWeight: 700, color: f.color }}>{f.org}</p>
                    </div>

                    {/* Specialisation badge */}
                    <span style={{ padding: '3px 12px', borderRadius: 99, fontSize: 10.5, fontWeight: 800, background: `${f.color}12`, color: f.color, border: `1px solid ${f.color}28`, letterSpacing: '0.03em' }}>{f.spec}</span>

                    {/* Bio */}
                    <p style={{ fontSize: 12, lineHeight: 1.65, color: 'var(--text-muted)', textAlign: 'center' }}>{f.desc}</p>

                    {/* Social links */}
                    {f.socials.length > 0 && (
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: 2 }}>
                        {f.socials.map(s => {
                          const Icon = s.type === 'github' ? GithubIcon : s.type === 'linkedin' ? LinkedinIcon : Globe;
                          const label = s.type === 'github' ? 'GitHub' : s.type === 'linkedin' ? 'LinkedIn' : 'Portfolio';
                          const hoverColor = s.type === 'github' ? '#24292e' : s.type === 'linkedin' ? '#0077b5' : f.color;
                          return (
                            <a key={s.type} href={s.url} target="_blank" rel="noreferrer" title={label}
                              style={{
                                width: 32, height: 32, borderRadius: 8,
                                border: '1px solid var(--border)',
                                background: 'var(--bg-input)',
                                color: 'var(--text-muted)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                textDecoration: 'none', transition: 'all 0.2s',
                              }}
                              onMouseEnter={e => { e.currentTarget.style.background = hoverColor; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = hoverColor; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-input)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                              <Icon size={14} />
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Footer */}
        <footer style={{ textAlign: 'center', padding: '2rem 0 1.5rem', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
          © {new Date().getFullYear()} Raviknat mahi · FSP Training Dashboard · DTE Punjab
        </footer>
      </div>
    </div>
  );
}
