import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, LayoutDashboard, Clock, Wrench, CheckCircle, Users, ShieldCheck, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import TicketCard from '../components/TicketCard';
import { getTicketsHoy, getStats, atenderTicket, resolverTicket } from '../services/api';

const POLL_INTERVAL = 5000;

// ── Mini modal para pedir nombre del técnico ──────────────────────────────────
function TecnicoModal({ action, onConfirm, onCancel }) {
  const [nombre, setNombre] = useState('');
  const isAtender = action === 'atender';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="card"
        style={{ width: '100%', maxWidth: 380, gap: '1rem', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={18} color={isAtender ? 'var(--accent-sky)' : 'var(--success)'} />
            <h3 style={{ margin: 0, fontSize: '1rem' }}>
              {isAtender ? 'Tomar ticket' : 'Resolver ticket'}
            </h3>
          </div>
          <button
            onClick={onCancel}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', padding: '0.25rem' }}
          >
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
          {isAtender
            ? 'Indica tu nombre para registrar que estás atendiendo este ticket.'
            : 'Indica tu nombre para marcar este ticket como resuelto.'}
        </p>

        {/* Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Tu nombre
          </label>
          <input
            autoFocus
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && nombre.trim() && onConfirm(nombre.trim())}
            placeholder="Ej: Carlos Mejía"
            style={{
              background: 'var(--bg-input)', border: '1.5px solid var(--border)',
              borderRadius: 'var(--radius-sm)', padding: '0.6rem 0.8rem',
              color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none',
              width: '100%', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <button className="btn btn-outline btn-sm" onClick={onCancel}>Cancelar</button>
          <button
            className={`btn btn-sm ${isAtender ? 'btn-primary' : 'btn-success'}`}
            disabled={!nombre.trim()}
            onClick={() => onConfirm(nombre.trim())}
          >
            {isAtender ? <><Wrench size={13} /> Atender</> : <><CheckCircle size={13} /> Resolver</>}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Stat Badge ────────────────────────────────────────────────────────────────
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

// ── AdminPage ─────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [filter, setFilter] = useState('todos');

  // Modal state
  const [modal, setModal] = useState(null); // { action: 'atender'|'resolver', ticketId }

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

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Abrir modal al hacer click en acción
  function handleAtenderClick(id) {
    setModal({ action: 'atender', ticketId: id });
  }
  function handleResolverClick(id) {
    setModal({ action: 'resolver', ticketId: id });
  }

  // Confirmar acción con nombre del técnico
  async function handleModalConfirm(nombreTecnico) {
    if (!modal) return;
    try {
      if (modal.action === 'atender') {
        await atenderTicket(modal.ticketId, nombreTecnico);
      } else {
        await resolverTicket(modal.ticketId, nombreTecnico);
      }
      fetchData();
    } catch (err) {
      console.error('Error al actualizar ticket:', err);
    } finally {
      setModal(null);
    }
  }

  const FILTERS = [
    { key: 'todos',      label: 'Todos',        color: 'var(--text-muted)' },
    { key: 'Esperando',  label: 'En espera',    color: 'var(--warning)' },
    { key: 'EnAtencion', label: 'En atención',  color: 'var(--info)' },
    { key: 'Resuelto',   label: 'Resueltos',    color: 'var(--success)' },
  ];

  const filteredTickets = filter === 'todos'
    ? tickets
    : tickets.filter(t => t.estado === filter);

  return (
    <div className="page">
      <Navbar />

      {/* Modal de técnico */}
      <AnimatePresence>
        {modal && (
          <TecnicoModal
            action={modal.action}
            onConfirm={handleModalConfirm}
            onCancel={() => setModal(null)}
          />
        )}
      </AnimatePresence>

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
                  onAtender={handleAtenderClick}
                  onResolver={handleResolverClick}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
