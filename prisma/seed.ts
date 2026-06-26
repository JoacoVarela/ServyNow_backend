import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// ─── IDs fijos para poder referenciarlos desde el playground ───────────────

const IDS = {
  // Plans
  PLAN_FREE:    '55555555-0000-0000-0000-000000000001',
  PLAN_PREMIUM: '55555555-0000-0000-0000-000000000002',

  // Categories
  CAT_PLOMERIA:      '11111111-0000-0000-0000-000000000001',
  CAT_ELECTRICIDAD:  '11111111-0000-0000-0000-000000000002',
  CAT_CARPINTERIA:   '11111111-0000-0000-0000-000000000003',
  CAT_PINTURA:       '11111111-0000-0000-0000-000000000004',
  CAT_ALBANILERIA:   '11111111-0000-0000-0000-000000000005',
  CAT_JARDINERIA:    '11111111-0000-0000-0000-000000000006',
  CAT_LIMPIEZA:      '11111111-0000-0000-0000-000000000007',
  CAT_MUDANZAS:      '11111111-0000-0000-0000-000000000008',

  // Accounts
  ACC_ADMIN:         '22222222-0000-0000-0000-000000000001',
  ACC_CLIENT1:       '22222222-0000-0000-0000-000000000002',
  ACC_CLIENT2:       '22222222-0000-0000-0000-000000000003',
  ACC_PLOMERO:       '22222222-0000-0000-0000-000000000004',
  ACC_ELECTRICISTA:  '22222222-0000-0000-0000-000000000005',
  ACC_CARPINTERO:    '22222222-0000-0000-0000-000000000006',
  ACC_PINTOR:        '22222222-0000-0000-0000-000000000007',
  ACC_ALBANIL:       '22222222-0000-0000-0000-000000000008',

  // User profiles
  USR_CLIENT1: '33333333-0000-0000-0000-000000000001',
  USR_CLIENT2: '33333333-0000-0000-0000-000000000002',

  // Professional profiles
  PRO_PLOMERO:      '44444444-0000-0000-0000-000000000001',
  PRO_ELECTRICISTA: '44444444-0000-0000-0000-000000000002',
  PRO_CARPINTERO:   '44444444-0000-0000-0000-000000000003',
  PRO_PINTOR:       '44444444-0000-0000-0000-000000000004',
  PRO_ALBANIL:      '44444444-0000-0000-0000-000000000005',

  // Jobs
  JOB_1: '66666666-0000-0000-0000-000000000001',
  JOB_2: '66666666-0000-0000-0000-000000000002',
  JOB_3: '66666666-0000-0000-0000-000000000003',
  JOB_4: '66666666-0000-0000-0000-000000000004',

  // Reviews
  REV_1: '88888888-0000-0000-0000-000000000001',
  REV_2: '88888888-0000-0000-0000-000000000002',

  // Quote requests
  QR_1: '77777777-0000-0000-0000-000000000001',
  QR_2: '77777777-0000-0000-0000-000000000002',

  // Quote offers
  QO_1: 'aaaaaaaa-0000-0000-0000-000000000001',
  QO_2: 'aaaaaaaa-0000-0000-0000-000000000002',

  // Appointments
  APT_1: 'bbbbbbbb-0000-0000-0000-000000000001',
  APT_2: 'bbbbbbbb-0000-0000-0000-000000000002',

  // Conversations
  CONV_1: 'cccccccc-0000-0000-0000-000000000001',
  CONV_2: 'cccccccc-0000-0000-0000-000000000002',

  // Subscriptions
  SUB_1: 'dddddddd-0000-0000-0000-000000000001',
};

async function main() {
  const PWD_CLIENTS = await bcrypt.hash('test1234', 10);
  const PWD_PROS    = await bcrypt.hash('test1234', 10);
  const PWD_ADMIN   = await bcrypt.hash('admin1234', 10);

  console.log('🌱 Seeding ServyNow database...');

  // ── 1. PLANS ─────────────────────────────────────────────────────────────
  console.log('  → Plans...');
  await prisma.subscription_plan.upsert({
    where: { id: IDS.PLAN_FREE },
    update: {},
    create: {
      id: IDS.PLAN_FREE,
      name: 'Gratis',
      description: 'Hasta 20 contactos por mes. Perfil básico.',
      price: 0,
      maxContactsPerMonth: 20,
      isFeatured: false,
      hasAdvancedStats: false,
    },
  });
  await prisma.subscription_plan.upsert({
    where: { id: IDS.PLAN_PREMIUM },
    update: {},
    create: {
      id: IDS.PLAN_PREMIUM,
      name: 'Premium',
      description: 'Contactos ilimitados, aparece primero en búsquedas, estadísticas avanzadas.',
      price: 590,
      maxContactsPerMonth: null,
      isFeatured: true,
      hasAdvancedStats: true,
    },
  });

  // ── 2. CATEGORIES ────────────────────────────────────────────────────────
  console.log('  → Categories...');
  const categories = [
    { id: IDS.CAT_PLOMERIA,     name: 'Plomería',     slug: 'plomeria' },
    { id: IDS.CAT_ELECTRICIDAD, name: 'Electricidad',  slug: 'electricidad' },
    { id: IDS.CAT_CARPINTERIA,  name: 'Carpintería',   slug: 'carpinteria' },
    { id: IDS.CAT_PINTURA,      name: 'Pintura',       slug: 'pintura' },
    { id: IDS.CAT_ALBANILERIA,  name: 'Albañilería',   slug: 'albanileria' },
    { id: IDS.CAT_JARDINERIA,   name: 'Jardinería',    slug: 'jardineria' },
    { id: IDS.CAT_LIMPIEZA,     name: 'Limpieza',      slug: 'limpieza' },
    { id: IDS.CAT_MUDANZAS,     name: 'Mudanzas',      slug: 'mudanzas' },
  ];
  for (const cat of categories) {
    await prisma.category.upsert({ where: { id: cat.id }, update: {}, create: cat });
  }

  // ── 3. ACCOUNTS ──────────────────────────────────────────────────────────
  console.log('  → Accounts...');
  const accounts = [
    { id: IDS.ACC_ADMIN,        email: 'admin@servynow.com',    password: PWD_ADMIN, role: 'ADMIN' as any },
    { id: IDS.ACC_CLIENT1,      email: 'juan@test.com',         password: PWD_CLIENTS, role: 'USER' as any },
    { id: IDS.ACC_CLIENT2,      email: 'sofia@test.com',        password: PWD_CLIENTS, role: 'USER' as any },
    { id: IDS.ACC_PLOMERO,      email: 'carlos.plomero@test.com', password: PWD_PROS, role: 'PROFESSIONAL' as any },
    { id: IDS.ACC_ELECTRICISTA, email: 'ana.electrica@test.com',  password: PWD_PROS, role: 'PROFESSIONAL' as any },
    { id: IDS.ACC_CARPINTERO,   email: 'pablo.carpintero@test.com', password: PWD_PROS, role: 'PROFESSIONAL' as any },
    { id: IDS.ACC_PINTOR,       email: 'maria.pintora@test.com',   password: PWD_PROS, role: 'PROFESSIONAL' as any },
    { id: IDS.ACC_ALBANIL,      email: 'roberto.albanil@test.com', password: PWD_PROS, role: 'PROFESSIONAL' as any },
  ];
  for (const acc of accounts) {
    await prisma.account.upsert({ where: { id: acc.id }, update: {}, create: acc as any });
  }

  // ── 4. USER PROFILES (clients) ───────────────────────────────────────────
  console.log('  → User profiles...');
  await prisma.user.upsert({
    where: { id: IDS.USR_CLIENT1 },
    update: {},
    create: {
      id: IDS.USR_CLIENT1,
      firstName: 'Juan',
      lastName: 'García',
      phoneNumber: '+598 91 234 567',
      address: 'Av. Brasil 2145, Pocitos, Montevideo',
      account_id: IDS.ACC_CLIENT1,
      slug: 'juan-garcia',
    },
  });
  await prisma.user.upsert({
    where: { id: IDS.USR_CLIENT2 },
    update: {},
    create: {
      id: IDS.USR_CLIENT2,
      firstName: 'Sofía',
      lastName: 'Martínez',
      phoneNumber: '+598 98 765 432',
      address: 'Bulevar Artigas 1234, Punta Carretas, Montevideo',
      account_id: IDS.ACC_CLIENT2,
      slug: 'sofia-martinez',
    },
  });

  // ── 5. PROFESSIONAL PROFILES ─────────────────────────────────────────────
  console.log('  → Professional profiles...');
  const professionals = [
    {
      id: IDS.PRO_PLOMERO,
      firstName: 'Carlos', lastName: 'Rodríguez',
      bio: 'Plomero con más de 10 años de experiencia en Montevideo. Especializado en reparaciones de emergencia, instalaciones y destapes. Trabajo garantizado.',
      city: 'Montevideo', zone: 'Pocitos y alrededores',
      phoneNumber: '+598 99 111 222',
      rating: 4.8, minPrice: 500, maxPrice: 3000, yearsExperience: 10,
      availability: 'AVAILABLE' as any, status: 'ACTIVE' as any,
      verificationStatus: 'VERIFIED' as any,
      slug: 'carlos-rodriguez',
      account_id: IDS.ACC_PLOMERO,
      profileViews: 312, contactCount: 47,
      categoryId: IDS.CAT_PLOMERIA,
    },
    {
      id: IDS.PRO_ELECTRICISTA,
      firstName: 'Ana', lastName: 'Martínez',
      bio: 'Electricista matriculada con habilitación UTE. Instalaciones residenciales y comerciales, corrección de fallas, tableros eléctricos.',
      city: 'Montevideo', zone: 'Centro y Cordón',
      phoneNumber: '+598 98 222 333',
      rating: 4.9, minPrice: 800, maxPrice: 5000, yearsExperience: 8,
      availability: 'AVAILABLE' as any, status: 'ACTIVE' as any,
      verificationStatus: 'VERIFIED' as any,
      slug: 'ana-martinez',
      account_id: IDS.ACC_ELECTRICISTA,
      profileViews: 228, contactCount: 31,
      categoryId: IDS.CAT_ELECTRICIDAD,
    },
    {
      id: IDS.PRO_CARPINTERO,
      firstName: 'Pablo', lastName: 'González',
      bio: 'Carpintero y ebanista. Muebles a medida, restauración, arreglos de puertas y ventanas. Materiales de primera calidad.',
      city: 'Montevideo', zone: 'Malvín y Buceo',
      phoneNumber: '+598 92 333 444',
      rating: 4.6, minPrice: 600, maxPrice: 8000, yearsExperience: 15,
      availability: 'BUSY' as any, status: 'ACTIVE' as any,
      verificationStatus: 'VERIFIED' as any,
      slug: 'pablo-gonzalez',
      account_id: IDS.ACC_CARPINTERO,
      profileViews: 185, contactCount: 22,
      categoryId: IDS.CAT_CARPINTERIA,
    },
    {
      id: IDS.PRO_PINTOR,
      firstName: 'María', lastName: 'López',
      bio: 'Pintora profesional. Interiores y exteriores, texturas, papel mural. Trabajos prolijos y en tiempo acordado.',
      city: 'Montevideo', zone: 'Punta Carretas y Parque Batlle',
      phoneNumber: '+598 97 444 555',
      rating: 4.7, minPrice: 400, maxPrice: 4000, yearsExperience: 6,
      availability: 'AVAILABLE' as any, status: 'ACTIVE' as any,
      verificationStatus: 'PENDING' as any,
      slug: 'maria-lopez',
      account_id: IDS.ACC_PINTOR,
      profileViews: 143, contactCount: 18,
      categoryId: IDS.CAT_PINTURA,
    },
    {
      id: IDS.PRO_ALBANIL,
      firstName: 'Roberto', lastName: 'Fernández',
      bio: 'Albañil con 20 años de experiencia. Construcción, reformas, impermeabilizaciones, reparación de azoteas.',
      city: 'Montevideo', zone: 'Toda la ciudad',
      phoneNumber: '+598 96 555 666',
      rating: 4.5, minPrice: 700, maxPrice: 10000, yearsExperience: 20,
      availability: 'AVAILABLE' as any, status: 'ACTIVE' as any,
      verificationStatus: 'VERIFIED' as any,
      slug: 'roberto-fernandez',
      account_id: IDS.ACC_ALBANIL,
      profileViews: 267, contactCount: 38,
      categoryId: IDS.CAT_ALBANILERIA,
    },
  ];

  for (const pro of professionals) {
    const { categoryId, ...proData } = pro;
    await prisma.professional.upsert({
      where: { id: pro.id },
      update: {},
      create: proData,
    });
    await prisma.professional_category.upsert({
      where: { professionalId_categoryId: { professionalId: pro.id, categoryId } },
      update: {},
      create: { professionalId: pro.id, categoryId },
    });
  }

  // ── 6. PROFESSIONAL SERVICES ─────────────────────────────────────────────
  console.log('  → Professional services...');
  const services = [
    { id: 'srv-001', professionalId: IDS.PRO_PLOMERO, name: 'Destape de cañerías', price: 800, durationMinutes: 60 },
    { id: 'srv-002', professionalId: IDS.PRO_PLOMERO, name: 'Reparación de pérdidas', price: 600, durationMinutes: 90 },
    { id: 'srv-003', professionalId: IDS.PRO_PLOMERO, name: 'Instalación de grifería', price: 1200, durationMinutes: 120 },
    { id: 'srv-004', professionalId: IDS.PRO_ELECTRICISTA, name: 'Instalación de puntos de luz', price: 900, durationMinutes: 90 },
    { id: 'srv-005', professionalId: IDS.PRO_ELECTRICISTA, name: 'Corrección de tablero', price: 1500, durationMinutes: 180 },
    { id: 'srv-006', professionalId: IDS.PRO_CARPINTERO, name: 'Mueble de cocina a medida', price: 15000, durationMinutes: null as any },
    { id: 'srv-007', professionalId: IDS.PRO_PINTOR, name: 'Pintura de habitación (hasta 12m²)', price: 1800, durationMinutes: 480 },
    { id: 'srv-008', professionalId: IDS.PRO_ALBANIL, name: 'Impermeabilización de azotea', price: 5000, durationMinutes: null as any },
  ];
  for (const s of services) {
    await prisma.professional_service.upsert({ where: { id: s.id }, update: {}, create: s });
  }

  // ── 7. PROFESSIONAL SCHEDULE ─────────────────────────────────────────────
  console.log('  → Schedules...');
  const workDays = [1, 2, 3, 4, 5]; // Lunes a Viernes
  const scheduleProfs = [IDS.PRO_PLOMERO, IDS.PRO_ELECTRICISTA, IDS.PRO_PINTOR, IDS.PRO_ALBANIL];
  for (let pi = 0; pi < scheduleProfs.length; pi++) {
    const proId = scheduleProfs[pi];
    for (const day of workDays) {
      const id = `sch-p${pi + 1}-d${day}`;
      await prisma.professional_schedule.upsert({
        where: { professionalId_dayOfWeek: { professionalId: proId, dayOfWeek: day } },
        update: {},
        create: { id, professionalId: proId, dayOfWeek: day, startTime: '09:00', endTime: '18:00', isAvailable: true },
      });
    }
    // Sábado media jornada
    await prisma.professional_schedule.upsert({
      where: { professionalId_dayOfWeek: { professionalId: proId, dayOfWeek: 6 } },
      update: {},
      create: { id: `sch-p${pi + 1}-d6`, professionalId: proId, dayOfWeek: 6, startTime: '09:00', endTime: '13:00', isAvailable: true },
    });
  }

  // ── 8. CERTIFICATIONS ────────────────────────────────────────────────────
  console.log('  → Certifications...');
  await prisma.professional_certification.upsert({
    where: { id: 'cert-001' },
    update: {},
    create: { id: 'cert-001', professionalId: IDS.PRO_ELECTRICISTA, title: 'Instalador Electricista Matriculado', issuer: 'UTE Uruguay', issuedAt: new Date('2018-06-01'), expiresAt: new Date('2028-06-01') },
  });
  await prisma.professional_certification.upsert({
    where: { id: 'cert-002' },
    update: {},
    create: { id: 'cert-002', professionalId: IDS.PRO_PLOMERO, title: 'Plomero Sanitario Certificado', issuer: 'OSE Uruguay', issuedAt: new Date('2016-03-15') },
  });

  // ── 9. JOBS ──────────────────────────────────────────────────────────────
  console.log('  → Jobs...');
  await prisma.service_job.upsert({
    where: { id: IDS.JOB_1 },
    update: {},
    create: {
      id: IDS.JOB_1,
      clientAccountId: IDS.ACC_CLIENT1,
      professionalId: IDS.PRO_PLOMERO,
      title: 'Reparación pérdida de agua en baño',
      description: 'Tenía una pérdida importante bajo el lavabo. Carlos la resolvió en una hora.',
      address: 'Av. Brasil 2145, Pocitos',
      budget: 800,
      status: 'COMPLETED',
      completedAt: new Date('2026-06-10T14:00:00.000Z'),
    },
  });
  await prisma.service_job.upsert({
    where: { id: IDS.JOB_2 },
    update: {},
    create: {
      id: IDS.JOB_2,
      clientAccountId: IDS.ACC_CLIENT1,
      professionalId: IDS.PRO_ELECTRICISTA,
      title: 'Instalación 3 puntos de luz en cocina',
      description: 'Necesito agregar iluminación en la cocina, actualmente solo hay un punto.',
      address: 'Av. Brasil 2145, Pocitos',
      budget: 2500,
      status: 'ACCEPTED',
      scheduledAt: new Date('2026-06-28T10:00:00.000Z'),
    },
  });
  await prisma.service_job.upsert({
    where: { id: IDS.JOB_3 },
    update: {},
    create: {
      id: IDS.JOB_3,
      clientAccountId: IDS.ACC_CLIENT2,
      professionalId: IDS.PRO_CARPINTERO,
      title: 'Mueble a medida para living',
      description: 'Mueble rack para TV con estantes laterales, madera de pino.',
      address: 'Bulevar Artigas 1234, Punta Carretas',
      budget: 12000,
      status: 'IN_PROGRESS',
    },
  });
  await prisma.service_job.upsert({
    where: { id: IDS.JOB_4 },
    update: {},
    create: {
      id: IDS.JOB_4,
      clientAccountId: IDS.ACC_CLIENT2,
      professionalId: IDS.PRO_PINTOR,
      title: 'Pintura de dormitorio principal',
      description: 'Dormitorio de 14m², color gris perla en paredes y blanco en cielorraso.',
      address: 'Bulevar Artigas 1234, Punta Carretas',
      budget: 3500,
      status: 'PENDING',
      scheduledAt: new Date('2026-07-03T09:00:00.000Z'),
    },
  });

  // ── 10. REVIEWS ─────────────────────────────────────────────────────────
  console.log('  → Reviews...');
  await prisma.review.upsert({
    where: { id: IDS.REV_1 },
    update: {},
    create: {
      id: IDS.REV_1,
      professionalId: IDS.PRO_PLOMERO,
      reviewerAccountId: IDS.ACC_CLIENT1,
      serviceJobId: IDS.JOB_1,
      reviewerName: 'Juan García',
      rating: 5,
      comment: 'Excelente profesional. Llegó a tiempo, identificó el problema rápido y lo resolvió por el precio acordado. 100% recomendable.',
      status: 'VISIBLE',
    },
  });
  await prisma.review.upsert({
    where: { id: IDS.REV_2 },
    update: {},
    create: {
      id: IDS.REV_2,
      professionalId: IDS.PRO_PLOMERO,
      reviewerAccountId: IDS.ACC_CLIENT2,
      serviceJobId: null,
      reviewerName: 'Sofía Martínez',
      rating: 4,
      comment: 'Buen trabajo, tardó un poco más de lo previsto pero el resultado fue muy bueno.',
      status: 'VISIBLE',
    },
  });

  // Actualizar rating del plomero
  await prisma.professional.update({
    where: { id: IDS.PRO_PLOMERO },
    data: { rating: 4.8 },
  });

  // ── 11. QUOTE REQUESTS ──────────────────────────────────────────────────
  console.log('  → Quote requests...');
  await prisma.quote_request.upsert({
    where: { id: IDS.QR_1 },
    update: {},
    create: {
      id: IDS.QR_1,
      clientAccountId: IDS.ACC_CLIENT2,
      categoryId: IDS.CAT_PLOMERIA,
      title: 'Pérdida de agua en la azotea',
      description: 'Tengo una pérdida en la azotea que está mojando el cielorraso del baño. Necesito presupuesto urgente.',
      city: 'Montevideo',
      budget: 5000,
      status: 'OPEN',
      expiresAt: new Date('2026-07-10T23:59:59.000Z'),
    },
  });
  await prisma.quote_request.upsert({
    where: { id: IDS.QR_2 },
    update: {},
    create: {
      id: IDS.QR_2,
      clientAccountId: IDS.ACC_CLIENT1,
      categoryId: IDS.CAT_ALBANILERIA,
      title: 'Reforma de baño completo',
      description: 'Quiero reformar el baño principal: cambio de azulejos, ducha nueva, vanitory. Piso de 4m².',
      city: 'Montevideo',
      budget: 80000,
      status: 'OPEN',
    },
  });
  await prisma.quote_offer.upsert({
    where: { id: IDS.QO_1 },
    update: {},
    create: {
      id: IDS.QO_1,
      quoteRequestId: IDS.QR_1,
      professionalId: IDS.PRO_PLOMERO,
      price: 3500,
      description: 'Puedo revisar el problema esta semana. El precio incluye materiales básicos y mano de obra. Trabajo garantizado.',
      estimatedDays: 1,
      status: 'PENDING',
    },
  });
  await prisma.quote_offer.upsert({
    where: { id: IDS.QO_2 },
    update: {},
    create: {
      id: IDS.QO_2,
      quoteRequestId: IDS.QR_2,
      professionalId: IDS.PRO_ALBANIL,
      price: 75000,
      description: 'Tengo experiencia en reformas de baños. El precio incluye demolición, materiales y mano de obra. Plazo 7 días.',
      estimatedDays: 7,
      status: 'PENDING',
    },
  });

  // ── 12. APPOINTMENTS ────────────────────────────────────────────────────
  console.log('  → Appointments...');
  await prisma.appointment.upsert({
    where: { id: IDS.APT_1 },
    update: {},
    create: {
      id: IDS.APT_1,
      clientAccountId: IDS.ACC_CLIENT1,
      professionalId: IDS.PRO_ELECTRICISTA,
      scheduledAt: new Date('2026-06-28T10:00:00.000Z'),
      durationMinutes: 120,
      address: 'Av. Brasil 2145, Pocitos',
      notes: 'El portón del edificio no funciona, avisar por WhatsApp al llegar.',
      status: 'CONFIRMED',
    },
  });
  await prisma.appointment.upsert({
    where: { id: IDS.APT_2 },
    update: {},
    create: {
      id: IDS.APT_2,
      clientAccountId: IDS.ACC_CLIENT2,
      professionalId: IDS.PRO_PINTOR,
      scheduledAt: new Date('2026-07-05T09:00:00.000Z'),
      durationMinutes: 480,
      address: 'Bulevar Artigas 1234, Punta Carretas',
      status: 'PENDING',
    },
  });

  // ── 13. CHAT ────────────────────────────────────────────────────────────
  console.log('  → Chat conversations...');
  await prisma.chat_conversation.upsert({
    where: { id: IDS.CONV_1 },
    update: {},
    create: { id: IDS.CONV_1, clientAccountId: IDS.ACC_CLIENT1, professionalAccountId: IDS.ACC_PLOMERO },
  });
  await prisma.chat_conversation.upsert({
    where: { id: IDS.CONV_2 },
    update: {},
    create: { id: IDS.CONV_2, clientAccountId: IDS.ACC_CLIENT1, professionalAccountId: IDS.ACC_ELECTRICISTA },
  });

  const messages = [
    { id: 'msg-001', conversationId: IDS.CONV_1, senderAccountId: IDS.ACC_CLIENT1, content: 'Hola Carlos, necesito que me veas una pérdida de agua urgente.' },
    { id: 'msg-002', conversationId: IDS.CONV_1, senderAccountId: IDS.ACC_PLOMERO, content: '¡Hola Juan! Claro, ¿qué día te viene bien?' },
    { id: 'msg-003', conversationId: IDS.CONV_1, senderAccountId: IDS.ACC_CLIENT1, content: 'Mañana a las 10am si podés.' },
    { id: 'msg-004', conversationId: IDS.CONV_1, senderAccountId: IDS.ACC_PLOMERO, content: 'Perfecto, ahí estaré. Dame la dirección por favor.' },
    { id: 'msg-005', conversationId: IDS.CONV_2, senderAccountId: IDS.ACC_CLIENT1, content: 'Ana, ¿podés darme un presupuesto para 3 puntos de luz en la cocina?' },
    { id: 'msg-006', conversationId: IDS.CONV_2, senderAccountId: IDS.ACC_ELECTRICISTA, content: 'Hola Juan, con gusto. ¿Cuántos metros cuadrados tiene la cocina?' },
  ];
  for (const m of messages) {
    await prisma.chat_message.upsert({
      where: { id: m.id },
      update: {},
      create: { ...m, type: 'TEXT', isRead: true },
    });
  }

  // ── 14. NOTIFICATIONS ───────────────────────────────────────────────────
  console.log('  → Notifications...');
  const notifications = [
    { id: 'notif-001', accountId: IDS.ACC_CLIENT1, type: 'JOB_STATUS_UPDATE' as any, title: 'Trabajo aceptado', body: 'Ana Martínez aceptó tu trabajo "Instalación 3 puntos de luz en cocina"', data: JSON.stringify({ jobId: IDS.JOB_2 }), isRead: true },
    { id: 'notif-002', accountId: IDS.ACC_CLIENT2, type: 'QUOTE_RECEIVED' as any, title: 'Nuevo presupuesto', body: 'Carlos Rodríguez envió un presupuesto para "Pérdida de agua en la azotea"', data: JSON.stringify({ quoteRequestId: IDS.QR_1, offerId: IDS.QO_1 }), isRead: false },
    { id: 'notif-003', accountId: IDS.ACC_PLOMERO, type: 'REVIEW_RECEIVED' as any, title: 'Nueva reseña recibida', body: 'Juan García te dio 5 estrellas', data: JSON.stringify({ reviewId: IDS.REV_1 }), isRead: false },
    { id: 'notif-004', accountId: IDS.ACC_ELECTRICISTA, type: 'APPOINTMENT_SCHEDULED' as any, title: 'Cita confirmada', body: 'Tienes una cita el 28/06 a las 10:00', data: JSON.stringify({ appointmentId: IDS.APT_1 }), isRead: false },
  ];
  for (const n of notifications) {
    await prisma.notification.upsert({
      where: { id: n.id },
      update: {},
      create: n,
    });
  }

  // ── 15. SUBSCRIPTION ────────────────────────────────────────────────────
  console.log('  → Subscriptions...');
  await prisma.subscription.upsert({
    where: { id: IDS.SUB_1 },
    update: {},
    create: {
      id: IDS.SUB_1,
      professionalId: IDS.PRO_PLOMERO,
      planId: IDS.PLAN_PREMIUM,
      status: 'ACTIVE',
      startDate: new Date('2026-06-01T00:00:00.000Z'),
      endDate: new Date('2026-07-01T00:00:00.000Z'),
    },
  });

  console.log('\n✅ Seed completado exitosamente!\n');
  console.log('════════════════════════════════════════════════════════');
  console.log('  USUARIOS DE PRUEBA (contraseña: test1234)');
  console.log('════════════════════════════════════════════════════════');
  console.log('  ADMIN:          admin@servynow.com     / admin1234');
  console.log('  CLIENTE 1:      juan@test.com          / test1234');
  console.log('  CLIENTE 2:      sofia@test.com         / test1234');
  console.log('  PLOMERO:        carlos.plomero@test.com / test1234');
  console.log('  ELECTRICISTA:   ana.electrica@test.com  / test1234');
  console.log('  CARPINTERO:     pablo.carpintero@test.com / test1234');
  console.log('  PINTORA:        maria.pintora@test.com   / test1234');
  console.log('  ALBAÑIL:        roberto.albanil@test.com / test1234');
  console.log('════════════════════════════════════════════════════════');
  console.log('  UI de testing: http://localhost:3000/ui/playground.html');
  console.log('════════════════════════════════════════════════════════\n');
}

main()
  .catch((e) => { console.error('❌ Seed error:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
