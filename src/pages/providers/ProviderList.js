import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/api';

const ProviderList = () => {
  const [providerList, setProviderList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProviders = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await API.get('/providers');
      setProviderList(data);
    } catch (error) {
      console.error('Error al cargar la lista de proveedores:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDelete = async (providerId) => {
    const isConfirmed = window.confirm('¿Deseas eliminar este proveedor?');
    if (!isConfirmed) return;

    try {
      await API.delete(`/providers/${providerId}`);
      fetchProviders();
    } catch (error) {
      console.error('Error al eliminar el proveedor:', error);
      alert('No se pudo eliminar el proveedor especificado.');
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Directorio de Proveedores</h2>
          <p className="text-muted small mb-0">Administración de contactos y empresas aliadas</p>
        </div>

        <Link to="/providers/create" className="btn btn-success shadow-sm d-flex align-items-center gap-1">
          <span>+ Nuevo Proveedor</span>
        </Link>
      </div>

      <div className="card shadow-sm border-0 rounded-3">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light border-bottom">
                <tr>
                  <th className="ps-4 py-3">ID</th>
                  <th className="py-3">Razón Social / Nombre</th>
                  <th className="py-3">Teléfono</th>
                  <th className="py-3">Correo Electrónico</th>
                  <th className="py-3">Ciudad</th>
                  <th className="py-3 text-center pe-4">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      Cargando proveedores...
                    </td>
                  </tr>
                ) : providerList.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      No hay proveedores registrados.
                    </td>
                  </tr>
                ) : (
                  providerList.map(({ id, name, phone, email, city }) => (
                    <tr key={id}>
                      <td className="ps-4">
                        <span className="badge bg-light text-dark border">
                          #{id}
                        </span>
                      </td>
                      <td className="fw-semibold text-dark">{name}</td>
                      <td>{phone}</td>
                      <td>
                        <a href={`mailto:${email}`} className="text-decoration-none">
                          {email}
                        </a>
                      </td>
                      <td>
                        <span className="badge bg-info text-dark bg-opacity-25 px-2 py-1">
                          {city}
                        </span>
                      </td>

                      <td className="text-center pe-4">
                        <div className="btn-group gap-1" role="group">
                          <Link 
                            to={`/providers/edit/${id}`} 
                            className="btn btn-outline-warning btn-sm"
                          >
                            Editar
                          </Link>

                          <button
                            onClick={() => handleDelete(id)}
                            className="btn btn-outline-danger btn-sm"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderList;