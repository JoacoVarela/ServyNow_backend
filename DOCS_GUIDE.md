# ServyNow - Guía de Archivos de Documentación

## 📚 Archivos de Referencia

### 1. **API_DOCS.md** ⭐ PRINCIPAL
   - Documentación completa de la API REST
   - Incluye: descripción de la app, arquitectura, casos de uso
   - Especificación de todos los endpoints (14 módulos)
   - Guía de integración para frontend
   - Flujos completos de cada feature
   - Recomendaciones de UI/UX
   - **Tamaño**: ~6000 líneas
   - **Para qué sirve**: Referencia única para todo lo que el frontend necesita

### 2. **FRONTEND_PROMPT.md**
   - Prompt pre-fabricado para pedir a Copilot que genere el frontend
   - Instrucciones paso a paso
   - Checklist de validación
   - Tips y notas importantes
   - **Para qué sirve**: Copy-paste directo a Copilot Chat

### 3. **README.md**
   - Descripción del proyecto
   - Cómo levantar el backend
   - Estructura del proyecto backend
   - Credenciales de test
   - **Para qué sirve**: Información general del backend

---

## 🎯 Casos de Uso

### Si quiero entender toda la arquitectura
→ Lee: **API_DOCS.md** secciones 0-6 (primeras 300 líneas)

### Si quiero ver cómo funciona un flujo específico
→ Lee: **API_DOCS.md** sección "17. Flujos completos" o "Casos de Uso Detallados"

### Si quiero generar el frontend ahora
→ Lee: **FRONTEND_PROMPT.md** (5 minutos) + **API_DOCS.md** (referencia rápida)

### Si quiero entender un endpoint específico
→ Busca en: **API_DOCS.md** (Ctrl+F) por el nombre del módulo

### Si tengo errores en el frontend
→ Consulta: **API_DOCS.md** sección "Manejo de Errores" y "Debugging"

---

## 📋 Resumen Rápido

### ServyNow en 30 segundos
- **Qué es**: Marketplace de servicios del hogar (Uber para plomeros)
- **Dónde**: Uruguay (Montevideo)
- **Usuarios**: Clientes, Profesionales, Admins
- **Servicios**: Plomería, Electricidad, Carpintería, Pintura, etc.

### Flujos Principales
1. **Cliente busca profesional** → Contrata → Profesional acepta → Trabajo completado → Reseña
2. **Cliente publica necesidad** → Profesionales envían presupuestos → Cliente elige → Servicio
3. **Chat** → Profesional y cliente se comunican
4. **Notificaciones** → Sistema notifica cambios en tiempo real

### 3 Roles
- **CLIENT**: Busca, contrata, paga, deja reseñas
- **PROFESSIONAL**: Ofrece servicios, recibe trabajos, envía presupuestos
- **ADMIN**: Verifica profesionales, resuelve reportes

### 3 Formas de Contratar
1. **Contrato directo (Job)**: Cliente elige profesional y presupuesto
2. **Solicitud de presupuesto (Quote)**: Cliente publica, múltiples profesionales ofertan
3. **Cita (Appointment)**: Solo reserva de tiempo, sin presupuesto fijo

---

## 🔗 Relación de Archivos

```
ServyNow_backend/
├── API_DOCS.md ← LEER PRIMERO (todo en un archivo)
├── FRONTEND_PROMPT.md ← USAR PARA GENERAR FRONTEND
├── README.md ← Para saber cómo levantar backend
├── public/
│   └── playground.html ← Testing UI (http://localhost:3000/ui/playground.html)
├── prisma/
│   ├── schema.prisma ← Modelo de datos
│   └── seed.ts ← Datos de prueba
└── src/
    ├── app.module.ts ← Módulos importados
    └── [módulos implementados]
```

---

## 🚀 Quick Start (Backend)

```bash
# 1. Terminal 1 - Backend
cd ServyNow_backend
npm install
npm run start:dev
# Esperar: "Listening on port 3000"

# 2. Terminal 2 - Abrir UI de testing
http://localhost:3000/ui/playground.html

# 3. O probar endpoints con curl
curl http://localhost:3000/api/professionals/categories

# 4. O leer documentación
API_DOCS.md
```

---

## 📖 Guía de Lectura Recomendada

### Día 1: Entender la plataforma
1. Lee "¿Qué es ServyNow?" en API_DOCS.md
2. Lee "Propósito y Funcionalidad"
3. Lee "Modelos de Negocio"
4. Lee "Diagrama de Entidades"

### Día 2: Casos de uso
1. Lee "Casos de Uso Detallados"
2. Prueba los endpoints en http://localhost:3000/ui/playground.html
3. Entiende los 3 flujos de contratación

### Día 3: Generar frontend
1. Lee "Guía de Integración para Frontend"
2. Copia FRONTEND_PROMPT.md
3. Pásalo a Copilot Chat
4. Valida con el checklist

---

## 🔍 Búsquedas Útiles (Ctrl+F en API_DOCS.md)

| Que busco | Patrón de búsqueda |
|-----------|-------------------|
| Login | `POST /accounts/login` |
| Contratar profesional | `POST /jobs` |
| Ver trabajos propios | `GET /jobs/my` |
| Chat | `POST /chat/conversations` |
| Notificaciones | `GET /notifications` |
| Suscripción premium | `POST /subscriptions/subscribe` |
| Perfil profesional | `PUT /professionals/:id` |
| Búsqueda con filtros | `GET /professionals?` |
| Presupuestos | `POST /quote-requests` |
| Citas | `POST /appointments` |
| Reseñas | `POST /professionals/:id/reviews` |

---

## ✅ Checklist Pre-desarrollo

- [ ] He leído "¿Qué es ServyNow?" en API_DOCS.md
- [ ] Entiendo los 3 roles (CLIENT, PROFESSIONAL, ADMIN)
- [ ] Entiendo los 3 flujos de contratación (Job, Quote, Appointment)
- [ ] Probé login en http://localhost:3000/ui/playground.html
- [ ] Entiendo cómo funciona JWT (access + refresh token)
- [ ] Leí "Guía de Integración para Frontend"
- [ ] Tengo lista la estructura de carpetas (src/api, src/components, etc.)
- [ ] Tengo el stack decidido (React + TypeScript + TailwindCSS)
- [ ] Estoy listo para copiar FRONTEND_PROMPT.md y usarlo con Copilot

---

## 🆘 Si tengo dudas

1. **Sobre la API**: Busca en API_DOCS.md
2. **Sobre un endpoint**: `GET /professionals` → Busca en "## 5. Módulo: Profesionales"
3. **Sobre un flujo**: Lee sección "Flujos completos" o "Casos de Uso Detallados"
4. **Sobre validaciones**: Lee "## Guía de Integración para Frontend"
5. **Sobre errores**: Lee "## Formato de errores"

---

## 📝 Cronograma Sugerido

| Fase | Duración | Tareas |
|------|----------|--------|
| **Investigación** | 2-3 horas | Leer API_DOCS.md, entender arquitectura |
| **Setup Frontend** | 1 hora | Crear carpetas, config inicial |
| **Generación Copilot** | 30 min | Usar FRONTEND_PROMPT.md, dejar que genere |
| **Validación** | 1-2 horas | Probar flujos, arreglar errores |
| **Pulido** | 2-3 horas | UI, performance, testing |
| **Deploy** | 1 hora | Build, hosting |

**Total**: ~1-2 semanas para un frontend completo (según experiencia)

---

## 🎓 Conceptos Clave

### JWT Token Management
- Access token: 15 minutos
- Refresh token: 7 días  
- Guardar en localStorage
- Auto-refresh cuando expira
- Decodificar para obtener rol

### Estados de Trabajos
```
PENDING → ACCEPTED → IN_PROGRESS → COMPLETED
                  ↘ CANCELED
```

### Estados de Presupuestos
```
OPEN → ASSIGNED (aceptado) o CLOSED/EXPIRED
```

### Estados de Citas
```
PENDING → CONFIRMED → COMPLETED
       ↘ CANCELED o RESCHEDULED
```

### Notificación → Acción
```
Tipo                → Acción esperada
QUOTE_RECEIVED      → Ver solicitud y ofertas
JOB_REQUEST         → Ver job y aceptar/rechazar
NEW_MESSAGE         → Abrir chat
APPOINTMENT_SCHEDULED → Ver cita y confirmar
QUOTE_ACCEPTED      → Profesional fue aceptado
REVIEW_RECEIVED     → Ver reseña
```

---

## 🎯 Próximo Paso

👉 **Abre API_DOCS.md y lee las primeras 500 líneas**

Luego, cuando estés listo:

👉 **Copia FRONTEND_PROMPT.md y pásalo a Copilot Chat**

---

*Documentación de referencia — ServyNow Backend v1.0*  
*Última actualización: 25/06/2026*
