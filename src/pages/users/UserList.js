import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/api';

const UserList = () => {
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await API.get('/users');
      setUserList(data);
    } catch (error) {
      console.error('Error al cargar la lista de usuarios:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDelete = async (userId) => {
    const isConfirmed = window.confirm('¿Deseas eliminar este usuario de manera permanente?');
    if (!isConfirmed) return;

    try {
      await API.delete(`/users/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      alert('No se pudo eliminar el usuario seleccionado.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Gestión de Usuarios</h2>
          <p className="text-muted small mb-0">Administración de accesos y roles del sistema</p>
        </div>

        <Link to="/users/create" className="btn btn-success shadow-sm d-flex align-items-center gap-1">
          <span>+ Nuevo Usuario</span>
        </Link>
      </div>

      <div className="card shadow-sm border-0 rounded-3">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light border-bottom">
                <tr>
                  <th className="ps-4 py-3">ID</th>
                  <th className="py-3">Nombre Completo</th>
                  <th className="py-3">Correo Electrónico</th>
                  <th className="py-3">Rol</th>
                  <th className="py-3 text-center pe-4">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      Cargando usuarios...
                    </td>
                  </tr>
                ) : userList.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      No hay usuarios registrados en la plataforma.
                    </td>
                  </tr>
                ) : (
                  userList.map(({ id, name, email, role }) => (
                    <tr key={id}>
                      <td className="ps-4">
                        <span className="badge bg-light text-dark border">
                          #{id}
                        </span>
                      </td>
                      <td className="fw-semibold text-dark">{name}</td>
                      <td>
                        <a href={`mailto:${email}`} className="text-decoration-none">
                          {email}
                        </a>
                      </td>
                      <td>
                        <span 
                          className={`badge px-2 py-1 ${
                            role === 'admin' 
                              ? 'bg-danger bg-opacity-10 text-danger border border-danger' 
                              : 'bg-primary bg-opacity-10 text-primary border border-primary'
                          }`}
                        >
                          {role === 'admin' ? 'Administrador' : 'Usuario'}
                        </span>
                      </td>

                      <td className="text-center pe-4">
                        <div className="btn-group gap-1" role="group">
                          <Link 
                            to={`/users/edit/${id}`} 
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

export default UserList;