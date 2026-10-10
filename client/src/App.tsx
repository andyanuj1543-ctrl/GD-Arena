import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const SetupPage = lazy(() => import('./pages/SetupPage'));
const GDRoomPage = lazy(() => import('./pages/GDRoomPage'));
const ReportPage = lazy(() => import('./pages/ReportPage'));

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center">
      <p className="text-warm-gray font-sans text-lg">Loading…</p>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/setup" element={<SetupPage />} />
        <Route path="/room/:sessionId" element={<GDRoomPage />} />
        <Route path="/report/:sessionId" element={<ReportPage />} />
      </Routes>
    </Suspense>
  );
}
