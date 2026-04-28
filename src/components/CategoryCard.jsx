import { motion } from 'framer-motion';

const CATEGORY_CONFIG = {
  '💻': { color: '#3b82f6', bg: 'rgba(59,130,246,0.08)',  label: 'Software General'    },
  '🖨️': { color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', label: 'Impresoras'           },
  '🔌': { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', label: 'Hardware Físico'      },
  '🌐': { color: '#06b6d4', bg: 'rgba(6,182,212,0.08)',  label: 'Red / Internet'       },
  '🔒': { color: '#ef4444', bg: 'rgba(110, 103, 103, 0.08)',  label: 'Accesos'              },
  '📧': { color: '#22c55e', bg: 'rgba(34,197,94,0.08)',  label: 'Correo'               },
  '📞': { color: '#a855f7', bg: 'rgba(168,85,247,0.08)', label: 'Telefonía'            },
  '🖥️': { color: '#f97316', bg: 'rgba(249,115,22,0.08)', label: 'Equipo apagado'      },
  '📱': { color: '#14b8a6', bg: 'rgba(20,184,166,0.08)', label: 'Dispositivos'         },
  '❓': { color: '#64748b', bg: 'rgba(100,116,139,0.08)','label': 'Otro'              },
};

export default function CategoryCard({ emoji, label, description, onClick, disabled }) {
  const cfg = CATEGORY_CONFIG[emoji] ?? { color: '#2563eb', bg: 'rgba(37,99,235,0.08)' };

  return (
    <motion.button
      whileHover={{ scale: 1.035, y: -5 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick({ emoji, label })}
      disabled={disabled}
      initial={false}
      style={{
        all: 'unset',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 0,
        width: '100%',
        height: '100%', // Makes button stretch to fill grid cell
        boxSizing: 'border-box',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        position: 'relative',
        borderRadius: 18,
        overflow: 'hidden',
        /* Glassmorphism base */
        background: 'rgba(13,27,62,0.65)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: `1.5px solid rgba(255,255,255,0.07)`,
        boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
        transition: 'border-color 0.25s, box-shadow 0.25s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = cfg.color + '60';
        e.currentTarget.style.boxShadow   = `0 8px 36px ${cfg.color}28, 0 0 0 1px ${cfg.color}30`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
        e.currentTarget.style.boxShadow   = '0 4px 24px rgba(0,0,0,0.35)';
      }}
    >
      {/* Top color stripe */}
      <div className="card-stripe" style={{
        background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}55)`,
      }} />

      <div className="card-inner">
        {/* Emoji badge */}
        <div className="card-emoji-badge" style={{
          background: cfg.bg,
          border: `1px solid ${cfg.color}30`,
        }}>
          {emoji}
        </div>

        {/* Text Container */}
        <div className="card-text-container">
          {/* Label */}
          <div className="card-label">
            {label}
          </div>

          {/* Description */}
          {description && (
            <div className="card-desc">
              {description}
            </div>
          )}
        </div>

        {/* Arrow indicator pushed to bottom */}
        <div className="card-arrow" style={{ color: cfg.color }}>
          <span className="card-arrow-text">Reportar</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5h6M6 3l2 2-2 2" stroke={cfg.color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </motion.button>
  );
}
