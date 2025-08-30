import { redirect } from "next/navigation";
import { getTenantByHost } from "@/lib/tenant";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function HomePage() {
  const tenant = await getTenantByHost();
  
  // Always show the main page with 3 business options, regardless of tenant
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">🚙</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">DriveBy</h1>
                <p className="text-sm text-gray-600">Dashboard de Pedidos por QR</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Bienvenido a{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              DriveByApp
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            La plataforma más moderna para pedidos por QR en negocios con estacionamiento. 
            Escanea, ordena y disfruta sin salir de tu auto.
          </p>
        </div>

        {/* Business Selection */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Selecciona tu Negocio
            </h2>
            <p className="text-lg text-gray-600">
              Accede al dashboard de tu negocio para gestionar todo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* DriveByApp Demo */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-3xl">🚗</span>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">DriveByApp Demo</CardTitle>
                <p className="text-gray-600">Plataforma de Demostración</p>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">
                  Explora todas las funcionalidades de la plataforma con datos de demostración.
                </p>
                <Link href="/dashboard/demo" className="block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 text-lg">
                    Ir al Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Café Shop */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-3xl">☕</span>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Café Shop</CardTitle>
                <p className="text-gray-600">Café & Panadería</p>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">
                  Gestiona tu negocio de café y pastelería con todas las herramientas necesarias.
                </p>
                <Link href="/dashboard/cafeshop" className="block">
                  <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 text-lg">
                    Ir al Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pizza Express */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-3xl">🍕</span>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Pizza Express</CardTitle>
                <p className="text-gray-600">Pizzas & Bebidas</p>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">
                  Administra tu negocio de pizzas con el panel de control completo.
                </p>
                <Link href="/dashboard/pizzaexpress" className="block">
                  <Button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 text-lg">
                    Ir al Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* How it works */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              ¿Cómo Funciona?
            </CardTitle>
            <p className="text-lg text-gray-600">
              Proceso simple y rápido en 4 pasos
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-2xl">📱</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Escanear QR</h3>
                <p className="text-gray-600">Encuentra el código QR en tu cajón de estacionamiento</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-2xl">🍽️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Ver Menú</h3>
                <p className="text-gray-600">Explora productos organizados por categorías</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-2xl">🛒</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Ordenar</h3>
                <p className="text-gray-600">Agrega al carrito y paga de forma segura</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-2xl">📋</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">4. Seguimiento</h3>
                <p className="text-gray-600">Monitorea el estado de tu pedido en tiempo real</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-600">
            © 2025 DriveByApp. Plataforma moderna de pedidos por QR.
          </p>
        </div>
      </div>
    </div>
  );
}
