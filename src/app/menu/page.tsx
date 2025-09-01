import { getTenantByHost } from "@/lib/tenant";
import { prisma } from "@/server/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function MenuPage() {
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

  // Get categories and products separately to avoid complex includes
  const categories = await prisma.category.findMany({
    where: { businessId: business.id },
  });

  const products = await prisma.product.findMany({
    where: { businessId: business.id },
    include: {
      category: true,
    }
  });

  // Group products by category
  const productsByCategory = categories.map(category => ({
    ...category,
    products: products.filter(product => product.categoryId === category.id)
  }));

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
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
                <p className="text-xs text-gray-500 font-light">Menú Digital</p>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="flex items-center space-x-6">
              <Link href="/menu" className="text-sm text-gray-900 font-medium">
                Menú
              </Link>
              <Link href="/cart" className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">
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
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            Menú de {business.name}
          </h1>
          <p className="text-lg text-gray-600 font-light">
            Explora nuestros deliciosos productos
          </p>
        </div>

        {/* Categories and Products */}
        <div className="space-y-12">
          {productsByCategory.map((category) => (
            <section key={category.id} className="space-y-6">
              <h2 className="text-2xl font-medium text-gray-900 border-b border-gray-200 pb-2">
                {category.name}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.products.map((product) => (
                  <Card key={product.id} className="border-0 bg-white shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden">
                    <div className="aspect-video bg-gray-100 relative overflow-hidden">
                      {product.imageUrl && (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                        <p className="text-lg font-medium text-gray-900">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {product.description}
                      </p>
                      
                      <Button 
                        className="w-full"
                        style={{ 
                          backgroundColor: theme?.primary || '#111827',
                          color: 'white'
                        }}
                      >
                        Agregar al Carrito
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 pt-8 border-t border-gray-100">
          <p className="text-gray-500 text-sm font-light">
            © 2025 {business.name}. Plataforma DriveBy.
          </p>
        </footer>
      </main>
    </div>
  );
}
