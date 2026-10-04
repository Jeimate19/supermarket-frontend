import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/api';

const SaleList = () => {
  const [salesRecords, setSalesRecords] = useState([]);
  const [expandedSaleId, setExpandedSaleId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSalesHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await API.get('/sales');
      setSalesRecords(data);
    } catch (err) {
      console.error('Error al consultar el registro de ventas:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSalesHistory();
  }, [fetchSalesHistory]);

  const toggleDetails = (saleId) => {
    setExpandedSaleId((prevId) => (prevId === saleId ? null : saleId));
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Historial de Ventas</h2>
          <p className="text-muted small mb-0">Consulta de transacciones y desglose de productos</p>
        </div>

        <Link to="/sales/create" className="btn btn-success shadow-sm d-flex align-items-center gap-1">
          <span>+ Registrar Venta</span>
        </Link>
      </div>

      <div className="card shadow-sm border-0 rounded-3">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light border-bottom">
                <tr>
                  <th className="ps-4 py-3">N° Venta</th>
                  <th className="py-3">Cliente / Usuario</th>
                  <th className="py-3">Monto Total</th>
                  <th className="py-3 text-center pe-4">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-5 text-muted">
                      Cargando historial de ventas...
                    </td>
                  </tr>
                ) : salesRecords.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-5 text-muted">
                      No hay ventas registradas en la base de datos.
                    </td>
                  </tr>
                ) : (
                  salesRecords.map((sale) => {
                    const isExpanded = expandedSaleId === sale.id;

                    return (
                      <React.Fragment key={sale.id}>
                        {/* Fila Principal de la Venta */}
                        <tr className={isExpanded ? 'table-active' : ''}>
                          <td className="ps-4 fw-bold">
                            <span className="badge bg-dark">
                              #{sale.id}
                            </span>
                          </td>
                          <td className="fw-semibold text-dark">
                            {sale.User?.name || 'Usuario desconocido'}
                          </td>
                          <td>
                            <span className="badge bg-success bg-opacity-10 text-success border border-success px-3 py-2 fs-6">
                              ${Number(sale.total).toLocaleString()}
                            </span>
                          </td>
                          <td className="text-center pe-4">
                            <button
                              className={`btn btn-sm ${isExpanded ? 'btn-secondary' : 'btn-outline-primary'}`}
                              onClick={() => toggleDetails(sale.id)}
                            >
                              {isExpanded ? 'Ocultar Detalle' : 'Ver Detalle'}
                            </button>
                          </td>
                        </tr>

                        {/* Fila Expandible con Detalle de Productos */}
                        {isExpanded && (
                          <tr>
                            <td colSpan="4" className="p-0 border-0">
                              <div className="p-4 bg-light border-bottom">
                                <h6 className="fw-bold mb-3 text-secondary text-uppercase tracking-wider">
                                  Items de la Venta #{sale.id}
                                </h6>

                                <div className="card border shadow-sm">
                                  <div className="table-responsive">
                                    <table className="table table-sm table-striped align-middle mb-0">
                                      <thead className="table-light">
                                        <tr>
                                          <th className="ps-3">Producto</th>
                                          <th className="text-center">Cantidad</th>
                                          <th className="text-end">Precio Unitario</th>
                                          <th className="text-end pe-3">Subtotal</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {sale.Details && sale.Details.length > 0 ? (
                                          sale.Details.map((detail, idx) => {
                                            const unitPrice = Number(detail.price || 0);
                                            const subtotal = unitPrice * Number(detail.quantity || 0);

                                            return (
                                              <tr key={idx}>
                                                <td className="ps-3 fw-semibold">
                                                  {detail.Product?.name || 'Producto no disponible'}
                                                </td>
                                                <td className="text-center">{detail.quantity}</td>
                                                <td className="text-end">${unitPrice.toLocaleString()}</td>
                                                <td className="text-end pe-3 fw-bold text-success">
                                                  ${subtotal.toLocaleString()}
                                                </td>
                                              </tr>
                                            );
                                          })
                                        ) : (
                                          <tr>
                                            <td colSpan="4" className="text-center py-3 text-muted">
                                              No hay información sobre el detalle de esta venta.
                                            </td>
                                          </tr>
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleList;