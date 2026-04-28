import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage    from './pages/HomePage';
import FormPage    from './pages/FormPage';
import ConfirmPage from './pages/ConfirmPage';
import LoginPage   from './pages/LoginPage';
import AdminPage   from './pages/AdminPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"          element={<HomePage />} />
        <Route path="/formulario" element={<FormPage />} />
        <Route path="/turno"     element={<ConfirmPage />} />
        <Route path="/login"     element={<LoginPage />} />

        {/* Protected */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        } />
        
        {/* Fallback */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}
