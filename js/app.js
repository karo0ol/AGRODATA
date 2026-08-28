/* ================= ESTADO GLOBAL REPACTIVO DE LA APLICACIÓN ================= */
const appState = {
  currentUser: null,
  clientSearchTerm: '',
  clientFilter: 'Todos',
  clientPage: 1,
  itemsPerPage: 5,
  activeSelectedClientIndex: 0,
  activeSelectedOpportunity: { clientName: 'Hacienda Santa Rita', stage: 'Interesado' },
  activeVisitEditingId: null,

  clients: [
    { nombre: "Finca La Esperanza", nit: "900.221.884-2", ubic: "Ibagué, Tolima", tipo: "Finca productora", cultivo: "Maíz", estado: "Activo", contacto: "Roberto Gómez", tel: "+57 315 402 8877", email: "roberto@esperanza.com", stage: "Venta Pactada", valAnual: "$24.6M", lastBuy: "12 jul 2026", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=160&fit=crop", compromisos: [] },
    { nombre: "Agroindustrias El Roble", nit: "800.114.220-9", ubic: "Pitalito, Huila", tipo: "Empresa agroindustrial", cultivo: "Café", estado: "En riesgo", contacto: "Elena Vargas", tel: "+57 310 998 1122", email: "elena@elroble.com", stage: "Interesado", valAnual: "$18.2M", lastBuy: "05 may 2026", img: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=160&fit=crop", compromisos: [] },
    { nombre: "Hacienda Santa Rita", nit: "901.556.774-1", ubic: "Yopal, Casanare", tipo: "Finca productora", cultivo: "Arroz", estado: "Activo", contacto: "Hernán Cortés", tel: "+57 320 445 6677", email: "hernan@santarita.com", stage: "Interesado", valAnual: "$32.0M", lastBuy: "28 jun 2026", img: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=160&fit=crop", compromisos: [] },
    { nombre: "Finca El Paraíso", nit: "902.774.310-5", ubic: "Duitama, Boyacá", tipo: "Finca productora", cultivo: "Papa", estado: "Inactivo", contacto: "Jorge Restrepo", tel: "+57 311 223 3445", email: "jorge@paraiso.com", stage: "Prospecto", valAnual: "$12.0M", lastBuy: "14 ene 2026", img: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=160&fit=crop", compromisos: [] },
    { nombre: "Cultivos del Cauca S.A.S.", nit: "890.221.774-8", ubic: "Santander de Quilichao, Cauca", tipo: "Cooperativa", cultivo: "Caña", estado: "Activo", contacto: "Martha Lucía", tel: "+57 300 778 9900", email: "martha@cultivoscauca.com", stage: "Propuesta", valAnual: "$45.5M", lastBuy: "02 ago 2026", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=160&fit=crop", compromisos: [] },
    { nombre: "Finca Buenavista", nit: "903.442.110-3", ubic: "Barrancabermeja, Santander", tipo: "Finca productora", cultivo: "Cacao", estado: "En riesgo", contacto: "Carlos Páez", tel: "+57 318 665 4433", email: "carlos@buenavista.com", stage: "Prospecto", valAnual: "$15.8M", lastBuy: "10 feb 2026", img: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=160&fit=crop", compromisos: [] },
    { nombre: "Agropecuaria San José", nit: "800.998.221-4", ubic: "Andes, Antioquia", tipo: "Distribuidor agro", cultivo: "Aguacate", estado: "Activo", contacto: "Sonia Morales", tel: "+57 312 334 5566", email: "sonia@sanjose.com", stage: "Contactado", valAnual: "$28.0M", lastBuy: "18 jul 2026", img: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=160&fit=crop", compromisos: [] },
    { nombre: "Finca Villa Marina", nit: "901.220.667-0", ubic: "Villavicencio, Meta", tipo: "Finca productora", cultivo: "Maíz", estado: "En riesgo", contacto: "Guillermo León", tel: "+57 314 556 7788", email: "guillermo@villamarina.com", stage: "Prospecto", valAnual: "$19.4M", lastBuy: "22 mar 2026", img: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=160&fit=crop", compromisos: [] }
  ],

  visits: [
    { id: 101, clientName: "Finca La Esperanza", objective: "Revisión técnica de cultivo de maíz", date: "2026-08-14", time: "09:00", status: "Próxima" },
    { id: 102, clientName: "Cultivos del Cauca S.A.S.", objective: "Entrega de agroinsumos y foliares", date: "2026-08-15", time: "14:30", status: "Próxima" },
    { id: 103, clientName: "Finca El Paraíso", objective: "Diagnóstico de suelo y nutrición", date: "2026-08-05", time: "11:00", status: "Próxima" }
  ],

  alerts: [
    { id: 1, type: "Cartera", client: "Finca El Paraíso", title: "Finca El Paraíso — Cartera vencida hace 12 días", sub: "Monto pendiente: $3.4M · Zona Boyacá", priority: "Alta" },
    { id: 2, type: "Visita", client: "Finca Villa Marina", title: "Finca Villa Marina — Sin visita hace 38 días", sub: "Zona Meta · Cultivo de Maíz", priority: "Media" },
    { id: 3, type: "Insumos", client: "Agropecuaria San José", title: "Agropecuaria San José — Alerta de reorden de insumos", sub: "Requerimiento de Fertilizante Folio-S", priority: "Media" }
  ],

  importHistory: [
    { archivo: "fincas_tolima.csv", fecha: "02 ago 2026", registros: 32, estado: "OK" },
    { archivo: "clientes_huila.xlsx", fecha: "25 jul 2026", registros: 18, estado: "3 advertencias" }
  ],

  usersList: [
    { nombre: "Andrés Peña", zona: "Tolima", clientes: 32, visitas: 14, acceso: "Hoy, 8:32 a.m.", estado: "Activo", oportunidades: 9, ventas: 5 },
    { nombre: "Laura Gómez", zona: "Huila", clientes: 28, visitas: 11, acceso: "Ayer, 5:10 p.m.", estado: "Activo", oportunidades: 7, ventas: 3 },
    { nombre: "Camila Ríos", zona: "Boyacá", clientes: 24, visitas: 9, acceso: "Hoy, 7:58 a.m.", estado: "Activo", oportunidades: 6, ventas: 4 }
  ],

  /* ===== AGREGADO: indicador de estado de conexión (offline/online) ===== */
  connection: { online: true, pending: 0 },

  /* ===== AGREGADO: módulo M5 - Órdenes de compra ===== */
  activeOrderEditingId: null,
  orders: [
    { id: 5001, clientName: "Finca La Esperanza", producto: "Fertilizante NPK 15-15-15", cantidad: "40 bultos", precio: "$8.5M", fechaEntrega: "2026-08-20", estado: "En proceso", novedades: [] },
    { id: 5002, clientName: "Cultivos del Cauca S.A.S.", producto: "Foliar Nutricional Premium", cantidad: "120 L", precio: "$4.2M", fechaEntrega: "2026-08-10", estado: "Entregada", novedades: [] },
    { id: 5003, clientName: "Finca El Paraíso", producto: "Fungicida Sistémico", cantidad: "25 L", precio: "$2.1M", fechaEntrega: "2026-07-28", estado: "Con novedad", novedades: [ { fecha: "2026-07-29", detalle: "Entrega parcial: faltaron 5 L por desabasto del proveedor." } ] }
  ]
};

const permisosPorRol = {
  asesor: ["Ver y registrar clientes propios", "Gestionar pipeline asignado", "Agendar e informar visitas", "Ver alertas de cartera personal"],
  admin: ["Dashboard consolidado de gerencia", "Gestión de todos los usuarios y roles", "Importación maestro ISA", "Visualización de reportes globales"]
};

const menus = {
  asesor: [
    { label: "GESTIÓN COMERCIAL", items: [
      { id: "scr-dashboard", label: "Panel de Control", icon: "layout-dashboard" },
      { id: "scr-clientes-buscar", label: "Clientes", icon: "users", sub: [
        { id: "scr-clientes-buscar", label: "Buscar Cliente" },
        { id: "scr-clientes-registrar", label: "Registrar Cliente" },
        { id: "scr-clientes-importar", label: "Importar Clientes" }
      ]},
      { id: "scr-pipeline", label: "Pipeline Comercial", icon: "git-branch" },
      { id: "scr-visitas", label: "Gestión de Visitas", icon: "calendar-check" },
      { id: "scr-ordenes", label: "Órdenes de Compra", icon: "package-check" }
    ]},
    { label: "ANÁLISIS & ALERTAS", items: [
      { id: "scr-alertas", label: "Centro de Alertas", icon: "bell-ring" },
      { id: "scr-reportes", label: "Reportes & Métricas", icon: "bar-chart-3" }
    ]}
  ],
  admin: [
    { label: "GERENCIA & CONTROL", items: [
      { id: "scr-dashboard-gerente", label: "Panel de Control", icon: "layout-dashboard" },
      { id: "scr-usuarios", label: "Usuarios y Roles", icon: "user-cog" },
      { id: "scr-importar-isa", label: "Importar ISA", icon: "upload" },
      { id: "scr-ordenes", label: "Órdenes de Compra", icon: "package-check" },
      { id: "scr-alertas-globales", label: "Alertas Nacionales", icon: "bell-ring" },
      { id: "scr-reportes", label: "Reportes Consolidados", icon: "bar-chart-3" }
    ]}
  ]
};

let loginSelectedRole = "asesor";

/* ================= PERSISTENCIA ENTRE PÁGINAS =================
   Como ahora cada módulo vive en su propio archivo .html, el estado
   (appState) se guarda en localStorage al salir de la página y se
   recupera al entrar a la siguiente, para que los datos no se pierdan
   al navegar entre pestañas/páginas. */
const STORAGE_KEY = 'agrodata_state_v2';

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  } catch (e) { /* almacenamiento no disponible: se ignora */ }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) Object.assign(appState, JSON.parse(raw));
  } catch (e) { /* datos corruptos: se usan los valores por defecto */ }
}

loadState();
window.addEventListener('beforeunload', saveState);

/* Qué archivo .html contiene cada pantalla, para saltar entre páginas reales */
const SCREEN_PAGE_MAP = {
  'scr-dashboard': 'dashboard.html',
  'scr-dashboard-gerente': 'dashboard.html',
  'scr-clientes-buscar': 'clientes.html',
  'scr-clientes-registrar': 'clientes.html',
  'scr-clientes-importar': 'clientes.html',
  'scr-ficha-cliente': 'ficha-cliente.html',
  'scr-pipeline': 'pipeline.html',
  'scr-visitas': 'visitas.html',
  'scr-alertas': 'alertas.html',
  'scr-alertas-globales': 'alertas.html',
  'scr-reportes': 'reportes.html',
  'scr-usuarios': 'usuarios.html',
  'scr-usuarios-nuevo': 'usuarios.html',
  'scr-importar-isa': 'importar-isa.html',
  'scr-ordenes': 'ordenes.html'
};

/* Alterna entre el formulario de login y el de recuperar contraseña
   (ambas viven en index.html, fuera del sistema de .screen) */
function showForgotScreen() {
  const l = document.getElementById('screen-login');
  const f = document.getElementById('screen-forgot');
  if (l) l.classList.add('hidden');
  if (f) f.classList.remove('hidden');
}

function showLoginScreen() {
  const l = document.getElementById('screen-login');
  const f = document.getElementById('screen-forgot');
  if (f) f.classList.add('hidden');
  if (l) l.classList.remove('hidden');
}

/* Inicializa cualquier página interna de la app (todas menos index.html):
   valida sesión, arma el sidebar/perfil y abre la pantalla que corresponda. */
function initPage(defaultScreen, adminScreen) {
  if (!appState.currentUser) {
    window.location.href = 'index.html';
    return;
  }
  updateProfileUI();
  buildSidebar();
  populateClientSelectors();
  renderConnIndicator();

  const roleScreen = (adminScreen && appState.currentUser.role === 'admin') ? adminScreen : defaultScreen;
  const pending = sessionStorage.getItem('agrodata_target_screen');
  sessionStorage.removeItem('agrodata_target_screen');
  const target = (pending && document.getElementById(pending)) ? pending : roleScreen;
  showScreen(target);

  if (sessionStorage.getItem('agrodata_just_logged_in')) {
    sessionStorage.removeItem('agrodata_just_logged_in');
    showToast(`¡Bienvenido, ${appState.currentUser.name}!`);
  }
}

/* ================= PARTE 1: LOGIN & PERFIL ================= */
function selectLoginRole(role) {
  loginSelectedRole = role;
  document.querySelectorAll('.role-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.role === role));
}

function togglePass() {
  const inp = document.getElementById('pass-input');
  inp.type = inp.type === 'password' ? 'text' : 'password';
}

function sendReset() {
  const emailInp = document.getElementById('reset-email-input').value;
  document.getElementById('forgot-confirm-msg').textContent = `Te hemos enviado un enlace de recuperación a ${emailInp}`;
  document.getElementById('forgot-step1').classList.add('hidden');
  document.getElementById('forgot-step2').classList.remove('hidden');
}

function authenticateUser(role) {
  if (role === 'admin') {
    return { name: 'Andrés Peña', roleLabel: 'Gerente / Administrador', initials: 'AP', role: 'admin', phone: '+57 310 888 9900', email: 'andres.pena@agrodata.com', zone: 'Nacional' };
  } else {
    return { name: 'Camila Ríos', roleLabel: 'Asesora comercial', initials: 'CR', role: 'asesor', phone: '+57 315 402 8877', email: 'camila.rios@agrodata.com', zone: 'Boyacá - Tolima' };
  }
}

function doLogin() {
  appState.currentUser = authenticateUser(loginSelectedRole);
  sessionStorage.setItem('agrodata_just_logged_in', '1');
  saveState();
  window.location.href = 'dashboard.html';
}

function doLogout() {
  appState.currentUser = null;
  saveState();
  window.location.href = 'index.html';
}

function updateProfileUI() {
  const u = appState.currentUser;
  if (!u) return;
  document.getElementById('uc-name').textContent = u.name;
  document.getElementById('uc-role').textContent = u.roleLabel;
  document.getElementById('uc-initials').textContent = u.initials;
  document.getElementById('pc-name').textContent = u.name;
  document.getElementById('pc-initials').textContent = u.initials;

  document.getElementById('prof-name').value = u.name;
  document.getElementById('prof-email').value = u.email;
  document.getElementById('prof-phone').value = u.phone;
  document.getElementById('prof-zone').value = u.zone;
  document.getElementById('modal-avatar-preview').textContent = u.initials;
}

function saveUserProfile() {
  appState.currentUser.name = document.getElementById('prof-name').value;
  appState.currentUser.email = document.getElementById('prof-email').value;
  appState.currentUser.phone = document.getElementById('prof-phone').value;
  appState.currentUser.initials = appState.currentUser.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase();
  
  updateProfileUI();
  closeModal('modal-profile');
  showToast('Perfil actualizado correctamente');
}

function changeAvatarSimulated() {
  showToast('Sube una imagen de perfil (simulado)');
}

/* ================= NAV & SIDEBAR ================= */
function buildSidebar() {
  const nav = document.getElementById('nav-scroll');
  nav.innerHTML = "";
  const userRole = appState.currentUser ? appState.currentUser.role : 'asesor';

  menus[userRole].forEach(group => {
    const g = document.createElement('div');
    g.className = 'nav-group';
    let html = `<div class="nav-group-label">${group.label}</div>`;
    group.items.forEach(item => {
      if (item.sub) {
        html += `<div class="nav-item" data-target="${item.id}" onclick="toggleSub(this)">
          <i data-lucide="${item.icon}"></i><span>${item.label}</span><i data-lucide="chevron-right" class="chev"></i></div>
          <div class="nav-sub">`;
        item.sub.forEach(s => {
          html += `<div class="nav-item nav-sub-item" data-target="${s.id}" onclick="navTo('${s.id}', this)">${s.label}</div>`;
        });
        html += `</div>`;
      } else {
        html += `<div class="nav-item" data-target="${item.id}" onclick="navTo('${item.id}', this)"><i data-lucide="${item.icon}"></i><span>${item.label}</span></div>`;
      }
    });
    g.innerHTML = html;
    nav.appendChild(g);
  });
  renderIcons();
}

function toggleSub(el) {
  el.classList.toggle('expanded');
  const sub = el.nextElementSibling;
  if(sub) sub.classList.toggle('open');
}

function navTo(id, el) {
  showScreen(id);
}

function setActiveNav(id) {
  document.querySelectorAll('.nav-item').forEach(n => {
    if (n.dataset.target === id) {
      n.classList.add('active');
    } else {
      n.classList.remove('active');
    }
  });
}

function showScreen(id) {
  const target = document.getElementById(id);
  if (!target) {
    // La pantalla pedida vive en otro archivo: guardamos el estado
    // y saltamos a esa página, que la abrirá automáticamente al cargar.
    const page = SCREEN_PAGE_MAP[id];
    if (page) {
      saveState();
      sessionStorage.setItem('agrodata_target_screen', id);
      window.location.href = page;
    }
    return;
  }
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  target.classList.add('active');
  window.scrollTo(0, 0);

  setActiveNav(id);

  if (id === 'scr-dashboard') renderDashboardAsesor();
  if (id === 'scr-dashboard-gerente') renderDashboardGerente();
  if (id === 'scr-clientes-buscar') renderClientList();
  if (id === 'scr-pipeline') { renderKanban(); renderArchivedOpportunities(); }
  if (id === 'scr-visitas') renderVisits();
  if (id === 'scr-alertas') renderAlerts();
  if (id === 'scr-alertas-globales') renderAlertasGlobales();
  if (id === 'scr-usuarios') renderUsuarios();
  if (id === 'scr-usuarios-nuevo') renderPerms();
  if (id === 'scr-clientes-importar') renderImportHistory();
  if (id === 'scr-importar-isa') renderIsaHistory();
  if (id === 'scr-ordenes') renderOrdenes();

  renderIcons();
}

/* ================= PARTE 2: CLIENTES ================= */
function setClientTab(filter) {
  appState.clientFilter = filter;
  appState.clientPage = 1;
  document.querySelectorAll('#client-tabs .tab-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.f === filter));
  renderClientList();
}

function renderClientList() {
  const term = appState.clientSearchTerm.toLowerCase();
  let filtered = appState.clients.filter(c => appState.clientFilter === 'Todos' || c.estado === appState.clientFilter);
  if (term) {
    filtered = filtered.filter(c => c.nombre.toLowerCase().includes(term) || c.nit.includes(term) || c.ubic.toLowerCase().includes(term) || c.cultivo.toLowerCase().includes(term));
  }

  // Update counts
  document.getElementById('count-total').textContent = appState.clients.length;
  document.getElementById('count-activos').textContent = appState.clients.filter(c=>c.estado==='Activo').length;
  document.getElementById('count-riesgo').textContent = appState.clients.filter(c=>c.estado==='En riesgo').length;
  document.getElementById('count-inactivos').textContent = appState.clients.filter(c=>c.estado==='Inactivo').length;

  document.getElementById('badge-tab-todos').textContent = appState.clients.length;
  document.getElementById('badge-tab-activo').textContent = appState.clients.filter(c=>c.estado==='Activo').length;
  document.getElementById('badge-tab-riesgo').textContent = appState.clients.filter(c=>c.estado==='En riesgo').length;
  document.getElementById('badge-tab-inactivo').textContent = appState.clients.filter(c=>c.estado==='Inactivo').length;

  // Pagination logic
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / appState.itemsPerPage) || 1;
  if (appState.clientPage > totalPages) appState.clientPage = totalPages;

  const startIdx = (appState.clientPage - 1) * appState.itemsPerPage;
  const pageItems = filtered.slice(startIdx, startIdx + appState.itemsPerPage);

  const pillMap = { Activo: 'pill-verde', 'En riesgo': 'pill-rojo', Inactivo: 'pill-gris', Prospecto: 'pill-morado' };

  const container = document.getElementById('client-list');
  if (pageItems.length === 0) {
    container.innerHTML = `<div class="card" style="text-align:center;padding:30px;"><p>No se encontraron clientes que coincidan con la búsqueda.</p></div>`;
  } else {
    container.innerHTML = pageItems.map((c, i) => `
      <div class="client-row" onclick="openFichaByClientName('${c.nombre.replace(/'/g, "\\'")}')">
        <img src="${c.img}">
        <div class="cr-info">
          <div class="cr-name">${c.nombre}</div>
          <div class="cr-meta">
            <span><i data-lucide="map-pin" style="width:12px;height:12px"></i> ${c.ubic}</span>
            <span><i data-lucide="tag" style="width:12px;height:12px"></i> ${c.tipo}</span>
            <span><i data-lucide="sprout" style="width:12px;height:12px"></i> ${c.cultivo}</span>
          </div>
        </div>
        <div class="cr-right">
          <span class="pill ${pillMap[c.estado] || 'pill-gris'}">${c.estado}</span>
          <span class="cr-code">${c.nit}</span>
          <button class="cr-quick-btn" title="Registro rápido de visita (menos de 60s)" onclick="openQuickVisitModal('${c.nombre.replace(/'/g, "\\'")}', event)"><i data-lucide="zap" style="width:15px;height:15px"></i></button>
          <i data-lucide="chevron-right" style="width:16px;height:16px;color:#a49f8e"></i>
        </div>
      </div>
    `).join('');
  }

  // Render pagination controls (Hide if <= 1 page)
  const paginContainer = document.getElementById('client-pagination');
  if (totalPages <= 1) {
    paginContainer.style.display = 'none';
  } else {
    paginContainer.style.display = 'flex';
    let pBtns = '';
    for (let p = 1; p <= totalPages; p++) {
      pBtns += `<button class="${p === appState.clientPage ? 'active' : ''}" onclick="goToClientPage(${p})">${p}</button>`;
    }
    paginContainer.innerHTML = pBtns;
  }
  renderIcons();
}

function goToClientPage(p) {
  appState.clientPage = p;
  renderClientList();
}

function toggleChip(el) {
  el.classList.toggle('selected');
}

function promptAddCrop() {
  const cropName = prompt("Ingresa el nombre del cultivo a agregar:");
  if (cropName && cropName.trim() !== "") {
    const chipRow = document.getElementById('crop-chips');
    const newChip = document.createElement('div');
    newChip.className = 'chip selected';
    newChip.onclick = function() { toggleChip(this); };
    newChip.innerHTML = `${cropName.trim()} <span class="chip-remove">×</span>`;
    chipRow.insertBefore(newChip, chipRow.querySelector('.add-chip'));
  }
}

function pickStageInForm(el, stage) {
  const steps = el.parentElement.children;
  let passed = true;
  for (let s of steps) {
    s.classList.toggle('done', passed);
    if (s === el) passed = false;
  }
  el.dataset.selectedStage = stage;
}

function saveNewClient() {
  // AGREGADO: aviso de tratamiento de datos personales (Ley 1581 de 2012)
  const privacyCheck = document.getElementById('reg-privacy-check');
  if (privacyCheck && !privacyCheck.checked) {
    showToast('Debes aceptar el aviso de tratamiento de datos personales para continuar.');
    return;
  }

  const nombre = document.getElementById('reg-nombre').value;
  const nit = document.getElementById('reg-nit').value;
  const tipo = document.getElementById('reg-tipo').value;
  const ubic = document.getElementById('reg-ubic').value;
  const estado = document.getElementById('reg-estado').value;
  const contacto = document.getElementById('reg-contacto').value;
  const tel = document.getElementById('reg-tel').value;
  const email = document.getElementById('reg-email').value;

  const selectedCrops = Array.from(document.querySelectorAll('#crop-chips .chip.selected')).map(c => c.textContent.replace('×', '').trim());
  const cultivo = selectedCrops.join(', ') || 'Varios';

  // AGREGADO: perfil agronómico ampliado (SYS-FR-005)
  const hectareas = document.getElementById('reg-hectareas') ? document.getElementById('reg-hectareas').value : '';
  const epocaSiembra = document.getElementById('reg-epoca-siembra') ? document.getElementById('reg-epoca-siembra').value : '';
  const calendarioInsumos = document.getElementById('reg-calendario-insumos') ? document.getElementById('reg-calendario-insumos').value : '';
  const productosHabituales = document.getElementById('reg-productos-habituales') ? document.getElementById('reg-productos-habituales').value : '';

  const newClient = {
    nombre, nit, tipo, ubic, estado, contacto, tel, email,
    cultivo, stage: 'Prospecto', valAnual: '$10.0M', lastBuy: 'Sin compras',
    img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=160&fit=crop',
    compromisos: [],
    hectareas, epocaSiembra, calendarioInsumos, productosHabituales,
    adjuntos: []
  };

  appState.clients.unshift(newClient);
  registerPendingIfOffline();
  openModal('modal-client-ok');
}

function openFichaByClientName(name) {
  const idx = appState.clients.findIndex(c => c.nombre === name);
  if (idx !== -1) {
    appState.activeSelectedClientIndex = idx;
    const c = appState.clients[idx];

    document.getElementById('ficha-breadcrumb').textContent = c.nombre;
    document.getElementById('ficha-name').textContent = c.nombre;
    document.getElementById('ficha-img').src = c.img;
    document.getElementById('ficha-nit').innerHTML = `<i data-lucide="hash"></i> NIT ${c.nit}`;
    document.getElementById('ficha-tipo').innerHTML = `<i data-lucide="tag"></i> ${c.tipo}`;
    document.getElementById('ficha-loc').innerHTML = `<i data-lucide="map-pin"></i> ${c.ubic}`;
    document.getElementById('ficha-contact').innerHTML = `<i data-lucide="phone"></i> ${c.tel}`;

    const pillMap = { Activo: 'pill-verde', 'En riesgo': 'pill-rojo', Inactivo: 'pill-gris' };
    const stEl = document.getElementById('ficha-status');
    stEl.className = 'pill ' + (pillMap[c.estado] || 'pill-gris');
    stEl.textContent = c.estado;

    document.getElementById('ficha-last-buy').textContent = c.lastBuy;
    document.getElementById('ficha-val-anual').textContent = c.valAnual;

    document.getElementById('ficha-crops-list').innerHTML = c.cultivo.split(',').map(cr => `<div class="chip selected">${cr.trim()}</div>`).join('');

    // Render commitments
    const compContainer = document.getElementById('ficha-commitments-list');
    if (c.compromisos && c.compromisos.length > 0) {
      compContainer.innerHTML = c.compromisos.map(item => `
        <div class="timeline-item"><div class="ti-dot"></div><div><div class="ti-title">${item.commitment}</div><div class="ti-date">Fecha límite: ${item.date} · Observación: ${item.notes}${item.price ? ` · Precio: ${item.price}` : ''}${item.quality ? ` · Calidad: ${item.quality}` : ''}${item.deliveryDate ? ` · Entrega: ${item.deliveryDate}` : ''}</div></div></div>
      `).join('');
    } else {
      compContainer.innerHTML = `<p style="font-size:13px;color:var(--gris-texto)">Sin compromisos registrados recientemente.</p>`;
    }

    // AGREGADO: perfil agronómico ampliado
    const agroEl = document.getElementById('ficha-agro-info');
    if (agroEl) {
      agroEl.innerHTML = `
        <div><b>Hectáreas aprox.:</b> ${c.hectareas || 'No registrado'}</div>
        <div><b>Época de siembra:</b> ${c.epocaSiembra || 'No registrada'}</div>
        <div><b>Calendario de insumos:</b> ${c.calendarioInsumos || 'No registrado'}</div>
        <div><b>Productos habituales:</b> ${c.productosHabituales || 'No registrados'}</div>
      `;
    }

    renderClientAttachments();
    renderRecompraInfo();

    showScreen('scr-ficha-cliente');
  }
}

function confirmDeleteClient() {
  appState.clients.splice(appState.activeSelectedClientIndex, 1);
  closeModal('modal-delete-client');
  showToast('Cliente eliminado correctamente');
  showScreen('scr-clientes-buscar');
}

function setFichaTab(el, tab) {
  document.querySelectorAll('#ficha-tabs .tab-btn').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('ficha-panel-resumen').classList.toggle('hidden', tab !== 'resumen');
  document.getElementById('ficha-panel-otros').classList.toggle('hidden', tab === 'resumen');
}

/* ================= PARTE 2: IMPORTACIÓN ================= */
function triggerNativeFileSelect() {
  document.getElementById('native-file-input').click();
}

function handleFileSelected(input) {
  if (input.files && input.files[0]) {
    document.getElementById('selected-file-label').textContent = `Archivo seleccionado: ${input.files[0].name}`;
  }
}

function setImportFileType(type) {
  document.getElementById('ft-csv').classList.toggle('active', type === 'csv');
  document.getElementById('ft-xlsx').classList.toggle('active', type === 'xlsx');
}

function executeImportSimulated() {
  const btn = document.getElementById('btn-do-import');
  btn.disabled = true;
  btn.innerHTML = `<i data-lucide="loader" class="spin"></i> Procesando datos...`;

  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = `<i data-lucide="upload" style="width:16px;height:16px"></i> Procesar e Importar`;
    
    appState.importHistory.unshift({
      archivo: "import_clientes_reciente.csv",
      fecha: "Hoy",
      registros: 15,
      estado: "OK"
    });
    renderImportHistory();
    showToast('¡Importación completada! 15 registros cargados.');
  }, 1200);
}

function renderImportHistory() {
  document.getElementById('tb-import-history-asesor').innerHTML = appState.importHistory.map(h => `
    <tr><td>${h.archivo}</td><td>${h.fecha}</td><td>${h.registros}</td><td><span class="pill pill-verde">${h.estado}</span></td></tr>
  `).join('');
}

/* ================= PARTE 3: PIPELINE & VISITAS ================= */
function renderKanban() {
  const cols = ["Prospecto", "Contactado", "Interesado", "Propuesta", "Venta Pactada"];
  const wrap = document.getElementById('kanban-wrap');

  wrap.innerHTML = cols.map(col => {
    const colClients = appState.clients.filter(c => (c.stage || 'Prospecto') === col);
    return `
      <div class="kanban-col">
        <div class="kc-head"><span class="kc-title">${col}</span><span class="kc-count">${colClients.length}</span></div>
        ${colClients.map(c => `
          <div class="kanban-card ${appState.activeSelectedOpportunity.clientName === c.nombre ? 'selected' : ''}" onclick="selectOpportunity('${c.nombre.replace(/'/g, "\\'")}', '${col}')">
            <div class="kc-name">${c.nombre}</div>
            <div class="kc-type">${c.cultivo} · ${c.ubic}</div>
            <div class="kc-foot"><span class="kc-value">${c.valAnual}</span><span class="kc-time">Reciente</span></div>
          </div>
        `).join('')}
      </div>
    `;
  }).join('');
  renderIcons();
}

function selectOpportunity(clientName, stage) {
  appState.activeSelectedOpportunity = { clientName, stage };
  document.getElementById('dp-name').textContent = `${clientName} (${stage})`;
  renderKanban();
}

function confirmStageChange(newStage) {
  const client = appState.clients.find(c => c.nombre === appState.activeSelectedOpportunity.clientName);
  if (client) {
    client.stage = newStage;
    appState.activeSelectedOpportunity.stage = newStage;
    showToast(`Oportunidad movida a: ${newStage}`);
    renderKanban();
  }
  closeModal('modal-cambiar-etapa');
}

function confirmMarkLost() {
  const client = appState.clients.find(c => c.nombre === appState.activeSelectedOpportunity.clientName);
  if (client) {
    client.stage = 'Perdida';
    showToast(`Oportunidad marcada como perdida`);
    renderKanban();
  }
  closeModal('modal-marcar-perdido');
}

function populateClientSelectors() {
  const optionsHtml = appState.clients.map(c => `<option value="${c.nombre}">${c.nombre} (${c.ubic})</option>`).join('');
  document.getElementById('opp-client-select').innerHTML = optionsHtml;
  document.getElementById('visit-client-select').innerHTML = optionsHtml;
}

function saveNewOpportunity() {
  const clientName = document.getElementById('opp-client-select').value;
  const stage = document.getElementById('opp-stage').value;
  const client = appState.clients.find(c => c.nombre === clientName);
  if (client) {
    client.stage = stage;
    showToast('Oportunidad guardada en el pipeline');
    renderKanban();
  }
  closeModal('modal-nueva-oportunidad');
}

/* VISITAS */
function renderVisits() {
  const activeList = document.getElementById('visits-active-list');
  const completedList = document.getElementById('visits-completed-list');

  const activeVisits = appState.visits.filter(v => v.status !== 'Completada');
  const completedVisits = appState.visits.filter(v => v.status === 'Completada');

  document.getElementById('visit-count-total').textContent = appState.visits.length;
  document.getElementById('visit-count-proximas').textContent = appState.visits.filter(v=>v.status==='Próxima').length;
  document.getElementById('visit-count-encurso').textContent = appState.visits.filter(v=>v.status==='En curso').length;
  document.getElementById('visit-count-completadas').textContent = completedVisits.length;

  activeList.innerHTML = activeVisits.map(v => `
    <div class="visit-card">
      <div class="vc-info">
        <div class="vc-name">${v.clientName}</div>
        <div class="vc-meta">Objetivo: ${v.objective} · ${v.date} a las ${v.time} <span class="pill ${v.status==='En curso'?'pill-amarillo':'pill-verde'}" style="margin-left:8px;">${v.status}</span></div>
      </div>
      <div class="vc-actions">
        <button class="btn btn-outline btn-sm" onclick="openReagendaModal(${v.id})">Reagendar</button>
        ${v.status === 'En curso' ? 
          `<button class="btn btn-primary btn-sm" onclick="openFollowupModal(${v.id})">Registrar Compromisos</button>` :
          `<button class="btn btn-primary btn-sm" onclick="startVisit(${v.id})">Iniciar Visita</button>`}
      </div>
    </div>
  `).join('') || `<p style="font-size:13px;color:var(--gris-texto)">No hay visitas pendientes.</p>`;

  completedList.innerHTML = completedVisits.map(v => `
    <div class="visit-card" style="opacity:0.8;">
      <div class="vc-info">
        <div class="vc-name">${v.clientName}</div>
        <div class="vc-meta">Objetivo: ${v.objective} · Finalizada el ${v.date}</div>
      </div>
      <div class="vc-actions">
        <span class="pill pill-verde">Completada</span>
      </div>
    </div>
  `).join('') || `<p style="font-size:13px;color:var(--gris-texto)">No hay visitas completadas aún.</p>`;

  populateClientSelectors();
}

function saveNewVisit() {
  const clientName = document.getElementById('visit-client-select').value;
  const objective = document.getElementById('visit-objective').value;
  const date = document.getElementById('visit-date').value;
  const time = document.getElementById('visit-time').value;

  appState.visits.push({
    id: Date.now(),
    clientName, objective, date, time, status: "Próxima"
  });

  closeModal('modal-agendar-visita');
  showToast('Visita agendada exitosamente');
  renderVisits();
}

function openReagendaModal(id) {
  appState.activeVisitEditingId = id;
  openModal('modal-reagendar-visita');
}

function confirmReagendaVisit() {
  const v = appState.visits.find(x => x.id === appState.activeVisitEditingId);
  if (v) {
    v.date = document.getElementById('reagenda-date').value;
    v.time = document.getElementById('reagenda-time').value;
    v.status = "Próxima";
    showToast('Fecha de visita actualizada');
    renderVisits();
  }
  closeModal('modal-reagendar-visita');
}

function startVisit(id) {
  const v = appState.visits.find(x => x.id === id);
  if (v) {
    v.status = "En curso";
    showToast(`Visita a ${v.clientName} iniciada.`);
    renderVisits();
    openFollowupModal(id);
  }
}

function openFollowupModal(id) {
  appState.activeVisitEditingId = id;
  openModal('modal-formulario-visita');
}

function saveVisitFollowup() {
  const v = appState.visits.find(x => x.id === appState.activeVisitEditingId);
  if (v) {
    v.status = "Completada";
    const notes = document.getElementById('vf-notes').value;
    const products = document.getElementById('vf-products').value;
    const commitment = document.getElementById('vf-commitment').value;
    const date = document.getElementById('vf-commitment-date').value;
    // AGREGADO: compromisos por etapa (SYS-FR-015)
    const price = document.getElementById('vf-price') ? document.getElementById('vf-price').value : '';
    const quality = document.getElementById('vf-quality') ? document.getElementById('vf-quality').value : '';
    const deliveryDate = document.getElementById('vf-delivery-date') ? document.getElementById('vf-delivery-date').value : '';

    const client = appState.clients.find(c => c.nombre === v.clientName);
    if (client) {
      if (!client.compromisos) client.compromisos = [];
      client.compromisos.unshift({ notes, products, commitment, date, price, quality, deliveryDate });
    }

    registerPendingIfOffline();
    showToast('Reporte de visita guardado y compromisos registrados');
    renderVisits();
  }
  closeModal('modal-formulario-visita');
}

/* ================= PARTE 4: ALERTAS & NOTIFICACIONES ================= */
function renderAlerts(filter = 'Todas') {
  const container = document.getElementById('alerts-container');
  let list = appState.alerts;
  if (filter !== 'Todas') list = list.filter(a => a.type === filter);

  container.innerHTML = list.map(a => `
    <div class="alert-full-card" style="border-color:${a.priority==='Alta'?'var(--rojo)':'var(--amarillo)'}">
      <div class="af-left">
        <div class="a-icon"><i data-lucide="bell" style="color:${a.priority==='Alta'?'var(--rojo)':'var(--amarillo)'}"></i></div>
        <div><div class="af-title">${a.title}</div><div class="af-sub">${a.sub}</div></div>
      </div>
      <div class="af-actions">
        <button class="btn btn-outline btn-sm" onclick="actionAlertCall('${a.client}')"><i data-lucide="phone" style="width:13px;height:13px"></i> Llamar</button>
        <button class="btn btn-outline btn-sm" onclick="actionAlertMap('${a.client}')"><i data-lucide="map" style="width:13px;height:13px"></i> Ver Mapa</button>
        <button class="btn btn-dark btn-sm" onclick="actionAssignVisit('${a.client}')">Agendar Visita</button>
      </div>
    </div>
  `).join('');
  renderIcons();
}

function filterAlerts(type, btnEl) {
  document.querySelectorAll('#alert-tabs .tab-btn').forEach(b => b.classList.remove('active'));
  btnEl.classList.add('active');
  renderAlerts(type);
}

function actionAlertCall(clientName) {
  showToast(`Iniciando llamada telefónica con el contacto de ${clientName}...`);
}

function actionAlertMap(clientName) {
  openFichaByClientName(clientName);
  showToast(`Mostrando mapa e información de la finca: ${clientName}`);
}

function actionAssignVisit(clientName) {
  populateClientSelectors();
  document.getElementById('visit-client-select').value = clientName;
  openModal('modal-agendar-visita');
}

/* ================= PARTE 5: VISTA GERENCIA / ADMIN ================= */
function renderDashboardGerente() {
  const tableBody = document.getElementById('tb-performance-asesores');
  tableBody.innerHTML = appState.usersList.map(u => `
    <tr>
      <td><b>${u.nombre}</b></td>
      <td>${u.zona}</td>
      <td>${u.clientes}</td>
      <td>${u.visitas}</td>
      <td>${u.oportunidades != null ? u.oportunidades : '—'}</td>
      <td>${u.ventas != null ? u.ventas : '—'}</td>
      <td><span class="pill pill-verde">${Math.floor(Math.random()*20 + 60)}%</span></td>
    </tr>
  `).join('');

  document.getElementById('asesor-distribution-bars').innerHTML = appState.usersList.map(u => `
    <div style="margin-bottom:12px;">
      <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px;"><span>${u.nombre} (${u.zona})</span><b>${u.clientes} clientes</b></div>
      <div class="funnel-bar-bg"><div class="funnel-bar-fill" style="width:${(u.clientes/40)*100}%"></div></div>
    </div>
  `).join('');
}

function renderDashboardAsesor() {
  const funnel = [["Prospecto", 8, 100], ["Contactado", 6, 75], ["Interesado", 5, 62], ["Propuesta", 3, 37], ["Venta Pactada", 2, 25]];
  document.getElementById('funnel-chart').innerHTML = funnel.map(f => `
    <div class="funnel-row"><div class="fr-top"><span>${f[0]}</span><span>${f[1]} oportunidades</span></div>
    <div class="funnel-bar-bg"><div class="funnel-bar-fill" style="width:${f[2]}%"></div></div></div>`).join('');

  document.getElementById('visits-by-dist').innerHTML = [
    ["AgroInsumos del Centro", 14, "Tolima"], ["Cosechas del Sur", 9, "Huila"], ["Distribuidora Andina", 11, "Boyacá"]
  ].map(r => `<tr><td>${r[0]}</td><td><b>${r[1]}</b></td><td>${r[2]}</td></tr>`).join('');

  document.getElementById('dashboard-alerts').innerHTML = `
    <div class="alert-card a-rojo"><div class="a-icon"><i data-lucide="alert-octagon" color="#b93d3d" style="width:16px;height:16px"></i></div><div class="a-body"><div class="a-title">Finca El Paraíso — Cartera vencida hace 12 días</div><div class="a-sub">Monto pendiente $3.4M</div></div></div>
    <div class="alert-card a-amarillo"><div class="a-icon"><i data-lucide="clock-4" color="#a5741f" style="width:16px;height:16px"></i></div><div class="a-body"><div class="a-title">Finca Villa Marina — Sin visita hace 38 días</div><div class="a-sub">Zona Meta</div></div></div>`;
  renderIcons();
}

function renderAlertasGlobales() {
  const rows = [
    ["Finca El Paraíso", "AgroInsumos del Centro", "Boyacá", "Cartera vencida", "12", "$3.4M", "Alta"],
    ["Finca Villa Marina", "Cosechas del Sur", "Meta", "Sin visita", "38", "—", "Media"],
    ["Agroindustrias El Roble", "Distribuidora Andina", "Huila", "Riesgo inactividad", "45", "—", "Alta"],
  ];
  const prColor = { Alta: 'pill-rojo', Media: 'pill-amarillo', Baja: 'pill-gris' };
  document.getElementById('alertas-globales-body').innerHTML = rows.map(r => `
    <tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td><td>${r[5]}</td><td><span class="pill ${prColor[r[6]]}">${r[6]}</span></td></tr>
  `).join('');
}

function renderUsuarios() {
  document.getElementById('usuarios-body').innerHTML = appState.usersList.map((u, i) => `
    <tr>
      <td><b>${u.nombre}</b></td><td>${u.zona}</td><td>${u.clientes}</td><td>${u.visitas}</td><td>${u.acceso}</td>
      <td><span class="pill ${u.estado==='Activo'?'pill-verde':'pill-rojo'}">${u.estado}</span></td>
      <td style="display:flex;gap:6px;flex-wrap:wrap;">
        <button class="btn btn-outline btn-sm" onclick="showToast('Editando permisos de ${u.nombre}')">Editar</button>
        <button class="btn btn-outline btn-sm" onclick="openResetPasswordUser(${i})" title="Restablecer contraseña"><i data-lucide="key-round" style="width:13px;height:13px"></i></button>
        <button class="btn btn-outline btn-sm" onclick="openDeactivateUser(${i})" title="Activar/Desactivar cuenta"><i data-lucide="user-x" style="width:13px;height:13px"></i></button>
      </td>
    </tr>
  `).join('');
  renderIcons();
}

function renderPerms() {
  const role = document.getElementById('new-user-role').value;
  document.getElementById('perm-list').innerHTML = permisosPorRol[role].map(p => `
    <div class="perm-item"><i data-lucide="check" style="width:14px;height:14px"></i> ${p}</div>
  `).join('');
  renderIcons();
}

function saveNewUser() {
  const name = document.getElementById('nu-name').value;
  const zone = document.getElementById('nu-zone').value;
  appState.usersList.push({
    nombre: name, zona: zone, clientes: 0, visitas: 0, acceso: "Reciente", estado: "Activo"
  });
  showToast(`Usuario ${name} registrado correctamente.`);
  showScreen('scr-usuarios');
}

function isaGoStep(step) {
  [1, 2, 3, 4].forEach(n => {
    document.getElementById('isa-p' + n).classList.toggle('hidden', n !== step);
    const stEl = document.querySelector(`#isa-stepper .st-step[data-s="${n}"]`);
    if (stEl) {
      stEl.classList.toggle('active', n === step);
      stEl.classList.toggle('done', n < step);
    }
  });
  if (step === 2) {
    const fill = document.getElementById('isa-progress');
    fill.style.width = '0%';
    setTimeout(() => { fill.style.width = '100%'; }, 100);
  }
}

function confirmIsaImport() {
  isaGoStep(1);
  showToast('Importación Maestro ISA finalizada con éxito');
}

function renderIsaHistory() {
  document.getElementById('tb-isa-history').innerHTML = `
    <tr><td>isa_maestro_julio.csv</td><td>02 jul 2026</td><td>Andrés Peña</td><td>980</td><td>4</td><td><span class="pill pill-verde">Completado</span></td></tr>
    <tr><td>isa_maestro_junio.xlsx</td><td>01 jun 2026</td><td>Laura Gómez</td><td>1,050</td><td>21</td><td><span class="pill pill-amarillo">Con advertencias</span></td></tr>
  `;
}

/* ================= BLOQUE AGREGADO: INDICADOR OFFLINE/ONLINE ================= */
function renderConnIndicator() {
  const el = document.getElementById('conn-indicator');
  if (!el) return;
  const c = appState.connection;
  el.classList.toggle('online', c.online);
  el.classList.toggle('offline', !c.online);
  const text = document.getElementById('conn-text');
  if (text) {
    text.innerHTML = c.online
      ? (c.pending > 0 ? `En línea · <span class="conn-pending">${c.pending}</span> por sincronizar` : 'En línea')
      : (c.pending > 0 ? `Sin conexión · <span class="conn-pending">${c.pending}</span> pendientes` : 'Sin conexión');
  }
}

/* Simula pasar a modo offline/online (en un dispositivo real esto lo dispararían
   los eventos window 'offline'/'online' del navegador). Al reconectar, simula
   la sincronización automática de los registros pendientes. */
function toggleConnection() {
  appState.connection.online = !appState.connection.online;
  if (!appState.connection.online) {
    appState.connection.pending = 0;
    showToast('Sin conexión: los cambios se guardarán localmente en este dispositivo.');
  } else if (appState.connection.pending > 0) {
    const n = appState.connection.pending;
    showToast(`Conexión recuperada: sincronizando ${n} registro(s) pendiente(s)...`);
    setTimeout(() => {
      appState.connection.pending = 0;
      renderConnIndicator();
      showToast('Sincronización completada con el servidor central.');
    }, 1200);
  } else {
    showToast('Conexión recuperada.');
  }
  renderConnIndicator();
  saveState();
}

/* Cualquier guardado hecho mientras el indicador está en "offline" incrementa
   el contador de pendientes, para simular que quedó solo en almacenamiento local. */
function registerPendingIfOffline() {
  if (!appState.connection.online) {
    appState.connection.pending += 1;
    renderConnIndicator();
  }
}

/* ================= BLOQUE AGREGADO: REGISTRO RÁPIDO DE VISITA (<60s) ================= */
function openQuickVisitModal(clientName, ev) {
  if (ev) ev.stopPropagation();
  appState.quickVisitClient = clientName;
  document.getElementById('quick-visit-client-name').textContent = clientName;
  document.getElementById('quick-visit-text').value = '';
  openModal('modal-registro-rapido');
}

function saveQuickVisit() {
  const text = document.getElementById('quick-visit-text').value.trim();
  if (!text) { showToast('Escribe una nota antes de guardar.'); return; }
  const clientName = appState.quickVisitClient;

  appState.visits.push({
    id: Date.now(),
    clientName,
    objective: 'Registro rápido de visita',
    date: new Date().toISOString().slice(0, 10),
    time: new Date().toTimeString().slice(0, 5),
    status: 'Completada',
    quickNote: text
  });

  const client = appState.clients.find(c => c.nombre === clientName);
  if (client) {
    if (!client.compromisos) client.compromisos = [];
    client.compromisos.unshift({ notes: text, products: '—', commitment: 'Registro rápido (texto libre)', date: new Date().toISOString().slice(0, 10) });
  }

  registerPendingIfOffline();
  closeModal('modal-registro-rapido');
  showToast(`Registro rápido guardado para ${clientName}`);
  if (typeof renderClientList === 'function' && document.getElementById('client-list')) renderClientList();
}

/* ================= BLOQUE AGREGADO: PERFIL AGRONÓMICO Y ADJUNTOS DEL CLIENTE ================= */
function saveClientAttachment(input) {
  if (!input.files || !input.files[0]) return;
  const client = appState.clients[appState.activeSelectedClientIndex];
  if (!client) return;
  if (!client.adjuntos) client.adjuntos = [];
  client.adjuntos.unshift({ nombre: input.files[0].name, fecha: new Date().toISOString().slice(0, 10) });
  renderClientAttachments();
  registerPendingIfOffline();
  showToast('Documento adjuntado a la ficha del cliente');
  input.value = '';
}

function removeClientAttachment(idx) {
  const client = appState.clients[appState.activeSelectedClientIndex];
  if (client && client.adjuntos) client.adjuntos.splice(idx, 1);
  renderClientAttachments();
}

function renderClientAttachments() {
  const client = appState.clients[appState.activeSelectedClientIndex];
  const container = document.getElementById('ficha-attachments-list');
  if (!container || !client) return;
  const list = client.adjuntos || [];
  container.innerHTML = list.length ? list.map((a, i) => `
    <div class="attach-item">
      <i data-lucide="file-text" style="width:16px;height:16px"></i>
      <span class="att-name">${a.nombre}</span>
      <span style="color:var(--gris-texto);font-size:12px;">${a.fecha}</span>
      <span class="att-remove" onclick="removeClientAttachment(${i})">Quitar</span>
    </div>`).join('')
    : `<p style="font-size:13px;color:var(--gris-texto)">Sin documentos adjuntos.</p>`;
  renderIcons();
}

/* ================= BLOQUE AGREGADO: PRONÓSTICO DE RECOMPRA MANUAL (M6) ================= */
function openAdjustCycleModal() {
  const client = appState.clients[appState.activeSelectedClientIndex];
  if (!client) return;
  document.getElementById('adjust-cycle-days').value = client.cicloManual || 30;
  openModal('modal-ajustar-ciclo');
}

function confirmAdjustCycle() {
  const client = appState.clients[appState.activeSelectedClientIndex];
  const days = document.getElementById('adjust-cycle-days').value;
  if (client) {
    client.cicloManual = days;
    client.cicloConfirmado = true;
    renderRecompraInfo();
    registerPendingIfOffline();
    showToast(`Ciclo de recompra confirmado manualmente: cada ${days} días`);
  }
  closeModal('modal-ajustar-ciclo');
}

function renderRecompraInfo() {
  const client = appState.clients[appState.activeSelectedClientIndex];
  const el = document.getElementById('ficha-recompra-tag');
  if (!el || !client) return;
  const numOrdenes = (client.compromisos || []).length;
  if (client.cicloConfirmado) {
    el.innerHTML = `<span class="rfm-tag confirmado"><i data-lucide="check" style="width:12px;height:12px"></i> Ciclo confirmado por el distribuidor: cada ${client.cicloManual} días</span>`;
  } else if (numOrdenes < 3) {
    el.innerHTML = `<span class="rfm-tag limitado"><i data-lucide="alert-triangle" style="width:12px;height:12px"></i> Estimación con datos limitados</span>`;
  } else {
    el.innerHTML = '';
  }
  renderIcons();
}

/* ================= BLOQUE AGREGADO: MÓDULO M5 - ÓRDENES DE COMPRA ================= */
function renderOrdenes() {
  const pillMap = { 'Pendiente': 'pill-amarillo', 'En proceso': 'pill-morado', 'Entregada': 'pill-verde', 'Con novedad': 'pill-rojo' };
  const body = document.getElementById('ordenes-body');
  if (!body) return;
  body.innerHTML = appState.orders.map(o => `
    <tr>
      <td><b>${o.clientName}</b></td>
      <td>${o.producto}</td>
      <td>${o.cantidad}</td>
      <td>${o.precio}</td>
      <td>${o.fechaEntrega}</td>
      <td><span class="pill ${pillMap[o.estado] || 'pill-gris'}">${o.estado}</span></td>
      <td>
        <select onchange="updateOrderStatus(${o.id}, this.value)" class="btn-outline btn-sm" style="padding:4px 8px;border-radius:8px;">
          <option ${o.estado==='Pendiente'?'selected':''}>Pendiente</option>
          <option ${o.estado==='En proceso'?'selected':''}>En proceso</option>
          <option ${o.estado==='Entregada'?'selected':''}>Entregada</option>
          <option ${o.estado==='Con novedad'?'selected':''}>Con novedad</option>
        </select>
        <button class="btn btn-outline btn-sm" onclick="openOrderNoveltyModal(${o.id})">Novedad</button>
      </td>
    </tr>
  `).join('');

  document.getElementById('order-client-select').innerHTML = appState.clients.map(c => `<option value="${c.nombre}">${c.nombre}</option>`).join('');
  renderIcons();
}

function saveNewOrder() {
  const clientName = document.getElementById('order-client-select').value;
  const producto = document.getElementById('order-producto').value;
  const cantidad = document.getElementById('order-cantidad').value;
  const precio = document.getElementById('order-precio').value;
  const fechaEntrega = document.getElementById('order-fecha').value;

  appState.orders.unshift({
    id: Date.now(), clientName, producto, cantidad, precio, fechaEntrega, estado: 'Pendiente', novedades: []
  });

  registerPendingIfOffline();
  closeModal('modal-nueva-orden');
  showToast('Orden de compra registrada correctamente');
  renderOrdenes();
}

function updateOrderStatus(id, newStatus) {
  const o = appState.orders.find(x => x.id === id);
  if (o) {
    o.estado = newStatus;
    registerPendingIfOffline();
    showToast(`Orden #${id} actualizada a: ${newStatus}`);
    renderOrdenes();
  }
}

function openOrderNoveltyModal(id) {
  appState.activeOrderEditingId = id;
  document.getElementById('novelty-text').value = '';
  openModal('modal-novedad-orden');
}

function saveOrderNovelty() {
  const o = appState.orders.find(x => x.id === appState.activeOrderEditingId);
  const detalle = document.getElementById('novelty-text').value.trim();
  if (o && detalle) {
    o.novedades.unshift({ fecha: new Date().toISOString().slice(0, 10), detalle });
    o.estado = 'Con novedad';
    registerPendingIfOffline();
    showToast('Novedad registrada en la orden');
    renderOrdenes();
  }
  closeModal('modal-novedad-orden');
}

/* ================= BLOQUE AGREGADO: PIPELINE - MOTIVO DE PÉRDIDA Y PAUSA (SYS-FR-016) ================= */
function confirmMarkLostWithReason() {
  const client = appState.clients.find(c => c.nombre === appState.activeSelectedOpportunity.clientName);
  const motivo = document.getElementById('lost-reason').value.trim();
  if (client) {
    client.stage = 'Perdida';
    client.motivoPerdida = motivo || 'Sin motivo especificado';
    showToast(`Oportunidad marcada como perdida: ${client.motivoPerdida}`);
    renderKanban();
    renderArchivedOpportunities();
  }
  closeModal('modal-marcar-perdido');
}

function markOpportunityPaused() {
  const client = appState.clients.find(c => c.nombre === appState.activeSelectedOpportunity.clientName);
  if (client) {
    client.stage = 'En pausa';
    showToast('Oportunidad marcada como en pausa');
    renderKanban();
    renderArchivedOpportunities();
  }
}

/* Muestra las oportunidades que salieron del tablero activo (Perdida / En pausa),
   para que "no desaparezcan" del sistema como exige el requisito SYS-FR-016. */
function renderArchivedOpportunities() {
  const container = document.getElementById('archived-opportunities-list');
  if (!container) return;
  const archived = appState.clients.filter(c => c.stage === 'Perdida' || c.stage === 'En pausa');
  container.innerHTML = archived.length ? archived.map(c => `
    <div class="visit-card">
      <div class="vc-info">
        <div class="vc-name">${c.nombre}</div>
        <div class="vc-meta">
          <span class="pill ${c.stage === 'Perdida' ? 'pill-rojo' : 'pill-amarillo'}">${c.stage}</span>
          ${c.stage === 'Perdida' ? ` · Motivo: ${c.motivoPerdida || 'No especificado'}` : ''}
        </div>
      </div>
      <div class="vc-actions">
        <button class="btn btn-outline btn-sm" onclick="reactivateOpportunity('${c.nombre.replace(/'/g, "\\'")}')">Reactivar en Prospecto</button>
      </div>
    </div>
  `).join('') : `<p style="font-size:13px;color:var(--gris-texto)">No hay oportunidades archivadas.</p>`;
}

function reactivateOpportunity(clientName) {
  const client = appState.clients.find(c => c.nombre === clientName);
  if (client) {
    client.stage = 'Prospecto';
    client.motivoPerdida = null;
    showToast(`${clientName} fue reactivada en el pipeline`);
    renderKanban();
    renderArchivedOpportunities();
  }
}

/* ================= BLOQUE AGREGADO: USUARIOS - DESACTIVAR / RESTABLECER CONTRASEÑA ================= */
function openDeactivateUser(idx) {
  appState.activeUserEditingIdx = idx;
  document.getElementById('deactivate-user-name').textContent = appState.usersList[idx].nombre;
  openModal('modal-desactivar-usuario');
}

function confirmDeactivateUser() {
  const u = appState.usersList[appState.activeUserEditingIdx];
  if (u) {
    u.estado = u.estado === 'Activo' ? 'Inactivo' : 'Activo';
    showToast(`Usuario ${u.nombre} ahora está ${u.estado.toLowerCase()}`);
    renderUsuarios();
  }
  closeModal('modal-desactivar-usuario');
}

function openResetPasswordUser(idx) {
  appState.activeUserEditingIdx = idx;
  document.getElementById('reset-user-name').textContent = appState.usersList[idx].nombre;
  openModal('modal-reset-password-usuario');
}

function confirmResetPasswordUser() {
  const u = appState.usersList[appState.activeUserEditingIdx];
  if (u) showToast(`Se envió un enlace de restablecimiento de contraseña a ${u.nombre}`);
  closeModal('modal-reset-password-usuario');
}

/* ================= BLOQUE AGREGADO: EXPORTAR REPORTES (SYS-FR-027) ================= */
function exportReport(format) {
  showToast(`Generando reporte en formato ${format.toUpperCase()}... la descarga comenzará en breve.`);
}

/* ================= UTILIDADES GLOBALES & EVENTOS ================= */
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('show');
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('show');
}

function showToast(msg) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i data-lucide="check-circle" style="width:18px;height:18px"></i> ${msg}`;
  container.appendChild(toast);
  renderIcons();
  setTimeout(() => { toast.remove(); }, 3200);
}

function renderIcons() {
  if (window.lucide) lucide.createIcons();
}

/* Event Delegation & Keydown Handler */
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.overlay.show').forEach(m => m.classList.remove('show'));
  }
});

document.addEventListener('click', function(e) {
  if (e.target.classList.contains('overlay')) {
    e.target.classList.remove('show');
  }
});

/* Inicialización */
document.addEventListener('DOMContentLoaded', () => {
  renderIcons();
});
