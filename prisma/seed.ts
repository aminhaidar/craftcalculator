import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  await prisma.sale.deleteMany()
  await prisma.bowMaterial.deleteMany()
  await prisma.bow.deleteMany()
  await prisma.recipeLayer.deleteMany()
  await prisma.recipe.deleteMany()
  await prisma.ribbon.deleteMany()

  console.log('🗑️  Cleared existing data')

  // Create ribbons
  const ribbons = await Promise.all([
    prisma.ribbon.create({
      data: {
        ribbonType: "Satin",
        material: "Satin",
        wired: false,
        widthInches: 1.5,
        rollLengthYards: 25,
        designType: "Solid",
        colors: ["Pink"],
        availability: "In stock",
        brand: "Craft Outlet",
        costPerYard: 2.99,
        supplier: "Craft Outlet",
        lastOrdered: new Date("2024-01-15"),
        inStock: 15,
        minStock: 5,
        maxStock: 25
      }
    }),
    prisma.ribbon.create({
      data: {
        ribbonType: "Grosgrain",
        material: "Grosgrain",
        wired: false,
        widthInches: 1.0,
        rollLengthYards: 20,
        designType: "Solid",
        colors: ["Blue"],
        availability: "In stock",
        brand: "Craft Outlet",
        costPerYard: 1.99,
        supplier: "Craft Outlet",
        lastOrdered: new Date("2024-01-10"),
        inStock: 8,
        minStock: 10,
        maxStock: 20
      }
    }),
    prisma.ribbon.create({
      data: {
        ribbonType: "Velvet",
        material: "Velvet",
        wired: false,
        widthInches: 2.0,
        rollLengthYards: 10,
        designType: "Solid",
        colors: ["Green"],
        availability: "In stock",
        brand: "Craft Outlet",
        costPerYard: 4.99,
        supplier: "Craft Outlet",
        lastOrdered: new Date("2024-01-08"),
        inStock: 5,
        minStock: 3,
        maxStock: 15
      }
    }),
    prisma.ribbon.create({
      data: {
        ribbonType: "Satin",
        material: "Satin",
        wired: false,
        widthInches: 1.5,
        rollLengthYards: 25,
        designType: "Solid",
        colors: ["Red"],
        availability: "In stock",
        brand: "Craft Outlet",
        costPerYard: 2.99,
        supplier: "Craft Outlet",
        lastOrdered: new Date("2023-12-20"),
        inStock: 2,
        minStock: 5,
        maxStock: 25
      }
    }),
    prisma.ribbon.create({
      data: {
        ribbonType: "Metallic Foil",
        material: "Metallic Foil",
        wired: false,
        widthInches: 0.875,
        rollLengthYards: 30,
        designType: "Solid",
        colors: ["Gold"],
        availability: "In stock",
        brand: "Craft Outlet",
        costPerYard: 3.99,
        supplier: "Craft Outlet",
        lastOrdered: new Date("2024-01-12"),
        inStock: 12,
        minStock: 8,
        maxStock: 20
      }
    }),
    prisma.ribbon.create({
      data: {
        ribbonType: "Grosgrain",
        material: "Grosgrain",
        wired: false,
        widthInches: 1.5,
        rollLengthYards: 20,
        designType: "Polka Dot",
        colors: ["White", "Black"],
        availability: "In stock",
        brand: "Craft Outlet",
        costPerYard: 2.49,
        supplier: "Craft Outlet",
        lastOrdered: new Date("2024-01-05"),
        inStock: 10,
        minStock: 5,
        maxStock: 20
      }
    }),
    prisma.ribbon.create({
      data: {
        ribbonType: "Satin",
        material: "Satin",
        wired: false,
        widthInches: 2.5,
        rollLengthYards: 25,
        designType: "Floral",
        colors: ["Pink", "Green"],
        theme: "Spring Birds and Nests",
        availability: "In stock",
        brand: "Craft Outlet",
        costPerYard: 3.99,
        supplier: "Craft Outlet",
        lastOrdered: new Date("2024-01-18"),
        inStock: 7,
        minStock: 5,
        maxStock: 20
      }
    }),
    prisma.ribbon.create({
      data: {
        ribbonType: "Velvet",
        material: "Velvet",
        wired: false,
        widthInches: 1.5,
        rollLengthYards: 15,
        designType: "Solid",
        colors: ["Purple"],
        theme: "Wedding",
        availability: "In stock",
        brand: "Craft Outlet",
        costPerYard: 5.99,
        supplier: "Craft Outlet",
        lastOrdered: new Date("2024-01-22"),
        inStock: 8,
        minStock: 3,
        maxStock: 15
      }
    }),
    prisma.ribbon.create({
      data: {
        ribbonType: "Grosgrain",
        material: "Grosgrain",
        wired: false,
        widthInches: 1.0,
        rollLengthYards: 30,
        designType: "Check",
        colors: ["Red", "Black"],
        theme: "Buffalo Plaid",
        availability: "In stock",
        brand: "Craft Outlet",
        costPerYard: 2.79,
        supplier: "Craft Outlet",
        lastOrdered: new Date("2024-01-25"),
        inStock: 20,
        minStock: 10,
        maxStock: 30
      }
    }),
    prisma.ribbon.create({
      data: {
        ribbonType: "Metallic Foil",
        material: "Metallic Foil",
        wired: false,
        widthInches: 0.875,
        rollLengthYards: 25,
        designType: "Solid",
        colors: ["Silver"],
        theme: "Wedding",
        availability: "In stock",
        brand: "Craft Outlet",
        costPerYard: 4.49,
        supplier: "Craft Outlet",
        lastOrdered: new Date("2024-01-28"),
        inStock: 12,
        minStock: 5,
        maxStock: 20
      }
    })
  ])

  console.log(`🎀 Created ${ribbons.length} ribbons`)

  // Create recipes
  const recipes = await Promise.all([
    prisma.recipe.create({
      data: {
        name: "Classic Double Loop",
        description: "Simple and elegant two-layer bow design",
        category: "Classic",
        difficulty: "Easy",
        estimatedTime: "10-15 minutes",
        tags: ["Classic", "Simple", "Gift"],
        layers: {
          create: [
            {
              ribbonId: ribbons[0].id, // Pink Satin
              color: "#ff5a8c",
              loops: [{ quantity: 4, length: 6 }],
              tails: [{ quantity: 2, length: 8 }],
              streamers: [],
              order: 0
            },
            {
              ribbonId: ribbons[1].id, // Blue Grosgrain
              color: "#5a9cff",
              loops: [{ quantity: 3, length: 5 }],
              tails: [{ quantity: 2, length: 6 }],
              streamers: [],
              order: 1
            }
          ]
        }
      }
    }),
    prisma.recipe.create({
      data: {
        name: "Layered Garden Bow",
        description: "Multi-layered design with flowing streamers",
        category: "Garden",
        difficulty: "Medium",
        estimatedTime: "20-25 minutes",
        tags: ["Garden", "Layered", "Elegant"],
        layers: {
          create: [
            {
              ribbonId: ribbons[6].id, // Pink Floral Satin
              color: "#ff5a8c",
              loops: [{ quantity: 5, length: 7 }],
              tails: [{ quantity: 3, length: 10 }],
              streamers: [],
              order: 0
            },
            {
              ribbonId: ribbons[2].id, // Green Velvet
              color: "#5aff8c",
              loops: [{ quantity: 4, length: 6 }],
              tails: [{ quantity: 2, length: 8 }],
              streamers: [],
              order: 1
            },
            {
              ribbonId: ribbons[1].id, // Blue Grosgrain
              color: "#5a9cff",
              loops: [{ quantity: 3, length: 5 }],
              tails: [{ quantity: 2, length: 6 }],
              streamers: [],
              order: 2
            }
          ]
        }
      }
    }),
    prisma.recipe.create({
      data: {
        name: "Holiday Triple Layer",
        description: "Festive three-layer bow perfect for holidays",
        category: "Holiday",
        difficulty: "Hard",
        estimatedTime: "25-30 minutes",
        tags: ["Holiday", "Festive", "Triple"],
        layers: {
          create: [
            {
              ribbonId: ribbons[3].id, // Red Satin
              color: "#ff5a5a",
              loops: [{ quantity: 6, length: 8 }],
              tails: [{ quantity: 4, length: 12 }],
              streamers: [],
              order: 0
            },
            {
              ribbonId: ribbons[4].id, // Gold Metallic
              color: "#ffd700",
              loops: [{ quantity: 5, length: 7 }],
              tails: [{ quantity: 3, length: 10 }],
              streamers: [],
              order: 1
            },
            {
              ribbonId: ribbons[2].id, // Green Velvet
              color: "#5aff8c",
              loops: [{ quantity: 4, length: 6 }],
              tails: [{ quantity: 2, length: 8 }],
              streamers: [],
              order: 2
            }
          ]
        }
      }
    })
  ])

  console.log(`📝 Created ${recipes.length} recipes`)

  // Create sample bows
  const bows = await Promise.all([
    prisma.bow.create({
      data: {
        name: "Spring Garden Bow",
        description: "Beautiful spring-themed bow with floral patterns",
        totalCost: 8.50,
        targetPrice: 18.00,
        profit: 9.50,
        profitMargin: 52.8,
        status: "excellent",
        timeToMake: "15-20 minutes",
        difficulty: "Medium",
        category: "Garden",
        tags: ["Spring", "Garden", "Floral"],
        layers: 3,
        recipeId: recipes[1].id,
        materials: {
          create: [
            {
              ribbonId: ribbons[6].id,
              name: "Pink Floral Satin",
              quantity: "35 inches",
              cost: 3.88
            },
            {
              ribbonId: ribbons[2].id,
              name: "Green Velvet",
              quantity: "32 inches",
              cost: 4.44
            },
            {
              ribbonId: ribbons[1].id,
              name: "Blue Grosgrain",
              quantity: "27 inches",
              cost: 1.49
            }
          ]
        }
      }
    }),
    prisma.bow.create({
      data: {
        name: "Classic Red Bow",
        description: "Timeless red satin bow for any occasion",
        totalCost: 6.25,
        targetPrice: 14.00,
        profit: 7.75,
        profitMargin: 55.4,
        status: "excellent",
        timeToMake: "10-15 minutes",
        difficulty: "Easy",
        category: "Classic",
        tags: ["Classic", "Red", "Simple"],
        layers: 2,
        recipeId: recipes[0].id,
        materials: {
          create: [
            {
              ribbonId: ribbons[0].id,
              name: "Pink Satin",
              quantity: "32 inches",
              cost: 2.66
            },
            {
              ribbonId: ribbons[1].id,
              name: "Blue Grosgrain",
              quantity: "27 inches",
              cost: 1.49
            }
          ]
        }
      }
    }),
    prisma.bow.create({
      data: {
        name: "Holiday Celebration Bow",
        description: "Festive holiday bow with metallic accents",
        totalCost: 12.75,
        targetPrice: 25.00,
        profit: 12.25,
        profitMargin: 49.0,
        status: "excellent",
        timeToMake: "25-30 minutes",
        difficulty: "Hard",
        category: "Holiday",
        tags: ["Holiday", "Festive", "Metallic"],
        layers: 3,
        recipeId: recipes[2].id,
        materials: {
          create: [
            {
              ribbonId: ribbons[3].id,
              name: "Red Satin",
              quantity: "56 inches",
              cost: 4.66
            },
            {
              ribbonId: ribbons[4].id,
              name: "Gold Metallic",
              quantity: "45 inches",
              cost: 4.99
            },
            {
              ribbonId: ribbons[2].id,
              name: "Green Velvet",
              quantity: "32 inches",
              cost: 4.44
            }
          ]
        }
      }
    })
  ])

  console.log(`🎀 Created ${bows.length} bows`)

  // Create sample sales
  const sales = await Promise.all([
    prisma.sale.create({
      data: {
        bowId: bows[0].id,
        quantity: 2,
        price: 18.00,
        customer: "Sarah Johnson",
        notes: "For spring wedding decorations"
      }
    }),
    prisma.sale.create({
      data: {
        bowId: bows[1].id,
        quantity: 1,
        price: 14.00,
        customer: "Mike Chen",
        notes: "Gift for anniversary"
      }
    }),
    prisma.sale.create({
      data: {
        bowId: bows[2].id,
        quantity: 3,
        price: 25.00,
        customer: "Emily Davis",
        notes: "Christmas decorations"
      }
    })
  ])

  console.log(`💰 Created ${sales.length} sales records`)

  console.log('✅ Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 