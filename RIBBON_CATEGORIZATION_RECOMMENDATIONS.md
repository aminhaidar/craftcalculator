# Ribbon Categorization System Recommendations

## Based on Craft Outlet's Actual Approach

### Overview
This document outlines the recommended ribbon categorization system based on analysis of Craft Outlet's ribbon collection structure and user behavior patterns.

## Primary Filter Categories (Most Important)

### 1. Roll Length
**Priority: HIGHEST** - This is the most important filter for cost calculations and inventory management.

**Options:**
- 5 yards
- 10 yards  
- 20 yards
- 25 yards
- 30 yards
- 50 yards
- 100 yards
- 500 yards

**Why Important:**
- Directly affects cost per yard calculations
- Determines how many bows can be made from one roll
- Critical for inventory planning and ordering

### 2. Design Type
**Priority: HIGH** - Visual pattern is the primary way users identify ribbons.

**Primary Options (Most Common):**
- Solid
- Check
- Floral
- Plaid
- Polka Dot
- Seasonal Print
- Stripes
- Text
- Windowpane

**Secondary Options:**
- Animal Print
- Basket Weave
- Camouflage
- Chevron
- Damask
- Embroidered
- Geometric
- Harlequin
- Houndstooth
- Marble
- Ombre
- Quatrefoil
- Two Tone

### 3. Ribbon Type (Material)
**Priority: HIGH** - Determines texture, drape, and usage.

**Primary Options (Most Common):**
- Satin
- Grosgrain
- Velvet
- Organza
- Taffeta

**Secondary Options:**
- Cotton
- Lace
- Metallic Foil
- Metallic Lamé
- Glitter
- Burlap & Jute
- Canvas
- Denim
- Dupioni
- Flannel
- Flocked
- Fur
- Poly Mesh
- Sackcloth & Linen
- Sheer
- Tinsel
- Translucent PVC
- Water Resistant
- Webbing
- Wired

### 4. Brand
**Priority: MEDIUM** - Quality and sourcing information.

**Common Options:**
- Craft Outlet
- Offray
- May Arts
- Celebrate It
- Other manufacturers

## Secondary Fields (Supporting)

### 5. Colors
**Priority: MEDIUM** - Visual identification.

**Options:**
- Beige, Black, Blue, Brown, Gold, Green, Grey, Orange, Pink, Purple, Red, Silver, White, Yellow, Iridescent

### 6. Theme
**Priority: LOW** - Seasonal/Thematic categorization.

**Options:**
- Holiday themes (Christmas, Halloween, Easter)
- Seasonal themes (Spring, Summer, Fall, Winter)
- Specialty themes (Wedding, Baby Shower, Team Spirit)
- Character themes (Disney, etc.)

### 7. Width
**Priority: MEDIUM** - Physical measurement.

**Options:**
- 0.625", 0.875", 1.0", 1.5", 2.0", 2.5", 3.0", 4.0", 5.0", 6.0"

### 8. Wired
**Priority: LOW** - Functional property.

**Options:**
- True (for holdable bows)
- False (for drapeable bows)

## Implementation Recommendations

### UI/UX Priority
1. **Roll Length** should be prominently displayed in product cards
2. **Design Type** should be the primary visual identifier
3. **Ribbon Type** should be clearly visible but secondary
4. **Brand** should be available but not prominent

### Filter Order (Like Craft Outlet)
1. Roll Length
2. Design Type  
3. Ribbon Type
4. Brand
5. Colors
6. Theme

### Search Priority
1. Design Type (most searched)
2. Ribbon Type
3. Colors
4. Theme
5. Brand

## Database Schema Recommendations

```sql
-- Primary fields (indexed for fast filtering)
roll_length_yards: INTEGER
design_type: VARCHAR(50)
ribbon_type: VARCHAR(50)
brand: VARCHAR(100)

-- Secondary fields
colors: TEXT[]
theme: VARCHAR(100)
width_inches: DECIMAL(3,2)
wired: BOOLEAN
cost_per_yard: DECIMAL(6,2)
```

## Cost Calculator Integration

The ribbon categorization should support:
- **Cost per yard** calculations based on roll length
- **Yards used** calculations for bow making
- **Waste calculations** based on roll length vs. usage
- **Inventory tracking** by roll length and design type

## Conclusion

This categorization system prioritizes the fields that matter most to bow makers and crafters, following the same pattern used by major ribbon suppliers like Craft Outlet. The focus is on practical, cost-effective ribbon selection that supports accurate pricing and inventory management. 