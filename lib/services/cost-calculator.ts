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

export interface OptimizationSuggestion {
  type: 'loops' | 'loopLength' | 'streamers' | 'streamerLength' | 'ribbonYards';
  currentValue: number;
  suggestedValue: number;
  improvement: string;
  wasteReduction: number;
  bowsPerRollIncrease: number;
  priority: 'high' | 'medium' | 'low';
}

export interface RibbonUsageSummary {
  percentUsed: number;
  wasteYards: number;
  recommendation: string;
  bowsPerRoll: number;
  totalYardsUsed: number;
  rollsNeeded: number;
  totalWaste: number;
  efficiency: 'excellent' | 'good' | 'poor';
  optimizationSuggestions: OptimizationSuggestion[];
  maxBowsPossible: number;
  optimalBowsPerRoll: number;
}

export const calculateRibbonUsageSummary = (
  usedYards: number, 
  rollYards: number = 25,
  loops: number = 0,
  loopLength: number = 0,
  streamers: number = 0,
  streamerLength: number = 0
): RibbonUsageSummary => {
  const percentUsed = (usedYards / rollYards) * 100;
  const wasteYards = rollYards - usedYards;
  const bowsPerRoll = Math.floor(rollYards / usedYards);
  
  let recommendation = 'Optimized usage';
  let efficiency: 'excellent' | 'good' | 'poor' = 'good';
  const optimizationSuggestions: OptimizationSuggestion[] = [];
  
  // Calculate optimization suggestions
  if (wasteYards > 0.5) { // Only suggest optimizations if there's significant waste
    const suggestions = generateOptimizationSuggestions(
      usedYards, rollYards, loops, loopLength, streamers, streamerLength
    );
    optimizationSuggestions.push(...suggestions);
  }
  
  if (wasteYards > 2) {
    const additionalBows = Math.floor(wasteYards / usedYards);
    recommendation = `Consider making ${additionalBows} more small bows to use the remaining ${wasteYards.toFixed(2)} yards`;
    efficiency = 'poor';
  } else if (wasteYards > 1) {
    recommendation = `Consider making a small bow to use remaining ${wasteYards.toFixed(2)} yards`;
    efficiency = 'good';
  } else if (percentUsed >= 95) {
    recommendation = 'Excellent ribbon efficiency!';
    efficiency = 'excellent';
  }
  
  // Calculate optimal bows per roll
  const optimalBowsPerRoll = Math.floor(rollYards / usedYards);
  const maxBowsPossible = Math.floor(rollYards / usedYards);
  
  return { 
    percentUsed, 
    wasteYards, 
    recommendation,
    bowsPerRoll,
    totalYardsUsed: usedYards,
    rollsNeeded: 1,
    totalWaste: wasteYards,
    efficiency,
    optimizationSuggestions,
    maxBowsPossible,
    optimalBowsPerRoll
  };
};

const generateOptimizationSuggestions = (
  usedYards: number,
  rollYards: number,
  loops: number,
  loopLength: number,
  streamers: number,
  streamerLength: number
): OptimizationSuggestion[] => {
  const suggestions: OptimizationSuggestion[] = [];
  const wasteYards = rollYards - usedYards;
  
  // Calculate current metrics
  const currentBowsPerRoll = Math.floor(rollYards / usedYards);
  const currentWaste = wasteYards;
  
  // Suggestion 1: Optimize loop length
  if (loops > 0 && loopLength > 0) {
    const currentLoopYards = (loops * 2 * loopLength) / 36;
    const streamerYards = (streamers * streamerLength) / 36;
    
    // Try different loop lengths to find optimal
    for (let newLoopLength = Math.max(1, loopLength - 2); newLoopLength <= loopLength + 2; newLoopLength += 0.5) {
      const newLoopYards = (loops * 2 * newLoopLength) / 36;
      const newTotalYards = newLoopYards + streamerYards;
      const newBowsPerRoll = Math.floor(rollYards / newTotalYards);
      const newWaste = rollYards - (newTotalYards * newBowsPerRoll);
      
      if (newBowsPerRoll > currentBowsPerRoll && newWaste < currentWaste) {
        suggestions.push({
          type: 'loopLength',
          currentValue: loopLength,
          suggestedValue: newLoopLength,
          improvement: `Increase bows per roll from ${currentBowsPerRoll} to ${newBowsPerRoll}`,
          wasteReduction: currentWaste - newWaste,
          bowsPerRollIncrease: newBowsPerRoll - currentBowsPerRoll,
          priority: newBowsPerRoll - currentBowsPerRoll >= 2 ? 'high' : 'medium'
        });
        break;
      }
    }
  }
  
  // Suggestion 2: Optimize number of loops
  if (loops > 0 && loopLength > 0) {
    const streamerYards = (streamers * streamerLength) / 36;
    
    for (let newLoops = Math.max(1, loops - 1); newLoops <= loops + 2; newLoops++) {
      const newLoopYards = (newLoops * 2 * loopLength) / 36;
      const newTotalYards = newLoopYards + streamerYards;
      const newBowsPerRoll = Math.floor(rollYards / newTotalYards);
      const newWaste = rollYards - (newTotalYards * newBowsPerRoll);
      
      if (newBowsPerRoll > currentBowsPerRoll && newWaste < currentWaste) {
        suggestions.push({
          type: 'loops',
          currentValue: loops,
          suggestedValue: newLoops,
          improvement: `Increase bows per roll from ${currentBowsPerRoll} to ${newBowsPerRoll}`,
          wasteReduction: currentWaste - newWaste,
          bowsPerRollIncrease: newBowsPerRoll - currentBowsPerRoll,
          priority: newBowsPerRoll - currentBowsPerRoll >= 2 ? 'high' : 'medium'
        });
        break;
      }
    }
  }
  
  // Suggestion 3: Optimize streamer length
  if (streamers > 0 && streamerLength > 0) {
    const loopYards = (loops * 2 * loopLength) / 36;
    
    for (let newStreamerLength = Math.max(1, streamerLength - 3); newStreamerLength <= streamerLength + 3; newStreamerLength += 1) {
      const newStreamerYards = (streamers * newStreamerLength) / 36;
      const newTotalYards = loopYards + newStreamerYards;
      const newBowsPerRoll = Math.floor(rollYards / newTotalYards);
      const newWaste = rollYards - (newTotalYards * newBowsPerRoll);
      
      if (newBowsPerRoll > currentBowsPerRoll && newWaste < currentWaste) {
        suggestions.push({
          type: 'streamerLength',
          currentValue: streamerLength,
          suggestedValue: newStreamerLength,
          improvement: `Increase bows per roll from ${currentBowsPerRoll} to ${newBowsPerRoll}`,
          wasteReduction: currentWaste - newWaste,
          bowsPerRollIncrease: newBowsPerRoll - currentBowsPerRoll,
          priority: newBowsPerRoll - currentBowsPerRoll >= 2 ? 'high' : 'medium'
        });
        break;
      }
    }
  }
  
  // Suggestion 4: Optimize number of streamers
  if (streamers > 0 && streamerLength > 0) {
    const loopYards = (loops * 2 * loopLength) / 36;
    
    for (let newStreamers = Math.max(1, streamers - 1); newStreamers <= streamers + 1; newStreamers++) {
      const newStreamerYards = (newStreamers * streamerLength) / 36;
      const newTotalYards = loopYards + newStreamerYards;
      const newBowsPerRoll = Math.floor(rollYards / newTotalYards);
      const newWaste = rollYards - (newTotalYards * newBowsPerRoll);
      
      if (newBowsPerRoll > currentBowsPerRoll && newWaste < currentWaste) {
        suggestions.push({
          type: 'streamers',
          currentValue: streamers,
          suggestedValue: newStreamers,
          improvement: `Increase bows per roll from ${currentBowsPerRoll} to ${newBowsPerRoll}`,
          wasteReduction: currentWaste - newWaste,
          bowsPerRollIncrease: newBowsPerRoll - currentBowsPerRoll,
          priority: newBowsPerRoll - currentBowsPerRoll >= 2 ? 'high' : 'medium'
        });
        break;
      }
    }
  }
  
  // Sort suggestions by priority and impact
  return suggestions.sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority === 'high' ? -1 : b.priority === 'high' ? 1 : 0;
    }
    return b.bowsPerRollIncrease - a.bowsPerRollIncrease;
  }).slice(0, 3); // Limit to top 3 suggestions
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
      efficiency,
      optimizationSuggestions: [], // For multi-layer, we'd need more complex logic
      maxBowsPossible: bowsPerRoll,
      optimalBowsPerRoll: bowsPerRoll
    };
  });

  return results;
}; 