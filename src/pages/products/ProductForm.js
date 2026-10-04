import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../api/api';

const initialFormData = {
  name: '',
  description: '',
  price: '',
  stock: '',
  providerId: ''
};

const ProductForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [providerList, setProviderList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  // Carga de la lista de proveedores
  const fetchProviders = useCallback(async () => {
    try {
      const { data } = await API.get('/providers');
      setProviderList(data);
    } catch (err) {
      console.error('Error al obtener los proveedores:', err);
    }
  }, []);

  // Carga del producto en caso de estar en edición
  const fetchProductDetails = useCallback(async () => {
    if (!isEditMode) return;
    
    try {
      const { data } = await API.get(`/products/${id}`);
      setFormData({
        name: data.name || '',
        description: data.description || '',
        price: data.price || '',
        stock: data.stock || '',
        providerId: data.providerId || ''
      });
    } catch (err) {
      console.error('Error al obtener la información del producto:', err);
    }
  }, [id, isEditMode]);

  useEffect(() => {
    fetchProviders();
    fetchProductDetails();
  }, [fetchProviders, fetchProductDetails]);

  // Manejador centralizado de entradas de formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEditMode) {
        await API.put(`/products/${id}`, formData);
      } else {
        await API.post('/products', formData);
      }
      navigate('/products');
    } catch (err) {
      console.error('Error al procesar el producto:', err);
      alert('Ocurrió un error al intentar guardar el producto.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container my-4">
      <div className="card shadow-sm border-0 max-w-2xl mx-auto">
        <div className="card-header bg-primary text-white py-3">
          <h4 className="card-title mb-0">
            {isEditMode ? 'Editar Producto' : 'Crear Producto'}
          </h4>
        </div>

        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">Nombre del Producto</label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Ej. Arroz Blanco"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Descripción</label>
              <input
                type="text"
                name="description"
                className="form-control"
                placeholder="Ej. Bolsa de 1kg"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label fw-bold">Precio</label>
                <input
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  className="form-control"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold">Stock</label>
                <input
                  type="number"
                  name="stock"
                  min="0"
                  className="form-control"
                  placeholder="0"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">Proveedor</label>
              <select
                name="providerId"
                className="form-select"
                value={formData.providerId}
                onChange={handleInputChange}
                required
              >
                <option value="">-- Seleccione un proveedor --</option>
                {providerList.map(({ id, name, city }) => (
                  <option key={id} value={id}>
                    {name} ({city})
                  </option>
                ))}
              </select>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate('/products')}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-success px-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Guardando...' : 'Guardar Producto'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;