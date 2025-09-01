import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function CafeShopDashboard() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-white font-medium text-sm">D</span>
                </div>
                <div>
                  <h1 className="text-lg font-medium text-gray-900">DriveBy</h1>
                  <p className="text-xs text-gray-500 font-light">Café Shop Dashboard</p>
                </div>
              </Link>
            </div>
            
            {/* Navigation Buttons */}
            <nav className="flex items-center space-x-6">
              <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">
                Inicio
              </Link>
              <button className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">
                Pedidos
              </button>
              <button className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">
                Menú
              </button>
              <button className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">
                Reportes
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Dashboard Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            Café Shop Dashboard
          </h1>
          <p className="text-lg text-gray-600 font-light">
            Gestiona tu negocio de café y pastelería
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="border-0 bg-white shadow-sm rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-light">Pedidos Hoy</p>
                  <p className="text-3xl font-medium text-gray-900">18</p>
                </div>
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">☕</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white shadow-sm rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-light">Ingresos Hoy</p>
                  <p className="text-3xl font-medium text-gray-900">$890</p>
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
                  <p className="text-sm text-gray-500 font-light">Cafés Vendidos</p>
                  <p className="text-3xl font-medium text-gray-900">32</p>
                </div>
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">🥤</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white shadow-sm rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-light">Pasteles Vendidos</p>
                  <p className="text-3xl font-medium text-gray-900">15</p>
                </div>
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">🍰</span>
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
            <div className="space-y-4">
              {[
                { id: "#CS001", customer: "Sofía Ramírez", items: "Cappuccino + Croissant", status: "Completado", time: "1 min ago" },
                { id: "#CS002", customer: "Miguel Torres", items: "Café Americano + Muffin", status: "En preparación", time: "3 min ago" },
                { id: "#CS003", customer: "Carmen Vega", items: "Latte + Pastel de Chocolate", status: "Pendiente", time: "6 min ago" },
                { id: "#CS004", customer: "Roberto Silva", items: "Espresso + Pan de Dulce", status: "Completado", time: "10 min ago" },
              ].map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-medium">{order.id}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{order.customer}</p>
                      <p className="text-sm text-gray-600">{order.items}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      order.status === 'Completado' ? 'text-green-600' : 
                      order.status === 'En preparación' ? 'text-orange-600' : 'text-gray-600'
                    }`}>
                      {order.status}
                    </p>
                    <p className="text-xs text-gray-500">{order.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Items */}
        <Card className="border-0 bg-white shadow-sm rounded-2xl mb-8">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-light text-gray-900">
              Productos Populares
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "Cappuccino", sales: 45, price: "$4.50", icon: "☕" },
                { name: "Croissant", sales: 38, price: "$3.20", icon: "🥐" },
                { name: "Latte", sales: 32, price: "$4.80", icon: "🥛" },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">{item.icon}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.price}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-medium text-gray-900">{item.sales}</p>
                    <p className="text-xs text-gray-500">vendidos</p>
                  </div>
                </div>
              ))}
            </div>
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
              <p className="text-sm text-gray-600 mb-4">Añade nuevos cafés o pasteles</p>
              <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-xl text-sm">
                Agregar
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white shadow-sm rounded-2xl hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">📊</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ver Reportes</h3>
              <p className="text-sm text-gray-600 mb-4">Analiza ventas y tendencias</p>
              <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-xl text-sm">
                Ver Reportes
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white shadow-sm rounded-2xl hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">⚙️</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Configuración</h3>
              <p className="text-sm text-gray-600 mb-4">Ajusta precios y horarios</p>
              <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-xl text-sm">
                Configurar
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
