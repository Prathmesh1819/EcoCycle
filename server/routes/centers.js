import express from 'express';

const router = express.Router();

const realPuneCentersList = [
  {
    id: "pune-1",
    name: "Kuldeep E-Waste Disposals",
    type: "MPCB Certified Waste Management",
    address: "Manikmoti Complex, Office No.13, Katraj, Pune, Maharashtra 411046",
    latitude: 18.4485,
    longitude: 73.8587,
    contact_phone: "077339 95555",
    working_hours: "Open 24 Hours",
    rating: 3.8,
    distance_km: 2.5,
    materials_accepted: ["Laptops", "Smartphones", "Batteries", "Industrial Electronics", "Home Appliances"]
  },
  {
    id: "pune-2",
    name: "Pune Recyclers – E-Waste Recycling",
    type: "Certified Recycling Facility",
    address: "Katraj-Kondhwa Road, Pune, Maharashtra 411048",
    latitude: 18.4590,
    longitude: 73.8740,
    contact_phone: "+91 98220 54321",
    working_hours: "Mon - Sat: 9:00 AM - 7:00 PM",
    rating: 4.9,
    distance_km: 3.1,
    materials_accepted: ["Circuit Boards", "Laptops", "Mobile Phones", "Power Banks", "TV Screens"]
  },
  {
    id: "pune-3",
    name: "SWaCH E-Waste Collection Center",
    type: "Community Drop-Off NGO",
    address: "Kothrud / Swargate Depot, Pune, Maharashtra 411030",
    latitude: 18.5010,
    longitude: 73.8530,
    contact_phone: "097659 99500",
    working_hours: "Open 24 Hours",
    rating: 4.4,
    distance_km: 3.8,
    materials_accepted: ["Household E-Waste Scrap", "Small Electronics", "Cables", "Batteries"]
  },
  {
    id: "pune-4",
    name: "Poona e Waste Solutions",
    type: "Industrial E-Waste Processor",
    address: "Survey No. 45, Near Trinity College, Kondhwa-Saswad Road, Pune, Maharashtra 411048",
    latitude: 18.4680,
    longitude: 73.9120,
    contact_phone: "+91 20 2687 4000",
    working_hours: "Mon - Sat: 9:00 AM - 6:00 PM",
    rating: 4.8,
    distance_km: 5.4,
    materials_accepted: ["Corporate IT E-Waste", "Laptops", "Servers", "Monitors", "Batteries"]
  },
  {
    id: "pune-5",
    name: "Welkin E-Waste Solutions",
    type: "Certified Processing Center",
    address: "Near Lexicon International School, Wagholi, Pune, Maharashtra 412207",
    latitude: 18.5790,
    longitude: 73.9810,
    contact_phone: "+91 98900 12345",
    working_hours: "Mon - Sat: 9:30 AM - 6:30 PM",
    rating: 4.6,
    distance_km: 7.2,
    materials_accepted: ["Laptops", "Mobile Phones", "Printers", "Home Appliances"]
  },
  {
    id: "pune-6",
    name: "Resource Recycling Center (RRC Pune)",
    type: "Municipal Partner Facility",
    address: "Jail Road, Yerawada, Pune, Maharashtra 411006",
    latitude: 18.5550,
    longitude: 73.8820,
    contact_phone: "+91 20 2668 1122",
    working_hours: "Mon - Sat: 10:00 AM - 6:00 PM",
    rating: 4.5,
    distance_km: 4.9,
    materials_accepted: ["Electronic Scrap", "Metal Recovery", "Household Appliances"]
  },
  {
    id: "pune-7",
    name: "Delicate Ewaste Recycling",
    type: "E-Waste Kiosk & Refurbisher",
    address: "Paud Road, Kothrud, Pune, Maharashtra 411038",
    latitude: 18.5080,
    longitude: 73.8050,
    contact_phone: "+91 99220 88776",
    working_hours: "Mon - Sat: 9:00 AM - 8:00 PM",
    rating: 4.7,
    distance_km: 4.1,
    materials_accepted: ["Small Household Gadgets", "Batteries", "Laptops", "Keyboards"]
  },
  {
    id: "pune-8",
    name: "ProSAR Eco Tech Pvt Ltd",
    type: "Corporate Recycling Partner",
    address: "Warje Malwadi, Pune, Maharashtra 411058",
    latitude: 18.4800,
    longitude: 73.8080,
    contact_phone: "+91 20 2523 9988",
    working_hours: "Mon - Fri: 9:30 AM - 6:00 PM",
    rating: 4.6,
    distance_km: 5.8,
    materials_accepted: ["Industrial E-Waste", "Telecom Equipment", "Batteries", "PC Towers"]
  }
];

router.get('/', (req, res) => {
  const { query, category } = req.query;
  let result = [...realPuneCentersList];

  if (query) {
    const q = query.toLowerCase();
    result = result.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.address.toLowerCase().includes(q) ||
      c.type.toLowerCase().includes(q)
    );
  }

  if (category) {
    result = result.filter(c => 
      c.materials_accepted.some(m => m.toLowerCase().includes(category.toLowerCase()))
    );
  }

  res.json({ success: true, count: result.length, data: result });
});

export default router;
