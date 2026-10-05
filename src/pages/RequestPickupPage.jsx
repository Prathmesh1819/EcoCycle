import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import Modal from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { createCollectionRequest } from '../services/collectionService';
import { createWasteReport } from '../services/wasteService';
import { awardUserPoints } from '../services/rewardService';
import { QRCodeSVG } from 'qrcode.react';
import {
  Truck,
  UploadCloud,
  Calendar,
  Clock,
  MapPin,
  FileText,
  Sparkles,
  CheckCircle2,
  QrCode,
  Package,
  Layers,
  ArrowRight,
  ShieldCheck,
  X
} from 'lucide-react';

export default function RequestPickupPage() {
  const { user, firebaseUser, addRewardPoints } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    item_name: '',
    category: 'e-waste',
    brand: '',
    condition: 'Used - Functional',
    quantity: 1,
    approx_weight_kg: 2.0,
    preferred_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    preferred_time_slot: '10:00 AM - 12:00 PM',
    address: user?.address || 'Baner Road, Baner, Pune, Maharashtra 411045',
    gps_latitude: 18.5590,
    gps_longitude: 73.7868,
    notes: ''
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80'
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [createdPickup, setCreatedPickup] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prev => [...prev, ...files]);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firebaseUser) {
      addToast("Authentication Required", "Please log in to schedule a pickup.", "error");
      navigate('/auth');
      return;
    }

    setSubmitting(true);

    try {
      // 1. Create Waste Report in Firestore
      const wasteReport = await createWasteReport({
        userId: firebaseUser.uid,
        userName: user?.full_name || user?.name || "Eco User",
        wasteType: formData.category.toLowerCase().includes("laptop") ? "e-waste" : formData.category.toLowerCase(),
        description: `${formData.item_name} (${formData.brand || 'Generic'}, ${formData.condition})`,
        quantity: Number(formData.quantity) || 1,
        imageUrl: imagePreviews[0] || "",
        imageFile: imageFiles[0] || imagePreviews[0],
        location: {
          latitude: formData.gps_latitude,
          longitude: formData.gps_longitude,
          address: formData.address
        }
      });

      // 2. Create Collection Request in Firestore
      const collectionReq = await createCollectionRequest({
        userId: firebaseUser.uid,
        wasteReportId: wasteReport.id || "",
        pickupAddress: formData.address,
        pickupDate: formData.preferred_date,
        pickupTime: formData.preferred_time_slot,
        wasteType: formData.category,
        quantity: Number(formData.quantity) || 1,
        notes: formData.notes
      });

      // 3. Award Eco Points to User
      const earnedPoints = 40 * (Number(formData.quantity) || 1);
      await addRewardPoints(earnedPoints);

      setSubmitting(false);

      const pickupResult = {
        pickup_id: collectionReq.id || `REQ-${Date.now().toString().slice(-6)}`,
        item_name: formData.item_name,
        earned_points: earnedPoints,
        preferred_date: formData.preferred_date,
        preferred_time_slot: formData.preferred_time_slot,
        status: collectionReq.status
      };

      setCreatedPickup(pickupResult);
      addToast("Pickup Request Submitted!", `Pickup ID: ${pickupResult.pickup_id}. Earned +${earnedPoints} points!`, "success");
      setModalOpen(true);
    } catch (err) {
      setSubmitting(false);
      console.error("Pickup submission error:", err);
      addToast("Unable to submit waste report", err.message || "Something went wrong. Please try again.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="p-6 sm:p-8 max-w-4xl mx-auto w-full space-y-8">
          
          {/* Header Banner */}
          <div className="rounded-3xl p-6 bg-gradient-to-r from-eco-950 via-emerald-900 to-dark-900 text-white border border-eco-500/30 shadow-xl">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2.5 rounded-2xl bg-eco-500/20 text-emerald-400 border border-eco-500/30">
                <Truck className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white">Schedule Doorstep E-Waste Pickup</h1>
            </div>
            <p className="text-xs text-gray-200 font-medium">
              Fill in your item specifications and preferred schedule. Certified collection agents will safely pick up your e-waste and issue instant points!
            </p>
          </div>

          {/* Request Form Card */}
          <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 space-y-6">
            
            {/* Step 1: Device Details */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200/50 dark:border-gray-700/50 pb-2">
                <Package className="w-5 h-5 text-eco-500" />
                <span>1. Device Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Item Name / Title *</label>
                  <input
                    type="text"
                    required
                    name="item_name"
                    value={formData.item_name}
                    onChange={handleInputChange}
                    placeholder="e.g. Laptop, Phone, TV, Appliance"
                    className="w-full px-4 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-eco-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Waste Type Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-eco-500"
                  >
                    <option value="e-waste">E-Waste (Electronics, Laptops, Phones)</option>
                    <option value="plastic">Plastic Waste</option>
                    <option value="paper">Paper & Cardboard</option>
                    <option value="glass">Glassware</option>
                    <option value="metal">Scrap Metal</option>
                    <option value="organic">Organic / Compost</option>
                    <option value="other">Other Recyclable Material</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Brand / Manufacturer</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="e.g. Apple, Dell, Sony, Samsung"
                    className="w-full px-4 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-eco-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Condition *</label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-eco-500"
                  >
                    <option value="Functional / Working">Functional / Working</option>
                    <option value="Used - Functional">Used - Minor Wear</option>
                    <option value="Broken Screen / Damaged">Broken Screen / Physical Damage</option>
                    <option value="Dead / Non-Functional">Dead / Non-Functional</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-eco-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Approx. Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="approx_weight_kg"
                    value={formData.approx_weight_kg}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-eco-500"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Schedule & Address */}
            <div className="space-y-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200/50 dark:border-gray-700/50 pb-2">
                <Calendar className="w-5 h-5 text-sky-500" />
                <span>2. Schedule & Address</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Preferred Date *</label>
                  <input
                    type="date"
                    required
                    name="preferred_date"
                    value={formData.preferred_date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-eco-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Preferred Time Window *</label>
                  <select
                    name="preferred_time_slot"
                    value={formData.preferred_time_slot}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-eco-500"
                  >
                    <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                    <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                    <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                    <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Full Pickup Address *</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Street address, city, state, zip code"
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-eco-500"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Special Instructions / Notes</label>
                  <textarea
                    rows="2"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="e.g. Ring door bell, item in original box, swollen battery..."
                    className="w-full px-4 py-2 text-sm rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-eco-500"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Step 3: Photo Upload */}
            <div className="space-y-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200/50 dark:border-gray-700/50 pb-2">
                <UploadCloud className="w-5 h-5 text-purple-500" />
                <span>3. Upload Photos</span>
              </h3>

              <div className="flex flex-wrap gap-4 items-center">
                {imagePreviews.map((img, idx) => (
                  <div key={idx} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-gray-300 dark:border-gray-700 group">
                    <img src={img} alt="E-waste preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                <label className="w-24 h-24 rounded-2xl border-2 border-dashed border-eco-500/40 hover:border-eco-500 flex flex-col items-center justify-center text-eco-600 dark:text-eco-400 cursor-pointer bg-eco-500/5 transition-colors">
                  <UploadCloud className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-bold">Add Photo</span>
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-eco-600 via-emerald-600 to-ocean-600 hover:from-eco-500 hover:to-ocean-500 text-white font-bold text-base shadow-xl shadow-eco-500/30 transition-all flex items-center justify-center space-x-2"
            >
              {submitting ? (
                <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <Truck className="w-5 h-5" />
                  <span>Confirm & Book Doorstep Pickup</span>
                </>
              )}
            </button>
          </form>

          {/* Success Confirmation Modal with QR Code */}
          <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Pickup Scheduled Successfully! 🎉">
            {createdPickup && (
              <div className="text-center space-y-6 py-2">
                <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                  <p className="text-xs font-bold uppercase tracking-wider">Pickup ID</p>
                  <p className="text-2xl font-black">{createdPickup.pickup_id}</p>
                </div>

                {/* QR Code Container */}
                <div className="p-4 bg-white rounded-2xl inline-block shadow-lg border border-gray-200">
                  <QRCodeSVG value={JSON.stringify({ id: createdPickup.pickup_id, status: createdPickup.status })} size={160} />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Show this QR code to the collection agent upon arrival to verify handover.
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs text-left bg-gray-50 dark:bg-dark-800 p-4 rounded-2xl border">
                  <div>
                    <span className="text-gray-400 block">Item</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">{createdPickup.item_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Earned Points</span>
                    <span className="font-bold text-amber-500">+{createdPickup.earned_points} PTS</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Scheduled Date</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">{createdPickup.preferred_date}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Time Slot</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">{createdPickup.preferred_time_slot}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => { setModalOpen(false); navigate('/history'); }}
                    className="flex-1 py-3 rounded-xl bg-eco-600 hover:bg-eco-500 text-white font-bold text-sm shadow"
                  >
                    View in History
                  </button>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-3 rounded-xl bg-gray-200 dark:bg-dark-700 text-gray-800 dark:text-gray-200 font-bold text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </Modal>

        </main>
      </div>
    </div>
  );
}
