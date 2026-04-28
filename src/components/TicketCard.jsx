import { motion } from 'framer-motion';
import { Clock, User, Briefcase, Wrench, CheckCircle, XCircle } from 'lucide-react';

const STATUS_CONFIG = {
  Esperando:  { label: 'En espera',    badge: 'badge-waiting',   icon: Clock },
  EnAtencion: { label: 'En atención',  badge: 'badge-active',    icon: Wrench },
  Resuelto:   { label: 'Resuelto',     badge: 'badge-resolved',  icon: CheckCircle },
  Cancelado:  { label: 'Cancelado',    badge: 'badge-cancelled', icon: XCircle },
};

export default function TicketCard({ ticket, onAtender, onResolver, onCancelar, isAdmin = false }) {
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

      {/* Info */}
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
            {ticket.estado !== 'Resuelto' && ticket.estado !== 'Cancelado' && (
              <button className="btn btn-danger btn-sm" onClick={() => onCancelar(ticket.id)}>
                <XCircle size={12} /> Cancelar
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
