# DriveBy – Guía de Producción y Demo

Esta guía resume cómo funciona la app, qué falta para estar lista para un demo/cliente, y los pasos concretos para levantar todo con Vercel y Neon (PostgreSQL).

## Resumen Rápido
- Stack: Next.js App Router (`src/app`), React 19, Tailwind v4, Prisma ORM, Neon (PostgreSQL) recomendado, despliegue en Vercel.
- Multi‑tenant por dominio/subdominio: mapeado mediante tabla `DomainMapping` (ver `prisma/schema.prisma: DomainMapping`). El código actual usa un stub en `src/lib/tenant.ts` (hardcode) para demo.
- Datos de demo: `prisma/seed.ts`, endpoint `src/app/api/setup-db/route.ts` y página `src/app/setup/page.tsx` para inicializar.
- Menú y vistas públicas: `src/app/menu`, `src/app/cart`, `src/app/orders`.
- Dashboard demo: `src/app/dashboard/*` (métricas simples con Prisma).
- Generación de QR: `scripts/generateQRCodes.ts` y salida en `public/qr/`.

## Arquitectura y Archivos Clave
- `src/server/db.ts`: instancia única de `PrismaClient`. En producción se reusa (evita instanciar múltiples clientes en dev).
- `prisma/schema.prisma`: modelos de negocio (Business, Theme, DomainMapping, Location, ParkingSpot, Category, Product, ModifierGroup/Option, Order y relaciones).
- `src/lib/tenant.ts`: detección de tenant por `host` (actualmente hardcodeado; ver TODO más abajo para hacerlo dinámico con DB).
- `src/app/...`:
  - `page.tsx`: landing + selección de negocio demo.
  - `menu/page.tsx`: consulta categorías/productos por `businessSlug` y pinta UI.
  - `cart/page.tsx`: carrito estático (pendiente conectar a estado/DB).
  - `orders/page.tsx`: lista estática (pendiente conectar a DB y estados).
  - `api/setup-db/route.ts`: inicializa datos mínimos en la DB.
  - `setup/page.tsx`: UI para correr el setup anterior.
- `scripts/`:
  - `check-db.js`: comprueba y crea datos demo básicos.
  - `seed-db.js`: genera cliente Prisma, `db push`, seed, QR.
  - `generateQRCodes.ts`: crea PNG + CSV con URLs para cada `ParkingSpot`.
  - `migrate-prod.js`: auxiliar para entorno prod.

## Modelado de Datos (resumen)
- Business: entidad principal; 1‑N Locations, Categories, Products, ModifierGroups, Orders; 1‑1 Theme; 1‑N DomainMappings.
- DomainMapping: dominio o subdominio → `businessId` (soporta multitenancy por host).
- Location: ubicación física; 1‑N `ParkingSpot` (cajones).
- ParkingSpot: identifica cajón (campo `qrSlug` único para códigos QR), 1‑N Orders.
- Category/Product: catálogo con precios, imágenes, relaciones a modificadores.
- Order/OrderItem/OrderItemModifier: carrito y elección de modificadores por producto.

## Estado Actual vs. Pendientes
Listo para demo (UI y consultas):
- Menú por negocio (`/menu`) y dashboard demo básico (KPIs y últimos pedidos).
- Seed de datos demo y generación de QR.

Pendientes mínimos para demo clickable de punta a punta:
1) Multitenancy real por dominio
   - Reemplazar stub en `src/lib/tenant.ts` para consultar `DomainMapping` por `host` y resolver `businessId` → `Business`/`Theme`/`Location`.
2) Ruta de escaneo QR
   - Implementar página `src/app/l/[locationId]/s/[qrSlug]/page.tsx` que:
     - Valida `ParkingSpot` por `locationId` + `qrSlug`.
     - Guarda en cookie/session el `parkingSpotId`/`businessId`.
     - Redirige a `/menu` con el contexto cargado.
   - Nota: el script de QR hoy genera URLs `http://localhost:3001/l/{locationId}/s/{qrSlug}`. Ajustar dominio/base URL según Vercel.
3) Carrito y orden real
   - Persistir carrito (cookie + fallback server actions o tabla temporal); crear `Order` + `OrderItem` + `OrderItemModifier`.
   - Reemplazar datos estáticos en `/cart` y `/orders`.
4) Autenticación para dashboard
   - Mínimo: admin per‑tenant con protección de rutas (`/dashboard/*`). Sencillo con passkey o NextAuth + credentials.
5) Protección y robustez
   - Validaciones de entrada, control de errores, límites de tasa en APIs públicas.

Pendientes para producción (post‑demo):
- Webhooks de pago (Stripe u OpenPay), facturación, estados de pedido en tiempo real (Pusher/Ably o polling).
- Backoffice CRUD completo para Menú/Categorías/Modificadores/Estacionamientos.
- Observabilidad: logs centralizados (Vercel Logs/Datadog/Sentry) e indicadores de salud DB.
- Multidominio Vercel con wildcard y mapeo en `DomainMapping`.

## Setup Local (Dev)
1) Dependencias
   - Node 18+.
   - `npm i`

2) Variables de entorno
   - Atención: el repo trae `.env`/`.env.local` con `DATABASE_URL="file:./dev.db"` pero el `provider` en `prisma/schema.prisma` es `postgresql`.
   - Para Postgres local: pon un URL válido (Neon/Local) en `DATABASE_URL`.
   - Si deseas SQLite en dev, cambia el `provider` de `prisma/schema.prisma` a `sqlite` (no recomendado si tu prod es Postgres).

3) Migraciones y seed
   - `npx prisma generate`
   - `npx prisma db push` (o `npx prisma migrate dev` si defines migraciones)
   - `npm run db:seed` (o abre `/setup` y presiona “Configurar Base de Datos”).

4) Correr app
   - `npm run dev` y abre `http://localhost:3000`.

## Setup Neon (PostgreSQL)
1) Crear proyecto en Neon
   - https://neon.tech → Nuevo proyecto → PostgreSQL 16/17.
   - Copia el connection string (ejemplo):
     `postgresql://USER:PASSWORD@ep-xxxx-xxxx.neon.tech/neondb?sslmode=require`

2) Pooling para serverless
   - Activa el connection pooling (ver pgbouncer) en Neon si usas funciones serverless.
   - Añade parámetros recomendados: `?sslmode=require&pgbouncer=true&connection_limit=1` (reducir conexiones por Lambda).

3) Variables en local
   - Exporta `DATABASE_URL` con tu URL de Neon y corre `prisma db push` + `npm run db:seed`.

## Setup Vercel
1) Variables de entorno
   - En Vercel → Project Settings → Environment Variables:
     - `DATABASE_URL` = URL de Neon (con `sslmode=require` y pooling si aplica).
     - Opcional: `ADMIN_DEMO_KEY` (ya definido en `vercel.json`, úsalo solo si lo integras).

2) Build/Runtime
   - Prisma funciona en Vercel con Postgres Neon. Recomendado:
     - Usar una sola instancia de Prisma client (ya aplicado en `src/server/db.ts`).
     - Considerar Prisma Accelerate o Neon pooling para cold starts y límite de conexiones.

3) Dominios y multitenancy
   - Agrega dominio raíz y subdominios (wildcard si quieres `*.drivebyapp.com`).
   - Inserta registros en `DomainMapping` con cada dominio que apunte al `businessId` correcto.
   - Implementa la consulta en `getTenantByHost` (ver snippet abajo).

4) Seed en producción
   - Despliega y visita `/setup` → “Configurar Base de Datos” o ejecuta `scripts/seed-db.js` dentro de un job/manual con `DATABASE_URL` configurado.

## Generación de Códigos QR
- Script: `scripts/generateQRCodes.ts`.
- Salida: `public/qr/<slug-negocio>/<id-ubicacion>/<codigo>.png` y `public/qr/qr_index.csv`.
- Ajusta la base URL en el script para producción (dominio Vercel) y/o implementa la ruta `l/[locationId]/s/[qrSlug]`.

## Mejora recomendada: Resolver Tenant por Dominio (DB)
Reemplazar `src/lib/tenant.ts` para leer de `DomainMapping` y `Theme`:

```ts
// src/lib/tenant.ts (idea)
import { headers } from 'next/headers';
import { prisma } from '@/server/db';

export async function getTenantByHost() {
  const h = await headers();
  const host = (h.get('host') || '').toLowerCase().replace(/:\d+$/, '');
  if (!host || host === 'localhost') return null; // admin landing

  const mapping = await prisma.domainMapping.findUnique({ where: { domain: host } });
  if (!mapping) return null;

  const business = await prisma.business.findUnique({ where: { id: mapping.businessId } });
  const theme = await prisma.theme.findUnique({ where: { businessId: mapping.businessId } });

  if (!business) return null;
  return {
    businessSlug: business.slug,
    locationId: '', // opcional: decidir ubicación por defecto o por cookie/QR
    theme: {
      primary: theme?.primary || '#111827',
      accent: theme?.accent || '#22C55E',
      text: theme?.text || '#0B1020',
      currency: business.currency,
    },
  };
}
```

## TODOs MVP (orden sugerido)
1) `getTenantByHost` consultando DB (arriba) y poblar `DomainMapping` para tus dominios.
2) Ruta de QR `src/app/l/[locationId]/s/[qrSlug]/page.tsx` → guardar contexto (`parkingSpotId`) y redirigir a `/menu`.
3) Crear pedido desde el carrito:
   - API route (POST) p.ej. `src/app/api/orders/route.ts` que cree `Order` + `OrderItems`.
   - Conectar `/cart` para enviar el payload.
4) Reemplazar listas estáticas en `/orders` con consulta Prisma filtrada por cliente (cookie con `parkingSpotId` + `businessId`).
5) Autenticación simple para `/dashboard/*` (NextAuth Credentials o token temporal con `ADMIN_DEMO_KEY`).

## Comandos Útiles
- Generar Prisma Client: `npx prisma generate`
- Aplicar schema (sin migraciones): `npx prisma db push`
- Migraciones (si las usas): `npx prisma migrate dev`
- Seed: `npm run db:seed` (usa `prisma/seed.ts`)
- Verificar/crear demo por script: `node scripts/check-db.js`
- Generar QR: `tsx scripts/generateQRCodes.ts`

## Observaciones y Riesgos
- Inconsistencia dev DB: `.env` apunta a SQLite pero `provider` es `postgresql`. Define un `DATABASE_URL` de Postgres tanto en local como en Vercel para que Prisma no falle.
- `getTenantByHost` hardcodeado: funciona para demo, pero para cliente real debes implementar lookup por dominio.
- Rutas QR no implementadas: el script genera URLs que aún no resuelve la app. Implementar la página indicada arriba.
- Dashboard sin auth: protege antes de exponer a clientes.
- Manejo de carrito/pedidos: actualmente mock; implementar persistencia para demo convincente.
- `scripts/seed-db.js` invoca `npm run qr:100`, pero no existe ese script en `package.json`. Usa `tsx scripts/generateQRCodes.ts` o añade un script equivalente.

## Checklist “Listo para Demo”
- [ ] `DATABASE_URL` (Neon) configurado en Vercel y local.
- [ ] `prisma db push` ejecutado (tablas creadas en Neon).
- [ ] Datos demo cargados (desde `/setup` o `npm run db:seed`).
- [ ] `getTenantByHost` con lookup a `DomainMapping`.
- [ ] Ruta QR implementada y QR generados con dominio correcto.
- [ ] Carrito → Crear Pedido (flujo mínimo) funcionando.
- [ ] Dashboard protegido (clave simple o auth).
- [ ] Dominios y subdominios configurados en Vercel.

## Checklist “Casi Producción”
- [ ] Pasarela de pago integrada (Stripe, OpenPay).
- [ ] Estados de pedido en tiempo real (Pusher/Ably o polling + revalidaciones).
- [ ] CRUD de catálogo/estacionamientos desde dashboard con roles.
- [ ] Monitoreo/errores (Sentry), métricas y logs centralizados.
- [ ] Backups y políticas de retención en Neon.

---

¿Quieres que implemente ahora mismo el lookup de tenant por dominio y la ruta de QR para que puedas hacer el demo hoy? Puedo hacerlo con cambios mínimos y dejando todo behind a feature flag.
