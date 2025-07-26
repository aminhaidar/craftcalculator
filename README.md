# Ribbon Calculator

A comprehensive bow design and inventory management application with PostgreSQL database integration.

## Features

- **🎀 Bow Design Wizard**: Create custom bow designs with step-by-step guidance
- **📦 Inventory Management**: Track ribbon stock, costs, and suppliers
- **📝 Recipe System**: Save and reuse bow design recipes
- **💰 Cost Analysis**: Real-time profit margin calculations
- **📊 Sales Tracking**: Monitor sales history and performance
- **🔍 Search & Filter**: Find ribbons, recipes, and bows quickly

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: Shadcn/ui, Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Form Handling**: React Hook Form with Zod validation

## Database Schema

### Tables

1. **Ribbons**: Inventory management with detailed ribbon specifications
2. **Recipes**: Reusable bow design templates with layer configurations
3. **Bows**: Individual bow designs with cost analysis and materials
4. **Sales**: Transaction history and customer information
5. **Relations**: Proper foreign key relationships between all entities

### Key Features

- **Type Safety**: Full TypeScript integration with Prisma
- **Relationships**: Proper foreign key constraints and cascading deletes
- **Search**: Full-text search capabilities across multiple fields
- **Performance**: Optimized queries with proper indexing

## Setup Instructions

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

### 1. Clone and Install

```bash
git clone <repository-url>
cd ribbon-calculator
npm install
```

### 2. Database Setup

#### Option A: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a new database:
   ```sql
   CREATE DATABASE ribbon_calculator;
   ```
3. Update `.env` file with your database credentials:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/ribbon_calculator?schema=public"
   ```

#### Option B: Cloud Database (Recommended)

1. Set up a PostgreSQL database on your preferred cloud provider:
   - [Neon](https://neon.tech) (Free tier available)
   - [Supabase](https://supabase.com) (Free tier available)
   - [Railway](https://railway.app) (Free tier available)
   - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)

2. Copy the connection string to your `.env` file

### 3. Database Migration and Seeding

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

### 4. Development

```bash
# Start development server
npm run dev

# Open Prisma Studio (database GUI)
npm run db:studio
```

## API Endpoints

### Ribbons
- `GET /api/ribbons` - Get all ribbons
- `GET /api/ribbons?q=search` - Search ribbons
- `POST /api/ribbons` - Create new ribbon
- `GET /api/ribbons/[id]` - Get ribbon by ID
- `PUT /api/ribbons/[id]` - Update ribbon
- `DELETE /api/ribbons/[id]` - Delete ribbon

### Recipes
- `GET /api/recipes` - Get all recipes
- `POST /api/recipes` - Create new recipe
- `GET /api/recipes/[id]` - Get recipe by ID
- `PUT /api/recipes/[id]` - Update recipe
- `DELETE /api/recipes/[id]` - Delete recipe

### Bows
- `GET /api/bows` - Get all bows
- `POST /api/bows` - Create new bow
- `GET /api/bows/[id]` - Get bow by ID
- `PUT /api/bows/[id]` - Update bow
- `DELETE /api/bows/[id]` - Delete bow

### Sales
- `GET /api/sales` - Get sales statistics
- `POST /api/sales` - Record new sale

## Database Services

The application uses service classes for database operations:

- `RibbonService`: Ribbon inventory management
- `RecipeService`: Recipe creation and management
- `BowService`: Bow design and sales tracking

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ribbon_calculator?schema=public"

# Next Auth (optional)
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

## Development Commands

```bash
# Database operations
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema changes
npm run db:seed        # Seed database with sample data
npm run db:studio      # Open Prisma Studio

# Application
npm run dev            # Start development server
npm run build          # Build for production
npm run start          # Start production server
npm run lint           # Run ESLint
```

## Sample Data

The seed script creates:

- **8 Ribbons**: Various types (Satin, Grosgrain, Velvet, Metallic)
- **3 Recipes**: Classic, Garden, and Holiday designs
- **3 Bows**: Sample bow designs with cost analysis
- **3 Sales**: Sample transaction records

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details 