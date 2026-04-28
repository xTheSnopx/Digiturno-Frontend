import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';
import { loginTecnico } from '../services/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError('Ingresa usuario y contraseña.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await loginTecnico(form.username, form.password);
      navigate('/admin');
    } catch {
      setError('Credenciales inválidas. Verifica tu usuario y contraseña.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <Navbar />
      <main className="container" style={{
        flex: 1, display: 'flex', alignItems: 'center',
        justifyContent: 'center', paddingTop: '2rem', paddingBottom: '3rem',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ width: '100%', maxWidth: 420 }}
        >
          {/* Icon */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '18px',
              background: 'linear-gradient(135deg, var(--accent), var(--accent-sky))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: 'var(--shadow-blue)',
            }}>
              <ShieldCheck size={32} color="#fff" />
            </div>
            <h2>Acceso Técnicos</h2>
            <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Panel de gestión de turnos
            </p>
          </div>

          {/* Card */}
          <div className="card">
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="username">
                  <User size={13} style={{ display: 'inline', marginRight: 5 }} />
                  Usuario
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Ingresa tu usuario"
                  value={form.username}
                  onChange={e => { setForm(f => ({ ...f, username: e.target.value })); setError(''); }}
                  autoFocus
                  autoComplete="username"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  <Lock size={13} style={{ display: 'inline', marginRight: 5 }} />
                  Contraseña
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="password"
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setError(''); }}
                    autoComplete="current-password"
                    style={{ paddingRight: '2.8rem', width: '100%' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{
                      position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)',
                      display: 'flex', alignItems: 'center',
                    }}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div style={{
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: 'var(--radius-sm)', padding: '0.65rem 0.9rem',
                  color: 'var(--danger)', fontSize: '0.83rem', marginBottom: '1rem',
                }}>
                  {error}
                </div>
              )}

              <motion.button
                type="submit"
                className="btn btn-primary btn-full btn-lg"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Ingresando...</>
                ) : (
                  <><Lock size={16} /> Ingresar</>
                )}
              </motion.button>
            </form>
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.78rem', marginTop: '1.25rem', color: 'var(--text-dim)' }}>
            Acceso exclusivo para personal de Soporte TI
          </p>
        </motion.div>
      </main>
    </div>
  );
}
