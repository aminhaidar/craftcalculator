# 🎀 Bow Cost Calculator - Complete Business Management System

A comprehensive web application for ribbon bow businesses, featuring an advanced cost calculator wizard, recipe management, inventory tracking, and detailed analytics. Built with Next.js 15, TypeScript, and modern UI components.

## ✨ Core Features

### 🧮 **Advanced Bow Cost Calculator Wizard**
The heart of the application - a sophisticated 3-step wizard for designing and pricing bows:

#### **Step 1: Design Your Bow**
- **Multi-Layer Design**: Add unlimited ribbon layers with different types and specifications
- **Smart Ribbon Selection**: Choose from predefined ribbon types or add custom ones
- **Quick Select Options**: One-click buttons for common values:
  - Loop counts: 3, 4, 5, 6, 8, 10, 12
  - Loop lengths: 3", 4", 5", 6", 8", 10", 12"
  - Streamer counts: 0, 1, 2, 3, 4, 6
  - Streamer lengths: 8", 10", 12", 15", 18", 20", 24"
- **Automatic Calculations**: 
  - Yards used per bow (calculated from total inches)
  - Cost per yard (calculated from total cost ÷ total yards)
  - Real-time running total with live updates
- **Ribbon Reuse Logic**: When adding layers, choose to reuse ribbon from previous layers or add new ribbon details
- **Mobile-Optimized**: Number pad support for numeric inputs, responsive design

#### **Step 2: Confirm Bow Design**
- **Design Summary**: Review all layer specifications before pricing
- **Material Breakdown**: See ribbon types, quantities, and costs for each layer
- **Visual Confirmation**: Staggered animations for easy review

#### **Step 3: Pricing Analysis & Recommendations**
- **Multiple Pricing Strategies**:
  - **Conservative**: 50% markup for competitive pricing
  - **Recommended**: 60% markup for balanced profit
  - **Premium**: 67% markup for high-end positioning
- **Comprehensive Metrics**:
  - Materials cost per bow
  - Profit per bow
  - Bows per roll (25-yard rolls)
  - Time estimates per roll
  - Cost per inch and profit per inch
- **Business Intelligence**:
  - Total profit potential from one roll
  - Efficiency metrics for optimization
  - Time investment analysis

### 📦 **Inventory Management**
- **Ribbon Catalog**: Track ribbon types, colors, widths, costs, and quantities
- **Visual Inventory Cards**: Easy-to-scan cards with images and specifications
- **Stock Tracking**: Monitor inventory levels and set reorder points
- **Cost Analysis**: Track ribbon costs and calculate profit margins
- **Usage Analytics**: See which ribbons are used in which recipes

### 🎨 **Recipe Management**
- **Visual Bow Designer**: Create and customize bow recipes with layered designs
- **Recipe Library**: Browse and manage your collection of bow recipes
- **Detailed Recipe Pages**: Comprehensive view with materials, costs, and usage
- **Recipe Analytics**: Track which recipes are most popular and profitable
- **Material Integration**: Link recipes to actual inventory items

### 🏠 **Bow Management**
- **Bow Library**: View and manage all your created bows
- **Detailed Bow Pages**: Comprehensive information about each bow
- **Sales Tracking**: Monitor bow performance and sales history
- **Category Organization**: Organize bows by type, season, or occasion

### 💰 **Cost Explorer Tool**
- **Interactive Cost Explorer**: Real-time cost estimation tool
- **Recipe Integration**: Start with existing recipes or create custom designs
- **Profit Analysis**: Calculate profit margins and suggested pricing
- **Material Efficiency**: Optimize ribbon usage and minimize waste

## 🚀 Technology Stack

- **Frontend**: Next.js 15 with App Router
- **UI Components**: Shadcn/ui with Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **State Management**: React Hooks with Framer Motion animations
- **Type Safety**: TypeScript
- **Deployment**: Render.com with automatic deployments

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm, yarn, or pnpm

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aminhaidar/craftcalculator.git
   cd craftcalculator
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your database connection:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/ribbon_calculator"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
ribbon-calculator/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes for CRUD operations
│   │   ├── bows/          # Bow management API
│   │   ├── recipes/       # Recipe management API
│   │   └── ribbons/       # Ribbon inventory API
│   ├── bows/              # Bow management pages
│   ├── cost-explorer/     # Cost calculation tool
│   ├── inventory/         # Inventory management
│   ├── recipes/           # Recipe management
│   └── ribbons/           # Ribbon detail pages
├── components/            # React components
│   ├── ui/               # Shadcn/ui components
│   ├── cost-estimator-wizard.tsx  # Main calculator wizard
│   ├── cost-explorer.tsx # Cost exploration tool
│   ├── bow-library.tsx   # Bow management
│   ├── ribbon-inventory.tsx # Inventory management
│   └── recipe-manager.tsx # Recipe management
├── lib/                  # Utility functions and data
│   ├── services/         # Business logic services
│   ├── db.ts            # Database connection
│   ├── bow-data.ts      # Bow recipe data
│   └── ribbon-data.ts   # Ribbon inventory data
├── hooks/               # Custom React hooks
│   └── use-api-data.ts  # API data fetching
├── prisma/              # Database schema and migrations
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Sample data seeding
└── public/              # Static assets
```

## 🎯 How the Calculator Wizard Works

### **Step-by-Step Process**

1. **Design Phase (Step 1)**:
   - Add ribbon layers with type, cost, and yardage
   - Configure loops and streamers with quick-select options
   - See real-time cost calculations and running totals
   - Choose to reuse ribbon from previous layers

2. **Confirmation Phase (Step 2)**:
   - Review all design specifications
   - Confirm ribbon choices and quantities
   - Validate calculations before pricing

3. **Pricing Phase (Step 3)**:
   - Get multiple pricing strategy recommendations
   - View comprehensive business metrics
   - Analyze profit potential and efficiency

### **Key Calculations**

- **Yards Used**: `(loops × loop length + streamers × streamer length) ÷ 36`
- **Cost Per Yard**: `total ribbon cost ÷ total ribbon yards`
- **Total Cost**: `yards used × cost per yard`
- **Bows Per Roll**: `25 yards ÷ yards used per bow`
- **Profit Per Bow**: `selling price - total cost`
- **Profit Margin**: `(profit ÷ selling price) × 100`

### **Pricing Strategies**

- **Conservative (50% markup)**: For competitive markets
- **Recommended (60% markup)**: Balanced profit approach
- **Premium (67% markup)**: High-end positioning

## 🎨 Design System

The application uses a comprehensive design system built with:
- **Shadcn/ui**: Modern, accessible UI components
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **Custom Theme**: Consistent color palette and typography
- **Responsive Design**: Works perfectly on all devices
- **Dark Mode**: Full dark mode support

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Database Management

```bash
npx prisma studio    # Open Prisma Studio
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema changes
npx prisma db seed   # Seed database with sample data
```

## 📊 Database Schema

The application uses PostgreSQL with the following main entities:

### **Ribbons**
- `id`: Unique identifier
- `ribbonType`: Type of ribbon (Satin, Grosgrain, etc.)
- `colors`: Array of available colors
- `widthInches`: Width in inches
- `costPerYard`: Cost per yard
- `rollLengthYards`: Length of roll
- `quantity`: Available quantity

### **Recipes**
- `id`: Unique identifier
- `name`: Recipe name
- `description`: Recipe description
- `difficulty`: Difficulty level
- `estimatedTime`: Time to make
- `layers`: Array of layer specifications
- `tags`: Recipe tags

### **Bows**
- `id`: Unique identifier
- `name`: Bow name
- `recipeId`: Associated recipe
- `price`: Selling price
- `cost`: Material cost
- `profit`: Profit margin

## 🚀 Deployment

The application is configured for deployment on Render.com:

- **Automatic Deployments**: Triggers on git push
- **Environment Variables**: Configured for production
- **Database**: PostgreSQL with Prisma
- **Build Process**: Optimized Next.js build

See `DEPLOYMENT.md` and `DEPLOYMENT_EXISTING_DB.md` for detailed deployment instructions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Shadcn/ui** for the beautiful component library
- **Next.js** for the amazing React framework
- **Prisma** for the excellent database toolkit
- **Tailwind CSS** for the utility-first styling approach
- **Framer Motion** for smooth animations
- **Render.com** for seamless deployment

## 📞 Support

If you have any questions or need help with the application, please:
- Open an issue on GitHub
- Check the documentation
- Review the code examples

---

**Built with ❤️ for ribbon bow businesses everywhere**

*Transform your bow-making business with precise cost calculations and professional pricing strategies.* 