# ServyNow API — Documentación Completa para Frontend

> **Marketplace B2C de profesionales del hogar — Uruguay**  
> Backend: NestJS + Prisma + MySQL  
> Base URL: `http://localhost:3000/api`  
> Todos los endpoints responden JSON.

---

## 📋 Tabla de Contenidos

### Introducción y Contexto
1. [¿Qué es ServyNow?](#0-qué-es-servynow)
2. [Propósito y Funcionalidad](#propósito-y-funcionalidad)
3. [Modelos de Negocio](#modelos-de-negocio)
4. [Stack Tecnológico](#stack-tecnológico)
5. [Arquitectura del Sistema](#arquitectura-del-sistema)
6. [Diagrama de Entidades](#diagrama-de-entidades)

### Especificación Técnica
7. [Convenciones generales](#1-convenciones-generales)
8. [Autenticación](#2-autenticación)
9. [Roles y acceso](#3-roles-y-acceso)
10. [Módulo: Cuentas](#4-módulo-cuentas)
11. [Módulo: Profesionales](#5-módulo-profesionales)
12. [Módulo: Trabajos (Jobs)](#6-módulo-trabajos-jobs)
13. [Módulo: Solicitudes de presupuesto](#7-módulo-solicitudes-de-presupuesto)
14. [Módulo: Citas / Agenda](#8-módulo-citas--agenda)
15. [Módulo: Chat](#9-módulo-chat)
16. [Módulo: Notificaciones](#10-módulo-notificaciones)
17. [Módulo: Suscripciones](#11-módulo-suscripciones)
18. [Módulo: Pagos](#12-módulo-pagos)
19. [Módulo: Estadísticas](#13-módulo-estadísticas)
20. [Módulo: Admin](#14-módulo-admin)
21. [Módulo: Uploads (fotos)](#15-módulo-uploads-fotos)
22. [Formato de errores](#16-formato-de-errores)

### Guías e Integración
23. [Guía de Integración para Frontend](#guía-de-integración-para-frontend)
24. [Flujos Completos por Feature](#17-flujos-completos-por-pantalla)
25. [Casos de Uso Detallados](#casos-de-uso-detallados)
26. [Glosario de Términos](#glosario-de-términos)

---

## 0. ¿Qué es ServyNow?

**ServyNow** es una plataforma digital tipo **marketplace B2C** que conecta a clientes (personas que necesitan servicios del hogar) con profesionales independientes (plomeros, electricistas, reparadores, etc.).

### Analogía
- **Airbnb** = alquilar espacios
- **Uber** = transporte bajo demanda
- **ServyNow** = servicios del hogar bajo demanda

### Geografía
- **País**: Uruguay
- **Cobertura**: Área metropolitana (Montevideo, zonas próximas)
- **Servicios**: Reparaciones, mantenimiento, instalaciones residenciales

### Ejemplos de Servicios
- Plomería: destapes, reparación de cañerías, instalación de accesorios
- Electricidad: reparación de instalaciones, cambio de luminarias, mantenimiento
- Albañilería: pequeñas obras, reparaciones de paredes
- Pintura: interior, exterior, mantenimiento
- Carpintería: muebles, reparaciones, instalaciones

---

## Propósito y Funcionalidad

### Objetivos de Negocio

1. **Para Clientes**: Encontrar profesionales confiables, comparar precios, agendar servicios sin intermediarios
2. **Para Profesionales**: Conseguir más clientes, crecer su negocio, gestionar su calendario y cotizaciones
3. **Para la Plataforma**: Generar ingresos (comisión en pagos, suscripciones premium)

### Funcionalidades Clave

#### Cliente (rol `CLIENT`)
- ✅ Crear cuenta / perfil
- ✅ Buscar profesionales por categoría, zona, precio, rating
- ✅ Ver perfil completo del profesional (fotos, certificaciones, horario, reseñas)
- ✅ **Contratar directamente**: crear un "trabajo" asignando presupuesto y fecha
- ✅ **Solicitar presupuestos**: publicar una necesidad genérica y recibir cotizaciones de múltiples profesionales
- ✅ **Agendar citas**: programar encuentros sin comprometerse al presupuesto final
- ✅ **Chat**: comunicarse con el profesional antes/durante/después del trabajo
- ✅ **Dejar reseñas**: calificar al profesional tras completar el trabajo
- ✅ Ver historial de trabajos y citas
- ✅ Recibir notificaciones

#### Profesional (rol `PROFESSIONAL`)
- ✅ Crear cuenta / perfil con foto, bio, certificaciones
- ✅ Definir servicios, precios, horario disponible
- ✅ Categorías de servicios que ofrece (plomería, electricidad, etc.)
- ✅ **Aceptar/Rechazar trabajos**: contratos directos de clientes
- ✅ **Enviar presupuestos**: responder a solicitudes de presupuesto de clientes
- ✅ **Gestionar citas**: confirmar, reprogramar, cancelar
- ✅ **Chat**: comunicarse con clientes
- ✅ **Suscripción Premium**: aparecer destacado, acceso a estadísticas avanzadas
- ✅ Ver panel de control con métricas (vistas del perfil, contactos, trabajos completados)
- ✅ Historial de ingresos y pagos
- ✅ Recibir notificaciones

#### Admin (rol `ADMIN`)
- ✅ Panel de control del sistema
- ✅ Verificar profesionales
- ✅ Bloquear cuentas problemas
- ✅ Resolver reportes de reseñas inapropiadas
- ✅ Gestionar planes de suscripción

---

## Modelos de Negocio

### 1. Comisión por Trabajo Completado
- Cuando un cliente paga por un trabajo completado → plataforma retiene 15-20%

### 2. Suscripciones Premium para Profesionales
- **Gratis**: hasta 20 contactos/mes, sin estadísticas avanzadas
- **Premium**: contactos ilimitados, aparece destacado, estadísticas avanzadas, $590 USD/mes

### 3. Publicidad y Promoción
- Profesionales pueden pagar por aparecer en top de búsquedas

---

## Stack Tecnológico

### Backend
- **Framework**: NestJS v11 (TypeScript)
- **Base de Datos**: MySQL 8.0 (local en dev, hosted en producción)
- **ORM**: Prisma v6
- **Autenticación**: JWT (JSON Web Tokens)
- **Uploads**: Multer + almacenamiento en `/uploads/` (S3 en producción)
- **Runtime**: Node.js v18+

### Frontend (a desarrollar con esta documentación)
- **Framework**: React 18+ (recomendado) o Vue 3, Angular 16+
- **Estado**: Zustand, Redux, Context API (según preferencia)
- **Estilos**: TailwindCSS, Material-UI, o custom CSS
- **HTTP Client**: Fetch API o Axios
- **Validación Formas**: React Hook Form + Zod/Yup
- **Ruteo**: React Router v6
- **Notificaciones**: Toast (react-hot-toast, react-toastify)
- **Mapas** (opcional): Leaflet o Google Maps para geolocalización
- **Chat Tiempo Real** (futuro): Socket.IO o WebSockets

### DevOps
- **Local Dev**: Docker Compose (MySQL + PhpMyAdmin)
- **Hosting** (producción): AWS, DigitalOcean, Heroku, etc.
- **CDN/Storage**: AWS S3 para archivos
- **Pasarela de Pago**: Mercado Pago API (integración pendiente)

---

## Arquitectura del Sistema

### Diagrama de Capas (Backend)

```
┌─────────────────────────────────────┐
│         API REST (HTTP/JSON)        │
│      NestJS Controllers             │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      Lógica de Negocio              │
│      NestJS Services                │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      Acceso a Datos                 │
│      Repositories + Prisma Client   │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│    Base de Datos MySQL              │
│    (schema.prisma)                  │
└─────────────────────────────────────┘
```

### Flujo de Comunicación Frontend ↔ Backend

```
1. Frontend hace HTTP request (GET/POST/PUT/PATCH/DELETE)
   Content-Type: application/json
   Authorization: Bearer <JWT-TOKEN>

2. Backend recibe en Controller
   - Valida JWT
   - Valida rol (si es protegido)
   - Ejecuta validaciones (DTO)

3. Controller invoca Service
   - Service ejecuta lógica de negocio
   - Service invoca Repository para queries

4. Repository accede Prisma Client
   - Ejecuta queries SQL en MySQL

5. Backend retorna JSON
   { datos } ó { success: false, error }

6. Frontend recibe respuesta
   - Si 2xx → procesar datos
   - Si 4xx ó 5xx → mostrar error
```

---

## Diagrama de Entidades

### Relaciones Principales

```
┌──────────────────┐
│    account       │ (email, password, role)
└────────┬─────────┘
         │
    ┌────┴─────┬──────────────────┬──────────────────┐
    │           │                  │                  │
    ▼           ▼                  ▼                  ▼
┌────────┐ ┌──────────┐ ┌──────────────┐ ┌─────────┐
│  user  │ │professional │ (if PROFESSIONAL)
└────────┘ └──────────┘ └──────────────┘
                  │
         ┌────────┴────────┬─────────────┬──────────────┐
         │                 │             │              │
         ▼                 ▼             ▼              ▼
    ┌─────────────┐ ┌────────┐ ┌─────────────┐ ┌──────────┐
    │ professional│ │review  │ │  photo      │ │ schedule │
    │_photo       │ │        │ │             │ │          │
    └─────────────┘ └────────┘ └─────────────┘ └──────────┘
         │
    ┌────┴────────────────────────────┬────────────────────────┐
    │                                 │                        │
    ▼                                 ▼                        ▼
┌──────────┐ ┌──────────────────┐ ┌──────────────┐ ┌──────────────┐
│job       │ │quote_request     │ │appointment   │ │chat          │
│          │ │                  │ │              │ │conversation  │
└──────────┘ └──────────────────┘ └──────────────┘ └──────────────┘
      │           │                      │                 │
      │           │                      │                 ▼
      │           │                      │           ┌────────────┐
      │           ▼                      │           │   message  │
      │    ┌──────────────┐              │           └────────────┘
      │    │quote_offer   │              │
      │    └──────────────┘              │
      │                                  │
      └──────────────────┬───────────────┘
                         │
                         ▼
                    ┌──────────────┐
                    │notification  │
                    └──────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │subscription /payment │
              └──────────────────────┘
```

### Tabla de Entidades

| Entidad | Descripción | Relaciones |
|---------|-------------|-----------|
| `account` | Usuario del sistema (email, password hash, rol) | 1:1 con user/professional |
| `user` | Perfil del cliente | 1:N con jobs, appointments, reviews |
| `professional` | Perfil del profesional | 1:N con fotos, certificaciones, servicios, trabajos, citas, presupuestos, reseñas, suscripciones |
| `professional_photo` | Foto del portfolio del profesional | N:1 con professional |
| `professional_certification` | Certificado del profesional | N:1 con professional |
| `professional_service` | Servicio específico ofrecido | N:1 con professional |
| `professional_schedule` | Horario semanal disponible | N:1 con professional |
| `category` | Categoría de servicio (plomería, electricidad, etc.) | N:N con professional |
| `job` | Contratación directa de un profesional por un cliente | N:1 con account (cliente) y professional |
| `quote_request` | Solicitud de presupuesto pública | 1:N con quote_offer |
| `quote_offer` | Presupuesto enviado por un profesional | N:1 con professional, 1:1 con quote_request |
| `appointment` | Cita agendada | N:1 con account (cliente), professional, y opcionalmente job |
| `review` | Reseña dejada por un cliente sobre un profesional | N:1 con professional, account (cliente) |
| `chat_conversation` | Conversación 1:1 entre cliente y profesional | 1:N con message |
| `chat_message` | Mensaje individual en una conversación | N:1 con conversation |
| `notification` | Notificación del sistema | N:1 con account |
| `subscription_plan` | Plan de suscripción (gratis, premium, etc.) | 1:N con subscription |
| `subscription` | Suscripción activa de un profesional | N:1 con professional, plan |
| `payment` | Registro de transacción monetaria | N:1 con subscription |

---

## Casos de Uso Detallados

### Caso 1: Cliente busca y contrata directamente

**Actor**: Cliente  
**Precondición**: Cliente está autenticado

**Pasos**:
1. Cliente va a pantalla de búsqueda
2. Filtra por categoría: "Plomería" + ciudad: "Montevideo"
3. Obtiene lista de plomeros disponibles, ordena por rating
4. Hace click en uno: ve perfil completo (fotos, certificaciones, reseñas, horario)
5. Hace click en "Contratar" → ingresa presupuesto, descripción del problema, fecha deseada
6. Sistema crea un **Job** en estado `PENDING`
7. Profesional recibe notificación
8. Profesional acepta → Job pasa a `ACCEPTED`
9. Cliente confirma la dirección en pantalla de cita
10. Profesional va, realiza trabajo, marca como `COMPLETED`
11. Cliente deja reseña (1-5 estrellas + comentario)

**Datos involucrados**:
- Búsqueda: `GET /professionals`
- Perfil: `GET /professionals/:slug`
- Contratar: `POST /jobs`
- Profesional acepta: `PATCH /jobs/:id/status`
- Reseña: `POST /professionals/:id/reviews`

---

### Caso 2: Profesional recibe y responde solicitudes de presupuesto

**Actor**: Profesional  
**Precondición**: Profesional autenticado y con perfil completo

**Pasos**:
1. Cliente publica: "Necesito reparar pérdida en baño, zona Pocitos"
2. Profesional (plomero) entra a `GET /quote-requests?city=Montevideo&categoryId=plomeria`
3. Ve solicitud del cliente
4. Envía presupuesto: `POST /quote-requests/:id/offers { price: 1800, description: "..." }`
5. Cliente recibe notificación `QUOTE_RECEIVED`
6. Cliente revisa 3 ofertas recibidas
7. Cliente acepta la mejor: `PATCH /quote-requests/:id/offers/:offerId/accept`
8. Las otras 2 ofertas se marcan como `REJECTED` automáticamente
9. Profesional aceptado recibe notificación `QUOTE_ACCEPTED`
10. Siguiente paso: crear Job o Appointment

**Datos involucrados**:
- Ver solicitudes: `GET /quote-requests`
- Enviar oferta: `POST /quote-requests/:id/offers`
- Cliente revisa: `GET /quote-requests/my`
- Cliente acepta: `PATCH /quote-requests/:id/offers/:offerId/accept`

---

### Caso 3: Comunicación Cliente ↔ Profesional antes de agendar

**Actor**: Ambos

**Pasos**:
1. Cliente entra a perfil del profesional
2. Hace click en "Enviar mensaje"
3. Sistema crea automáticamente `chat_conversation` si no existe
4. Cliente escribe: "¿Podés venir mañana a las 10am?"
5. Profesional recibe notificación `NEW_MESSAGE`
6. Profesional lee el mensaje (se marca automáticamente como leído)
7. Profesional responde: "Sí, puedo. El costo será $1500"
8. Cliente ve respuesta, acepta
9. Ambos crean la cita: `POST /appointments`

**Datos involucrados**:
- Crear/obtener conversación: `POST /chat/conversations`
- Enviar mensaje: `POST /chat/conversations/:id/messages`
- Cargar historial: `GET /chat/conversations/:id/messages`
- Contador no leídos: `GET /chat/unread-count`
- Ver conversaciones: `GET /chat/conversations`

---

### Caso 4: Sistema de notificaciones en tiempo real

**Actor**: Ambos

**Flujo de notificaciones**:

```
Cliente contrata → Profesional recibe: JOB_REQUEST
Profesional acepta → Cliente recibe: JOB_STATUS_UPDATE
Profesional envía mensaje → Cliente recibe: NEW_MESSAGE
Profesional envía presupuesto → Cliente recibe: QUOTE_RECEIVED
Cliente acepta oferta → Profesional recibe: QUOTE_ACCEPTED
Se crea/confirma cita → Ambos reciben: APPOINTMENT_SCHEDULED
Cliente deja reseña → Profesional recibe: REVIEW_RECEIVED
Sistema avisa → Ambos reciben: APPOINTMENT_REMINDER (futuro)
```

**Implementación Frontend**:
1. Al cargar app: `GET /notifications/unread-count` → mostrar badge
2. Abrir panel: `GET /notifications?unread=true`
3. Click en notificación: parsear `notification.data` para navegar a recurso
4. Polling cada 10-30 segundos: `GET /notifications`
5. Marcar leída: `PATCH /notifications/:id/read`

---

### Caso 5: Suscripción Premium de Profesional

**Actor**: Profesional

**Pasos**:
1. Profesional ve que tiene plan "Gratis" (20 contactos/mes)
2. Hace click en "Upgrade a Premium"
3. Ve planes disponibles: `GET /subscriptions/plans`
4. Selecciona Premium: $590 USD/mes
5. Es redirigido a pasarela de pago (Mercado Pago)
6. Sistema crea `POST /payments { amount: 590, method: "MERCADO_PAGO" }`
7. Profesional completa pago en Mercado Pago
8. Webhook de Mercado Pago: `PATCH /payments/:id/confirm`
9. Sistema crea suscripción: `POST /subscriptions/subscribe { planId }`
10. Profesional ahora aparece con badge "Premium" en búsquedas
11. Puede ver estadísticas avanzadas: `GET /stats`

**Datos involucrados**:
- Ver planes: `GET /subscriptions/plans`
- Crear pago: `POST /payments`
- Suscribirse: `POST /subscriptions/subscribe`
- Ver suscripción activa: `GET /subscriptions/my`
- Ver estadísticas: `GET /stats`
- Historial pagos: `GET /payments/my`

---

## Glosario de Términos

| Término | Significado |
|---------|-----------|
| **Job** | Contratación directa de un profesional: cliente elige profesional, presupuesto y fecha, profesional acepta o rechaza |
| **Quote Request** | Solicitud de presupuesto: cliente publica una necesidad genérica, múltiples profesionales envían ofertas (presupuestos) |
| **Quote Offer** | Presupuesto específico enviado por un profesional en respuesta a una solicitud |
| **Appointment** | Cita agendada, independiente de presupuesto. Es una reserva de tiempo |
| **Availability** | Estado de disponibilidad del profesional: `AVAILABLE` (conectado y disponible), `BUSY` (ocupado pero verá mensajes después), `OFFLINE` |
| **Rating** | Promedio de calificaciones del profesional (1-5 estrellas) basado en reseñas |
| **Slug** | Versión amigable del nombre para URL, ej: `juan-garcia` (sin espacios, minúsculas) |
| **JWT Token** | Token de seguridad que contiene identidad del usuario, válido por 15 minutos (access) o 7 días (refresh) |
| **Bearer Token** | Forma de enviar JWT en header: `Authorization: Bearer eyJ...` |
| **Webhook** | Callback que recibe el backend de una pasarela de pago (ej Mercado Pago) para confirmar transacciones |
| **Transacción Verificada** | Estado del profesional que ha pasado verificación manual por admin |
| **Presupuesto** | Estimación de precio y duración que da un profesional |
| **Contacto** | Cada comunicación iniciada por un cliente (contratación, presupuesto, mensaje, cita) |



---

## 1. Convenciones generales

### Headers requeridos

```http
Content-Type: application/json
Authorization: Bearer <accessToken>   ← en endpoints protegidos
```

### Estructura de respuesta exitosa

Cada endpoint retorna directamente el objeto o array resultado. No hay un wrapper global `{ data: ... }`.

```json
{
  "id": "...",
  "email": "...",
  ...
}
```

### Estructura de respuesta de error

```json
{
  "success": false,
  "statusCode": 400,
  "timestamp": "2026-06-25T12:00:00.000Z",
  "path": "/api/accounts/login",
  "message": "Invalid credentials",
  "details": [           ← solo en errores de validación
    {
      "field": "email",
      "constraints": { "isEmail": "email must be an email" }
    }
  ]
}
```

### Paginación

Los endpoints de listado con paginación retornan:

```json
{
  "items": [...],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

---

## 2. Autenticación

El sistema usa **JWT con par de tokens**:

| Token | Duración | Uso |
|-------|----------|-----|
| `accessToken` | 15 minutos | Autenticar cada request |
| `refreshToken` | 7 días | Obtener nuevo accessToken |

### Flujo completo

```
1. POST /accounts/login
   → recibo { accessToken, refreshToken }

2. Guardar ambos tokens (localStorage / SecureStore)

3. En cada request protegido:
   Authorization: Bearer <accessToken>

4. Si recibo 401:
   → POST /accounts/refresh con { refreshToken }
   → Recibo nuevos tokens, guardarlos y reintentar el request

5. Si refresh también falla:
   → Redirigir al login
```

### Donde guardar los tokens (recomendación frontend)

- **Web**: `localStorage` o `sessionStorage` (según si quiere persistencia)
- **Mobile (React Native)**: `expo-secure-store` o `AsyncStorage`

---

## 3. Roles y acceso

Cada cuenta tiene exactamente **un rol**:

| Rol | Descripción |
|-----|-------------|
| `CLIENT` | Usuario que busca y contrata profesionales |
| `PROFESSIONAL` | Profesional que ofrece servicios |
| `ADMIN` | Administrador del sistema |

> El JWT incluye el campo `role`. El frontend puede leerlo para mostrar/ocultar funcionalidades.

Para decodificar el JWT sin librería externa:
```js
const payload = JSON.parse(atob(accessToken.split('.')[1]));
// payload = { sub: "account-id", email: "...", role: "CLIENT" }
```

---

## 4. Módulo: Cuentas

### `POST /accounts/register`

Registro de cuenta nueva. Crea simultáneamente la cuenta y el perfil (cliente o profesional).

**Body para cliente:**
```json
{
  "email": "juan@gmail.com",
  "password": "segura123",
  "role": "CLIENT",
  "user": {
    "firstName": "Juan",
    "lastName": "García",
    "phoneNumber": "+598 91 234 567"
  }
}
```

**Body para profesional:**
```json
{
  "email": "plomero@gmail.com",
  "password": "segura123",
  "role": "PROFESSIONAL",
  "professional": {
    "firstName": "Carlos",
    "lastName": "Rodríguez",
    "bio": "Plomero con 10 años de experiencia en Montevideo",
    "city": "Montevideo",
    "zone": "Pocitos",
    "minPrice": 500,
    "maxPrice": 3000,
    "yearsExperience": 10,
    "phoneNumber": "+598 99 123 456",
    "categoryIds": ["uuid-categoria-plomeria"]
  }
}
```

**Respuesta exitosa (cliente):**
```json
{
  "account": {
    "id": "uuid",
    "email": "juan@gmail.com",
    "role": "CLIENT"
  },
  "profile": {
    "id": "uuid",
    "firstName": "Juan",
    "lastName": "García",
    "slug": "juan-garcia",
    "account_id": "uuid"
  },
  "tokens": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

**Respuesta exitosa (profesional):** igual pero incluye `profileLink`:
```json
{
  "account": { ... },
  "profile": { "slug": "carlos-rodriguez", ... },
  "profileLink": "/api/professionals/carlos-rodriguez",
  "tokens": { ... }
}
```

---

### `POST /accounts/login`

```json
{
  "email": "juan@gmail.com",
  "password": "segura123"
}
```

**Respuesta (cliente):**
```json
{
  "id": "uuid",
  "email": "juan@gmail.com",
  "role": "CLIENT",
  "client": {
    "id": "uuid",
    "firstName": "Juan",
    "lastName": "García",
    "slug": "juan-garcia"
  },
  "tokens": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

**Respuesta (profesional):** incluye `professional` y `profileLink`.

---

### `POST /accounts/refresh`

```json
{
  "refreshToken": "eyJ..."
}
```

**Respuesta:**
```json
{
  "id": "uuid",
  "email": "juan@gmail.com",
  "role": "CLIENT",
  "tokens": {
    "accessToken": "eyJ... (nuevo)",
    "refreshToken": "eyJ... (nuevo)"
  }
}
```

> ⚠️ Cada refresh invalida el token anterior. Siempre guardar los nuevos.

---

### `POST /accounts/logout` 🔒

Sin body. Invalida el refreshToken del servidor.

```json
{ "success": true }
```

---

## 5. Módulo: Profesionales

### `GET /professionals` — Búsqueda pública

**Query params:**

| Param | Tipo | Descripción |
|-------|------|-------------|
| `search` | string | Busca en nombre y bio |
| `city` | string | Filtra por ciudad |
| `categoryId` | string (UUID) | Filtra por categoría |
| `minPrice` | number | Precio mínimo |
| `maxPrice` | number | Precio máximo |
| `minRating` | number (0-5) | Rating mínimo |
| `availability` | `AVAILABLE` \| `BUSY` \| `OFFLINE` | Disponibilidad |
| `sortBy` | `rating` \| `minPrice` \| `createdAt` | Ordenar por |
| `sortDirection` | `asc` \| `desc` | Dirección |
| `page` | number | Página (default: 1) |
| `pageSize` | number | Por página (default: 10) |

**Ejemplo:** `GET /professionals?city=Montevideo&categoryId=uuid&sortBy=rating&page=1`

**Respuesta:**
```json
{
  "items": [
    {
      "id": "uuid",
      "firstName": "Carlos",
      "lastName": "Rodríguez",
      "bio": "Plomero con 10 años...",
      "avatarUrl": "/uploads/professionals/abc.jpg",
      "rating": 4.8,
      "city": "Montevideo",
      "zone": "Pocitos",
      "minPrice": 500,
      "maxPrice": 3000,
      "yearsExperience": 10,
      "availability": "AVAILABLE",
      "slug": "carlos-rodriguez",
      "categories": [
        { "category": { "id": "uuid", "name": "Plomería", "slug": "plomeria" } }
      ],
      "review": [...]
    }
  ],
  "pagination": { "page": 1, "pageSize": 10, "total": 23, "totalPages": 3 }
}
```

---

### `GET /professionals/:slug` — Perfil público

No requiere auth. **Incrementa automáticamente el contador de vistas** del perfil.

**Respuesta:**
```json
{
  "id": "uuid",
  "firstName": "Carlos",
  "lastName": "Rodríguez",
  "bio": "...",
  "avatarUrl": "/uploads/professionals/abc.jpg",
  "coverPhotoUrl": null,
  "rating": 4.8,
  "city": "Montevideo",
  "zone": "Pocitos",
  "minPrice": 500,
  "maxPrice": 3000,
  "yearsExperience": 10,
  "profileViews": 142,
  "availability": "AVAILABLE",
  "verificationStatus": "VERIFIED",
  "slug": "carlos-rodriguez",
  "profileLink": "/api/professionals/carlos-rodriguez",
  "categories": [...],
  "review": [
    {
      "id": "uuid",
      "reviewerName": "Juan García",
      "rating": 5,
      "comment": "Excelente trabajo",
      "createdAt": "2026-06-01T10:00:00.000Z",
      "status": "VISIBLE"
    }
  ],
  "account": { "id": "uuid", "email": "...", "createdAt": "..." }
}
```

---

### `POST /professionals` 🔒 `PROFESSIONAL`

Crear perfil profesional (si aún no tiene uno). Ver body en `/register`.

---

### `PUT /professionals/:id` 🔒 `PROFESSIONAL`

Actualizar perfil propio. Todos los campos son opcionales.

```json
{
  "bio": "Nueva descripción",
  "city": "Montevideo",
  "availability": "BUSY",
  "minPrice": 600,
  "categoryIds": ["uuid1", "uuid2"]
}
```

---

### `DELETE /professionals/:id` 🔒 `PROFESSIONAL`

Elimina el perfil propio (cascada: borra reviews, trabajos, etc).

---

### `GET /professionals/categories`

Lista todas las categorías disponibles.

```json
[
  { "id": "uuid", "name": "Plomería", "slug": "plomeria" },
  { "id": "uuid", "name": "Electricidad", "slug": "electricidad" }
]
```

---

### `POST /professionals/categories` 🔒 `PROFESSIONAL`

```json
{ "name": "Plomería" }
```

---

### `GET /professionals/:id/schedule`

Horario semanal del profesional (público).

```json
[
  { "dayOfWeek": 1, "startTime": "09:00", "endTime": "18:00", "isAvailable": true },
  { "dayOfWeek": 2, "startTime": "09:00", "endTime": "18:00", "isAvailable": true },
  { "dayOfWeek": 6, "startTime": "09:00", "endTime": "13:00", "isAvailable": true }
]
```

> `dayOfWeek`: 0=Domingo, 1=Lunes, 2=Martes, ..., 6=Sábado

---

### `PUT /professionals/schedule` 🔒 `PROFESSIONAL`

Define el horario semanal. Sobreescribe los días enviados.

```json
{
  "schedule": [
    { "dayOfWeek": "1", "startTime": "09:00", "endTime": "18:00", "isAvailable": true },
    { "dayOfWeek": "2", "startTime": "09:00", "endTime": "18:00", "isAvailable": true },
    { "dayOfWeek": "6", "startTime": "09:00", "endTime": "13:00", "isAvailable": true },
    { "dayOfWeek": "0", "startTime": "09:00", "endTime": "13:00", "isAvailable": false }
  ]
}
```

---

### `POST /professionals/photos` 🔒 `PROFESSIONAL`

Upload de foto al portfolio. Request `multipart/form-data`.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `file` | File | Imagen JPG/PNG/WEBP, máx 5MB |
| `caption` | string (opcional) | Descripción de la foto |
| `type` | `PORTFOLIO` \| `BEFORE_AFTER` | Tipo de foto |

**Respuesta:**
```json
{
  "id": "uuid",
  "professionalId": "uuid",
  "url": "/uploads/professionals/1234567-abc.jpg",
  "caption": "Reparación de cañería en Pocitos",
  "type": "BEFORE_AFTER"
}
```

---

### `DELETE /professionals/photos/:photoId` 🔒 `PROFESSIONAL`

---

### `POST /professionals/certifications` 🔒 `PROFESSIONAL`

```json
{
  "title": "Instalador Electricista Autorizado",
  "issuer": "UTE",
  "issuedAt": "2020-03-15",
  "expiresAt": "2025-03-15",
  "documentUrl": "https://..."
}
```

---

### `DELETE /professionals/certifications/:certId` 🔒 `PROFESSIONAL`

---

### `POST /professionals/services` 🔒 `PROFESSIONAL`

Define los servicios específicos que ofrece.

```json
{
  "name": "Destape de cañerías",
  "description": "Destape con equipos profesionales",
  "price": 1200,
  "durationMinutes": 60
}
```

---

### `DELETE /professionals/services/:serviceId` 🔒 `PROFESSIONAL`

---

### `POST /professionals/:id/reviews` 🔒 `CLIENT`

Dejar una reseña. **Solo se puede si el cliente tiene un trabajo COMPLETADO con ese profesional y sin reseña aún.**

```json
{
  "rating": 5,
  "comment": "Excelente profesional, muy puntual"
}
```

**Respuesta:** incluye la reseña creada y actualiza automáticamente el rating del profesional.

---

### `POST /professionals/reviews/:reviewId/reports` 🔒

Reportar una reseña inapropiada.

```json
{
  "reason": "Lenguaje ofensivo",
  "details": "Contiene insultos hacia el profesional"
}
```

---

### `PATCH /professionals/reviews/:reviewId/moderation` 🔒 `PROFESSIONAL`

El profesional puede ocultar/mostrar reseñas de su propio perfil.

```json
{ "action": "HIDE" }
```
o
```json
{ "action": "SHOW" }
```

---

### `GET /professionals/reviews/reports/my` 🔒 `PROFESSIONAL`

Lista todos los reportes de reseñas del propio perfil.

---

## 6. Módulo: Trabajos (Jobs)

Un trabajo representa la contratación directa de un profesional por un cliente.

**Estados posibles:**
```
PENDING → ACCEPTED → IN_PROGRESS → COMPLETED
                   ↘ CANCELED (cualquier estado excepto COMPLETED)
```

---

### `POST /jobs` 🔒 `CLIENT`

```json
{
  "professionalId": "uuid-del-profesional",
  "title": "Reparación pérdida de agua",
  "description": "Tengo una pérdida bajo el lavabo del baño",
  "address": "Av. Brasil 2145, Ap. 301, Pocitos",
  "budget": 1500,
  "scheduledAt": "2026-07-01T10:00:00.000Z"
}
```

**Respuesta:**
```json
{
  "id": "uuid",
  "clientAccountId": "uuid",
  "professionalId": "uuid",
  "title": "Reparación pérdida de agua",
  "description": "...",
  "address": "...",
  "budget": 1500,
  "scheduledAt": "2026-07-01T10:00:00.000Z",
  "status": "PENDING",
  "createdAt": "2026-06-25T...",
  "professional": { ... }
}
```

---

### `GET /jobs/my` 🔒 `CLIENT` | `PROFESSIONAL`

Lista los trabajos propios. Si es `CLIENT` muestra los trabajos que creó. Si es `PROFESSIONAL` muestra los trabajos que le asignaron.

---

### `PATCH /jobs/:id/status` 🔒 `PROFESSIONAL`

El profesional actualiza el estado del trabajo.

```json
{ "status": "ACCEPTED" }
```

**Transiciones válidas:**

| Desde | Puede ir a |
|-------|-----------|
| `PENDING` | `ACCEPTED`, `CANCELED` |
| `ACCEPTED` | `IN_PROGRESS`, `CANCELED` |
| `IN_PROGRESS` | `COMPLETED`, `CANCELED` |

---

### `PATCH /jobs/:id/cancel` 🔒 `CLIENT`

El cliente cancela un trabajo. Solo cuando está en `PENDING` o `ACCEPTED`.

---

## 7. Módulo: Solicitudes de presupuesto

El cliente publica una necesidad y varios profesionales envían presupuestos.

**Flujo:**
```
Cliente crea solicitud (OPEN)
    → Profesionales envían ofertas
    → Cliente acepta una oferta (→ ASSIGNED, otras ofertas → REJECTED)
    → Cliente puede cerrar manualmente (→ CLOSED)
```

---

### `POST /quote-requests` 🔒 `CLIENT`

```json
{
  "title": "Necesito reparar pérdida de agua en Pocitos",
  "description": "Tengo una pérdida en la cañería del baño. El piso ya está mojado.",
  "city": "Montevideo",
  "budget": 2000,
  "categoryId": "uuid-plomeria",
  "expiresAt": "2026-07-05T23:59:59.000Z"
}
```

---

### `GET /quote-requests`

Lista pública de solicitudes abiertas. Query params:

| Param | Descripción |
|-------|-------------|
| `city` | Filtrar por ciudad |
| `categoryId` | Filtrar por categoría |
| `status` | `OPEN` (default) \| `ASSIGNED` \| `CLOSED` \| `EXPIRED` |
| `page`, `pageSize` | Paginación |

---

### `GET /quote-requests/my` 🔒 `CLIENT`

Lista las solicitudes propias con todas las ofertas recibidas.

**Respuesta:**
```json
[
  {
    "id": "uuid",
    "title": "Necesito reparar pérdida...",
    "status": "OPEN",
    "offers": [
      {
        "id": "uuid",
        "price": 1800,
        "description": "Puedo ir mañana...",
        "estimatedDays": 1,
        "status": "PENDING",
        "professional": {
          "id": "uuid",
          "firstName": "Carlos",
          "rating": 4.8,
          "avatarUrl": "/uploads/professionals/abc.jpg",
          "slug": "carlos-rodriguez"
        }
      }
    ]
  }
]
```

---

### `GET /quote-requests/:id`

Detalle de una solicitud con sus ofertas.

---

### `POST /quote-requests/:id/offers` 🔒 `PROFESSIONAL`

```json
{
  "price": 1800,
  "description": "Puedo asistir mañana a las 10am. Incluye materiales básicos.",
  "estimatedDays": 1
}
```

> Solo se puede enviar **una oferta por profesional** por solicitud.  
> El cliente recibe una notificación automáticamente.

---

### `PATCH /quote-requests/:id/offers/:offerId/accept` 🔒 `CLIENT`

Acepta una oferta. Automáticamente:
- La oferta pasa a `ACCEPTED`
- Las demás ofertas pasan a `REJECTED`
- La solicitud pasa a `ASSIGNED`
- El profesional recibe una notificación

---

### `PATCH /quote-requests/:id/close` 🔒 `CLIENT`

Cierra la solicitud sin aceptar ninguna oferta.

---

## 8. Módulo: Citas / Agenda

Permite agendar una cita con un profesional.

**Estados:**
```
PENDING → CONFIRMED → COMPLETED
       ↘ CANCELED
       ↘ RESCHEDULED (vuelve a estar pendiente de confirmar)
```

---

### `POST /appointments` 🔒 `CLIENT`

```json
{
  "professionalId": "uuid",
  "scheduledAt": "2026-07-02T10:00:00.000Z",
  "durationMinutes": 90,
  "address": "Av. Brasil 2145, Pocitos",
  "notes": "Timbre no funciona, llamar al llegar",
  "serviceJobId": "uuid-opcional"
}
```

> El profesional recibe una notificación automáticamente.

---

### `GET /appointments/my` 🔒

Lista las citas propias. Si es `CLIENT`, incluye datos del profesional.

---

### `PATCH /appointments/:id/confirm` 🔒 `PROFESSIONAL`

El profesional confirma la cita. El cliente recibe notificación.

---

### `PATCH /appointments/:id/reschedule` 🔒

Puede ejecutarlo cliente o profesional. La cita pasa a estado `RESCHEDULED`.

```json
{
  "scheduledAt": "2026-07-03T14:00:00.000Z",
  "notes": "Se reagendó por lluvia"
}
```

---

### `PATCH /appointments/:id/cancel` 🔒

Puede ejecutarlo cliente o profesional. Solo cancela si está en `PENDING`, `CONFIRMED` o `RESCHEDULED`.

---

## 9. Módulo: Chat

Sistema de mensajería entre un cliente y un profesional.

**Modelo de conversación:**  
Cada par `(clientAccountId, professionalAccountId)` tiene **una única conversación**. Si no existe, se crea automáticamente.

---

### `POST /chat/conversations` 🔒

Crea o recupera la conversación entre las dos partes.

**Query params** (según rol del que hace el request):
- Si eres `CLIENT`: `?professionalAccountId=uuid`
- Si eres `PROFESSIONAL`: `?clientAccountId=uuid`

**Respuesta:**
```json
{
  "id": "uuid-conversation",
  "clientAccountId": "uuid",
  "professionalAccountId": "uuid",
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

### `GET /chat/conversations` 🔒

Lista todas las conversaciones propias con el último mensaje de cada una.

```json
[
  {
    "id": "uuid",
    "clientAccountId": "uuid",
    "professionalAccountId": "uuid",
    "updatedAt": "2026-06-25T...",
    "messages": [
      {
        "id": "uuid",
        "content": "Hola, ¿podés venir mañana?",
        "senderAccountId": "uuid",
        "type": "TEXT",
        "isRead": true,
        "createdAt": "..."
      }
    ]
  }
]
```

---

### `GET /chat/conversations/:id/messages` 🔒

Lista los mensajes de una conversación. **Marca automáticamente como leídos** los mensajes de la otra parte.

Query: `?page=1&pageSize=30`

---

### `POST /chat/conversations/:id/messages` 🔒

Envía un mensaje. La otra parte recibe una notificación.

```json
{
  "content": "Hola, ¿podés venir el martes a las 10?",
  "type": "TEXT"
}
```

Tipos de mensaje: `TEXT` | `IMAGE` | `LOCATION`

> Para imágenes: primero subir con el módulo de uploads, luego enviar la URL como `content`.

---

### `GET /chat/unread-count` 🔒

```json
{ "count": 3 }
```

---

## 10. Módulo: Notificaciones

---

### `GET /notifications` 🔒

Lista las últimas 50 notificaciones propias.

Query: `?unread=true` para solo las no leídas.

```json
[
  {
    "id": "uuid",
    "type": "QUOTE_RECEIVED",
    "title": "Nuevo presupuesto recibido",
    "body": "Carlos Rodríguez envió un presupuesto para \"Reparación de pérdida\"",
    "data": "{\"quoteRequestId\": \"uuid\", \"offerId\": \"uuid\"}",
    "isRead": false,
    "createdAt": "2026-06-25T..."
  }
]
```

**Tipos de notificación:**

| Tipo | Cuándo se genera |
|------|-----------------|
| `JOB_REQUEST` | Un cliente contrata al profesional |
| `JOB_STATUS_UPDATE` | El estado del trabajo cambia |
| `NEW_MESSAGE` | Mensaje nuevo en el chat |
| `QUOTE_RECEIVED` | El cliente recibe una oferta de presupuesto |
| `QUOTE_ACCEPTED` | El profesional es aceptado |
| `APPOINTMENT_SCHEDULED` | Se agenda o confirma una cita |
| `APPOINTMENT_REMINDER` | Recordatorio de cita (próximamente automático) |
| `REVIEW_RECEIVED` | El profesional recibe una nueva reseña |
| `SYSTEM` | Mensajes del sistema |

> El campo `data` contiene un JSON stringificado con IDs relevantes para navegar al recurso.

---

### `GET /notifications/unread-count` 🔒

```json
{ "count": 5 }
```

---

### `PATCH /notifications/:id/read` 🔒

Marca una notificación como leída.

---

### `PATCH /notifications/read-all` 🔒

Marca todas como leídas.

---

## 11. Módulo: Suscripciones

Sistema de planes premium para profesionales.

---

### `GET /subscriptions/plans`

Lista los planes disponibles (público).

```json
[
  {
    "id": "uuid",
    "name": "Gratis",
    "description": "Hasta 20 contactos por mes",
    "price": 0,
    "maxContactsPerMonth": 20,
    "isFeatured": false,
    "hasAdvancedStats": false
  },
  {
    "id": "uuid",
    "name": "Premium",
    "description": "Aparece primero, más solicitudes, estadísticas avanzadas",
    "price": 590,
    "maxContactsPerMonth": null,
    "isFeatured": true,
    "hasAdvancedStats": true
  }
]
```

---

### `POST /subscriptions/subscribe` 🔒 `PROFESSIONAL`

```json
{ "planId": "uuid-plan-premium" }
```

**Respuesta:**
```json
{
  "id": "uuid",
  "professionalId": "uuid",
  "status": "ACTIVE",
  "startDate": "2026-06-25T...",
  "endDate": "2026-07-25T...",
  "plan": { "name": "Premium", "price": 590 }
}
```

---

### `GET /subscriptions/my` 🔒 `PROFESSIONAL`

Retorna la suscripción activa del profesional (o `null` si no tiene).

---

### `DELETE /subscriptions/cancel` 🔒 `PROFESSIONAL`

Cancela la suscripción activa.

---

## 12. Módulo: Pagos

---

### `POST /payments` 🔒

Registrar un pago (llamar antes de procesar con pasarela externa).

```json
{
  "amount": 590,
  "method": "MERCADO_PAGO",
  "subscriptionId": "uuid"
}
```

Métodos: `CARD` | `MERCADO_PAGO` | `TRANSFER`

---

### `GET /payments/my` 🔒

Historial de pagos propios con el plan al que corresponden.

---

### `GET /payments/earnings` 🔒 `PROFESSIONAL`

Resumen de ingresos del profesional.

```json
{
  "total": 11800,
  "thisMonth": 1770,
  "payments": [...]
}
```

---

### `PATCH /payments/:id/confirm`

Confirmar un pago (usado como webhook de la pasarela de pago externa).

---

## 13. Módulo: Estadísticas

Solo para profesionales. Requiere suscripción con `hasAdvancedStats: true` para el detalle completo.

### `GET /stats` 🔒 `PROFESSIONAL`

```json
{
  "profileViews": 142,
  "contactCount": 37,
  "rating": 4.8,
  "reviewCount": 18,
  "avgRating": 4.8,
  "jobs": {
    "total": 34,
    "byStatus": {
      "PENDING": 2,
      "ACCEPTED": 1,
      "COMPLETED": 28,
      "CANCELED": 3
    }
  },
  "quoteOffers": {
    "total": 15,
    "accepted": 9,
    "conversionRate": 60
  },
  "appointmentsThisMonth": 4,
  "subscription": {
    "plan": "Premium",
    "endDate": "2026-07-25T..."
  },
  "last30daysSummary": {
    "period": "25/05/2026 - 25/06/2026"
  }
}
```

---

## 14. Módulo: Admin

Todos los endpoints requieren rol `ADMIN`. 🔒 `ADMIN`

### `GET /admin/dashboard`

```json
{
  "totalAccounts": 1240,
  "totalProfessionals": 380,
  "pendingVerifications": 12,
  "openReports": 5,
  "totalJobs": 3200,
  "openQuoteRequests": 48
}
```

### `GET /admin/professionals?verificationStatus=PENDING&page=1`
### `PATCH /admin/professionals/:id/verify?status=VERIFIED`
### `PATCH /admin/professionals/:id/block`
### `GET /admin/accounts?role=PROFESSIONAL&page=1`
### `DELETE /admin/accounts/:id`
### `GET /admin/review-reports?status=OPEN&page=1`
### `PATCH /admin/review-reports/:id/resolve?action=RESOLVED`

> `action`: `RESOLVED` (oculta la reseña) | `DISMISSED` (descarta el reporte)

### `POST /admin/plans`

Crear planes de suscripción.

```json
{
  "name": "Premium",
  "description": "Plan completo para profesionales",
  "price": 590,
  "isFeatured": true,
  "hasAdvancedStats": true,
  "maxContactsPerMonth": null
}
```

---

## 15. Módulo: Uploads (fotos)

Las fotos se suben directamente desde los endpoints que las necesitan (multipart/form-data).

### Endpoints con soporte de upload

| Endpoint | Campo del file | Destino |
|----------|---------------|---------|
| `POST /professionals/photos` | `file` | `/uploads/professionals/` |

### URLs de archivos

Los archivos subidos se sirven desde:
```
http://localhost:3000/uploads/professionals/nombre-archivo.jpg
```

> En producción, reemplazar por CDN/S3.

### Restricciones

- Formatos permitidos: `JPG`, `PNG`, `WEBP`
- Tamaño máximo: **5MB**

---

## Guía de Integración para Frontend

Esta sección contiene recomendaciones prácticas para integrar el backend en una aplicación frontend moderna.

### Stack Recomendado para Frontend

#### Opción A: React (Recomendado)
```json
{
  "framework": "React 18+",
  "stateManagement": "Zustand o Redux Toolkit",
  "httpClient": "Axios o Fetch API",
  "validation": "React Hook Form + Zod",
  "styling": "TailwindCSS + shadcn/ui o Material-UI",
  "router": "React Router v6",
  "notifications": "react-hot-toast",
  "forms": "React Hook Form",
  "realtime": "Socket.IO (futuro para chat)",
  "devTools": "TanStack Query (React Query)"
}
```

#### Opción B: Vue 3
```json
{
  "framework": "Vue 3 + TypeScript",
  "stateManagement": "Pinia",
  "httpClient": "Axios",
  "validation": "Vee-Validate + Zod",
  "styling": "TailwindCSS + shadcn/vue",
  "router": "Vue Router 4"
}
```

### Estructura de Carpetas Recomendada (React)

```
frontend/
├── public/
├── src/
│   ├── api/
│   │   ├── auth.ts          (login, register, refresh)
│   │   ├── professionals.ts (búsqueda, perfil)
│   │   ├── jobs.ts          (crear, actualizar job)
│   │   ├── quotes.ts        (solicitudes y ofertas)
│   │   ├── appointments.ts  (citas)
│   │   ├── chat.ts          (conversaciones, mensajes)
│   │   ├── notifications.ts
│   │   └── client.ts        (instancia HTTP centralizada)
│   ├── components/
│   │   ├── auth/
│   │   ├── search/
│   │   ├── profile/
│   │   ├── jobs/
│   │   ├── chat/
│   │   ├── common/
│   │   └── layout/
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useNotifications.ts
│   │   ├── useProfessionals.ts
│   │   └── ...
│   ├── pages/
│   │   ├── login/
│   │   ├── register/
│   │   ├── search/
│   │   ├── profile/
│   │   ├── dashboard/
│   │   └── ...
│   ├── store/
│   │   ├── authStore.ts
│   │   ├── notificationStore.ts
│   │   └── ...
│   ├── types/
│   │   └── index.ts         (TypeScript types del backend)
│   ├── utils/
│   │   ├── jwt.ts           (decodificar JWT sin librería)
│   │   └── constants.ts
│   └── App.tsx
├── package.json
└── vite.config.ts
```

### Configuración del Cliente HTTP

#### Con Fetch API (recomendado para mantener minimal)

```typescript
// src/api/client.ts
const API_BASE = 'http://localhost:3000/api';

const apiCall = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token = localStorage.getItem('accessToken');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  // Si 401, intentar refresh
  if (response.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return apiCall(endpoint, options); // Reintentar
    } else {
      // Redirigir a login
      window.location.href = '/login';
    }
  }

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return response.json();
};

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return false;

  try {
    const { tokens } = await apiCall('/accounts/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    return true;
  } catch (e) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return false;
  }
};

export { apiCall, refreshAccessToken };
```

#### Con Axios

```typescript
// src/api/client.ts
import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Interceptor para agregar token
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar 401
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const { data } = await client.post('/accounts/refresh', {
            refreshToken,
          });
          localStorage.setItem('accessToken', data.tokens.accessToken);
          localStorage.setItem('refreshToken', data.tokens.refreshToken);
          
          // Reintentar request original
          return client(error.config);
        } catch (e) {
          // Redirigir a login
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default client;
```

### Decodificar JWT sin librería

```typescript
// src/utils/jwt.ts
export interface JWTPayload {
  sub: string;        // account ID
  email: string;
  role: 'CLIENT' | 'PROFESSIONAL' | 'ADMIN';
  iat: number;
  exp: number;
}

export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const decoded = JSON.parse(atob(parts[1]));
    return decoded;
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const payload = decodeJWT(token);
  if (!payload) return true;

  return payload.exp * 1000 < Date.now();
};

export const getCurrentUser = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  const payload = decodeJWT(token);
  if (!payload || isTokenExpired(token)) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return null;
  }

  return payload;
};
```

### TypeScript Types (basados en API)

```typescript
// src/types/index.ts

// Auth
export interface Account {
  id: string;
  email: string;
  role: 'CLIENT' | 'PROFESSIONAL' | 'ADMIN';
  createdAt: string;
}

export interface AuthResponse {
  id: string;
  email: string;
  role: string;
  client?: User;
  professional?: Professional;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

// Profesional
export interface Professional {
  id: string;
  firstName: string;
  lastName: string;
  bio: string;
  avatarUrl?: string;
  rating: number;
  city: string;
  zone: string;
  minPrice: number;
  maxPrice: number;
  yearsExperience: number;
  availability: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
  slug: string;
  profileViews: number;
  categories: Category[];
  reviews: Review[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  reviewerName: string;
  createdAt: string;
  status: 'VISIBLE' | 'HIDDEN';
}

// Jobs
export interface Job {
  id: string;
  clientAccountId: string;
  professionalId: string;
  title: string;
  description: string;
  address: string;
  budget: number;
  scheduledAt: string;
  status: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';
  professional?: Professional;
  createdAt: string;
}

// Quote
export interface QuoteRequest {
  id: string;
  title: string;
  description: string;
  city: string;
  budget: number;
  categoryId: string;
  status: 'OPEN' | 'ASSIGNED' | 'CLOSED' | 'EXPIRED';
  offers: QuoteOffer[];
  expiresAt: string;
}

export interface QuoteOffer {
  id: string;
  price: number;
  description: string;
  estimatedDays: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  professional: Professional;
  createdAt: string;
}

// Appointments
export interface Appointment {
  id: string;
  clientAccountId: string;
  professionalId: string;
  scheduledAt: string;
  durationMinutes: number;
  address: string;
  notes?: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELED' | 'RESCHEDULED';
}

// Chat
export interface ChatConversation {
  id: string;
  clientAccountId: string;
  professionalAccountId: string;
  messages: ChatMessage[];
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  senderAccountId: string;
  type: 'TEXT' | 'IMAGE' | 'LOCATION';
  isRead: boolean;
  createdAt: string;
}

// Notifications
export interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  data: string; // JSON stringificado
  isRead: boolean;
  createdAt: string;
}

// Subscriptions
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  maxContactsPerMonth?: number;
  isFeatured: boolean;
  hasAdvancedStats: boolean;
}

export interface Subscription {
  id: string;
  professionalId: string;
  planId: string;
  status: 'ACTIVE' | 'CANCELED' | 'EXPIRED';
  startDate: string;
  endDate: string;
  plan?: SubscriptionPlan;
}

// Stats
export interface Stats {
  profileViews: number;
  contactCount: number;
  rating: number;
  reviewCount: number;
  jobs: {
    total: number;
    byStatus: Record<string, number>;
  };
  quoteOffers: {
    total: number;
    accepted: number;
    conversionRate: number;
  };
  appointmentsThisMonth: number;
}
```

### Manejo de Errores Frontend

```typescript
// src/utils/errors.ts

interface ApiError {
  success: false;
  statusCode: number;
  message: string;
  details?: Array<{
    field: string;
    constraints: Record<string, string>;
  }>;
}

export const handleApiError = (error: unknown): string => {
  if (error instanceof TypeError) {
    return 'Error de red. Verifica tu conexión.';
  }

  const apiError = error as ApiError;
  
  if (apiError.statusCode === 401) {
    return 'Sesión expirada. Por favor inicia sesión nuevamente.';
  }
  
  if (apiError.statusCode === 403) {
    return 'No tienes permiso para realizar esta acción.';
  }
  
  if (apiError.statusCode === 404) {
    return 'El recurso no fue encontrado.';
  }
  
  if (apiError.statusCode === 409) {
    return 'Este recurso ya existe.';
  }
  
  if (apiError.details) {
    return apiError.details
      .map(d => `${d.field}: ${Object.values(d.constraints)[0]}`)
      .join('\n');
  }

  return apiError.message || 'Error desconocido del servidor.';
};
```

### Polling de Notificaciones

```typescript
// src/hooks/useNotifications.ts
import { useEffect, useState } from 'react';
import { apiCall } from '../api/client';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Obtener count de no leídas
        const { count } = await apiCall('/notifications/unread-count');
        setUnreadCount(count);

        // Obtener últimas 50
        const data = await apiCall('/notifications');
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();

    // Polling cada 30 segundos
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (notificationId: string) => {
    try {
      await apiCall(`/notifications/${notificationId}/read`, {
        method: 'PATCH',
      });
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return { notifications, unreadCount, markAsRead };
};
```

### Búsqueda de Profesionales con Filtros

```typescript
// src/api/professionals.ts
import { apiCall } from './client';

interface SearchFilters {
  search?: string;
  city?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: 'rating' | 'minPrice' | 'createdAt';
  sortDirection?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export const searchProfessionals = async (filters: SearchFilters) => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      params.append(key, String(value));
    }
  });

  return apiCall(`/professionals?${params.toString()}`);
};

export const getProfessionalProfile = async (slug: string) => {
  return apiCall(`/professionals/${slug}`);
};

export const uploadProfessionalPhoto = async (
  file: File,
  caption?: string,
  type: 'PORTFOLIO' | 'BEFORE_AFTER' = 'PORTFOLIO'
) => {
  const formData = new FormData();
  formData.append('file', file);
  if (caption) formData.append('caption', caption);
  formData.append('type', type);

  const token = localStorage.getItem('accessToken');
  const response = await fetch('http://localhost:3000/api/professionals/photos', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) throw new Error('Upload failed');
  return response.json();
};
```

### Configuración de Tema y UI

```typescript
// src/theme/colors.ts
export const colors = {
  primary: '#3b82f6',      // Azul
  secondary: '#8b5cf6',    // Púrpura
  success: '#10b981',      // Verde
  warning: '#f59e0b',      // Naranja
  error: '#ef4444',        // Rojo
  neutral: '#6b7280',      // Gris
};

// Paleta para profesionales por categoría
export const categoryColors: Record<string, string> = {
  plomeria: '#3b82f6',
  electricidad: '#f59e0b',
  carpinteria: '#8b4513',
  pintura: '#ec4899',
  albañileria: '#78350f',
};
```

### Rutas Recomendadas (React Router)

```typescript
// src/routes/index.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Auth
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Cliente
import SearchPage from '../pages/client/SearchPage';
import ProfessionalProfilePage from '../pages/client/ProfessionalProfilePage';
import MyJobsPage from '../pages/client/MyJobsPage';
import QuoteRequestsPage from '../pages/client/QuoteRequestsPage';
import AppointmentsPage from '../pages/client/AppointmentsPage';
import ChatPage from '../pages/client/ChatPage';
import ClientDashboard from '../pages/client/Dashboard';

// Profesional
import ProfessionalProfileEditPage from '../pages/professional/ProfileEditPage';
import ProfessionalDashboard from '../pages/professional/Dashboard';
import MySchedulePage from '../pages/professional/MySchedulePage';
import SubscriptionPage from '../pages/professional/SubscriptionPage';

// Admin
import AdminDashboard from '../pages/admin/Dashboard';

export const Router = () => (
  <Routes>
    {/* Public */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/professionals/:slug" element={<ProfessionalProfilePage />} />

    {/* Cliente */}
    <Route
      path="/search"
      element={
        <ProtectedRoute allowedRoles={['CLIENT']}>
          <SearchPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard/client"
      element={
        <ProtectedRoute allowedRoles={['CLIENT']}>
          <ClientDashboard />
        </ProtectedRoute>
      }
    />
    
    {/* Profesional */}
    <Route
      path="/dashboard/professional"
      element={
        <ProtectedRoute allowedRoles={['PROFESSIONAL']}>
          <ProfessionalDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/professional/profile"
      element={
        <ProtectedRoute allowedRoles={['PROFESSIONAL']}>
          <ProfessionalProfileEditPage />
        </ProtectedRoute>
      }
    />

    {/* Admin */}
    <Route
      path="/admin"
      element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />

    <Route path="/" element={<Navigate to="/search" replace />} />
  </Routes>
);
```

---

## 16. Formato de errores

| Código | Significado | Cuándo ocurre |
|--------|-------------|---------------|
| `400` | Bad Request | Datos inválidos, transición inválida |
| `401` | Unauthorized | Token inválido/expirado, credenciales incorrectas |
| `403` | Forbidden | No tiene permiso (rol incorrecto, recurso ajeno) |
| `404` | Not Found | Recurso no encontrado |
| `409` | Conflict | Ya existe (email duplicado, oferta duplicada) |
| `500` | Server Error | Error interno |

---

---

### 🏠 Pantalla de inicio — Búsqueda

```
1. GET /professionals/categories     → listar categorías en filtros
2. GET /professionals?city=...&categoryId=...&sortBy=rating
   → mostrar cards de resultados
3. Click en un profesional:
   GET /professionals/:slug          → página de perfil completo
   
Cliente ve:
- Foto y nombre
- Rating promedio y cantidad de reseñas
- Especialidades/categorías
- Precios min/max
- Zona de cobertura
- Fotos del portfolio
- Certificaciones
- Reseñas y comentarios
- Botones: "Contratar" y "Agendar cita"
```

---

### 👤 Registro de cliente

**Pantalla 1: Email y contraseña**
```
POST /accounts/register {
  "email": "juan@gmail.com",
  "password": "segura123",
  "role": "CLIENT",
  "user": {
    "firstName": "Juan",
    "lastName": "García",
    "phoneNumber": "+598 91 234 567"
  }
}

Respuesta: { tokens: {...}, profile: {...} }
```

**Pantalla 2: Completar perfil (opcional)**
```
- Avatar (foto de perfil)
- Zona predilecta
- Guardar direcciones frecuentes
```

**Pantalla 3: Preferencias**
```
- Recibir notificaciones
- Preferencias de comunicación
```

**Flujo**:
1. Ingresa datos básicos
2. Guardar tokens en localStorage
3. Redirigir a home/búsqueda
4. Opcionalmente completar perfil después

---

### 🔧 Registro de profesional (flujo completo)

**Pantalla 1: Email y contraseña**
```
POST /accounts/register {
  "email": "carlos.plomero@gmail.com",
  "password": "segura123",
  "role": "PROFESSIONAL",
  "professional": {
    "firstName": "Carlos",
    "lastName": "Rodríguez",
    "phoneNumber": "+598 99 123 456",
    "bio": "Plomero con 10 años de experiencia",
    "city": "Montevideo",
    "zone": "Pocitos",
    "minPrice": 500,
    "maxPrice": 3000,
    "yearsExperience": 10,
    "categoryIds": ["uuid-de-plomeria"]
  }
}
```

**Pantalla 2: Fotos y certificaciones**
```
POST /professionals/photos (multipart/form-data)
POST /professionals/certifications {
  "title": "Instalador Electricista Autorizado",
  "issuer": "UTE",
  "issuedAt": "2020-03-15",
  "expiresAt": "2025-03-15"
}
```

**Pantalla 3: Servicios específicos**
```
POST /professionals/services {
  "name": "Destape de cañerías",
  "description": "Con equipos profesionales",
  "price": 1200,
  "durationMinutes": 60
}
```

**Pantalla 4: Horario disponible**
```
PUT /professionals/schedule {
  "schedule": [
    { "dayOfWeek": 1, "startTime": "09:00", "endTime": "18:00", "isAvailable": true },
    { "dayOfWeek": 2, "startTime": "09:00", "endTime": "18:00", "isAvailable": true }
  ]
}
```

---

### 🔑 Login y renovación de token

**Pantalla de login:**
```json
POST /accounts/login {
  "email": "juan@gmail.com",
  "password": "segura123"
}

Respuesta: {
  "id": "uuid",
  "email": "juan@gmail.com",
  "role": "CLIENT",
  "tokens": {
    "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refreshToken": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

**Implementación en frontend:**
```javascript
// 1. Login
const login = async (email, password) => {
  const response = await fetch('http://localhost:3000/api/accounts/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  
  // 2. Guardar tokens
  localStorage.setItem('accessToken', data.tokens.accessToken);
  localStorage.setItem('refreshToken', data.tokens.refreshToken);
  
  // 3. Decodificar y guardar rol
  const payload = JSON.parse(atob(data.tokens.accessToken.split('.')[1]));
  localStorage.setItem('userRole', payload.role);
  
  // 4. Redirigir según rol
  if (payload.role === 'CLIENT') {
    window.location.href = '/search';
  } else {
    window.location.href = '/dashboard/professional';
  }
};

// 5. Interceptor para cuando expira token
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  const response = await fetch('http://localhost:3000/api/accounts/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken })
  });
  
  if (response.ok) {
    const data = await response.json();
    localStorage.setItem('accessToken', data.tokens.accessToken);
    localStorage.setItem('refreshToken', data.tokens.refreshToken);
    return true;
  } else {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
    return false;
  }
};
```

---

### 💬 Contratar directamente (flujo Jobs)

**Paso 1: Cliente busca profesional**
```
GET /professionals?city=Montevideo&categoryId=uuid
→ Ver cards de resultados
```

**Paso 2: Ver perfil completo**
```
GET /professionals/:slug
```

**Paso 3: Cliente hace click en "Contratar"**
- Se abre modal con formulario:
  - Descripción del problema (textarea)
  - Presupuesto estimado (número)
  - Dirección (address)
  - Fecha y hora deseada (datetime)
  - Fotos del problema (opcional)

**Paso 4: Crear el trabajo**
```json
POST /jobs {
  "professionalId": "uuid-carlos",
  "title": "Reparación pérdida de agua",
  "description": "Tengo una pérdida bajo el lavabo del baño",
  "address": "Av. Brasil 2145, Ap. 301, Pocitos",
  "budget": 1500,
  "scheduledAt": "2026-07-01T10:00:00.000Z"
}

Respuesta: { id: "job-123", status: "PENDING", ... }
```

- Cliente ve pantalla: "✅ Solicitud enviada al profesional"
- Profesional recibe notificación `JOB_REQUEST`

**Paso 5: Profesional ve el trabajo**
```
GET /jobs/my
→ Muestra tarjeta con estado "PENDING"
→ Botones: "Aceptar" | "Rechazar"
```

**Paso 6: Profesional acepta**
```json
PATCH /jobs/job-123/status {
  "status": "ACCEPTED"
}
```

- Trabajo pasa a `ACCEPTED`
- Cliente recibe notificación
- Ambos pueden ahora usar chat para comunicarse

**Paso 7: Profesional inicia trabajo**
```json
PATCH /jobs/job-123/status {
  "status": "IN_PROGRESS"
}
```

**Paso 8: Profesional completa trabajo**
```json
PATCH /jobs/job-123/status {
  "status": "COMPLETED"
}
```

- Cliente puede ahora dejar reseña

**Paso 9: Cliente deja reseña**
```json
POST /professionals/carlos-rodriguez/reviews {
  "rating": 5,
  "comment": "Excelente profesional, muy puntual y limpio"
}
```

---

### 📋 Solicitar presupuesto (flujo Quote Requests)

**Diferencia clave con Jobs**:
- En **Jobs**: Cliente elige profesional específico y presupuesto
- En **Quotes**: Cliente publica necesidad, múltiples profesionales ofrecen presupuestos

**Paso 1: Cliente publica necesidad**
```json
POST /quote-requests {
  "title": "Necesito reparar pérdida de agua en Pocitos",
  "description": "Tengo una pérdida en la cañería del baño. El piso ya está mojado.",
  "city": "Montevideo",
  "budget": 2000,
  "categoryId": "uuid-plomeria",
  "expiresAt": "2026-07-05T23:59:59.000Z"
}

Respuesta: { id: "quote-req-123", status: "OPEN", offers: [] }
```

- Cliente ve: "✅ Solicitud publicada. Espera presupuestos de profesionales"
- Profesionales ven en `/quote-requests` que hay una solicitud nueva

**Paso 2: Profesionales ven solicitudes**
```
GET /quote-requests?city=Montevideo&categoryId=uuid-plomeria
→ Muestra lista de solicitudes abiertas
→ Cada una con descripción y presupuesto estimado del cliente
```

**Paso 3: Profesional envía presupuesto**
```json
POST /quote-requests/quote-req-123/offers {
  "price": 1800,
  "description": "Puedo asistir mañana a las 10am. Incluye materiales básicos.",
  "estimatedDays": 1
}

Respuesta: { id: "offer-456", status: "PENDING", ... }
```

- Cliente recibe notificación `QUOTE_RECEIVED`
- **Importante**: Un profesional solo puede enviar UNA oferta por solicitud

**Paso 4: Cliente revisa todas las ofertas**
```
GET /quote-requests/my
→ Lista todas sus solicitudes con las ofertas recibidas
```

Cliente ve:
```
📋 "Reparar pérdida de agua"
├── 💼 Carlos Rodríguez: $1800 (Disponible mañana)
│   ⭐ 4.8 | 28 trabajos completados
│   Presupuesto: "Puedo asistir mañana..."
│   [ACEPTAR] [RECHAZAR] [CHAT]
├── 💼 Juan Plomero: $2200 (Dentro de 3 días)
│   ⭐ 4.5 | 15 trabajos completados
│   [ACEPTAR] [RECHAZAR] [CHAT]
└── 💼 Roberto Tuberías: $1500 (Disponible esta noche)
    ⭐ 3.2 | 5 trabajos completados
    [ACEPTAR] [RECHAZAR] [CHAT]
```

**Paso 5: Cliente acepta una oferta**
```json
PATCH /quote-requests/quote-req-123/offers/offer-456/accept
```

Automáticamente:
- Oferta aceptada → status: "ACCEPTED"
- Las otras ofertas → status: "REJECTED"
- Solicitud → status: "ASSIGNED"
- Profesional aceptado recibe notificación `QUOTE_ACCEPTED`
- Profesionales rechazados reciben notificación

**Paso 6: Siguiente acción**
- Opción A: Crear un Job: `POST /jobs { professionalId, ... }`
- Opción B: Agendar una Cita: `POST /appointments { professionalId, ... }`

---

### 📅 Agendar una cita (Appointments)

**Diferencia clave**:
- **Job**: Compromiso con presupuesto final y plazo
- **Appointment**: Solo reserva de tiempo, sin presupuesto fijo

**Paso 1: Ver horario disponible del profesional**
```
GET /professionals/carlos-rodriguez/schedule

Respuesta: [
  { dayOfWeek: 1, startTime: "09:00", endTime: "18:00", isAvailable: true },
  { dayOfWeek: 2, startTime: "09:00", endTime: "18:00", isAvailable: true },
  { dayOfWeek: 6, startTime: "09:00", endTime: "13:00", isAvailable: true },
  { dayOfWeek: 0, isAvailable: false }  // Domingo no atiende
]
```

Cliente ve un calendario con días/horas disponibles

**Paso 2: Cliente selecciona fecha y hora**
```json
POST /appointments {
  "professionalId": "uuid-carlos",
  "scheduledAt": "2026-07-02T10:00:00.000Z",
  "durationMinutes": 90,
  "address": "Av. Brasil 2145, Pocitos",
  "notes": "Timbre no funciona, llamar al llegar",
  "serviceJobId": null  // opcional, si es para un job específico
}

Respuesta: { id: "apt-123", status: "PENDING", ... }
```

- Cliente ve: "✅ Cita solicitada"
- Profesional recibe notificación `APPOINTMENT_SCHEDULED`

**Paso 3: Profesional confirma cita**
```json
PATCH /appointments/apt-123/confirm
```

- Status cambia a `CONFIRMED`
- Cliente recibe notificación

**Paso 4: Reprogramar (opcional)**
```json
PATCH /appointments/apt-123/reschedule {
  "scheduledAt": "2026-07-03T14:00:00.000Z",
  "notes": "Se reagendó por lluvia"
}
```

- Status → `RESCHEDULED`
- Ambas partes reciben notificación

**Paso 5: Cancelar (opcional)**
```json
PATCH /appointments/apt-123/cancel
```

- Solo si está en PENDING, CONFIRMED o RESCHEDULED
- Ambas partes reciben notificación

---

### 💬 Chat entre cliente y profesional

**Concepto clave**:
- Cada par (cliente, profesional) tiene UNA sola conversación
- Si no existe, se crea automáticamente al primer mensaje

**Paso 1: Abrir chat**
```json
POST /chat/conversations?professionalAccountId=uuid-carlos

Respuesta: {
  "id": "conv-123",
  "clientAccountId": "uuid-juan",
  "professionalAccountId": "uuid-carlos",
  "messages": []
}
```

O si eres profesional:
```json
POST /chat/conversations?clientAccountId=uuid-juan
```

**Paso 2: Cargar historial**
```
GET /chat/conversations/conv-123/messages?page=1&pageSize=30

Respuesta: [
  {
    "id": "msg-1",
    "content": "Hola, ¿podés venir mañana?",
    "senderAccountId": "uuid-juan",
    "type": "TEXT",
    "isRead": true,
    "createdAt": "2026-06-25T10:00:00.000Z"
  },
  {
    "id": "msg-2",
    "content": "Sí, sin problema. ¿A qué hora?",
    "senderAccountId": "uuid-carlos",
    "type": "TEXT",
    "isRead": true,
    "createdAt": "2026-06-25T10:05:00.000Z"
  }
]
```

**Automáticamente**: Los mensajes de la otra parte se marcan como leídos

**Paso 3: Enviar mensaje**
```json
POST /chat/conversations/conv-123/messages {
  "content": "¿A las 10am está bien?",
  "type": "TEXT"
}

Respuesta: {
  "id": "msg-3",
  "content": "¿A las 10am está bien?",
  "senderAccountId": "uuid-juan",
  "type": "TEXT",
  "isRead": false,
  "createdAt": "2026-06-25T10:06:00.000Z"
}
```

- La otra parte recibe notificación `NEW_MESSAGE`

**Paso 4: Implementación en frontend**
```javascript
// Cargar mensajes iniciales
const response = await fetch(
  'http://localhost:3000/api/chat/conversations/conv-123/messages?page=1&pageSize=30',
  { headers: { 'Authorization': `Bearer ${token}` } }
);
const messages = await response.json();

// Polling cada 3 segundos para nuevos mensajes
setInterval(async () => {
  const response = await fetch(
    'http://localhost:3000/api/chat/conversations/conv-123/messages?page=1&pageSize=30',
    { headers: { 'Authorization': `Bearer ${token}` } }
  );
  const newMessages = await response.json();
  // Comparar con mensajes previos y agregar nuevos
}, 3000);

// Enviar mensaje
const sendMessage = async (content) => {
  const response = await fetch(
    'http://localhost:3000/api/chat/conversations/conv-123/messages',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content, type: 'TEXT' })
    }
  );
  return response.json();
};
```

---

### 🔔 Sistema de notificaciones

**Paso 1: Al cargar la app**
```
GET /notifications/unread-count

Respuesta: { "count": 3 }
```

→ Mostrar badge "3" en el ícono de notificaciones

**Paso 2: Abrir panel de notificaciones**
```
GET /notifications

Respuesta: [
  {
    "id": "notif-1",
    "type": "QUOTE_RECEIVED",
    "title": "Nuevo presupuesto recibido",
    "body": "Carlos Rodríguez envió un presupuesto para \"Reparación de pérdida\"",
    "data": "{\"quoteRequestId\": \"quote-req-123\", \"offerId\": \"offer-456\"}",
    "isRead": false,
    "createdAt": "2026-06-25T12:30:00.000Z"
  },
  {
    "id": "notif-2",
    "type": "JOB_REQUEST",
    "title": "Nuevo trabajo solicitado",
    "body": "Juan García te contrató para \"Reparación de pérdida de agua\"",
    "data": "{\"jobId\": \"job-789\"}",
    "isRead": false,
    "createdAt": "2026-06-25T13:00:00.000Z"
  },
  {
    "id": "notif-3",
    "type": "NEW_MESSAGE",
    "title": "Nuevo mensaje",
    "body": "Carlos Rodríguez: \"¿Todavía necesitas el servicio?\"",
    "data": "{\"conversationId\": \"conv-123\"}",
    "isRead": true,
    "createdAt": "2026-06-25T13:15:00.000Z"
  }
]
```

**Paso 3: Click en una notificación**
```javascript
const handleNotificationClick = (notification) => {
  const data = JSON.parse(notification.data);

  // Marcar como leída
  fetch(`http://localhost:3000/api/notifications/${notification.id}/read`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  // Navegar al recurso correspondiente
  switch (notification.type) {
    case 'QUOTE_RECEIVED':
      navigate(`/quotes/${data.quoteRequestId}`);
      break;
    case 'JOB_REQUEST':
      navigate(`/jobs/${data.jobId}`);
      break;
    case 'NEW_MESSAGE':
      navigate(`/chat/${data.conversationId}`);
      break;
    case 'APPOINTMENT_SCHEDULED':
      navigate(`/appointments/${data.appointmentId}`);
      break;
    // ... más tipos
  }
};
```

**Paso 4: Polling**
```javascript
// Cada 10-30 segundos, verificar nuevas notificaciones
setInterval(async () => {
  const response = await fetch(
    'http://localhost:3000/api/notifications/unread-count',
    { headers: { 'Authorization': `Bearer ${token}` } }
  );
  const { count } = await response.json();
  updateBadgeCount(count);
}, 15000);
```

---

### ⭐ Plan Premium (profesional)

**Paso 1: Ver planes disponibles**
```
GET /subscriptions/plans

Respuesta: [
  {
    "id": "plan-free",
    "name": "Gratis",
    "description": "Hasta 20 contactos por mes",
    "price": 0,
    "maxContactsPerMonth": 20,
    "isFeatured": false,
    "hasAdvancedStats": false
  },
  {
    "id": "plan-premium",
    "name": "Premium",
    "description": "Contactos ilimitados, aparece destacado, estadísticas avanzadas",
    "price": 590,
    "maxContactsPerMonth": null,
    "isFeatured": true,
    "hasAdvancedStats": true
  }
]
```

**Paso 2: Profesional selecciona Premium**
- Hace click en botón "Upgrade a Premium"
- Ve los beneficios:
  - ✅ Aparecer destacado en búsquedas
  - ✅ Contactos ilimitados (sin límite de 20/mes)
  - ✅ Estadísticas avanzadas (conversión de presupuestos, etc.)
  - ✅ Prioridad en categorías populares

**Paso 3: Crear pago**
```json
POST /payments {
  "amount": 590,
  "method": "MERCADO_PAGO",
  "subscriptionId": null  // aún no hay suscripción
}

Respuesta: {
  "id": "payment-123",
  "amount": 590,
  "status": "PENDING",
  "method": "MERCADO_PAGO",
  "mercadopagoLink": "https://mpago.to/..."  // URL de pasarela
}
```

**Paso 4: Redirigir a pasarela**
```javascript
// Frontend redirige a Mercado Pago
window.location.href = paymentResponse.mercadopagoLink;
```

**Paso 5: Mercado Pago confirma pago**
- Usuario completa pago en Mercado Pago
- Mercado Pago retorna al sitio con parámetro: `?payment_id=123`

**Paso 6: Backend recibe webhook**
```
Mercado Pago envía webhook a: POST /payments/webhook
Backend actualiza: payment.status = "COMPLETED"
```

**Paso 7: Profesional se suscribe**
```json
POST /subscriptions/subscribe {
  "planId": "plan-premium"
}

Respuesta: {
  "id": "sub-123",
  "professionalId": "uuid-carlos",
  "planId": "plan-premium",
  "status": "ACTIVE",
  "startDate": "2026-06-25T14:00:00.000Z",
  "endDate": "2026-07-25T14:00:00.000Z"
}
```

**Paso 8: Verificar suscripción activa**
```
GET /subscriptions/my

Respuesta:
{
  "id": "sub-123",
  "status": "ACTIVE",
  "plan": { "name": "Premium", "price": 590, ... }
  "endDate": "2026-07-25T14:00:00.000Z"
}
```

**Paso 9: Ver estadísticas avanzadas**
```
GET /stats

Respuesta:
{
  "profileViews": 142,
  "contactCount": 37,
  "rating": 4.8,
  "reviewCount": 18,
  "jobs": { "total": 34, "byStatus": {...} },
  "quoteOffers": {
    "total": 15,
    "accepted": 9,
    "conversionRate": 60  // Porcentaje de ofertas aceptadas
  },
  "subscription": {
    "plan": "Premium",
    "endDate": "2026-07-25T14:00:00.000Z"
  }
}
```

**Paso 10: Cancelar suscripción**
```
DELETE /subscriptions/cancel

Respuesta: { "success": true }
```

- Suscripción pasa a CANCELED
- Profesional vuelve a plan Gratis al expirar

---

### 📊 Dashboard del profesional

**Componentes principales:**

```
┌──────────────────────────────────────────────────┐
│ Dashboard del Profesional                        │
└──────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 📈 MÉTRICAS (GET /stats)                             │
├─────────────────────────────────────────────────────────┤
│ Vistas del perfil: 142    |  Rating: ⭐ 4.8 / 5       │
│ Contactos este mes: 37    |  Trabajos completados: 34 │
│ Tasa de aceptación: 60%   |  Ingresos este mes: $2345 │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 🔧 TRABAJOS ACTIVOS (GET /jobs/my)                    │
├─────────────────────────────────────────────────────────┤
│ [PENDING] Reparación pérdida - Juan García            │
│           Presupuesto: $1500 | Mañana 10am            │
│           [ACEPTAR] [RECHAZAR]                        │
│                                                       │
│ [IN_PROGRESS] Cambio de calefactor - Sofía Pérez     │
│               Presupuesto: $3200 | 60% completado    │
│               [MARCAR COMPLETADO] [CHAT]             │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 📋 PRESUPUESTOS ENVIADOS (últimas)                     │
├─────────────────────────────────────────────────────────┤
│ ✅ ACEPTADO: "Destape cañería" - $1800               │
│ ⏳ PENDIENTE: "Reparar calefactor" - $2500           │
│ ❌ RECHAZADO: "Pintura" - $1200                      │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 📅 CITAS PRÓXIMAS (GET /appointments/my)              │
├─────────────────────────────────────────────────────────┤
│ ⏰ 26/06 10:00 - Reparación Destape (Pocitos)         │
│ ⏰ 27/06 14:30 - Inspección (Centro)                  │
│ ⏰ 28/06 09:00 - Mantenimiento (Malvín)              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 💬 MENSAJES NO LEÍDOS (GET /chat/unread-count)        │
├─────────────────────────────────────────────────────────┤
│ Juan García: "¿Todavía necesitas el servicio?"        │
│ Sofía Pérez: "¿A qué hora llegas mañana?"            │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 🔔 NOTIFICACIONES (GET /notifications/unread-count)   │
├─────────────────────────────────────────────────────────┤
│ 3 notificaciones no leídas                             │
└─────────────────────────────────────────────────────────┘
```

---

### 📊 Dashboard del cliente

```
┌──────────────────────────────────────────────────────┐
│ Dashboard del Cliente                               │
└──────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 🎯 MIS TRABAJOS (GET /jobs/my)                       │
├─────────────────────────────────────────────────────────┤
│ [PENDING] Carlos Rodríguez - $1500 | Mañana 10am     │
│ [COMPLETED] ⭐ Juan Plomero - $2200 | Hace 5 días   │
│            [DEJAR RESEÑA]                            │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 📋 MIS SOLICITUDES (GET /quote-requests/my)           │
├─────────────────────────────────────────────────────────┤
│ [OPEN] "Reparar pérdida de agua"                    │
│        3 presupuestos recibidos                       │
│        - Carlos: $1800 ⭐ 4.8                        │
│        - Juan: $2200 ⭐ 4.5                         │
│        - Roberto: $1500 ⭐ 3.2                      │
│        [VER DETALLES]                                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 📅 MIS CITAS (GET /appointments/my)                  │
├─────────────────────────────────────────────────────────┤
│ ⏳ 26/06 10:00 - Carlos Rodríguez (Pendiente confirmar)│
│ ✅ 27/06 14:30 - Sofía Pérez (Confirmada)            │
│ 📍 Pocitos, Av. Brasil 2145                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 💬 MENSAJES (GET /chat/conversations)                 │
├─────────────────────────────────────────────────────────┤
│ 🔵 Carlos Rodríguez: "Listo para mañana!"             │
│ 🟢 Sofía Pérez: "Confirmo, llego a las 14:30"       │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 🔔 NOTIFICACIONES (GET /notifications)                │
├─────────────────────────────────────────────────────────┤
│ 5 notificaciones no leídas                             │
└─────────────────────────────────────────────────────────┘
```


