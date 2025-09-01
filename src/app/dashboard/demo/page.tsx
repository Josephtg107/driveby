import { getTenantByHost } from "@/lib/tenant";
import { prisma } from "@/server/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function DemoDashboard() {
  const tenant = await getTenantByHost();
  
  if (!tenant) {
    notFound();
  }

  // Get business data with real statistics
  const business = await prisma.business.findUnique({
    where: { slug: tenant.businessSlug },
    include: {
      theme: true,
      orders: {
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)) // Today's orders
          }
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      },
      products: {
        include: {
          category: true,
          orderItems: {
            where: {
              order: {
                createdAt: {
                  gte: new Date(new Date().setHours(0, 0, 0, 0)) // Today's orders
                }
              }
            }
          }
        }
      }
    }
  });

  if (!business) {
    notFound();
  }

  // Calculate real statistics
  const todayOrders = business.orders;
  const todayRevenue = todayOrders.reduce((sum, order) => sum + Number(order.total), 0);
  const totalProducts = business.products.length;
  const activeCustomers = new Set(todayOrders.map(order => order.parkingSpotId)).size;

  // Get recent orders
  const recentOrders = await prisma.order.findMany({
    where: {
      businessId: business.id
    },
    include: {
      items: {
        include: {
          product: true
        }
      },
      parkingSpot: true
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 5
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-4">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: business.theme?.primary || '#111827' }}
                >
                  <span className="text-white font-medium text-sm">D</span>
                </div>
                <div>
                  <h1 className="text-lg font-medium text-gray-900">DriveBy</h1>
                  <p className="text-xs text-gray-500 font-light">Demo Dashboard</p>
                </div>
              </Link>
            </div>
            
            {/* Navigation Buttons */}
            <nav className="flex items-center space-x-6">
              <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">
                Inicio
              </Link>
              <Link href="/dashboard/demo/orders" className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">
                Pedidos
              </Link>
              <Link href="/dashboard/demo/menu" className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">
                Menú
              </Link>
              <Link href="/dashboard/demo/reports" className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">
                Reportes
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Dashboard Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            Dashboard Demo
          </h1>
          <p className="text-lg text-gray-600 font-light">
            Panel de control de demostración para {business.name}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="border-0 bg-white shadow-sm rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-light">Pedidos Hoy</p>
                  <p className="text-3xl font-medium text-gray-900">{todayOrders.length}</p>
                </div>
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">📋</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white shadow-sm rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-light">Ingresos Hoy</p>
                  <p className="text-3xl font-medium text-gray-900">${todayRevenue.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">💰</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white shadow-sm rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-light">Clientes Activos</p>
                  <p className="text-3xl font-medium text-gray-900">{activeCustomers}</p>
                </div>
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">👥</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white shadow-sm rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-light">Productos</p>
                  <p className="text-3xl font-medium text-gray-900">{totalProducts}</p>
                </div>
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">🍽️</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card className="border-0 bg-white shadow-sm rounded-2xl mb-8">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-light text-gray-900">
              Pedidos Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No hay pedidos recientes</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-medium">#{order.orderNumber}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Estacionamiento {order.parkingSpot.code}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        order.status === 'completed' ? 'text-green-600' : 
                        order.status === 'preparing' ? 'text-orange-600' : 'text-gray-600'
                      }`}>
                        {order.status === 'pending' ? 'Pendiente' :
                         order.status === 'preparing' ? 'En preparación' :
                         order.status === 'ready' ? 'Listo' :
                         order.status === 'completed' ? 'Completado' : order.status}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleTimeString('es-MX', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 bg-white shadow-sm rounded-2xl hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">➕</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Agregar Producto</h3>
              <p className="text-sm text-gray-600 mb-4">Añade nuevos productos al menú</p>
              <Link href="/dashboard/demo/menu">
                <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-xl text-sm">
                  Gestionar Menú
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white shadow-sm rounded-2xl hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">📊</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ver Reportes</h3>
              <p className="text-sm text-gray-600 mb-4">Analiza el rendimiento del negocio</p>
              <Link href="/dashboard/demo/reports">
                <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-xl text-sm">
                  Ver Reportes
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white shadow-sm rounded-2xl hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">⚙️</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Configuración</h3>
              <p className="text-sm text-gray-600 mb-4">Ajusta la configuración del negocio</p>
              <Link href="/dashboard/demo/settings">
                <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-xl text-sm">
                  Configurar
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
