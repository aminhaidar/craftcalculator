export interface CostBreakdown {
  baseCost: number;
  vendorFee: number;
  tax: number;
  shippingCost: number;
  total: number;
}

export interface VendorInfo {
  name: string;
  vendorFeePct: number;
  avgShipping: number;
}

export const calculateTotalCost = (
  baseCost: number,
  vendorFeePct: number,
  taxPct: number,
  shippingCost: number
): CostBreakdown => {
  const vendorFee = baseCost * vendorFeePct;
  const tax = (baseCost + vendorFee) * taxPct;
  const total = baseCost + vendorFee + tax + shippingCost;
  
  return {
    baseCost,
    vendorFee,
    tax,
    shippingCost,
    total
  };
};

export const calculateYardsUsed = (
  loops: number,
  loopLengthInches: number,
  streamers: number,
  streamerLengthInches: number
): number => {
  // Each loop uses 2x the loop length (front and back)
  const loopYards = (loops * 2 * loopLengthInches) / 36;
  const streamerYards = (streamers * streamerLengthInches) / 36;
  return loopYards + streamerYards;
};

export interface RibbonUsageSummary {
  percentUsed: number;
  wasteYards: number;
  recommendation: string;
  bowsPerRoll: number;
  totalYardsUsed: number;
  rollsNeeded: number;
  totalWaste: number;
  efficiency: 'excellent' | 'good' | 'poor';
}

export const calculateRibbonUsageSummary = (
  usedYards: number, 
  rollYards: number = 25
): RibbonUsageSummary => {
  const percentUsed = (usedYards / rollYards) * 100;
  const wasteYards = rollYards - usedYards;
  const bowsPerRoll = Math.floor(rollYards / usedYards);
  
  let recommendation = 'Optimized usage';
  let efficiency: 'excellent' | 'good' | 'poor' = 'good';
  
  if (wasteYards > 2) {
    recommendation = `Consider making ${Math.floor(wasteYards / usedYards)} more small bows to use the remaining ${wasteYards.toFixed(2)} yards`;
    efficiency = 'poor';
  } else if (wasteYards > 1) {
    recommendation = `Consider making a small bow to use remaining ${wasteYards.toFixed(2)} yards`;
    efficiency = 'good';
  } else if (percentUsed >= 95) {
    recommendation = 'Excellent ribbon efficiency!';
    efficiency = 'excellent';
  }
  
  return { 
    percentUsed, 
    wasteYards, 
    recommendation,
    bowsPerRoll,
    totalYardsUsed: usedYards,
    rollsNeeded: 1,
    totalWaste: wasteYards,
    efficiency
  };
};

export const calculateMultiLayerRibbonUsage = (
  layers: Array<{
    ribbonType: string;
    ribbonYards: number;
    yardsUsed: number;
  }>,
  rollYards: number = 25
) => {
  // Group layers by ribbon type
  const ribbonGroups = layers.reduce((groups, layer) => {
    if (!groups[layer.ribbonType]) {
      groups[layer.ribbonType] = [];
    }
    groups[layer.ribbonType].push(layer);
    return groups;
  }, {} as Record<string, typeof layers>);

  const results: Record<string, RibbonUsageSummary> = {};

  Object.entries(ribbonGroups).forEach(([ribbonType, ribbonLayers]) => {
    const totalYardsUsed = ribbonLayers.reduce((sum, layer) => sum + layer.yardsUsed, 0);
    const totalRollYards = ribbonLayers.reduce((sum, layer) => sum + layer.ribbonYards, 0);
    
    const percentUsed = (totalYardsUsed / totalRollYards) * 100;
    const wasteYards = totalRollYards - totalYardsUsed;
    const bowsPerRoll = Math.floor(totalRollYards / totalYardsUsed);
    const rollsNeeded = Math.ceil(totalYardsUsed / rollYards);
    
    let recommendation = 'Optimized usage';
    let efficiency: 'excellent' | 'good' | 'poor' = 'good';
    
    if (wasteYards > 2) {
      const additionalBows = Math.floor(wasteYards / totalYardsUsed);
      recommendation = `Consider making ${additionalBows} more bows to use the remaining ${wasteYards.toFixed(2)} yards`;
      efficiency = 'poor';
    } else if (wasteYards > 1) {
      recommendation = `Consider making a small bow to use remaining ${wasteYards.toFixed(2)} yards`;
      efficiency = 'good';
    } else if (percentUsed >= 95) {
      recommendation = 'Excellent ribbon efficiency!';
      efficiency = 'excellent';
    }
    
    results[ribbonType] = {
      percentUsed,
      wasteYards,
      recommendation,
      bowsPerRoll,
      totalYardsUsed,
      rollsNeeded,
      totalWaste: wasteYards,
      efficiency
    };
  });

  return results;
}; 