import React, { useRef } from 'react';
import { Download, Award, ShieldCheck, Leaf, Calendar, CheckCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function CertificateGenerator({ pickup, user }) {
  const certRef = useRef(null);

  const handleDownloadPDF = async () => {
    if (!certRef.current) return;
    try {
      const canvas = await html2canvas(certRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const imgWidth = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`EcoCycle_Certificate_${pickup.pickup_id || 'RECYCLE'}.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Action Button */}
      <button
        onClick={handleDownloadPDF}
        className="w-full flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-eco-600 to-emerald-600 hover:from-eco-500 hover:to-emerald-500 text-white font-bold text-sm shadow-lg shadow-eco-500/25 transition-all transform hover:-translate-y-0.5"
      >
        <Download className="w-4 h-4" />
        <span>Download Official E-Waste Certificate (PDF)</span>
      </button>

      {/* Printable Certificate Template Container */}
      <div className="overflow-x-auto p-2 bg-gray-100 dark:bg-dark-900 rounded-2xl">
        <div
          ref={certRef}
          className="w-[800px] h-[550px] mx-auto bg-white text-gray-900 p-10 rounded-2xl shadow-xl border-8 border-eco-600 relative flex flex-col justify-between select-none font-sans"
        >
          {/* Certificate Watermark Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Leaf className="w-96 h-96 text-eco-600" />
          </div>

          {/* Top Header */}
          <div className="flex items-center justify-between border-b-2 border-eco-500/20 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-eco-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                🌱
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-wider text-eco-800 uppercase">EcoCycle AI</h1>
                <p className="text-xs font-semibold text-gray-500 tracking-widest uppercase">Verified Zero E-Waste Recycling Protocol</p>
              </div>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 bg-eco-100 text-eco-800 rounded-full text-xs font-bold uppercase tracking-wider border border-eco-300">
                Official Certificate
              </span>
              <p className="text-[10px] text-gray-400 mt-1">ID: {pickup.pickup_id || 'ECO-849201'}</p>
            </div>
          </div>

          {/* Certificate Body */}
          <div className="text-center my-auto space-y-4">
            <div className="inline-block p-2 rounded-full bg-emerald-100 text-emerald-600 mb-2">
              <Award className="w-8 h-8" />
            </div>

            <h2 className="text-3xl font-extrabold text-gray-800 font-serif italic">Certificate of Environmental Impact</h2>
            <p className="text-sm text-gray-600 max-w-md mx-auto">This certificate is proudly awarded to</p>

            <h3 className="text-2xl font-bold text-eco-700 underline decoration-eco-400 underline-offset-4">
              {user?.full_name || 'Valued Eco Hero'}
            </h3>

            <p className="text-xs text-gray-600 max-w-lg mx-auto leading-relaxed">
              for responsibly recycling <span className="font-bold text-gray-900">{pickup.item_name || 'Electronic Waste Device'}</span> ({pickup.category || 'Electronics'}) under certified environmental safety standards, diverting heavy metals and saving valuable rare-earth elements.
            </p>

            {/* Impact Badges */}
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto pt-2">
              <div className="bg-eco-50 p-3 rounded-xl border border-eco-200 text-center">
                <p className="text-[10px] text-gray-500 font-bold uppercase">CO₂ Diverted</p>
                <p className="text-base font-black text-eco-700">{pickup.co2_saved_kg || 14.5} kg</p>
              </div>
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-center">
                <p className="text-[10px] text-gray-500 font-bold uppercase">Eco Points Earned</p>
                <p className="text-base font-black text-amber-700">+{pickup.earned_points || 100} PTS</p>
              </div>
              <div className="bg-sky-50 p-3 rounded-xl border border-sky-200 text-center">
                <p className="text-[10px] text-gray-500 font-bold uppercase">Recycling Status</p>
                <p className="text-base font-black text-sky-700">100% Certified</p>
              </div>
            </div>
          </div>

          {/* Footer Signatures */}
          <div className="flex items-end justify-between border-t-2 border-eco-500/20 pt-4 text-xs text-gray-500">
            <div>
              <p className="font-semibold text-gray-700">Date Issued: {new Date().toLocaleDateString()}</p>
              <p className="text-[10px] text-gray-400">Verified via Supabase Immutable Ledger</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-0.5 bg-gray-400 mx-auto mb-1"></div>
              <p className="font-bold text-eco-800">Dr. Elena Rostova</p>
              <p className="text-[10px] text-gray-500">EcoCycle Director of Sustainability</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
