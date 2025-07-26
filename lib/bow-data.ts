// Bow data service - in a real app this would come from an API/database
export interface Bow {
  id: string
  name: string
  description: string
  image: string
  totalCost: number
  targetPrice: number
  profit: number
  profitMargin: number
  status: "excellent" | "good" | "low"
  createdAt: string
  ribbons: string[]
  layers: number
  timeToMake: string
  difficulty: "Easy" | "Medium" | "Hard"
  category: string
  tags: string[]
  materials: {
    name: string
    quantity: string
    cost: number
  }[]
  instructions: string[]
  salesHistory: {
    month: string
    sales: number
    revenue: number
  }[]
}

export const bowData: Bow[] = [
  {
    id: "1",
    name: "Spring Garden Bow",
    description: "Beautiful pink and green bow perfect for spring occasions. This elegant design features multiple layers of satin ribbon with delicate streamers that add a touch of whimsy. Perfect for gift wrapping, hair accessories, or home decoration.",
    image: "",
    totalCost: 8.45,
    targetPrice: 18.99,
    profit: 10.54,
    profitMargin: 55.5,
    status: "excellent",
    createdAt: "2024-01-15",
    ribbons: ["Pink Satin", "Green Velvet"],
    layers: 2,
    timeToMake: "12-15 minutes",
    difficulty: "Medium",
    category: "Seasonal",
    tags: ["Spring", "Gift", "Elegant", "Multi-layer"],
    materials: [
      { name: "Pink Satin Ribbon", quantity: "24 inches", cost: 4.32 },
      { name: "Green Velvet Ribbon", quantity: "18 inches", cost: 3.15 },
      { name: "Floral Picks", quantity: "2 pieces", cost: 0.50 },
      { name: "Wire", quantity: "6 inches", cost: 0.48 }
    ],
    instructions: [
      "Cut pink satin ribbon to 24 inches",
      "Create 4 loops of 6 inches each",
      "Cut green velvet ribbon to 18 inches",
      "Create 2 loops of 9 inches each",
      "Layer ribbons and secure with wire",
      "Add floral picks for accent",
      "Trim and shape tails"
    ],
    salesHistory: [
      { month: "Jan", sales: 12, revenue: 227.88 },
      { month: "Feb", sales: 8, revenue: 151.92 },
      { month: "Mar", sales: 15, revenue: 284.85 },
      { month: "Apr", sales: 22, revenue: 417.78 }
    ]
  },
  {
    id: "2",
    name: "Classic Red Bow",
    description: "Traditional red bow for holidays and special events. A timeless design that never goes out of style. Perfect for Christmas decorations, Valentine's Day gifts, or any festive occasion.",
    image: "",
    totalCost: 6.2,
    targetPrice: 12.99,
    profit: 6.79,
    profitMargin: 52.3,
    status: "excellent",
    createdAt: "2024-01-12",
    ribbons: ["Red Satin"],
    layers: 1,
    timeToMake: "8-10 minutes",
    difficulty: "Easy",
    category: "Holiday",
    tags: ["Christmas", "Valentine", "Classic", "Red"],
    materials: [
      { name: "Red Satin Ribbon", quantity: "36 inches", cost: 5.40 },
      { name: "Wire", quantity: "4 inches", cost: 0.32 },
      { name: "Hot Glue", quantity: "1 stick", cost: 0.48 }
    ],
    instructions: [
      "Cut red satin ribbon to 36 inches",
      "Create 6 loops of 6 inches each",
      "Secure center with wire",
      "Add hot glue for stability",
      "Trim and shape tails"
    ],
    salesHistory: [
      { month: "Jan", sales: 8, revenue: 103.92 },
      { month: "Feb", sales: 15, revenue: 194.85 },
      { month: "Mar", sales: 6, revenue: 77.94 },
      { month: "Apr", sales: 4, revenue: 51.96 }
    ]
  },
  {
    id: "3",
    name: "Blue Ocean Waves",
    description: "Multi-layered blue bow with flowing streamers that mimic ocean waves. This sophisticated design features contrasting shades of blue with elegant streamers that add movement and grace.",
    image: "",
    totalCost: 12.3,
    targetPrice: 24.99,
    profit: 12.69,
    profitMargin: 50.8,
    status: "excellent",
    createdAt: "2024-01-10",
    ribbons: ["Blue Grosgrain", "Light Blue Satin"],
    layers: 3,
    timeToMake: "18-22 minutes",
    difficulty: "Hard",
    category: "Ocean",
    tags: ["Ocean", "Blue", "Elegant", "Multi-layer", "Streamers"],
    materials: [
      { name: "Blue Grosgrain Ribbon", quantity: "30 inches", cost: 4.50 },
      { name: "Light Blue Satin", quantity: "24 inches", cost: 3.60 },
      { name: "Navy Blue Ribbon", quantity: "18 inches", cost: 2.70 },
      { name: "Wire", quantity: "8 inches", cost: 0.64 },
      { name: "Hot Glue", quantity: "1 stick", cost: 0.48 },
      { name: "Pearl Accents", quantity: "3 pieces", cost: 0.38 }
    ],
    instructions: [
      "Cut blue grosgrain ribbon to 30 inches",
      "Create 5 loops of 6 inches each",
      "Cut light blue satin to 24 inches",
      "Create 4 loops of 6 inches each",
      "Cut navy blue ribbon to 18 inches",
      "Create 3 loops of 6 inches each",
      "Layer ribbons from largest to smallest",
      "Secure with wire and hot glue",
      "Add pearl accents",
      "Create flowing streamers"
    ],
    salesHistory: [
      { month: "Jan", sales: 6, revenue: 149.94 },
      { month: "Feb", sales: 4, revenue: 99.96 },
      { month: "Mar", sales: 8, revenue: 199.92 },
      { month: "Apr", sales: 12, revenue: 299.88 }
    ]
  },
  {
    id: "4",
    name: "Autumn Harvest",
    description: "Warm orange and brown bow for fall decorations. This cozy design captures the essence of autumn with rich, earthy tones perfect for seasonal decor and harvest celebrations.",
    image: "",
    totalCost: 9.75,
    targetPrice: 16.99,
    profit: 7.24,
    profitMargin: 42.6,
    status: "good",
    createdAt: "2024-01-08",
    ribbons: ["Orange Velvet", "Brown Satin"],
    layers: 2,
    timeToMake: "15-18 minutes",
    difficulty: "Medium",
    category: "Seasonal",
    tags: ["Autumn", "Fall", "Orange", "Brown", "Harvest"],
    materials: [
      { name: "Orange Velvet Ribbon", quantity: "28 inches", cost: 5.60 },
      { name: "Brown Satin Ribbon", quantity: "20 inches", cost: 3.00 },
      { name: "Wire", quantity: "6 inches", cost: 0.48 },
      { name: "Hot Glue", quantity: "1 stick", cost: 0.48 },
      { name: "Fall Leaves", quantity: "2 pieces", cost: 0.19 }
    ],
    instructions: [
      "Cut orange velvet ribbon to 28 inches",
      "Create 4 loops of 7 inches each",
      "Cut brown satin ribbon to 20 inches",
      "Create 3 loops of 6.5 inches each",
      "Layer ribbons and secure with wire",
      "Add hot glue for stability",
      "Attach fall leaf accents",
      "Trim and shape tails"
    ],
    salesHistory: [
      { month: "Jan", sales: 3, revenue: 50.97 },
      { month: "Feb", sales: 2, revenue: 33.98 },
      { month: "Mar", sales: 1, revenue: 16.99 },
      { month: "Apr", sales: 0, revenue: 0 }
    ]
  },
  {
    id: "5",
    name: "Purple Princess",
    description: "Elegant purple bow with sparkly accents. This regal design features rich purple tones with metallic silver accents, perfect for special occasions and royal-themed events.",
    image: "",
    totalCost: 11.2,
    targetPrice: 14.99,
    profit: 3.79,
    profitMargin: 25.3,
    status: "low",
    createdAt: "2024-01-05",
    ribbons: ["Purple Satin", "Silver Ribbon"],
    layers: 2,
    timeToMake: "20-25 minutes",
    difficulty: "Hard",
    category: "Special Occasion",
    tags: ["Purple", "Elegant", "Princess", "Silver", "Special"],
    materials: [
      { name: "Purple Satin Ribbon", quantity: "32 inches", cost: 4.80 },
      { name: "Silver Metallic Ribbon", quantity: "24 inches", cost: 4.80 },
      { name: "Wire", quantity: "8 inches", cost: 0.64 },
      { name: "Hot Glue", quantity: "1 stick", cost: 0.48 },
      { name: "Crystal Accents", quantity: "4 pieces", cost: 0.48 }
    ],
    instructions: [
      "Cut purple satin ribbon to 32 inches",
      "Create 6 loops of 5.5 inches each",
      "Cut silver metallic ribbon to 24 inches",
      "Create 4 loops of 6 inches each",
      "Layer ribbons carefully to avoid damage",
      "Secure with wire and hot glue",
      "Add crystal accents strategically",
      "Shape and trim with precision"
    ],
    salesHistory: [
      { month: "Jan", sales: 2, revenue: 29.98 },
      { month: "Feb", sales: 1, revenue: 14.99 },
      { month: "Mar", sales: 0, revenue: 0 },
      { month: "Apr", sales: 1, revenue: 14.99 }
    ]
  },
  {
    id: "6",
    name: "Summer Sunshine",
    description: "Bright yellow bow that brings joy and warmth. This cheerful design radiates positivity with its vibrant yellow color, perfect for summer celebrations and sunny occasions.",
    image: "",
    totalCost: 7.85,
    targetPrice: 19.99,
    profit: 12.14,
    profitMargin: 60.7,
    status: "excellent",
    createdAt: "2024-01-03",
    ribbons: ["Yellow Grosgrain"],
    layers: 1,
    timeToMake: "10-12 minutes",
    difficulty: "Easy",
    category: "Summer",
    tags: ["Summer", "Yellow", "Bright", "Cheerful", "Sunshine"],
    materials: [
      { name: "Yellow Grosgrain Ribbon", quantity: "42 inches", cost: 6.30 },
      { name: "Wire", quantity: "6 inches", cost: 0.48 },
      { name: "Hot Glue", quantity: "1 stick", cost: 0.48 },
      { name: "Sunflower Accent", quantity: "1 piece", cost: 0.59 }
    ],
    instructions: [
      "Cut yellow grosgrain ribbon to 42 inches",
      "Create 7 loops of 6 inches each",
      "Secure center with wire",
      "Add hot glue for stability",
      "Attach sunflower accent",
      "Trim and shape tails"
    ],
    salesHistory: [
      { month: "Jan", sales: 4, revenue: 79.96 },
      { month: "Feb", sales: 3, revenue: 59.97 },
      { month: "Mar", sales: 5, revenue: 99.95 },
      { month: "Apr", sales: 8, revenue: 159.92 }
    ]
  }
]

export function getBowById(id: string): Bow | undefined {
  return bowData.find(bow => bow.id === id)
}

export function getAllBows(): Bow[] {
  return bowData
}

export function updateBow(updatedBow: Bow): void {
  const index = bowData.findIndex(bow => bow.id === updatedBow.id)
  if (index !== -1) {
    bowData[index] = updatedBow
  }
}

export function addNewBow(bow: Omit<Bow, 'id'>): Bow {
  const newId = (Math.max(...bowData.map(b => parseInt(b.id))) + 1).toString()
  const newBow: Bow = {
    ...bow,
    id: newId,
    createdAt: new Date().toISOString().split('T')[0]
  }
  bowData.push(newBow)
  return newBow
}

// Recipe management
export interface BowRecipe {
  id: string
  name: string
  description: string
  layers: {
    ribbonId: string
    ribbonName: string
    color: string
    loops: { quantity: number; length: number }[]
    tails: { quantity: number; length: number }[]
  }[]
  category: string
  difficulty: "Easy" | "Medium" | "Hard"
  estimatedTime: string
  tags: string[]
}

// Mock recipe data
export const bowRecipes: BowRecipe[] = [
  {
    id: "1",
    name: "Classic Double Loop",
    description: "Simple and elegant two-layer bow design",
    category: "Classic",
    difficulty: "Easy",
    estimatedTime: "10-15 minutes",
    tags: ["Classic", "Simple", "Gift"],
    layers: [
      {
        ribbonId: "1",
        ribbonName: "Satin Ribbon",
        color: "#ef4444",
        loops: [{ quantity: 4, length: 6 }],
        tails: [{ quantity: 2, length: 8 }]
      },
      {
        ribbonId: "2",
        ribbonName: "Grosgrain Ribbon",
        color: "#dc2626",
        loops: [{ quantity: 3, length: 5 }],
        tails: [{ quantity: 2, length: 6 }]
      }
    ]
  },
  {
    id: "2",
    name: "Layered Garden Bow",
    description: "Multi-layered design with flowing streamers",
    category: "Garden",
    difficulty: "Medium",
    estimatedTime: "20-25 minutes",
    tags: ["Garden", "Layered", "Elegant"],
    layers: [
      {
        ribbonId: "1",
        ribbonName: "Pink Satin",
        color: "#ec4899",
        loops: [{ quantity: 5, length: 7 }],
        tails: [{ quantity: 3, length: 10 }]
      },
      {
        ribbonId: "3",
        ribbonName: "Green Velvet",
        color: "#16a34a",
        loops: [{ quantity: 4, length: 6 }],
        tails: [{ quantity: 2, length: 8 }]
      },
      {
        ribbonId: "2",
        ribbonName: "White Grosgrain",
        color: "#ffffff",
        loops: [{ quantity: 3, length: 5 }],
        tails: [{ quantity: 2, length: 6 }]
      }
    ]
  },
  {
    id: "3",
    name: "Holiday Triple Layer",
    description: "Festive three-layer bow perfect for holidays",
    category: "Holiday",
    difficulty: "Hard",
    estimatedTime: "25-30 minutes",
    tags: ["Holiday", "Festive", "Triple"],
    layers: [
      {
        ribbonId: "4",
        ribbonName: "Red Satin",
        color: "#dc2626",
        loops: [{ quantity: 6, length: 8 }],
        tails: [{ quantity: 4, length: 12 }]
      },
      {
        ribbonId: "5",
        ribbonName: "Gold Metallic",
        color: "#fbbf24",
        loops: [{ quantity: 5, length: 7 }],
        tails: [{ quantity: 3, length: 10 }]
      },
      {
        ribbonId: "3",
        ribbonName: "Green Velvet",
        color: "#16a34a",
        loops: [{ quantity: 4, length: 6 }],
        tails: [{ quantity: 2, length: 8 }]
      }
    ]
  }
]

export function getAllRecipes(): BowRecipe[] {
  return bowRecipes
}

export function getRecipeById(id: string): BowRecipe | undefined {
  return bowRecipes.find(recipe => recipe.id === id)
}

export function addNewRecipe(recipe: Omit<BowRecipe, 'id'>): BowRecipe {
  const newId = (Math.max(...bowRecipes.map(r => parseInt(r.id))) + 1).toString()
  const newRecipe: BowRecipe = {
    ...recipe,
    id: newId
  }
  bowRecipes.push(newRecipe)
  return newRecipe
}

export function updateRecipe(updatedRecipe: BowRecipe): void {
  const index = bowRecipes.findIndex(recipe => recipe.id === updatedRecipe.id)
  if (index !== -1) {
    bowRecipes[index] = updatedRecipe
  }
}

export function deleteRecipe(id: string): void {
  const index = bowRecipes.findIndex(recipe => recipe.id === id)
  if (index !== -1) {
    bowRecipes.splice(index, 1)
  }
} 