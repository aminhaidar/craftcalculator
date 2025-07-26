# 🎀 Ribbon Calculator - Bow Business Management System

A comprehensive web application for managing ribbon bow businesses, featuring recipe management, inventory tracking, cost calculations, and detailed analytics.

## ✨ Features

### 🎨 **Recipe Management**
- **Visual Bow Designer** - Create and customize bow recipes with layered designs
- **Recipe Library** - Browse and manage your collection of bow recipes
- **Detailed Recipe Pages** - Comprehensive view of each recipe with materials, costs, and usage
- **Recipe Analytics** - Track which recipes are most popular and profitable

### 📦 **Inventory Management**
- **Ribbon Inventory** - Track all your ribbon types, colors, and quantities
- **Visual Inventory Cards** - Easy-to-scan ribbon cards with images and details
- **Stock Tracking** - Monitor inventory levels and reorder points
- **Cost Analysis** - Track ribbon costs and profit margins

### 💰 **Cost Exploration & Calculation**
- **Interactive Cost Explorer** - Real-time cost estimation tool
- **Recipe Integration** - Start with existing recipes or create custom designs
- **Profit Analysis** - Calculate profit margins and suggested pricing
- **Material Efficiency** - Optimize ribbon usage and minimize waste

### 🏠 **Bow Management**
- **Bow Library** - View and manage all your created bows
- **Detailed Bow Pages** - Comprehensive information about each bow
- **Sales Tracking** - Monitor bow performance and sales history
- **Category Organization** - Organize bows by type, season, or occasion

### 🎯 **Business Intelligence**
- **Analytics Dashboard** - Key metrics and business insights
- **Performance Tracking** - Monitor recipe popularity and profitability
- **Cost Optimization** - Identify most cost-effective materials and designs
- **Trend Analysis** - Track seasonal patterns and popular designs

## 🚀 Technology Stack

- **Frontend**: Next.js 14 with App Router
- **UI Components**: Shadcn/ui with Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Type Safety**: TypeScript

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
│   ├── api/               # API routes
│   ├── bow/               # Bow management pages
│   ├── cost-explorer/     # Cost calculation tool
│   ├── inventory/         # Inventory management
│   ├── recipes/           # Recipe management
│   └── ribbons/           # Ribbon detail pages
├── components/            # React components
│   ├── ui/               # Shadcn/ui components
│   └── ...               # Custom components
├── lib/                  # Utility functions and data
│   ├── services/         # Business logic services
│   └── ...               # Data models and utilities
├── prisma/               # Database schema and migrations
└── public/               # Static assets
```

## 🎯 Key Features in Detail

### Recipe Management System
- **Visual Bow Designer**: Create bow recipes with multiple layers, loops, and tails
- **Material Integration**: Link recipes to actual inventory items
- **Cost Calculation**: Real-time cost analysis for each recipe
- **Usage Tracking**: See which bows use each recipe

### Inventory Management
- **Ribbon Catalog**: Comprehensive ribbon database with types, colors, and specifications
- **Stock Tracking**: Monitor inventory levels and set reorder points
- **Cost Tracking**: Track ribbon costs and calculate profit margins
- **Visual Cards**: Easy-to-scan inventory cards with images and details

### Cost Explorer Tool
- **Interactive Design**: Add/remove ribbon layers dynamically
- **Recipe Integration**: Start with existing recipes or create custom designs
- **Real-time Calculations**: Instant cost and profit analysis
- **Material Optimization**: Calculate how many bows you can make from a roll

### Business Analytics
- **Performance Metrics**: Track recipe popularity and profitability
- **Cost Analysis**: Identify most cost-effective materials
- **Trend Tracking**: Monitor seasonal patterns and popular designs
- **Profit Optimization**: Maximize profit margins through data insights

## 🎨 Design System

The application uses a comprehensive design system built with:
- **Shadcn/ui**: Modern, accessible UI components
- **Tailwind CSS**: Utility-first CSS framework
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
- **Ribbons**: Inventory items with types, colors, and costs
- **Recipes**: Bow designs with layered ribbon specifications
- **Bows**: Created bow instances with pricing and sales data
- **Categories**: Organization system for recipes and bows

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

## 📞 Support

If you have any questions or need help with the application, please:
- Open an issue on GitHub
- Check the documentation
- Review the code examples

---

**Built with ❤️ for ribbon bow businesses everywhere** 