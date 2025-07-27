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

export const calculateRibbonUsageSummary = (
  usedYards: number, 
  rollYards: number = 25
) => {
  const percentUsed = (usedYards / rollYards) * 100;
  const wasteYards = rollYards - usedYards;
  const recommendation =
    wasteYards > 1
      ? `Consider making a small bow to use remaining ${wasteYards.toFixed(2)} yards`
      : 'Optimized usage';
  
  return { 
    percentUsed, 
    wasteYards, 
    recommendation,
    bowsPerRoll: Math.floor(rollYards / usedYards)
  };
}; 