import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import StatsCard from '../components/cards/StatsCard';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { fetchImpactReportSummary } from '../services/api';
import { useAuth } from '../context/AuthContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Leaf,
  TreePine,
  ShieldCheck,
  Zap,
  Download,
  BarChart3,
  Globe,
  Award,
  Layers,
  Sparkles
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

export default function ImpactPage() {
  const { isAuthenticated } = useAuth();
  const [summary, setSummary] = useState(null);
  const reportRef = useRef(null);

  useEffect(() => {
    fetchImpactReportSummary()
      .then(res => {
        if (res.data) setSummary(res.data);
      })
      .catch(console.error);
  }, []);

  const handleDownloadReportPDF = async () => {
    if (!reportRef.current) return;
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('EcoCycle_Environmental_Impact_Report.pdf');
    } catch (err) {
      console.error('PDF error:', err);
    }
  };

  const content = (
    <main className="p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-8" ref={reportRef}>
      
      {/* Header Banner */}
      <div className="rounded-3xl p-8 bg-gradient-to-r from-eco-950 via-emerald-950 to-dark-900 text-white border border-eco-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-eco-500/20 text-emerald-400 text-xs font-bold mb-3 border border-eco-500/30">
            <Leaf className="w-3.5 h-3.5" />
            <span>Global Environmental Dashboard</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Eco Impact & Material Recovery</h1>
          <p className="text-xs text-gray-200 mt-1 max-w-xl font-medium">
            Real-time analytics measuring avoided greenhouse gas emissions, raw material circular economy metrics, and reforestation credits.
          </p>
        </div>

        <button
          onClick={handleDownloadReportPDF}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-eco-600 to-emerald-600 hover:from-eco-500 hover:to-emerald-500 text-white font-bold text-sm shadow-lg shadow-eco-500/30 transition-all flex items-center space-x-2 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF Impact Report</span>
        </button>
      </div>

      {/* Environmental Impact Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard title="Trees Saved Equivalent" value={summary?.treesEquivalentSaved || 1613} icon={TreePine} trend="Direct Eden Reforestation" color="eco" />
        <StatsCard title="Total CO₂ Emissions Reduced" value={`${summary?.totalCO2SavedKg || 35490} kg`} icon={Leaf} trend="Offset vs Landfills" color="blue" />
        <StatsCard title="Clean Energy Preserved" value="142,500 kWh" icon={Zap} trend="Equivalent to 12 homes/yr" color="amber" />
      </div>

      {/* Recovered Materials Breakdown */}
      <div className="glass-card rounded-3xl p-6 border border-gray-200 dark:border-gray-800 space-y-4">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-500" />
          <span>Circular Economy Raw Material Recovery</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { label: 'Gold Recovered', value: `${summary?.materialsRecovered?.goldGrams || 124.5} g`, color: 'border-amber-500/30 bg-amber-500/5 text-amber-600' },
            { label: 'Silver Recovered', value: `${summary?.materialsRecovered?.silverGrams || 980} g`, color: 'border-gray-400/30 bg-gray-400/5 text-gray-600 dark:text-gray-300' },
            { label: 'Copper Extracted', value: `${summary?.materialsRecovered?.copperKg || 1450} kg`, color: 'border-orange-500/30 bg-orange-500/5 text-orange-600' },
            { label: 'Aluminum Preserved', value: `${summary?.materialsRecovered?.aluminumKg || 2890} kg`, color: 'border-sky-500/30 bg-sky-500/5 text-sky-600' },
            { label: 'Plastic Recycled', value: `${summary?.materialsRecovered?.plasticsKg || 3120} kg`, color: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-600' }
          ].map((item, idx) => (
            <div key={idx} className={`p-4 rounded-2xl border ${item.color} text-center space-y-1`}>
              <span className="text-[10px] font-bold uppercase tracking-wider block opacity-80">{item.label}</span>
              <span className="text-xl font-black">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Trends Chart */}
      {summary?.monthlyTrends && (
        <div className="glass-card rounded-3xl p-6 border border-gray-200 dark:border-gray-800 space-y-4">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">Platform Growth & Recycling Velocity</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.monthlyTrends}>
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="items" name="Items Recycled" fill="#22c55e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

    </main>
  );

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex flex-col justify-between">
      <Navbar />
      {content}
      <Footer />
    </div>
  );
}
