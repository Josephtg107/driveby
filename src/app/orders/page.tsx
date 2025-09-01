import { getTenantByHost } from "@/lib/tenant";
import { prisma } from "@/server/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function OrdersPage() {
  const tenant = await getTenantByHost();
  
  if (!tenant) {
    notFound();
  }

  // Get business data - simplified query
  const business = await prisma.business.findUnique({
    where: { slug: tenant.businessSlug },
  });

  if (!business) {
    notFound();
  }

  // Get theme separately
  const theme = await prisma.theme.findUnique({
    where: { businessId: business.id },
  });

  // For now, we'll show static orders. In a real app, this would come from the database
  const orders = [
    {
      id: "1",
      orderNumber: "ORD-001",
      status: "preparing",
      total: 203.00,
      items: [
        { name: "Hamburguesa Clásica", quantity: 2, price: 89.00 },
        { name: "Refresco", quantity: 1, price: 25.00 }
      ],
      createdAt: "2025-01-15T14:30:00Z",
      estimatedTime: "15 min"
    },
    {
      id: "2",
      orderNumber: "ORD-002", 
      status: "completed",
      total: 129.00,
      items: [
        { name: "Hamburguesa BBQ", quantity: 1, price: 129.00 }
      ],
      createdAt: "2025-01-15T12:15:00Z",
      completedAt: "2025-01-15T12:45:00Z"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'preparing': return 'text-orange-600 bg-orange-50';
      case 'ready': return 'text-green-600 bg-green-50';
      case 'completed': return 'text-gray-600 bg-gray-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'preparing': return 'En Preparación';
      case 'ready': return 'Listo';
      case 'completed': return 'Completado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/menu" className="flex items-center space-x-4">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: theme?.primary || '#111827' }}
                >
                  <span className="text-white font-medium text-sm">
                    {business.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h1 className="text-lg font-medium text-gray-900">{business.name}</h1>
                  <p className="text-xs text-gray-500 font-light">Mis Pedidos</p>
                </div>
              </Link>
            </div>
            
            {/* Navigation */}
            <nav className="flex items-center space-x-6">
              <Link href="/menu" className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">
                Menú
              </Link>
              <Link href="/cart" className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">
                Carrito
              </Link>
              <Link href="/orders" className="text-sm text-gray-900 font-medium">
                Mis Pedidos
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Orders Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-2">
            Mis Pedidos
          </h1>
          <p className="text-gray-600">
            Historial de tus pedidos en {business.name}
          </p>
        </div>

        {orders.length === 0 ? (
          <Card className="border-0 bg-white shadow-sm rounded-2xl">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-2xl">📋</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes pedidos aún</h3>
              <p className="text-gray-600 mb-6">Realiza tu primer pedido y aparecerá aquí</p>
              <Link href="/menu">
                <Button 
                  className="px-8"
                  style={{ 
                    backgroundColor: theme?.primary || '#111827',
                    color: 'white'
                  }}
                >
                  Ver Menú
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="border-0 bg-white shadow-sm rounded-2xl">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-medium text-gray-900">
                        Pedido #{order.orderNumber}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(order.createdAt).toLocaleDateString('es-MX', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      <p className="text-lg font-bold text-gray-900 mt-1">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-gray-900">
                            {item.quantity}x
                          </span>
                          <span className="text-sm text-gray-600">{item.name}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {order.status === 'preparing' && order.estimatedTime && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-xl">
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-600">⏱️</span>
                        <span className="text-sm text-blue-800">
                          Tiempo estimado: {order.estimatedTime}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {order.status === 'completed' && order.completedAt && (
                    <div className="mt-4 p-3 bg-green-50 rounded-xl">
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600">✅</span>
                        <span className="text-sm text-green-800">
                          Completado el {new Date(order.completedAt).toLocaleDateString('es-MX', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-6 flex space-x-3">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      style={{ 
                        borderColor: theme?.primary || '#111827',
                        color: theme?.primary || '#111827'
                      }}
                    >
                      Ver Detalles
                    </Button>
                    {order.status === 'ready' && (
                      <Button 
                        className="flex-1"
                        style={{ 
                          backgroundColor: theme?.primary || '#111827',
                          color: 'white'
                        }}
                      >
                        Recoger Pedido
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
