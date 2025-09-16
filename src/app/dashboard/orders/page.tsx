import { prisma } from '@/server/db';
import { getTenantByHost } from '@/lib/tenant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';

export default async function DashboardOrdersPage() {
  const tenant = await getTenantByHost();
  if (!tenant) notFound();

  const business = await prisma.business.findUnique({ where: { slug: tenant.businessSlug } });
  if (!business) notFound();

  const pending = await prisma.order.findMany({
    where: { businessId: business.id, status: { in: ['pending', 'preparing'] } },
    include: { items: { include: { product: true } }, parkingSpot: true },
    orderBy: { createdAt: 'asc' },
  });

  const theme = await prisma.theme.findUnique({ where: { businessId: business.id } });

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: theme?.primary || '#111827' }}>
                <span className="text-white text-sm font-medium">{business.name.charAt(0)}</span>
              </div>
              <div>
                <h1 className="text-lg font-medium text-gray-900">{business.name}</h1>
                <p className="text-xs text-gray-500 font-light">Órdenes pendientes</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <Card className="border-0 bg-white shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-light text-gray-900">Cola de Órdenes</CardTitle>
          </CardHeader>
          <CardContent>
            {pending.length === 0 ? (
              <div className="text-center py-10 text-gray-500">No hay órdenes pendientes</div>
            ) : (
              <div className="space-y-4">
                {pending.map((o) => (
                  <div key={o.id} className="p-4 bg-gray-50 rounded-xl flex items-start justify-between">
                    <div>
                      <div className="font-medium text-gray-900">#{o.orderNumber} • Est. {o.parkingSpot.code}</div>
                      <div className="text-sm text-gray-600">
                        {o.items.map((it) => `${it.quantity}x ${it.product.name}`).join(', ')}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${o.status === 'pending' ? 'bg-yellow-50 text-yellow-700' : 'bg-orange-50 text-orange-700'}`}>{o.status === 'pending' ? 'Pendiente' : 'En preparación'}</span>
                      {/* Botones de cambio de estado (no bloqueantes para el demo) */}
                      <form action={`/api/orders/${o.id}/status`} method="post">
                        <input type="hidden" name="status" value={o.status === 'pending' ? 'preparing' : 'ready'} />
                        <Button type="submit" size="sm" variant="outline">{o.status === 'pending' ? 'Marcar prep.' : 'Marcar listo'}</Button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

