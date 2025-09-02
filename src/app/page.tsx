import { getTenantByHost } from "@/lib/tenant";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const tenant = await getTenantByHost();
  
  // If we have a tenant, redirect to their menu
  if (tenant) {
    redirect('/menu');
  }
  
  // If no tenant (admin view), show business selection
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-medium text-sm">D</span>
              </div>
              <div>
                <h1 className="text-lg font-medium text-gray-900">DriveBy</h1>
                <p className="text-xs text-gray-500 font-light">Gestión de Pedidos QR</p>
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <nav className="flex items-center space-x-6">
              <button className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">
                Inicio
              </button>
              <button className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">
                Negocios
              </button>
              <button className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">
                Ayuda
              </button>
              <button className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">
                Contacto
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6">
        {/* Hero Section */}
        <section className="py-24 text-center">
          <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-8 tracking-tight">
            Bienvenido a{" "}
            <span className="font-medium">
              DriveBy
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
            La plataforma para pedidos por QR en negocios con estacionamiento. 
            Escanea, ordena y disfruta sin salir de tu auto.
          </p>
        </section>

        {/* Business Selection */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-gray-900 mb-4">
              Selecciona tu Negocio
            </h2>
            <p className="text-lg text-gray-500 font-light">
              Accede al dashboard de tu negocio para gestionar todo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* DriveBy Demo */}
            <Card className="group border-0 bg-white shadow-sm hover:shadow-lg transition-all duration-500 rounded-2xl overflow-hidden">
              <CardHeader className="text-center pb-6 pt-8">
                <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform duration-500">
                  <span className="text-white text-2xl">🚗</span>
                </div>
                <CardTitle className="text-xl font-medium text-gray-900 mb-2">DriveBy Demo</CardTitle>
                <p className="text-sm text-gray-500 font-light">Plataforma de Demostración</p>
              </CardHeader>
              <CardContent className="text-center pb-8">
                <p className="text-gray-600 mb-8 text-sm leading-relaxed font-light">
                  Explora todas las funcionalidades de la plataforma con datos de demostración.
                </p>
                <Link href="/dashboard/demo" className="block">
                  <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 text-sm">
                    Ir al Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Café Shop */}
            <Card className="group border-0 bg-white shadow-sm hover:shadow-lg transition-all duration-500 rounded-2xl overflow-hidden">
              <CardHeader className="text-center pb-6 pt-8">
                <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform duration-500">
                  <span className="text-white text-2xl">☕</span>
                </div>
                <CardTitle className="text-xl font-medium text-gray-900 mb-2">Café Shop</CardTitle>
                <p className="text-sm text-gray-500 font-light">Café & Panadería</p>
              </CardHeader>
              <CardContent className="text-center pb-8">
                <p className="text-gray-600 mb-8 text-sm leading-relaxed font-light">
                  Gestiona tu negocio de café y pastelería con todas las herramientas necesarias.
                </p>
                <Link href="/dashboard/cafeshop" className="block">
                  <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 text-sm">
                    Ir al Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pizza Express */}
            <Card className="group border-0 bg-white shadow-sm hover:shadow-lg transition-all duration-500 rounded-2xl overflow-hidden">
              <CardHeader className="text-center pb-6 pt-8">
                <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform duration-500">
                  <span className="text-white text-2xl">🍕</span>
                </div>
                <CardTitle className="text-xl font-medium text-gray-900 mb-2">Pizza Express</CardTitle>
                <p className="text-sm text-gray-500 font-light">Pizzas & Bebidas</p>
              </CardHeader>
              <CardContent className="text-center pb-8">
                <p className="text-gray-600 mb-8 text-sm leading-relaxed font-light">
                  Administra tu negocio de pizzas con el panel de control completo.
                </p>
                <Link href="/dashboard/pizzaexpress" className="block">
                  <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 text-sm">
                    Ir al Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 bg-gray-50">
          <Card className="border-0 bg-white shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="text-center pb-12 pt-12">
              <CardTitle className="text-3xl font-light text-gray-900 mb-4">
                ¿Cómo Funciona?
              </CardTitle>
              <p className="text-lg text-gray-500 font-light">
                Proceso simple y rápido en 4 pasos
              </p>
            </CardHeader>
            <CardContent className="pb-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="text-center group">
                  <div className="w-14 h-14 border-2 border-gray-900 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform duration-500">
                    <span className="text-gray-900 text-xl">📱</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">1. Escanear QR</h3>
                  <p className="text-gray-600 text-sm font-light leading-relaxed">Encuentra el código QR en tu cajón de estacionamiento</p>
                </div>
                <div className="text-center group">
                  <div className="w-14 h-14 border-2 border-gray-900 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform duration-500">
                    <span className="text-gray-900 text-xl">🍽️</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">2. Ver Menú</h3>
                  <p className="text-gray-600 text-sm font-light leading-relaxed">Explora productos organizados por categorías</p>
                </div>
                <div className="text-center group">
                  <div className="w-14 h-14 border-2 border-gray-900 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform duration-500">
                    <span className="text-gray-900 text-xl">🛒</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">3. Ordenar</h3>
                  <p className="text-gray-600 text-sm font-light leading-relaxed">Agrega al carrito y paga de forma segura</p>
                </div>
                <div className="text-center group">
                  <div className="w-14 h-14 border-2 border-gray-900 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform duration-500">
                    <span className="text-gray-900 text-xl">📋</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">4. Seguimiento</h3>
                  <p className="text-gray-600 text-sm font-light leading-relaxed">Monitorea el estado de tu pedido en tiempo real</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="text-center py-16 border-t border-gray-100">
          <p className="text-gray-500 text-sm font-light">
            © 2025 DriveBy. Plataforma moderna de pedidos por QR.
          </p>
        </footer>
      </main>
    </div>
  );
}
