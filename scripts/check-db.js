const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAndPopulateDatabase() {
  try {
    console.log('🔍 Checking database...');

    // Check if demo business exists
    const demoBusiness = await prisma.business.findUnique({
      where: { slug: 'drivebyapp' }
    });

    if (!demoBusiness) {
      console.log('❌ Demo business not found. Creating...');
      
      // Create demo business
      const business = await prisma.business.create({
        data: {
          id: "demo-biz",
          name: "DriveByApp",
          slug: "drivebyapp",
          currency: "MXN"
        }
      });

      // Create theme
      await prisma.theme.create({
        data: {
          businessId: business.id,
          primary: "#111827",
          accent: "#22C55E",
          text: "#0B1020"
        }
      });

      // Create domain mapping
      await prisma.domainMapping.create({
        data: {
          domain: "drivebyapp.com",
          businessId: business.id,
          primary: true
        }
      });

      // Create location
      const location = await prisma.location.create({
        data: {
          id: "demo-location",
          name: "DriveByApp Demo Location",
          address: "Av. Insurgentes Sur 123, CDMX",
          businessId: business.id
        }
      });

      // Create parking spots
      for (let i = 1; i <= 10; i++) {
        await prisma.parkingSpot.create({
          data: {
            code: `A${i}`,
            qrSlug: `demo-spot-${i.toString().padStart(3, "0")}`,
            locationId: location.id
          }
        });
      }

      // Create categories
      const categories = await Promise.all([
        prisma.category.create({
          data: {
            id: "demo-burgers",
            name: "Hamburguesas",
            businessId: business.id
          }
        }),
        prisma.category.create({
          data: {
            id: "demo-drinks",
            name: "Bebidas",
            businessId: business.id
          }
        }),
        prisma.category.create({
          data: {
            id: "demo-sides",
            name: "Acompañamientos",
            businessId: business.id
          }
        })
      ]);

      // Create products
      await Promise.all([
        prisma.product.create({
          data: {
            id: "demo-burger-1",
            name: "Hamburguesa Clásica",
            description: "Carne de res, lechuga, tomate, cebolla y queso",
            price: 89.00,
            imageUrl: "https://picsum.photos/id/237/400/300",
            categoryId: categories[0].id,
            businessId: business.id
          }
        }),
        prisma.product.create({
          data: {
            id: "demo-burger-2",
            name: "Hamburguesa BBQ",
            description: "Carne de res, bacon, cebolla caramelizada y salsa BBQ",
            price: 129.00,
            imageUrl: "https://picsum.photos/id/238/400/300",
            categoryId: categories[0].id,
            businessId: business.id
          }
        }),
        prisma.product.create({
          data: {
            id: "demo-drink-1",
            name: "Refresco",
            description: "Coca-Cola, Sprite o Fanta",
            price: 25.00,
            imageUrl: "https://picsum.photos/id/239/400/300",
            categoryId: categories[1].id,
            businessId: business.id
          }
        }),
        prisma.product.create({
          data: {
            id: "demo-side-1",
            name: "Papas Fritas",
            description: "Papas fritas crujientes",
            price: 35.00,
            imageUrl: "https://picsum.photos/id/240/400/300",
            categoryId: categories[2].id,
            businessId: business.id
          }
        })
      ]);

      console.log('✅ Demo data created successfully!');
    } else {
      console.log('✅ Demo business already exists');
    }

    // Check other businesses
    const cafeBusiness = await prisma.business.findUnique({
      where: { slug: 'cafeshop' }
    });

    if (!cafeBusiness) {
      console.log('❌ Café Shop business not found. Creating...');
      
      const cafe = await prisma.business.create({
        data: {
          name: "Café Shop",
          slug: "cafeshop",
          currency: "MXN"
        }
      });

      await prisma.theme.create({
        data: {
          businessId: cafe.id,
          primary: "#1F2937",
          accent: "#F59E0B",
          text: "#0B1020"
        }
      });

      console.log('✅ Café Shop created successfully!');
    }

    const pizzaBusiness = await prisma.business.findUnique({
      where: { slug: 'pizzaexpress' }
    });

    if (!pizzaBusiness) {
      console.log('❌ Pizza Express business not found. Creating...');
      
      const pizza = await prisma.business.create({
        data: {
          name: "Pizza Express",
          slug: "pizzaexpress",
          currency: "MXN"
        }
      });

      await prisma.theme.create({
        data: {
          businessId: pizza.id,
          primary: "#DC2626",
          accent: "#FCD34D",
          text: "#0B1020"
        }
      });

      console.log('✅ Pizza Express created successfully!');
    }

    console.log('🎉 Database check completed!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndPopulateDatabase();
