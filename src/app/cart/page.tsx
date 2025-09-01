import { getTenantByHost } from "@/lib/tenant";
import { prisma } from "@/server/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CartPage() {
  const tenant = await getTenantByHost();
  
  if (!tenant) {
    notFound();
  }

  // Get business data
  const business = await prisma.business.findUnique({
    where: { slug: tenant.businessSlug },
    include: {
      theme: true,
    }
  });

  if (!business) {
    notFound();
  }

  // For now, we'll show a static cart. In a real app, this would come from a session or database
  const cartItems = [
    {
      id: "1",
      name: "Hamburguesa Clásica",
      price: 89.00,
      quantity: 2,
      modifiers: ["Tamaño: Grande", "Extra: Queso Extra"],
      imageUrl: "https://picsum.photos/id/237/400/300"
    },
    {
      id: "2", 
      name: "Refresco",
      price: 25.00,
      quantity: 1,
      modifiers: [],
      imageUrl: "https://picsum.photos/id/239/400/300"
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.16; // 16% IVA
  const total = subtotal + tax;

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
                  style={{ backgroundColor: business.theme?.primary || '#111827' }}
                >
                  <span className="text-white font-medium text-sm">
                    {business.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h1 className="text-lg font-medium text-gray-900">{business.name}</h1>
                  <p className="text-xs text-gray-500 font-light">Carrito</p>
                </div>
              </Link>
            </div>
            
            {/* Navigation */}
            <nav className="flex items-center space-x-6">
              <Link href="/menu" className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">
                Menú
              </Link>
              <Link href="/cart" className="text-sm text-gray-900 font-medium">
                Carrito
              </Link>
              <Link href="/orders" className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">
                Mis Pedidos
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Cart Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-2">
            Tu Carrito
          </h1>
          <p className="text-gray-600">
            {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'} en tu carrito
          </p>
        </div>

        {cartItems.length === 0 ? (
          <Card className="border-0 bg-white shadow-sm rounded-2xl">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-2xl">🛒</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tu carrito está vacío</h3>
              <p className="text-gray-600 mb-6">Agrega algunos productos deliciosos a tu carrito</p>
              <Link href="/menu">
                <Button 
                  className="px-8"
                  style={{ 
                    backgroundColor: business.theme?.primary || '#111827',
                    color: 'white'
                  }}
                >
                  Ver Menú
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="border-0 bg-white shadow-sm rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex space-x-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                        {item.imageUrl && (
                          <img 
                            src={item.imageUrl} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          <p className="font-medium text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        
                        {item.modifiers.length > 0 && (
                          <div className="mb-3">
                            {item.modifiers.map((modifier, index) => (
                              <p key={index} className="text-sm text-gray-600">
                                {modifier}
                              </p>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="w-8 h-8 p-0"
                            >
                              -
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="w-8 h-8 p-0"
                            >
                              +
                            </Button>
                          </div>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="text-red-600 hover:text-red-700"
                          >
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="border-0 bg-white shadow-sm rounded-2xl sticky top-24">
                <CardHeader>
                  <CardTitle className="text-xl font-medium text-gray-900">
                    Resumen del Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">IVA (16%)</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between">
                      <span className="font-medium text-gray-900">Total</span>
                      <span className="font-bold text-lg text-gray-900">${total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full py-3"
                    style={{ 
                      backgroundColor: business.theme?.primary || '#111827',
                      color: 'white'
                    }}
                  >
                    Proceder al Pago
                  </Button>
                  
                  <Link href="/menu">
                    <Button variant="outline" className="w-full">
                      Seguir Comprando
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
