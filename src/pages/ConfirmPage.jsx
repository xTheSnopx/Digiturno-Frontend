import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Home, Users } from 'lucide-react';
import Navbar from '../components/Navbar';
import confetti from 'canvas-confetti';

export default function ConfirmPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const ticket = location.state?.ticket;

  useEffect(() => {
    if (!ticket) return;
    // Celebration confetti
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#2563eb', '#38bdf8', '#ffffff', '#7dd3fc'],
      });
    }, 400);
  }, [ticket]);

  if (!ticket) {
    return (
      <div className="page">
        <Navbar />
        <main className="container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <p>No se encontró información del turno.</p>
            <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/')}>
              Volver al inicio
            </button>
          </div>
        </main>
      </div>
    );
  }

  const hora = new Date(ticket.creadoEn).toLocaleTimeString('es-HN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="page">
      <Navbar />
      <main className="container" style={{
        flex: 1, display: 'flex', alignItems: 'center',
        justifyContent: 'center', paddingTop: '2rem',
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 20 }}
          style={{ width: '100%', maxWidth: 480, textAlign: 'center' }}
        >
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 250 }}
            style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.3))',
              border: '2px solid rgba(34,197,94,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}
          >
            <CheckCircle size={36} color="var(--success)" />
          </motion.div>

          <p style={{ color: 'var(--accent-sky)', fontWeight: 700, letterSpacing: '0.1em', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            ¡TURNO ASIGNADO!
          </p>

          {/* Big number */}
          <div className="ticket-number" style={{ marginBottom: '0.25rem' }}>
            {ticket.numero}
          </div>

          {/* Category */}
          <p style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>
            {ticket.categoria}
          </p>

          {/* Info card */}
          <div className="card" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
            <div className="info-grid">
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>Nombre</div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{ticket.nombreEmpleado}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>Cargo</div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{ticket.cargoEmpleado}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>Hora</div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{hora}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>Posición</div>
                <div style={{ fontWeight: 700, color: 'var(--warning)', fontSize: '0.9rem' }}>
                  <Users size={13} style={{ display: 'inline', marginRight: 4 }} />
                  #{ticket.posicion} en cola
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          <div style={{
            background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)',
            borderRadius: 'var(--radius-md)', padding: '0.8rem 1rem',
            display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem',
          }}>
            <Clock size={16} color="var(--accent-sky)" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Un técnico de TI te atenderá en breve. Quédate cerca de tu puesto de trabajo.
            </span>
          </div>

          <motion.button
            className="btn btn-outline btn-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
          >
            <Home size={16} />
            Volver al inicio
          </motion.button>
        </motion.div>
      </main>
    </div>
  );
}
