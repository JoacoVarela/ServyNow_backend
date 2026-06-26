# Prompt para Generar Frontend de ServyNow

Usa este prompt cuando le pidas a Copilot que genere el frontend completo:

---

## 📋 Prompt Completo

```
Necesito que generes un FRONTEND COMPLETO para ServyNow, una plataforma de marketplace 
de servicios del hogar (tipo Uber para plomeros, electricistas, etc.) en Uruguay.

INSTRUCCIONES CRÍTICAS:

1. **LEE PRIMERO**: Abre y lee completamente el archivo API_DOCS.md. Este documento 
   contiene TODA la especificación de la API, arquitectura, flujos de negocio, casos 
   de uso y recomendaciones de UI/UX.

2. **STACK RECOMENDADO**:
   - React 18+ con TypeScript
   - TailwindCSS para estilos
   - React Router v6 para navegación
   - Zustand o Context API para estado
   - Fetch API para HTTP (sin depender de Axios)
   - React Hook Form + Zod para validación

3. **ESTRUCTURA DE CARPETAS**:
   Sigue exactamente la estructura recomendada en API_DOCS.md:
   - src/api/ → Llamadas HTTP por módulo
   - src/components/ → Componentes reutilizables
   - src/hooks/ → Custom hooks (useAuth, useNotifications, etc.)
   - src/pages/ → Pantallas principales
   - src/store/ → Estado global (Zustand)
   - src/types/ → TypeScript types
   - src/utils/ → Utilidades (JWT, constantes, etc.)

4. **MÓDULOS A IMPLEMENTAR**:
   ✅ Auth (Login, Register, JWT management)
   ✅ Búsqueda de Profesionales (con filtros y categorías)
   ✅ Perfil de Profesional (vista pública y edición)
   ✅ Sistema de Contratos (Jobs) - Cliente contrata profesional
   ✅ Sistema de Presupuestos (Quotes) - Cliente solicita, profesional cotiza
   ✅ Sistema de Citas (Appointments)
   ✅ Chat 1:1 entre Cliente y Profesional
   ✅ Notificaciones (polling cada 30 segundos)
   ✅ Dashboard Cliente (mis trabajos, solicitudes, citas, etc.)
   ✅ Dashboard Profesional (métricas, trabajos, estadísticas)
   ✅ Gestión de Perfil Profesional (foto, horario, servicios, certificaciones)
   ✅ Suscripciones Premium (planes, pago)
   ✅ Panel Admin básico (verificación, reportes)

5. **RUTAS RECOMENDADAS**:
   Público:
   - / → Redirigir a /search o /login
   - /login → Pantalla de login
   - /register → Registro (2-3 pasos según rol)
   - /professionals/:slug → Perfil público (sin auth requerida)

   Cliente:
   - /search → Búsqueda de profesionales
   - /dashboard/client → Home del cliente
   - /jobs/my → Mis trabajos
   - /quotes/my → Mis solicitudes de presupuesto
   - /appointments/my → Mis citas
   - /chat → Mis conversaciones
   - /profile → Mi perfil

   Profesional:
   - /dashboard/professional → Home del profesional
   - /jobs/my → Trabajos recibidos
   - /quotes/available → Solicitudes de presupuesto disponibles
   - /appointments/my → Mis citas
   - /profile/edit → Editar perfil
   - /schedule → Gestionar horario
   - /subscriptions → Planes premium
   - /stats → Estadísticas (si es premium)

   Admin:
   - /admin → Dashboard principal
   - /admin/professionals → Verificación de profesionales
   - /admin/reviews/reports → Reportes de reseñas

6. **GESTIÓN DE TOKENS JWT**:
   - Guardar accessToken y refreshToken en localStorage
   - Implementar auto-refresh cuando reciba 401
   - Decodificar JWT en frontend (sin librería externa) para obtener rol
   - Usar rol para mostrar/ocultar funcionalidades según corresponda

7. **SISTEMA DE NOTIFICACIONES**:
   - Polling a GET /notifications/unread-count cada 30 segundos
   - Mostrar badge con contador en ícono de notificaciones
   - Click en notificación → parsear data JSON → navegar a recurso
   - Marcar como leída al hacer click

8. **COMPONENTES REUTILIZABLES**:
   - ProfessionalCard (para búsqueda)
   - JobCard (para mostrar trabajos)
   - QuoteOfferCard (para mostrar ofertas de presupuesto)
   - AppointmentCard (para mostrar citas)
   - StatusBadge (PENDING, ACCEPTED, COMPLETED, CANCELED)
   - StarRating (para mostrar y dar rating)
   - FormModal (para crear trabajos, presupuestos, etc.)

9. **VALIDACIONES Y ERRORES**:
   - Usar React Hook Form para todos los formularios
   - Validar con Zod
   - Mostrar errores específicos por campo
   - Toast notifications para éxito/error (react-hot-toast o similar)
   - Manejar 401, 403, 404, 409, 500 con mensajes amigables

10. **RECOMENDACIONES UI/UX**:
    - Dark mode friendly (colores: azul primario #3b82f6, púrpura #8b5cf6)
    - Mobile-first responsive design
    - Botones grandes y clickeables (mín 48x48px)
    - Imágenes con lazy-loading
    - Skeleton loaders mientras carga
    - Transiciones suaves

11. **CONSIDERACIONES DE PERFORMANCE**:
    - Lazy load de componentes/páginas
    - Caché de datos en localStorage (profesionales, categorías)
    - Debounce en búsqueda (300-500ms)
    - Paginación (máx 10-20 items por página)

12. **TESTING MÍNIMO**:
    - Tests unitarios para hooks (useAuth, useNotifications)
    - Tests de componentes principales (LoginForm, SearchBar)
    - Tests E2E para flujo de login y búsqueda

13. **BASE DE DATOS LISTA**:
    - El backend en http://localhost:3000 está corriendo
    - Base de datos pre-poblada con datos de prueba
    - Usuarios disponibles: juan@test.com (CLIENT), carlos.plomero@test.com (PROFESSIONAL), etc.
    - Contraseña: test1234 o admin1234

14. **GENERA PASO A PASO**:
    a) Crea estructura de carpetas
    b) Configura tipos TypeScript (basados en API_DOCS.md)
    c) Implementa cliente HTTP con JWT management
    d) Crea hooks personalizados
    e) Implementa auth (login, register, protectedRoute)
    f) Implementa búsqueda y perfil de profesional
    g) Implementa jobs, quotes, appointments
    h) Implementa chat y notificaciones
    i) Implementa dashboards (cliente y profesional)
    j) Implementa admin panel
    k) Tests básicos

ENDPOINT BASE: http://localhost:3000/api
API DOCS: Archivo API_DOCS.md (léelo completo primero)

¿Listo para generar el frontend completo siguiendo esta especificación?
```

---

## 🎯 Cómo Usar Este Prompt

### Opción 1: Copilot Chat
1. En VS Code, abre Copilot Chat (Ctrl+I o Cmd+I)
2. Copia el prompt anterior
3. Pégalo en el chat
4. Presiona Enter

### Opción 2: Directo en Terminal
```bash
# Si tienes instalado copilot-cli (futuro)
copilot generate-frontend --config API_DOCS.md
```

### Opción 3: GitHub Copilot Extensions (futuro)
Cuando esté disponible, podrás:
```
@copilot /generate-frontend --from-api-docs API_DOCS.md
```

---

## ✅ Checklist de Validación

Una vez Copilot genere el frontend, verifica:

- [ ] Estructura de carpetas coincide con recomendaciones
- [ ] TypeScript types definidos según API_DOCS.md
- [ ] JWT management (login, refresh, logout)
- [ ] Protección de rutas por rol
- [ ] Búsqueda de profesionales funciona
- [ ] Login funciona con usuario de prueba
- [ ] Crear un Job desde cliente a profesional
- [ ] Profesional acepta job
- [ ] Chat abre y envía mensajes
- [ ] Notificaciones se cargan con polling
- [ ] Responde JSON completo sin "404 Not Found"
- [ ] Estilos responden en mobile
- [ ] Sin errores en console de navegador
- [ ] Tests corren sin errores

---

## 🔧 Variables de Entorno (.env)

Copia esto en tu `.env` del frontend:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=ServyNow
VITE_POLLING_INTERVAL=30000
VITE_TOKEN_REFRESH_BUFFER=300000
```

---

## 📝 Notas Importantes

1. **Lee API_DOCS.md primero**: Es fundamental entender toda la API antes de empezar
2. **Usa TypeScript**: Tipifica todo para mejor DX y menos bugs
3. **Componentes pequeños**: Divide en componentes reutilizables
4. **No uses librerías innecesarias**: Usa Fetch en lugar de Axios
5. **Mobile-first**: Diseña pensando en mobile primero
6. **Accesibilidad**: Labels en inputs, alt en imágenes, contraste suficiente
7. **Performance**: Lazy load, paginación, debounce en búsqueda

---

## 🚀 Comando para Levantar y Probar

```bash
# Terminal 1: Backend (ya debe estar corriendo)
cd ServyNow_backend
npm run start:dev

# Terminal 2: Frontend
cd frontend  # Después de que Copilot genere
npm install
npm run dev

# Terminal 3: Abrir navegador
http://localhost:5173  # (o el puerto que use Vite)
```

---

## 💡 Tips Adicionales

- **Login de Prueba**: juan@test.com / test1234 (CLIENT)
- **Login Profesional**: carlos.plomero@test.com / test1234
- **Login Admin**: admin@servynow.com / admin1234
- **API Playground**: http://localhost:3000/ui/playground.html

---

*Este prompt fue generado el 25/06/2026 para el proyecto ServyNow*
