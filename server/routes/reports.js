import express from 'express';

const router = express.Router();

router.get('/summary', (req, res) => {
  res.json({
    success: true,
    data: {
      generatedAt: new Date().toISOString(),
      totalUsers: 1480,
      totalPickups: 3290,
      completedPickups: 2950,
      totalEWasteWeightKg: 8450.5,
      totalCO2SavedKg: 35490.0,
      treesEquivalentSaved: 1613,
      materialsRecovered: {
        goldGrams: 124.5,
        silverGrams: 980.0,
        copperKg: 1450.0,
        aluminumKg: 2890.0,
        plasticsKg: 3120.0
      },
      categoryAnalysis: [
        { category: "Laptops & Computers", count: 1120, percentage: 34 },
        { category: "Smartphones & Tablets", count: 980, percentage: 30 },
        { category: "Batteries", count: 650, percentage: 20 },
        { category: "Monitors & Displays", count: 390, percentage: 12 },
        { category: "Small Home Appliances", count: 150, percentage: 4 }
      ],
      monthlyTrends: [
        { month: "Jan", items: 210, co2Saved: 2200 },
        { month: "Feb", items: 280, co2Saved: 3100 },
        { month: "Mar", items: 340, co2Saved: 3800 },
        { month: "Apr", items: 410, co2Saved: 4500 },
        { month: "May", items: 490, co2Saved: 5300 },
        { month: "Jun", items: 580, co2Saved: 6400 },
        { month: "Jul", items: 680, co2Saved: 7500 }
      ]
    }
  });
});

export default router;
