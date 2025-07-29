// Ribbon inventory data service - in a real app this would come from an API/database

/*
CRAFT OUTLET RIBBON CATEGORIZATION ANALYSIS
==========================================

Based on Craft Outlet's actual ribbon collection structure, here are the most important fields:

PRIMARY FILTERS (Most Important for Users):
1. Roll Length - Physical measurement (50 yards, 25 yards, etc.)
2. Design Type - Pattern/Visual (Solid, Floral, Plaid, etc.)
3. Ribbon Type - Material (Satin, Grosgrain, Velvet, etc.)
4. Brand - Manufacturer (Craft Outlet, etc.)

SECONDARY FIELDS (Supporting):
5. Colors - Visual identification
6. Theme - Seasonal/Thematic (Holiday, Wedding, etc.)
7. Width - Physical measurement
8. Wired - Functional property

This prioritization matches how users actually search and filter ribbons on Craft Outlet.
*/

export interface RibbonInventoryRecord {
  ribbonId: string;
  ribbonType: string;       // e.g., 'Grosgrain', 'Satin', 'Velvet'
  material: string;         // same as ribbonType (Craft Outlet naming)
  wired: boolean;
  widthInches: number;
  rollLengthYards: number;
  designType: string;
  theme?: string;
  colors?: string[];        // craft outlet top-level colors
  availability: 'In stock' | 'Out of stock';
  brand?: string;
  costPerYard?: number;
  supplier?: string;
  lastOrdered?: string;
  inStock?: number;
  minStock?: number;
  maxStock?: number;
  imageUrl?: string;        // URL to ribbon image
}

// Type-ahead dropdown possible values - aligned with Craft Outlet categories
export const RibbonTypeOptions = [
  'Satin',
  'Grosgrain', 
  'Velvet',
  'Organza',
  'Taffeta',
  'Cotton',
  'Lace',
  'Metallic Foil',
  'Metallic Lamé',
  'Glitter',
  'Burlap & Jute',
  'Canvas',
  'Denim',
  'Dupioni',
  'Flannel',
  'Flocked',
  'Fur',
  'Poly Mesh',
  'Sackcloth & Linen',
  'Sheer',
  'Tinsel',
  'Translucent PVC',
  'Water Resistant',
  'Webbing',
  'Wired',
  'Other'
];

export const WidthOptions = [
  0.625, 0.875, 1.0, 1.5, 2.0, 2.5, 3.0, 4.0, 5.0, 6.0
];

export const RollLengthOptions = [5, 10, 20, 25, 30, 50, 100, 500];

export const DesignTypeOptions = [
  'Solid',
  'Check',
  'Floral',
  'Plaid',
  'Polka Dot',
  'Seasonal Print',
  'Stripes',
  'Text',
  'Windowpane',
  'Animal Print',
  'Basket Weave',
  'Camouflage',
  'Chevron',
  'Damask',
  'Embroidered',
  'Geometric',
  'Harlequin',
  'Houndstooth',
  'Marble',
  'Ombre',
  'Quatrefoil',
  'Two Tone'
];

export const ThemeOptions = [
  'Adventures in Wonderland','Angels','Animals','Baby Shower',
  'Back To School','Bats','Beach','Berries','Birch','Birthday',
  'Black and White Halloween','Blue & White Floral','Buffalo Plaid',
  'Bugs Butterflies and Dragonflies','Bumble Bees','Bunny',
  'Candy Cane','Candy Corn','Cardinals','Carrots','Chicks','Christmas Elf',
  'Cinco de Mayo','Clovers and Shamrocks','Cotton','Cowboys & Western',
  'Crimson and White','Daisies','Day of the Dead and Skulls','Deer and Antlers',
  'Dogs and Cats','Ducks','Easter Candy','Easter Eggs','Eyeballs','Farm and Farmhouse',
  'Fishing','Flip Flops','Gardening','Ghosts','Gingerbread','Gnome',
  'Green Monster','Grey and Red Christmas','Hearts','Ladybug','Lemons and Citrus',
  'Nautical','Old Truck','Pumpkins','Santa Claus','Scarecrow','Snow','Snowman',
  'Spider','Spring Birds and Nests','Strawberry','Sunflower','Support Ribbon',
  'Sweet Shop','Team Spirit','Trees','Tropical','Tulips','Unicorn','Watermelon',
  'Wedding','Witch'
];

export const ColorOptions = [
  'Beige','Black','Blue','Brown','Gold','Green','Grey','Orange',
  'Pink','Purple','Red','Silver','White','Yellow','Iridescent'
];

export const AvailabilityOptions = ['In stock','Out of stock'];

// Mock ribbon inventory data
export const ribbonInventoryData: RibbonInventoryRecord[] = [
  {
    ribbonId: "1",
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
    lastOrdered: "2024-01-15",
    inStock: 15,
    minStock: 5,
    maxStock: 25
  },
  {
    ribbonId: "2",
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
    lastOrdered: "2024-01-10",
    inStock: 8,
    minStock: 10,
    maxStock: 20
  },
  {
    ribbonId: "3",
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
    lastOrdered: "2024-01-08",
    inStock: 5,
    minStock: 3,
    maxStock: 15
  },
  {
    ribbonId: "4",
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
    lastOrdered: "2023-12-20",
    inStock: 2,
    minStock: 5,
    maxStock: 25
  },
  {
    ribbonId: "5",
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
    lastOrdered: "2024-01-12",
    inStock: 12,
    minStock: 8,
    maxStock: 20
  },
  {
    ribbonId: "6",
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
    lastOrdered: "2024-01-05",
    inStock: 10,
    minStock: 5,
    maxStock: 20
  },
  {
    ribbonId: "7",
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
    lastOrdered: "2024-01-18",
    inStock: 7,
    minStock: 5,
    maxStock: 20
  },
  {
    ribbonId: "8",
    ribbonType: "Grosgrain",
    material: "Grosgrain",
    wired: false,
    widthInches: 1.0,
    rollLengthYards: 20,
    designType: "Stripes",
    colors: ["Red", "White", "Blue"],
    theme: "Team Spirit",
    availability: "In stock",
    brand: "Craft Outlet",
    costPerYard: 2.99,
    supplier: "Craft Outlet",
    lastOrdered: "2024-01-20",
    inStock: 15,
    minStock: 10,
    maxStock: 25
  },
  {
    ribbonId: "9",
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
    lastOrdered: "2024-01-18",
    inStock: 7,
    minStock: 5,
    maxStock: 20
  },
  {
    ribbonId: "10",
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
    lastOrdered: "2024-01-22",
    inStock: 8,
    minStock: 3,
    maxStock: 15
  },
  {
    ribbonId: "11",
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
    lastOrdered: "2024-01-25",
    inStock: 20,
    minStock: 10,
    maxStock: 30
  },
  {
    ribbonId: "12",
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
    lastOrdered: "2024-01-28",
    inStock: 12,
    minStock: 5,
    maxStock: 20
  }
];

export function getAllRibbons(): RibbonInventoryRecord[] {
  return ribbonInventoryData;
}

export function getRibbonById(id: string): RibbonInventoryRecord | undefined {
  return ribbonInventoryData.find(ribbon => ribbon.ribbonId === id);
}

export function addNewRibbon(ribbon: Omit<RibbonInventoryRecord, 'ribbonId'>): RibbonInventoryRecord {
  const newId = (Math.max(...ribbonInventoryData.map(r => parseInt(r.ribbonId))) + 1).toString();
  const newRibbon: RibbonInventoryRecord = {
    ...ribbon,
    ribbonId: newId,
    lastOrdered: new Date().toISOString().split('T')[0]
  };
  ribbonInventoryData.push(newRibbon);
  return newRibbon;
}

export function updateRibbon(updatedRibbon: RibbonInventoryRecord): void {
  const index = ribbonInventoryData.findIndex(ribbon => ribbon.ribbonId === updatedRibbon.ribbonId);
  if (index !== -1) {
    ribbonInventoryData[index] = updatedRibbon;
  }
}

export function deleteRibbon(id: string): void {
  const index = ribbonInventoryData.findIndex(ribbon => ribbon.ribbonId === id);
  if (index !== -1) {
    ribbonInventoryData.splice(index, 1);
  }
}

export function searchRibbons(query: string): RibbonInventoryRecord[] {
  const lowercaseQuery = query.toLowerCase();
  return ribbonInventoryData.filter(ribbon => 
    ribbon.ribbonType.toLowerCase().includes(lowercaseQuery) ||
    ribbon.designType.toLowerCase().includes(lowercaseQuery) ||
    ribbon.colors?.some(color => color.toLowerCase().includes(lowercaseQuery)) ||
    ribbon.theme?.toLowerCase().includes(lowercaseQuery) ||
    ribbon.brand?.toLowerCase().includes(lowercaseQuery)
  );
} 