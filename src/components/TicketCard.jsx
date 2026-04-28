import { motion } from 'framer-motion';
import { Clock, User, Briefcase, Wrench, CheckCircle, ShieldCheck } from 'lucide-react';

const STATUS_CONFIG = {
  Esperando:  { label: 'En espera',    badge: 'badge-waiting',   icon: Clock },
  EnAtencion: { label: 'En atención',  badge: 'badge-active',    icon: Wrench },
  Resuelto:   { label: 'Resuelto',     badge: 'badge-resolved',  icon: CheckCircle },
};

export default function TicketCard({ ticket, onAtender, onResolver, isAdmin = false }) {
  const cfg = STATUS_CONFIG[ticket.estado] ?? STATUS_CONFIG.Esperando;
  const IconStatus = cfg.icon;

  const fecha = new Date(ticket.creadoEn).toLocaleTimeString('es-HN', {
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="card"
      style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <span style={{
          fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.02em',
          color: 'var(--accent-sky)', fontVariantNumeric: 'tabular-nums',
        }}>
          {ticket.numero}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.3rem' }}>{ticket.categoria?.split(' ')[0]}</span>
          <span className={`badge ${cfg.badge}`}>
            <IconStatus size={11} />
            {cfg.label}
          </span>
        </div>
      </div>

      {/* Employee Info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
          <User size={13} color="var(--text-dim)" />
          <span style={{ fontWeight: 600 }}>{ticket.nombreEmpleado}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <Briefcase size={12} color="var(--text-dim)" />
          {ticket.cargoEmpleado}
        </div>
        {ticket.descripcion && (
          <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontStyle: 'italic', marginTop: '0.2rem' }}>
            "{ticket.descripcion}"
          </div>
        )}
      </div>

      {/* Técnico responsable */}
      {ticket.nombreTecnico && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          fontSize: '0.78rem', fontWeight: 600,
          color: ticket.estado === 'Resuelto' ? 'var(--success)' : 'var(--info)',
          background: ticket.estado === 'Resuelto' ? 'rgba(34,197,94,0.08)' : 'rgba(56,189,248,0.08)',
          border: `1px solid ${ticket.estado === 'Resuelto' ? 'rgba(34,197,94,0.25)' : 'rgba(56,189,248,0.25)'}`,
          borderRadius: 'var(--radius-sm)',
          padding: '0.3rem 0.6rem',
        }}>
          <ShieldCheck size={13} />
          {ticket.estado === 'Resuelto' ? 'Resuelto por' : 'Atendido por'}:&nbsp;
          <span style={{ fontWeight: 700 }}>{ticket.nombreTecnico}</span>
        </div>
      )}

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          <Clock size={11} style={{ display: 'inline', marginRight: 4 }} />
          {fecha}
        </span>

        {/* Admin actions */}
        {isAdmin && (
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {ticket.estado === 'Esperando' && (
              <button className="btn btn-primary btn-sm" onClick={() => onAtender(ticket.id)}>
                <Wrench size={12} /> Atender
              </button>
            )}
            {(ticket.estado === 'Esperando' || ticket.estado === 'EnAtencion') && (
              <button className="btn btn-success btn-sm" onClick={() => onResolver(ticket.id)}>
                <CheckCircle size={12} /> Resolver
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
