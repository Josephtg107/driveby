import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // DriveByApp Demo Business
  const driveby = await prisma.business.upsert({
    where: { slug: "drivebyapp" },
    update: {},
    create: {
      id: "demo-biz",
      name: "DriveByApp",
      slug: "drivebyapp",
      currency: "MXN"
    }
  });

  await prisma.theme.upsert({
    where: { businessId: driveby.id },
    update: {},
    create: {
      businessId: driveby.id,
      primary: "#111827",
      accent: "#22C55E",
      text: "#0B1020"
    }
  });

  await prisma.domainMapping.upsert({
    where: { domain: "drivebyapp.com" },
    update: { primary: true },
    create: {
      domain: "drivebyapp.com",
      businessId: driveby.id,
      primary: true
    }
  });

  // Café Shop Example Business
  const adc = await prisma.business.upsert({
    where: { slug: "cafeshop" },
    update: {},
    create: {
      name: "Café Shop",
      slug: "cafeshop",
      currency: "MXN"
    }
  });

  await prisma.theme.upsert({
    where: { businessId: adc.id },
    update: {},
    create: {
      businessId: adc.id,
      primary: "#1F2937",
      accent: "#F59E0B",
      text: "#0B1020"
    }
  });

  await prisma.domainMapping.upsert({
    where: { domain: "cafeshop.drivebyapp.com" },
    update: {},
    create: {
      domain: "cafeshop.drivebyapp.com",
      businessId: adc.id,
      primary: true
    }
  });

  // Pizza Express Example Business
  const pizza = await prisma.business.upsert({
    where: { slug: "pizzaexpress" },
    update: {},
    create: {
      name: "Pizza Express",
      slug: "pizzaexpress",
      currency: "MXN"
    }
  });

  await prisma.theme.upsert({
    where: { businessId: pizza.id },
    update: {},
    create: {
      businessId: pizza.id,
      primary: "#DC2626",
      accent: "#FCD34D",
      text: "#0B1020"
    }
  });

  await prisma.domainMapping.upsert({
    where: { domain: "pizzaexpress.drivebyapp.com" },
    update: {},
    create: {
      domain: "pizzaexpress.drivebyapp.com",
      businessId: pizza.id,
      primary: true
    }
  });

  // Add localhost mapping for development (DriveByApp)
  await prisma.domainMapping.upsert({
    where: { domain: "localhost" },
    update: {},
    create: {
      domain: "localhost",
      businessId: driveby.id,
      primary: false
    }
  });

  // Add localhost subdomain mapping for Café Shop development
  await prisma.domainMapping.upsert({
    where: { domain: "cafeshop.localhost" },
    update: {},
    create: {
      domain: "cafeshop.localhost",
      businessId: adc.id,
      primary: false
    }
  });

  // Add localhost subdomain mapping for Pizza Express development
  await prisma.domainMapping.upsert({
    where: { domain: "pizzaexpress.localhost" },
    update: {},
    create: {
      domain: "pizzaexpress.localhost",
      businessId: pizza.id,
      primary: false
    }
  });

  // Create locations for both businesses
  const drivebyLocation = await prisma.location.upsert({
    where: { id: "demo-location" },
    update: {},
    create: {
      id: "demo-location",
      name: "DriveByApp Demo Location",
      address: "Av. Insurgentes Sur 123, CDMX",
      businessId: driveby.id
    }
  });

  const adcLocation = await prisma.location.upsert({
    where: { id: "adc-location" },
    update: {},
    create: {
      id: "adc-location",
      name: "Café Shop - Polanco",
      address: "Av. Presidente Masaryk 123, Polanco, CDMX",
      businessId: adc.id
    }
  });

  const pizzaLocation = await prisma.location.upsert({
    where: { id: "pizza-location" },
    update: {},
    create: {
      id: "pizza-location",
      name: "Pizza Express - Condesa",
      address: "Av. Tamaulipas 123, Condesa, CDMX",
      businessId: pizza.id
    }
  });

  // Create parking spots
  for (let i = 1; i <= 10; i++) {
    await prisma.parkingSpot.upsert({
      where: { qrSlug: `demo-spot-${i.toString().padStart(3, "0")}` },
      update: {},
      create: {
        code: `A${i}`,
        qrSlug: `demo-spot-${i.toString().padStart(3, "0")}`,
        locationId: drivebyLocation.id
      }
    });

    await prisma.parkingSpot.upsert({
      where: { qrSlug: `adc-spot-${i.toString().padStart(3, "0")}` },
      update: {},
      create: {
        code: `B${i}`,
        qrSlug: `adc-spot-${i.toString().padStart(3, "0")}`,
        locationId: adcLocation.id
      }
    });

    await prisma.parkingSpot.upsert({
      where: { qrSlug: `pizza-spot-${i.toString().padStart(3, "0")}` },
      update: {},
      create: {
        code: `C${i}`,
        qrSlug: `pizza-spot-${i.toString().padStart(3, "0")}`,
        locationId: pizzaLocation.id
      }
    });
  }

  // Create categories for DriveByApp
  const drivebyCategories = await Promise.all([
    prisma.category.upsert({
      where: { id: "demo-burgers" },
      update: {},
      create: {
        id: "demo-burgers",
        name: "Hamburguesas",
        businessId: driveby.id
      }
    }),
    prisma.category.upsert({
      where: { id: "demo-drinks" },
      update: {},
      create: {
        id: "demo-drinks",
        name: "Bebidas",
        businessId: driveby.id
      }
    }),
    prisma.category.upsert({
      where: { id: "demo-sides" },
      update: {},
      create: {
        id: "demo-sides",
        name: "Acompañamientos",
        businessId: driveby.id
      }
    })
  ]);

  // Create products for DriveByApp
  await prisma.product.upsert({
    where: { id: "demo-burger-1" },
    update: {
      imageUrl: "https://picsum.photos/id/237/400/300"
    },
    create: {
      id: "demo-burger-1",
      name: "Hamburguesa Clásica",
      description: "Carne de res, lechuga, tomate, cebolla y queso",
      price: 89.00,
      imageUrl: "https://picsum.photos/id/237/400/300",
      categoryId: drivebyCategories[0].id,
      businessId: driveby.id
    }
  });

  await prisma.product.upsert({
    where: { id: "demo-burger-2" },
    update: {
      imageUrl: "https://picsum.photos/id/238/400/300"
    },
    create: {
      id: "demo-burger-2",
      name: "Hamburguesa BBQ",
      description: "Carne de res, bacon, cebolla caramelizada y salsa BBQ",
      price: 129.00,
      imageUrl: "https://picsum.photos/id/238/400/300",
      categoryId: drivebyCategories[0].id,
      businessId: driveby.id
    }
  });

  await prisma.product.upsert({
    where: { id: "demo-drink-1" },
    update: {
      imageUrl: "https://picsum.photos/id/239/400/300"
    },
    create: {
      id: "demo-drink-1",
      name: "Refresco",
      description: "Coca-Cola, Sprite o Fanta",
      price: 25.00,
      imageUrl: "https://picsum.photos/id/239/400/300",
      categoryId: drivebyCategories[1].id,
      businessId: driveby.id
    }
  });

  await prisma.product.upsert({
    where: { id: "demo-side-1" },
    update: {
      imageUrl: "https://picsum.photos/id/240/400/300"
    },
    create: {
      id: "demo-side-1",
      name: "Papas Fritas",
      description: "Papas fritas crujientes",
      price: 35.00,
      imageUrl: "https://picsum.photos/id/240/400/300",
      categoryId: drivebyCategories[2].id,
      businessId: driveby.id
    }
  });

  // Create categories for Café Shop
  const adcCategories = await Promise.all([
    prisma.category.upsert({
      where: { id: "adc-coffee" },
      update: {},
      create: {
        id: "adc-coffee",
        name: "Café",
        businessId: adc.id
      }
    }),
    prisma.category.upsert({
      where: { id: "adc-pastries" },
      update: {},
      create: {
        id: "adc-pastries",
        name: "Panadería",
        businessId: adc.id
      }
    })
  ]);

  // Create products for Café Shop
  await prisma.product.upsert({
    where: { id: "adc-coffee-1" },
    update: {
      imageUrl: "https://picsum.photos/id/241/400/300"
    },
    create: {
      id: "adc-coffee-1",
      name: "Café Americano",
      description: "Café negro con agua caliente",
      price: 45.00,
      imageUrl: "https://picsum.photos/id/241/400/300",
      categoryId: adcCategories[0].id,
      businessId: adc.id
    }
  });

  await prisma.product.upsert({
    where: { id: "adc-coffee-2" },
    update: {
      imageUrl: "https://picsum.photos/id/242/400/300"
    },
    create: {
      id: "adc-coffee-2",
      name: "Cappuccino",
      description: "Espresso con leche espumada",
      price: 55.00,
      imageUrl: "https://picsum.photos/id/242/400/300",
      categoryId: adcCategories[0].id,
      businessId: adc.id
    }
  });

  await prisma.product.upsert({
    where: { id: "adc-pastry-1" },
    update: {
      imageUrl: "https://picsum.photos/id/243/400/300"
    },
    create: {
      id: "adc-pastry-1",
      name: "Croissant",
      description: "Croissant de mantequilla",
      price: 35.00,
      imageUrl: "https://picsum.photos/id/243/400/300",
      categoryId: adcCategories[1].id,
      businessId: adc.id
    }
  });

  // Create categories for Pizza Express
  const pizzaCategories = await Promise.all([
    prisma.category.upsert({
      where: { id: "pizza-pizzas" },
      update: {},
      create: {
        id: "pizza-pizzas",
        name: "Pizzas",
        businessId: pizza.id
      }
    }),
    prisma.category.upsert({
      where: { id: "pizza-drinks" },
      update: {},
      create: {
        id: "pizza-drinks",
        name: "Bebidas",
        businessId: pizza.id
      }
    }),
    prisma.category.upsert({
      where: { id: "pizza-sides" },
      update: {},
      create: {
        id: "pizza-sides",
        name: "Acompañamientos",
        businessId: pizza.id
      }
    })
  ]);

  // Create products for Pizza Express
  await prisma.product.upsert({
    where: { id: "pizza-margherita" },
    update: {
      imageUrl: "https://picsum.photos/id/244/400/300"
    },
    create: {
      id: "pizza-margherita",
      name: "Pizza Margherita",
      description: "Salsa de tomate, mozzarella y albahaca",
      price: 189.00,
      imageUrl: "https://picsum.photos/id/244/400/300",
      categoryId: pizzaCategories[0].id,
      businessId: pizza.id
    }
  });

  await prisma.product.upsert({
    where: { id: "pizza-pepperoni" },
    update: {
      imageUrl: "https://picsum.photos/id/245/400/300"
    },
    create: {
      id: "pizza-pepperoni",
      name: "Pizza Pepperoni",
      description: "Salsa de tomate, mozzarella y pepperoni",
      price: 219.00,
      imageUrl: "https://picsum.photos/id/245/400/300",
      categoryId: pizzaCategories[0].id,
      businessId: pizza.id
    }
  });

  await prisma.product.upsert({
    where: { id: "pizza-soda" },
    update: {
      imageUrl: "https://picsum.photos/id/246/400/300"
    },
    create: {
      id: "pizza-soda",
      name: "Refresco",
      description: "Coca-Cola, Sprite o Fanta",
      price: 35.00,
      imageUrl: "https://picsum.photos/id/246/400/300",
      categoryId: pizzaCategories[1].id,
      businessId: pizza.id
    }
  });

  await prisma.product.upsert({
    where: { id: "pizza-garlic-bread" },
    update: {
      imageUrl: "https://picsum.photos/id/247/400/300"
    },
    create: {
      id: "pizza-garlic-bread",
      name: "Pan de Ajo",
      description: "Pan tostado con mantequilla de ajo",
      price: 45.00,
      imageUrl: "https://picsum.photos/id/247/400/300",
      categoryId: pizzaCategories[2].id,
      businessId: pizza.id
    }
  });

  // Create modifier groups for DriveByApp
  const drivebyModifierGroups = await Promise.all([
    prisma.modifierGroup.upsert({
      where: { id: "demo-size" },
      update: {},
      create: {
        id: "demo-size",
        name: "Tamaño",
        required: true,
        maxChoices: 1,
        businessId: driveby.id
      }
    }),
    prisma.modifierGroup.upsert({
      where: { id: "demo-extras" },
      update: {},
      create: {
        id: "demo-extras",
        name: "Extras",
        required: false,
        maxChoices: 3,
        businessId: driveby.id
      }
    })
  ]);

  // Create modifier options
  await Promise.all([
    prisma.modifierOption.upsert({
      where: { id: "demo-size-small" },
      update: {},
      create: {
        id: "demo-size-small",
        name: "Chico",
        price: 0,
        modifierGroupId: drivebyModifierGroups[0].id
      }
    }),
    prisma.modifierOption.upsert({
      where: { id: "demo-size-large" },
      update: {},
      create: {
        id: "demo-size-large",
        name: "Grande",
        price: 15.00,
        modifierGroupId: drivebyModifierGroups[0].id
      }
    }),
    prisma.modifierOption.upsert({
      where: { id: "demo-extra-cheese" },
      update: {},
      create: {
        id: "demo-extra-cheese",
        name: "Queso Extra",
        price: 10.00,
        modifierGroupId: drivebyModifierGroups[1].id
      }
    }),
    prisma.modifierOption.upsert({
      where: { id: "demo-extra-bacon" },
      update: {},
      create: {
        id: "demo-extra-bacon",
        name: "Bacon Extra",
        price: 15.00,
        modifierGroupId: drivebyModifierGroups[1].id
      }
    })
  ]);

  // Link modifier groups to products
  await Promise.all([
    prisma.productModifierGroup.upsert({
      where: { id: "demo-burger-1-size" },
      update: {},
      create: {
        id: "demo-burger-1-size",
        productId: "demo-burger-1",
        modifierGroupId: drivebyModifierGroups[0].id
      }
    }),
    prisma.productModifierGroup.upsert({
      where: { id: "demo-burger-1-extras" },
      update: {},
      create: {
        id: "demo-burger-1-extras",
        productId: "demo-burger-1",
        modifierGroupId: drivebyModifierGroups[1].id
      }
    })
  ]);

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


