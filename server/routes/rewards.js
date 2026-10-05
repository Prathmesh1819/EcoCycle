import express from 'express';

const router = express.Router();

const rewardsCatalog = [
  {
    id: "rw-1",
    title: "$10 Amazon Eco-Gift Card",
    pointsRequired: 200,
    category: "Voucher",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80",
    description: "Redeemable on all eco-certified products on Amazon."
  },
  {
    id: "rw-2",
    title: "Plant 5 Native Trees (Eden Reforestation)",
    pointsRequired: 150,
    category: "Impact",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=400&q=80",
    description: "EcoCycle will plant 5 native trees in damaged ecosystems."
  },
  {
    id: "rw-3",
    title: "Bamboo Tech Accessories Kit",
    pointsRequired: 300,
    category: "Product",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=400&q=80",
    description: "Includes eco-bamboo wireless phone charger and cable organizer."
  },
  {
    id: "rw-4",
    title: "20% Discount at Solar / Clean Energy Store",
    pointsRequired: 100,
    category: "Discount",
    image: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=400&q=80",
    description: "Get 20% off high-efficiency portable solar banks and gear."
  }
];

let userRedemptions = [
  {
    id: "red-1",
    rewardTitle: "Plant 5 Native Trees (Eden Reforestation)",
    pointsSpent: 150,
    voucherCode: "ECO-TREE-88392",
    redeemedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    status: "Active"
  }
];

router.get('/catalog', (req, res) => {
  res.json({ success: true, data: rewardsCatalog });
});

router.get('/history', (req, res) => {
  res.json({ success: true, data: userRedemptions });
});

router.post('/redeem', (req, res) => {
  const { rewardId } = req.body;
  const reward = rewardsCatalog.find(r => r.id === rewardId);
  if (!reward) {
    return res.status(404).json({ success: false, message: 'Reward not found' });
  }

  const newRedemption = {
    id: `red-${Date.now()}`,
    rewardTitle: reward.title,
    pointsSpent: reward.pointsRequired,
    voucherCode: `ECO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    redeemedAt: new Date().toISOString(),
    status: "Active"
  };

  userRedemptions.unshift(newRedemption);
  res.json({ success: true, data: newRedemption });
});

export default router;
