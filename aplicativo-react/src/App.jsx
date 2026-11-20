// App.jsx: define TODAS las rutas de la aplicación.
//
//  - LayoutPublico: pantallas sin sesión (login, registro, verificar correo, recuperar contraseña)
//  - LayoutPrivado: pantallas internas (revisa la sesión y muestra Sidebar + Header)
//  - Las rutas del menú deben coincidir con components/layout/menu.js

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LayoutPublico from './layouts/LayoutPublico.jsx';
import LayoutPrivado from './layouts/LayoutPrivado.jsx';

import Login from './pages/Login.jsx';
import Registro from './pages/Registro.jsx';
import VerificarCorreo from './pages/VerificarCorreo.jsx';
import RecuperarContrasena from './pages/RecuperarContrasena.jsx';

import Perfil from './pages/Perfil.jsx';
import Panel from './pages/Panel.jsx';
import Clientes from './pages/Clientes.jsx';
import ClienteDetalle from './pages/ClienteDetalle.jsx';
import Prospectos from './pages/Prospectos.jsx';
import Agenda from './pages/Agenda.jsx';
import Alertas from './pages/Alertas.jsx';
import Seguimiento from './pages/Seguimiento.jsx';
import Oportunidades from './pages/Oportunidades.jsx';
import Compromisos from './pages/Compromisos.jsx';
import Catalogo from './pages/Catalogo.jsx';
import Ventas from './pages/Ventas.jsx';
import Reportes from './pages/Reportes.jsx';
import ImportarExportar from './pages/ImportarExportar.jsx';
import NoEncontrada from './pages/NoEncontrada.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ---------- Sin sesión ---------- */}
        <Route element={<LayoutPublico />}>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/verificar-correo" element={<VerificarCorreo />} />
          <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
        </Route>

        {/* ---------- Con sesión ---------- */}
        <Route element={<LayoutPrivado />}>
          <Route path="/" element={<Panel />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/clientes/:id" element={<ClienteDetalle />} />
          <Route path="/prospectos" element={<Prospectos />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/alertas" element={<Alertas />} />
          <Route path="/seguimiento" element={<Seguimiento />} />
          <Route path="/oportunidades" element={<Oportunidades />} />
          <Route path="/compromisos" element={<Compromisos />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/importar-exportar" element={<ImportarExportar />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>

        {/* ---------- Cualquier otra dirección ---------- */}
        <Route path="*" element={<NoEncontrada />} />
      </Routes>
    </BrowserRouter>
  );
}
