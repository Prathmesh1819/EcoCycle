import express from 'express';

const router = express.Router();

// Mock store for in-memory persistence alongside database sync
let pickupRequests = [
  {
    id: "p-1001",
    pickup_id: "ECO-849201",
    item_name: "MacBook Pro 15-inch 2017",
    category: "Laptop",
    brand: "Apple",
    condition: "Non-functional / Damaged Battery",
    quantity: 1,
    approx_weight_kg: 2.1,
    preferred_date: "2026-08-02",
    preferred_time_slot: "10:00 AM - 12:00 PM",
    address: "Plot 18, Balewadi High Street, Baner, Pune 411045",
    gps_latitude: 18.5590,
    gps_longitude: 73.7868,
    notes: "Swollen battery casing, handle with care.",
    status: "Accepted",
    assigned_agent_id: "agent-01",
    agent_name: "Marcus Vance",
    earned_points: 100,
    co2_saved_kg: 14.5,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80"]
  },
  {
    id: "p-1002",
    pickup_id: "ECO-849202",
    item_name: "Galaxy S10 Smartphone & Chargers",
    category: "Phone",
    brand: "Samsung",
    condition: "Used / Broken Screen",
    quantity: 2,
    approx_weight_kg: 0.6,
    preferred_date: "2026-08-04",
    preferred_time_slot: "02:00 PM - 04:00 PM",
    address: "Ideal Colony, Paud Road, Kothrud, Pune 411038",
    gps_latitude: 18.5074,
    gps_longitude: 73.8077,
    notes: "Box containing phone and 3 USB-C cables.",
    status: "Pending",
    assigned_agent_id: null,
    earned_points: 40,
    co2_saved_kg: 4.2,
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80"]
  },
  {
    id: "p-1003",
    pickup_id: "ECO-849199",
    item_name: "Dell UltraSharp 27-inch Monitor",
    category: "Monitor",
    brand: "Dell",
    condition: "Flickering Display",
    quantity: 1,
    approx_weight_kg: 5.8,
    preferred_date: "2026-07-28",
    preferred_time_slot: "11:00 AM - 01:00 PM",
    address: "55 Eco Plaza, Suite 12",
    gps_latitude: 37.7690,
    gps_longitude: -122.4480,
    notes: "Original box included.",
    status: "Completed",
    assigned_agent_id: "agent-01",
    agent_name: "Marcus Vance",
    earned_points: 60,
    co2_saved_kg: 22.0,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    images: ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80"]
  }
];

// Get all pickups (supports status filter & search query)
router.get('/', (req, res) => {
  const { status, search } = req.query;
  let result = [...pickupRequests];

  if (status && status !== 'All') {
    result = result.filter(p => p.status.toLowerCase() === status.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(p =>
      p.item_name.toLowerCase().includes(q) ||
      p.pickup_id.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.address.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, count: result.length, data: result });
});

// Create new pickup request
router.post('/', (req, res) => {
  try {
    const data = req.body;
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    const newPickup = {
      id: `p-${Date.now()}`,
      pickup_id: `ECO-${randomCode}`,
      item_name: data.item_name || 'E-Waste Item',
      category: data.category || 'Electronics',
      brand: data.brand || 'Generic',
      condition: data.condition || 'Used',
      quantity: parseInt(data.quantity) || 1,
      approx_weight_kg: parseFloat(data.approx_weight_kg) || 1.0,
      preferred_date: data.preferred_date || new Date().toISOString().split('T')[0],
      preferred_time_slot: data.preferred_time_slot || '09:00 AM - 12:00 PM',
      address: data.address || 'Address provided',
      gps_latitude: data.gps_latitude || 37.7749,
      gps_longitude: data.gps_longitude || -122.4194,
      notes: data.notes || '',
      status: 'Pending',
      assigned_agent_id: null,
      earned_points: calculatePoints(data.category, data.quantity),
      co2_saved_kg: calculateCO2(data.category, data.quantity, data.approx_weight_kg),
      created_at: new Date().toISOString(),
      images: data.images && data.images.length > 0 ? data.images : ["https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80"]
    };

    pickupRequests.unshift(newPickup);
    res.status(201).json({ success: true, data: newPickup });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Update status or assign agent
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const { status, assigned_agent_id, agent_name } = req.body;

  const index = pickupRequests.findIndex(p => p.id === id || p.pickup_id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Pickup not found' });
  }

  if (status) pickupRequests[index].status = status;
  if (assigned_agent_id) pickupRequests[index].assigned_agent_id = assigned_agent_id;
  if (agent_name) pickupRequests[index].agent_name = agent_name;

  res.json({ success: true, data: pickupRequests[index] });
});

function calculatePoints(category, qty = 1) {
  const cat = (category || '').toLowerCase();
  let points = 30;
  if (cat.includes('laptop') || cat.includes('pc') || cat.includes('computer')) points = 100;
  else if (cat.includes('phone') || cat.includes('tablet')) points = 40;
  else if (cat.includes('battery')) points = 20;
  else if (cat.includes('monitor') || cat.includes('display') || cat.includes('tv')) points = 60;
  else if (cat.includes('appliance')) points = 150;
  return points * (parseInt(qty) || 1);
}

function calculateCO2(category, qty = 1, weight = 1) {
  const w = parseFloat(weight) || 1.5;
  return (w * 4.2 * (parseInt(qty) || 1)).toFixed(1);
}

export default router;
