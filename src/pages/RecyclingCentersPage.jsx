import React, { useState, useEffect } from 'react';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import { fetchRecyclingCenters } from '../services/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import {
  MapPin,
  Search,
  Star,
  Clock,
  Phone,
  Navigation,
  CheckCircle2,
  Building,
  Filter
} from 'lucide-react';
import L from 'leaflet';

// Custom Leaflet Green Pin Icon
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function RecyclingCentersPage() {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedCenter, setSelectedCenter] = useState(null);

  useEffect(() => {
    fetchRecyclingCenters({ query: searchQuery, category: categoryFilter })
      .then(res => {
        if (res.data) setCenters(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [searchQuery, categoryFilter]);

  // Pune, Maharashtra Baseline Coordinates (Katraj / Swargate / Kothrud Centroid)
  const puneBaseline = [18.5089, 73.8567];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-6">
          
          {/* Header Banner */}
          <div className="rounded-3xl p-6 bg-gradient-to-r from-eco-950 via-emerald-950 to-dark-900 text-white border border-eco-500/30 shadow-xl">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2.5 rounded-2xl bg-eco-500/20 text-emerald-400 border border-eco-500/30">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-white">E-Waste Recycling Centers in Pune, Maharashtra</h1>
                <p className="text-xs text-gray-200 font-medium">
                  Verified MPCB-approved recyclers & collection points across Katraj, Swargate, Kothrud, Wagholi, Yerawada, and Warje.
                </p>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="glass-card rounded-2xl p-4 border border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Pune centers (e.g. Kuldeep, SWaCH, Poona E-Waste, Katraj, Kothrud)..."
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-eco-500"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto shrink-0">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2.5 text-sm rounded-xl bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-eco-500"
              >
                <option value="">All Materials</option>
                <option value="Laptop">Laptops & PCs</option>
                <option value="Smartphones">Smartphones</option>
                <option value="Batteries">Batteries</option>
                <option value="Monitors">Monitors & Screens</option>
              </select>
            </div>
          </div>

          {/* Interactive Map & List Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            
            {/* Map Canvas Container */}
            <div className="lg:col-span-2 glass-card rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 relative z-10 h-full">
              <MapContainer center={puneBaseline} zoom={12} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {centers.map(center => (
                  <Marker key={center.id} position={[center.latitude, center.longitude]} icon={greenIcon}>
                    <Popup>
                      <div className="p-1 font-sans">
                        <h4 className="font-bold text-sm text-gray-900">{center.name}</h4>
                        <p className="text-xs text-gray-600">{center.address}</p>
                        <p className="text-[11px] text-gray-500 mt-1">📞 {center.contact_phone}</p>
                        <p className="text-[11px] font-semibold text-emerald-600">Rating: ⭐ {center.rating}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            {/* Pune Centers Sidebar */}
            <div className="glass-card rounded-3xl p-4 border border-gray-200 dark:border-gray-800 overflow-y-auto space-y-3 h-full">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white px-2">
                Pune Centers Found ({centers.length})
              </h3>

              {centers.map(center => (
                <div
                  key={center.id}
                  onClick={() => setSelectedCenter(center)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedCenter?.id === center.id
                      ? 'border-eco-500 bg-eco-500/10 ring-2 ring-eco-500/20'
                      : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-dark-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded-md bg-eco-500/10 text-eco-600 dark:text-eco-400 text-[10px] font-bold">
                        {center.type}
                      </span>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white mt-1">{center.name}</h4>
                    </div>
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {center.rating}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0" /> {center.address} ({center.distance_km} km)
                  </p>

                  <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 shrink-0 text-sky-400" /> {center.working_hours}
                  </p>

                  <div className="mt-3 pt-2 border-t border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between">
                    <a
                      href={`tel:${center.contact_phone}`}
                      className="text-[11px] font-semibold text-gray-600 dark:text-gray-300 hover:text-eco-500 flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" /> {center.contact_phone}
                    </a>
                    <a
                      href={`https://maps.google.com/?q=${center.latitude},${center.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-bold text-eco-600 dark:text-eco-400 hover:underline flex items-center gap-1"
                    >
                      <Navigation className="w-3 h-3" /> Directions
                    </a>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
