import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../api/api';

const defaultFormState = {
  name: '',
  phone: '',
  email: '',
  city: ''
};

const ProviderForm = () => {
  const [providerData, setProviderData] = useState(defaultFormState);
  const [isSaving, setIsSaving] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const loadProviderDetails = useCallback(async () => {
    if (!isEditing) return;

    try {
      const { data } = await API.get(`/providers/${id}`);
      setProviderData({
        name: data.name || '',
        phone: data.phone || '',
        email: data.email || '',
        city: data.city || ''
      });
    } catch (err) {
      console.error('Error al obtener datos del proveedor:', err);
    }
  }, [id, isEditing]);

  useEffect(() => {
    loadProviderDetails();
  }, [loadProviderDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProviderData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (isEditing) {
        await API.put(`/providers/${id}`, providerData);
      } else {
        await API.post('/providers', providerData);
      }
      navigate('/providers');
    } catch (err) {
      console.error('Error al procesar proveedor:', err);
      alert('Ocurrió un error al intentar guardar el proveedor.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container my-4">
      <div className="card shadow-sm border-0 max-w-2xl mx-auto">
        <div className="card-header bg-dark text-white py-3">
          <h4 className="card-title mb-0">
            {isEditing ? 'Actualizar Proveedor' : 'Registrar Proveedor'}
          </h4>
        </div>

        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">Razón Social / Nombre</label>
              <input 
                type="text"
                name="name" 
                className="form-control" 
                placeholder="Ej. Distribuidora Central" 
                value={providerData.name} 
                onChange={handleInputChange} 
                required
              />
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label fw-bold">Teléfono</label>
                <input 
                  type="text"
                  name="phone" 
                  className="form-control" 
                  placeholder="Ej. 3001234567" 
                  value={providerData.phone} 
                  onChange={handleInputChange} 
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold">Ciudad</label>
                <input 
                  type="text"
                  name="city" 
                  className="form-control" 
                  placeholder="Ej. Bogotá" 
                  value={providerData.city} 
                  onChange={handleInputChange} 
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">Correo Electrónico</label>
              <input 
                type="email"
                name="email" 
                className="form-control" 
                placeholder="contacto@proveedor.com" 
                value={providerData.email} 
                onChange={handleInputChange} 
                required
              />
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate('/providers')}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn btn-success px-4"
                disabled={isSaving}
              >
                {isSaving ? 'Guardando...' : 'Guardar Proveedor'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProviderForm;