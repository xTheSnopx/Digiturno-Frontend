import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, User, Briefcase, MessageSquare } from 'lucide-react';
import Navbar from '../components/Navbar';
import { crearTicket } from '../services/api';

export default function FormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const categoria = location.state?.categoria ?? 'Sin categoría';

  const [form, setForm] = useState({ nombreEmpleado: '', cargoEmpleado: '', descripcion: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  function validate() {
    const e = {};
    if (!form.nombreEmpleado.trim()) e.nombreEmpleado = 'El nombre es obligatorio.';
    if (!form.cargoEmpleado.trim())  e.cargoEmpleado  = 'El cargo es obligatorio.';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setApiError('');
    try {
      const res = await crearTicket({ ...form, categoria });
      navigate('/turno', { state: { ticket: res.data } });
    } catch (err) {
      setApiError(err.response?.data?.message ?? 'Error al crear el turno. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(field, value) {
    let finalValue = value;
    
    // Validaciones estrictas en tiempo real
    if (field === 'nombreEmpleado') {
      // Permitir solo letras y espacios (incluyendo acentos y ñ)
      finalValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    }

    if (field === 'cargoEmpleado') {
      // Permitir letras, números y espacios
      finalValue = value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]/g, '');
    }

    setForm(f => ({ ...f, [field]: finalValue }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: undefined }));
  }

  return (
    <div className="page">
      <Navbar />
      <main className="container" style={{ flex: 1, paddingTop: '2.5rem', display: 'flex', justifyContent: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ width: '100%', maxWidth: 520 }}
        >
          {/* Back */}
          <button className="btn btn-ghost btn-sm" style={{ marginBottom: '1.5rem' }} onClick={() => navigate('/')}>
            <ArrowLeft size={16} /> Volver
          </button>

          {/* Selected category pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'var(--accent-glow)', border: '1px solid var(--border-bright)',
            borderRadius: 'var(--radius-full)', padding: '0.4rem 1rem',
            marginBottom: '1.25rem',
          }}>
            <span style={{ fontSize: '1.1rem' }}>{categoria.split(' ')[0]}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-sky)', fontWeight: 600 }}>
              {categoria.slice(categoria.indexOf(' ') + 1)}
            </span>
          </div>

          <h2 style={{ marginBottom: '0.4rem' }}>Tus datos</h2>
          <p style={{ marginBottom: '1.75rem', fontSize: '0.9rem' }}>
            Completa el formulario para solicitar tu turno de atención.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Nombre */}
            <div className="form-group">
              <label htmlFor="nombreEmpleado">
                <User size={13} style={{ display: 'inline', marginRight: 5 }} />
                Nombre completo *
              </label>
              <input
                id="nombreEmpleado"
                type="text"
                placeholder="Ej. María García"
                value={form.nombreEmpleado}
                onChange={e => handleChange('nombreEmpleado', e.target.value)}
                autoFocus
                maxLength={60}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                Ingresa tus dos nombres y apellidos para identificarte correctamente.
              </span>
              {errors.nombreEmpleado && <span className="form-error">{errors.nombreEmpleado}</span>}
            </div>

            {/* Cargo */}
            <div className="form-group">
              <label htmlFor="cargoEmpleado">
                <Briefcase size={13} style={{ display: 'inline', marginRight: 5 }} />
                Cargo / Departamento *
              </label>
              <input
                id="cargoEmpleado"
                type="text"
                placeholder="Ej. Ventas, Contabilidad, Bodega..."
                value={form.cargoEmpleado}
                onChange={e => handleChange('cargoEmpleado', e.target.value)}
                maxLength={60}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                Especifica tu cargo u otra referencia breve de tu departamento o locación.
              </span>
              {errors.cargoEmpleado && <span className="form-error">{errors.cargoEmpleado}</span>}
            </div>

            {/* Descripción */}
            <div className="form-group">
              <label htmlFor="descripcion">
                <MessageSquare size={13} style={{ display: 'inline', marginRight: 5 }} />
                Descripción breve (opcional)
              </label>
              <textarea
                id="descripcion"
                placeholder="Describe brevemente tu problema..."
                value={form.descripcion}
                onChange={e => handleChange('descripcion', e.target.value)}
                maxLength={200}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.2rem' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                  Detalla tu problema lo más claro posible.
                </span>
                <span style={{ fontSize: '0.72rem', color: form.descripcion.length === 200 ? 'var(--warning)' : 'var(--text-dim)' }}>
                  {form.descripcion.length}/200 chars
                </span>
              </div>
            </div>

            {apiError && (
              <div style={{
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem',
                color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1rem',
              }}>
                {apiError}
              </div>
            )}

            <motion.button
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ marginTop: '0.5rem' }}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                  Creando turno...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Solicitar Turno
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
