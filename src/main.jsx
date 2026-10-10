import React, { lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// The admin panel is loaded only on /admin so visitors never download it.
const Admin = lazy(() => import('./Admin.jsx'))
const isAdmin = window.location.pathname.startsWith('/admin')

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isAdmin ? (
      <Suspense fallback={<p className="p-8 text-muted">Loading…</p>}>
        <Admin />
      </Suspense>
    ) : (
      <App />
    )}
  </React.StrictMode>,
)
