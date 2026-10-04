import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';

import ProductList from './pages/products/ProductList';
import ProductForm from './pages/products/ProductForm';

import ProviderList from './pages/providers/ProviderList';
import ProviderForm from './pages/providers/ProviderForm';

import UserList from './pages/users/UserList';
import UserForm from './pages/users/UserForm';

import SaleList from './pages/sales/SaleList';
import SaleForm from './pages/sales/SaleForm';

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-vh-100 d-flex flex-column bg-light">
        <Navbar />
        
        <main className="flex-grow-1 pb-5">
          <Routes>
            {/* Redirección automática de la raíz a Productos */}
            <Route path="/" element={<Navigate to="/products" replace />} />

            {/* Rutas para Productos */}
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/create" element={<ProductForm />} />
            <Route path="/products/edit/:id" element={<ProductForm />} />

            {/* Rutas para Proveedores */}
            <Route path="/providers" element={<ProviderList />} />
            <Route path="/providers/create" element={<ProviderForm />} />
            <Route path="/providers/edit/:id" element={<ProviderForm />} />

            {/* Rutas para Usuarios */}
            <Route path="/users" element={<UserList />} />
            <Route path="/users/create" element={<UserForm />} />
            <Route path="/users/edit/:id" element={<UserForm />} />

            {/* Rutas para Ventas */}
            <Route path="/sales" element={<SaleList />} />
            <Route path="/sales/create" element={<SaleForm />} />

            {/* Ruta por defecto para 404/No Encontrado */}
            <Route path="*" element={<Navigate to="/products" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;