import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/api';

const SaleForm = () => {
  const [userOptions, setUserOptions] = useState([]);
  const [productCatalog, setProductCatalog] = useState([]);

  const [selectedUserId, setSelectedUserId] = useState('');
  const [saleItems, setSaleItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const loadUsers = useCallback(async () => {
    try {
      const { data } = await API.get('/users');
      setUserOptions(data);
    } catch (err) {
      console.error('Error al obtener la lista de usuarios:', err);
    }
  }, []);

  const loadProducts = useCallback(async () => {
    try {
      const { data } = await API.get('/products');
      setProductCatalog(data);
    } catch (err) {
      console.error('Error al obtener el catálogo de productos:', err);
    }
  }, []);

  useEffect(() => {
    loadUsers();
    loadProducts();
  }, [loadUsers, loadProducts]);

  const handleAddItem = () => {
    setSaleItems((prevItems) => [
      ...prevItems,
      { productId: '', quantity: 1 }
    ]);
  };

  const handleItemChange = (index, field, value) => {
    setSaleItems((prevItems) => {
      const updated = [...prevItems];
      updated[index] = {
        ...updated[index],
        [field]: field === 'quantity' ? Math.max(1, parseInt(value, 10) || 1) : value
      };
      return updated;
    });
  };

  const handleRemoveItem = (index) => {
    setSaleItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const calculatedTotal = useMemo(() => {
    return saleItems.reduce((acc, item) => {
      const selectedProduct = productCatalog.find(
        (p) => String(p.id) === String(item.productId)
      );
      if (!selectedProduct) return acc;
      return acc + Number(selectedProduct.price) * Number(item.quantity);
    }, 0);
  }, [saleItems, productCatalog]);

  const handleSubmitSale = async (e) => {
    e.preventDefault();

    if (!selectedUserId) {
      alert('Por favor selecciona un cliente/usuario.');
      return;
    }

    if (saleItems.length === 0) {
      alert('Debes agregar al menos un producto a la venta.');
      return;
    }

    const hasInvalidItem = saleItems.some((item) => !item.productId);
    if (hasInvalidItem) {
      alert('Por favor selecciona un producto válido en cada fila.');
      return;
    }

    setIsSubmitting(true);

    try {
      await API.post('/sales', {
        userId: Number(selectedUserId),
        products: saleItems.map((item) => ({
          productId: Number(item.productId),
          quantity: Number(item.quantity)
        }))
      });

      alert('¡Venta registrada exitosamente!');
      navigate('/sales');
    } catch (err) {
      console.error('Error al registrar la venta:', err);
      alert('Ocurrió un error al procesar la venta. Verifique el stock.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container my-4">
      <div className="card shadow-sm border-0 max-w-3xl mx-auto">
        <div className="card-header bg-dark text-white py-3">
          <h4 className="card-title mb-0">Registrar Nueva Venta</h4>
        </div>

        <div className="card-body p-4">
          <form onSubmit={handleSubmitSale}>
            {/* Selección de Cliente */}
            <div className="mb-4">
              <label className="form-label fw-bold">Cliente / Usuario</label>
              <select
                className="form-select"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                required
              >
                <option value="">-- Seleccionar cliente --</option>
                {userOptions.map(({ id, name, email }) => (
                  <option key={id} value={id}>
                    {name} ({email})
                  </option>
                ))}
              </select>
            </div>

            <hr className="my-4" />

            {/* Detalle de Productos */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0 fw-bold">Productos de la Venta</h5>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={handleAddItem}
              >
                + Agregar Producto
              </button>
            </div>

            {saleItems.length === 0 ? (
              <div className="alert alert-light text-center border py-4 mb-4">
                No has agregado productos a esta venta. Haz clic en <strong>"+ Agregar Producto"</strong>.
              </div>
            ) : (
              saleItems.map((item, index) => {
                const currentProduct = productCatalog.find(
                  (p) => String(p.id) === String(item.productId)
                );
                const itemSubtotal = currentProduct
                  ? Number(currentProduct.price) * Number(item.quantity)
                  : 0;

                return (
                  <div key={index} className="row g-2 align-items-center mb-3">
                    <div className="col-md-5">
                      <select
                        className="form-select"
                        value={item.productId}
                        onChange={(e) =>
                          handleItemChange(index, 'productId', e.target.value)
                        }
                        required
                      >
                        <option value="">Seleccionar producto</option>
                        {productCatalog.map(({ id, name, price, stock }) => (
                          <option key={id} value={id} disabled={stock <= 0}>
                            {name} - ${Number(price).toLocaleString()} ({stock} en stock)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-3">
                      <input
                        type="number"
                        min="1"
                        className="form-control"
                        placeholder="Cantidad"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(index, 'quantity', e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="col-md-3 text-end fw-bold text-success">
                      ${itemSubtotal.toLocaleString()}
                    </div>

                    <div className="col-md-1 text-end">
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleRemoveItem(index)}
                        title="Remover producto"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })
            )}

            <hr className="my-4" />

            {/* Total y Acciones */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="fs-5 fw-bold text-dark">Total de la Venta:</span>
              <span className="fs-3 fw-bold text-success">
                ${calculatedTotal.toLocaleString()}
              </span>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary px-4"
                onClick={() => navigate('/sales')}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-success px-4"
                disabled={isSubmitting || saleItems.length === 0}
              >
                {isSubmitting ? 'Procesando...' : 'Finalizar Venta'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SaleForm;