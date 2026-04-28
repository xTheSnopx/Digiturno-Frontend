import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import CategoryCard from '../components/CategoryCard';
import MetaBalls from '../components/MetaBalls';

const CATEGORIES = [
  { emoji: '💻', label: 'Software General',    description: 'Lentitud, errores de apps, actualizaciones' },
  { emoji: '🖨️', label: 'Impresoras',          description: 'Papel, conexión, drivers' },
  { emoji: '🔌', label: 'Hardware Físico',      description: 'Teclado, mouse, monitor, cables' },
  { emoji: '🌐', label: 'Red / Internet',       description: 'Sin conexión, WiFi lento, VPN' },
  { emoji: '🔒', label: 'Contraseñas / Accesos',description: 'Reset de claves, permisos' },
  { emoji: '📧', label: 'Correo Electrónico',   description: 'Outlook, configuración, spam' },
  { emoji: '📞', label: 'Telefonía / VoIP',     description: 'Teléfono, extensiones, conferencias' },
  { emoji: '🖥️', label: 'Equipo no enciende',  description: 'PC apagada, fallos de boot' },
  { emoji: '📱', label: 'Dispositivos Móviles', description: 'Celulares, tablets, configuración' },
  { emoji: '❓', label: 'Otro',                 description: 'Problema no listado' },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 22 } },
};

export default function HomePage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  function handleSelect(cat) {
    setSelected(cat);
    navigate('/formulario', { state: { categoria: `${cat.emoji} ${cat.label}` } });
  }

  return (
    <div className="page" style={{ position: 'relative', zIndex: 1 }}>
      {/* MetaBalls WebGL background — behind everything, blurred */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
        opacity: 0.55,
        filter: 'blur(40px)',
      }}>
        <MetaBalls
          color="#1e40af"
          cursorBallColor="#38bdf8"
          cursorBallSize={2.5}
          ballCount={12}
          animationSize={30}
          enableMouseInteraction={true}
          enableTransparency={true}
          hoverSmoothness={0.05}
          clumpFactor={0.9}
          speed={0.25}
        />
      </div>

      <Navbar />
      <main className="container" style={{ flex: 1, paddingTop: '2.5rem' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '2.5rem' }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'var(--accent-glow)', border: '1px solid var(--border-bright)',
            borderRadius: 'var(--radius-full)', padding: '0.35rem 1rem',
            marginBottom: '1rem',
          }}>
            <div className="pulse-dot" />
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-sky)', fontWeight: 600 }}>
              Sistema de Turnos — Soporte TI
            </span>
          </div>
          <h1 className="glow-text" style={{ marginBottom: '0.75rem' }}>
            ¿Cuál es tu problema?
          </h1>
          <p style={{ maxWidth: 520, margin: '0 auto', fontSize: '1rem' }}>
            Selecciona la categoría que mejor describe tu problema. Te asignaremos un turno de atención.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="categories-grid"
        >
          {CATEGORIES.map((cat) => (
            <motion.div key={cat.label} variants={item}>
              <CategoryCard
                emoji={cat.emoji}
                label={cat.label}
                description={cat.description}
                onClick={handleSelect}
              />
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
