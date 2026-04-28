import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, LayoutDashboard, Clock, Wrench, CheckCircle, XCircle, Users } from 'lucide-react';
import Navbar from '../components/Navbar';
import TicketCard from '../components/TicketCard';
import { getTicketsHoy, getStats, atenderTicket, resolverTicket, cancelarTicket } from '../services/api';

const POLL_INTERVAL = 5000; // 5 seconds

function StatBadge({ icon: Icon, label, value, color }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '1rem' }}>
      <div style={{
        width: 40, height: 40, borderRadius: '12px',
        background: `${color}22`, border: `1px solid ${color}44`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 0.5rem',
      }}>
        <Icon size={20} color={color} />
      </div>
      <div style={{ fontSize: '1.6rem', fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.2rem', fontWeight: 500 }}>{label}</div>
    </div>
  );
}

export default function AdminPage() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [filter, setFilter] = useState('todos'); // todos | Esperando | EnAtencion | Resuelto

  const fetchData = useCallback(async () => {
    try {
      const [ticketsRes, statsRes] = await Promise.all([getTicketsHoy(), getStats()]);
      setTickets(ticketsRes.data);
      setStats(statsRes.data);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error actualizando datos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load + polling
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchData]);

  async function handleAtender(id) {
    try { await atenderTicket(id); fetchData(); } catch { /* handled silently */ }
  }
  async function handleResolver(id) {
    try { await resolverTicket(id); fetchData(); } catch { /* handled silently */ }
  }
  async function handleCancelar(id) {
    if (!confirm('¿Cancelar este ticket?')) return;
    try { await cancelarTicket(id); fetchData(); } catch { /* handled silently */ }
  }

  const filteredTickets = filter === 'todos'
    ? tickets
    : tickets.filter(t => t.estado === filter);

  const FILTERS = [
    { key: 'todos',      label: 'Todos',        color: 'var(--text-muted)' },
    { key: 'Esperando',  label: 'En espera',    color: 'var(--warning)' },
    { key: 'EnAtencion', label: 'En atención',  color: 'var(--info)' },
    { key: 'Resuelto',   label: 'Resueltos',    color: 'var(--success)' },
  ];

  return (
    <div className="page">
      <Navbar />
      <main className="container" style={{ flex: 1, paddingTop: '2rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <LayoutDashboard size={22} color="var(--accent-sky)" />
              <h2>Panel de Soporte TI</h2>
            </div>
            <p style={{ fontSize: '0.85rem', marginTop: '0.2rem' }}>
              Turnos del día — actualización automática cada 5 segundos
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {lastUpdate && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                <Clock size={11} style={{ display: 'inline', marginRight: 4 }} />
                {lastUpdate.toLocaleTimeString('es-HN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            )}
            <button className="btn btn-outline btn-sm" onClick={fetchData} disabled={loading}>
              <RefreshCw size={13} className={loading ? 'spin' : ''} />
              Actualizar
            </button>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '0.75rem', marginBottom: '1.75rem',
          }}>
            <StatBadge icon={Users}       label="Total hoy"    value={stats.total}      color="var(--accent-light)" />
            <StatBadge icon={Clock}       label="En espera"    value={stats.esperando}  color="var(--warning)" />
            <StatBadge icon={Wrench}      label="En atención"  value={stats.enAtencion} color="var(--info)" />
            <StatBadge icon={CheckCircle} label="Resueltos"    value={stats.resueltos}  color="var(--success)" />
            <StatBadge icon={XCircle}     label="Cancelados"   value={stats.cancelados} color="var(--danger)" />
          </div>
        )}

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="btn btn-sm"
              style={{
                background: filter === f.key ? `${f.color}22` : 'var(--bg-card)',
                border: `1.5px solid ${filter === f.key ? f.color : 'var(--border)'}`,
                color: filter === f.key ? f.color : 'var(--text-muted)',
                borderRadius: 'var(--radius-full)',
              }}
            >
              {f.label}
              <span style={{
                background: filter === f.key ? f.color : 'var(--border)',
                color: filter === f.key ? '#fff' : 'var(--text-dim)',
                borderRadius: 'var(--radius-full)',
                padding: '0.05rem 0.45rem',
                fontSize: '0.7rem', fontWeight: 700,
              }}>
                {f.key === 'todos' ? tickets.length : tickets.filter(t => t.estado === f.key).length}
              </span>
            </button>
          ))}
        </div>

        {/* Ticket list */}
        {loading && tickets.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: '3rem' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem' }} />
            <p>Cargando tickets...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', paddingTop: '3rem' }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <h3 style={{ color: 'var(--text-muted)' }}>Sin tickets en esta categoría</h3>
            <p style={{ fontSize: '0.85rem' }}>Los nuevos turnos aparecerán aquí automáticamente.</p>
          </motion.div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1rem',
          }}>
            <AnimatePresence mode="popLayout">
              {filteredTickets.map(ticket => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  isAdmin
                  onAtender={handleAtender}
                  onResolver={handleResolver}
                  onCancelar={handleCancelar}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
