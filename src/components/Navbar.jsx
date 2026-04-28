import { Link, useNavigate } from 'react-router-dom';
import { Zap, LogOut, ShieldCheck } from 'lucide-react';
import { getUser, isAuthenticated, logout } from '../services/auth';

export default function Navbar() {
  const navigate = useNavigate();
  const user = getUser();
  const authenticated = isAuthenticated();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav style={{
      background: 'rgba(6,13,31,0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 1.5rem',
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, var(--accent), var(--accent-sky))',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)', lineHeight: 1 }}>
              DigiTurno
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--accent-sky)', fontWeight: 600, letterSpacing: '0.05em' }}>
              AMERICAN LIGHTING
            </div>
          </div>
        </Link>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {authenticated ? (
            <>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-full)', padding: '0.35rem 0.9rem',
              }}>
                <ShieldCheck size={14} color="var(--accent-sky)" />
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  {user?.nombreCompleto}
                </span>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                <LogOut size={14} />
                <span className="hide-on-mobile">Salir</span>
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-outline btn-sm">
              <ShieldCheck size={14} />
              <span className="hide-on-mobile">Panel Técnico</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
