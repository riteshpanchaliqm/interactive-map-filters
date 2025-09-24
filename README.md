# Interactive Map with Filters

A sophisticated React application that visualizes voter data on an interactive map with real state boundaries for California, New York, and Wyoming. Features comprehensive filtering, heatmap visualization, and detailed voter analysis.

## 🗺️ Features

### **Real State Boundaries**
- **California**: Complete coastline and state boundaries
- **New York**: Full state boundary with all geographic features
- **Wyoming**: Proper rectangular state shape
- **Interactive**: Click on states to see detailed voter information

### **Advanced Filtering System**
- **137K+ Voter Records**: Comprehensive dataset from `wycany.csv`
- **Dynamic Categories**: Auto-generated filter categories from taxonomies
- **Search Functionality**: Find specific voter segments quickly
- **Real-time Analysis**: Instant updates when filters are applied

### **Heatmap Visualization**
- **Color-coded States**: Visual representation of voter segment density
- **Interactive Map**: Powered by MapLibre GL for smooth performance
- **Responsive Design**: Works on desktop and mobile devices
- **Professional UI**: Built with shadcn/ui components

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/riteshpanchaliqm/interactive-map-filters.git
cd interactive-map-filters

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Architecture

### **Frontend Stack**
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **MapLibre GL** - Interactive mapping library
- **shadcn/ui** - Professional UI components
- **Tailwind CSS** - Utility-first styling

### **Data Processing**
- **CSV Parser** - Handles 137K+ voter records
- **Taxonomy Extraction** - Dynamic filter generation
- **Voter Analysis Engine** - 4-step calculation process
- **State Population Integration** - Real demographic data

### **Key Components**

#### **FilterSidebar.tsx**
- Dynamic filter categories
- Search functionality
- Real-time analysis results
- Loading states and error handling

#### **MapView.tsx**
- MapLibre GL integration
- Real state boundaries (GeoJSON)
- Heatmap visualization
- Interactive state selection

#### **dataLoader.ts**
- CSV data processing
- Voter analysis algorithms
- Taxonomy extraction
- State population calculations

## 📊 Data Sources

### **Voter Data**
- **File**: `Data/wycany.csv` (137,416 records)
- **Format**: state_code, taxonomy, segment, population_pct
- **Coverage**: Multiple voter segments and demographics

### **State Boundaries**
- **Source**: US Census Bureau cartographic data
- **Format**: GeoJSON with accurate state boundaries
- **States**: California, New York, Wyoming

### **Taxonomies**
- **File**: `Data/all_taxonomies.txt` (2,866 categories)
- **Usage**: Dynamic filter generation
- **Categories**: Demographics, political views, consumer data

## 🎯 Voter Analysis Process

The application implements a sophisticated 4-step voter analysis:

1. **Filter Application**: Select specific voter segments
2. **Percentage Summation**: Aggregate matching percentages
3. **Cross-Taxonomy Multiplication**: Calculate combined effects
4. **State Population Application**: Convert to actual voter counts

## 🎨 UI/UX Features

### **Professional Design**
- Clean, modern interface
- Responsive layout
- Loading indicators
- Error handling
- Accessibility features

### **Interactive Elements**
- Real-time filter updates
- Clickable state boundaries
- Hover effects
- Smooth animations
- Mobile-friendly navigation

## 🔧 Development

### **Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### **Project Structure**
```
src/
├── components/          # React components
│   ├── FilterSidebar.tsx
│   ├── MapView.tsx
│   └── ui/             # shadcn/ui components
├── data/               # GeoJSON and data files
├── utils/              # Data processing utilities
└── styles/             # CSS and styling
```

## 🌟 Key Features

- ✅ **Real State Boundaries** - Accurate geographic shapes
- ✅ **Interactive Heatmap** - Color-coded voter density
- ✅ **Dynamic Filtering** - 137K+ voter records
- ✅ **Professional UI** - Modern, responsive design
- ✅ **Real-time Analysis** - Instant voter calculations
- ✅ **Mobile Support** - Works on all devices
- ✅ **TypeScript** - Type-safe development
- ✅ **Performance** - Optimized for large datasets

## 📈 Performance

- **Fast Loading**: Optimized data processing
- **Smooth Interactions**: 60fps map rendering
- **Efficient Filtering**: Debounced search and analysis
- **Memory Management**: Optimized for large datasets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- **Live Demo**: [GitHub Pages](https://riteshpanchaliqm.github.io/interactive-map-filters)
- **Repository**: [GitHub](https://github.com/riteshpanchaliqm/interactive-map-filters)
- **Issues**: [GitHub Issues](https://github.com/riteshpanchaliqm/interactive-map-filters/issues)

---

Built with ❤️ using React, TypeScript, and MapLibre GL