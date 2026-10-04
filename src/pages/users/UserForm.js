import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../api/api';

const initialFormState = {
  name: '',
  email: '',
  role: 'user'
};

const UserForm = () => {
  const [userData, setUserData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const loadUserDetails = useCallback(async () => {
    if (!isEditing) return;

    try {
      const { data } = await API.get(`/users/${id}`);
      setUserData({
        name: data.name || '',
        email: data.email || '',
        role: data.role || 'user'
      });
    } catch (err) {
      console.error('Error al obtener los detalles del usuario:', err);
    }
  }, [id, isEditing]);

  useEffect(() => {
    loadUserDetails();
  }, [loadUserDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEditing) {
        await API.put(`/users/${id}`, userData);
      } else {
        await API.post('/users', userData);
      }
      navigate('/users');
    } catch (err) {
      console.error('Error al guardar el usuario:', err);
      alert('Error al guardar el usuario. Verifique si el correo ya está registrado.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container my-4">
      <div className="card shadow-sm border-0 max-w-xl mx-auto">
        <div className="card-header bg-dark text-white py-3">
          <h4 className="card-title mb-0">
            {isEditing ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}
          </h4>
        </div>

        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">Nombre Completo</label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Ej. Juan Pérez"
                value={userData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Correo Electrónico</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="juan@ejemplo.com"
                value={userData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">Rol del Sistema</label>
              <select
                name="role"
                className="form-select"
                value={userData.role}
                onChange={handleInputChange}
                required
              >
                <option value="user">Usuario (User)</option>
                <option value="admin">Administrador (Admin)</option>
              </select>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate('/users')}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-success px-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Guardando...' : 'Guardar Usuario'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm;