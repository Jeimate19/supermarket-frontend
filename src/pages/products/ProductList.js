import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/api';

const ProductList = () => {
  const [productList, setProductList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await API.get('/products');
      setProductList(data);
    } catch (error) {
      console.error('Error al cargar la lista de productos:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDelete = async (productId) => {
    const isConfirmed = window.confirm('¿Deseas eliminar este registro de manera permanente?');
    if (!isConfirmed) return;

    try {
      await API.delete(`/products/${productId}`);
      fetchProducts();
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      alert('No se pudo eliminar el producto especificado.');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Catálogo de Productos</h2>
          <p className="text-muted small mb-0">Gestión general de inventario y precios</p>
        </div>

        <Link to="/products/create" className="btn btn-success d-flex align-items-center gap-1 shadow-sm">
          <span>+ Nuevo Producto</span>
        </Link>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light border-bottom">
                <tr>
                  <th className="ps-4 py-3">Nombre</th>
                  <th className="py-3">Precio</th>
                  <th className="py-3">Stock</th>
                  <th className="py-3">Proveedor</th>
                  <th className="py-3 text-center pe-4">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      Cargando productos...
                    </td>
                  </tr>
                ) : productList.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      No hay productos registrados en el sistema.
                    </td>
                  </tr>
                ) : (
                  productList.map(({ id, name, price, stock, Provider }) => (
                    <tr key={id}>
                      <td className="ps-4 fw-semibold text-dark">{name}</td>
                      <td className="text-success fw-bold">${Number(price).toLocaleString()}</td>
                      <td>
                        <span className={`badge px-2 py-1 ${stock > 10 ? 'bg-primary' : 'bg-warning text-dark'}`}>
                          {stock} unidades
                        </span>
                      </td>
                      <td>{Provider?.name || 'Sin asignación'}</td>

                      <td className="text-center pe-4">
                        <div className="btn-group gap-1" role="group">
                          <Link 
                            to={`/products/edit/${id}`} 
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

export default ProductList;