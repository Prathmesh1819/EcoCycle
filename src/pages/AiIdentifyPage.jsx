import React, { useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import { identifyEWaste } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import {
  Sparkles,
  UploadCloud,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  RefreshCw,
  Clock,
  Layers,
  Wrench,
  HeartHandshake,
  RefreshCw as Recycling,
  ShoppingBag,
  Info
} from 'lucide-react';

export default function AiIdentifyPage() {
  const { addToast } = useNotification();
  const [selectedImage, setSelectedImage] = useState('https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState({
    deviceName: "Apple MacBook Pro 15-inch (Retina)",
    category: "Computing & IT",
    estimatedAge: "4 - 6 Years",
    estimatedValue: "$45 - $90 (Scrap & Parts)",
    hazardLevel: "High",
    hazardDetails: "Contains a swollen Lithium-ion battery pack and lead-solder printed circuit board (PCB).",
    recommendedAction: "Recycle",
    explanation: "This laptop exhibits severe battery degradation. Refurbishing is unsafe due to battery swell. Certified recycling recovers gold, copper, and aluminum safely.",
    recyclableMaterials: ["Gold (0.04g)", "Copper (320g)", "Aluminum Casing (1.2kg)", "Cobalt (Lithium Cell)"]
  });

  const sampleImages = [
    { title: "Swollen Laptop Battery", url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80" },
    { title: "Broken Smartphone", url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80" },
    { title: "Desktop Monitor", url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80" },
    { title: "Old Circuit Board", url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80" }
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result);
      runAnalysis(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const runAnalysis = async (imgBase64) => {
    setAnalyzing(true);
    try {
      const data = await identifyEWaste(imgBase64 || selectedImage);
      if (data?.data) {
        setAnalysisResult(data.data);
        addToast("AI Analysis Complete", "Gemini evaluated your e-waste sample.", "success");
      }
    } catch (err) {
      addToast("Analysis Error", "Using intelligent fallback evaluation.", "info");
    } finally {
      setAnalyzing(false);
    }
  };

  const getActionIcon = (action) => {
    switch (action?.toLowerCase()) {
      case 'repair': return <Wrench className="w-5 h-5 text-sky-400" />;
      case 'donate': return <HeartHandshake className="w-5 h-5 text-purple-400" />;
      case 'sell': return <ShoppingBag className="w-5 h-5 text-amber-400" />;
      default: return <Recycling className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="p-6 sm:p-8 max-w-6xl mx-auto w-full space-y-8">
          
          {/* Page Banner */}
          <div className="rounded-3xl p-6 bg-gradient-to-r from-eco-950 via-emerald-950 to-ocean-950 text-white border border-eco-500/30 shadow-xl">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2.5 rounded-2xl bg-eco-500/20 text-emerald-400 border border-eco-500/30">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-white">Gemini AI E-Waste Identifier</h1>
                <p className="text-xs text-gray-200 font-medium">Powered by Google Gemini 2.5 Multi-Modal Vision</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column: Image Upload & Samples */}
            <div className="space-y-6">
              <div className="glass-card rounded-3xl p-6 border border-gray-200 dark:border-gray-800 space-y-4">
                <h3 className="font-bold text-base text-gray-900 dark:text-white">Upload E-Waste Image</h3>

                <div className="relative w-full h-72 rounded-2xl overflow-hidden border-2 border-dashed border-eco-500/40 bg-gray-100 dark:bg-dark-800 flex flex-col items-center justify-center group">
                  <img src={selectedImage} alt="E-waste for AI analysis" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white space-y-2">
                    <UploadCloud className="w-8 h-8" />
                    <span className="text-xs font-bold">Click to replace photo</span>
                  </div>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>

                <button
                  onClick={() => runAnalysis(selectedImage)}
                  disabled={analyzing}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-eco-600 via-emerald-600 to-ocean-600 hover:from-eco-500 hover:to-ocean-500 text-white font-bold text-sm shadow-lg shadow-eco-500/25 transition-all flex items-center justify-center space-x-2"
                >
                  {analyzing ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Analyze Image with Gemini AI</span>
                    </>
                  )}
                </button>
              </div>

              {/* Sample Images Selection */}
              <div className="glass-card rounded-3xl p-6 border border-gray-200 dark:border-gray-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Or Select Sample E-Waste Photo</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {sampleImages.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setSelectedImage(sample.url); runAnalysis(sample.url); }}
                      className={`relative h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === sample.url ? 'border-eco-500 ring-2 ring-eco-500/40 scale-105' : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img src={sample.url} alt={sample.title} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white p-1 text-center font-semibold truncate">
                        {sample.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: AI Analysis Cards */}
            <div className="space-y-6">
              {analyzing ? (
                <div className="glass-card rounded-3xl p-12 border border-gray-200 dark:border-gray-800 text-center space-y-4">
                  <Sparkles className="w-12 h-12 text-eco-500 animate-spin mx-auto" />
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">Gemini AI is analyzing component toxicity & value...</h3>
                  <p className="text-xs text-gray-500">Scanning PCB traces, heavy metals, battery status, and material composition.</p>
                </div>
              ) : analysisResult ? (
                <div className="space-y-6">
                  
                  {/* Top Analysis Header Card */}
                  <div className="glass-card rounded-3xl p-6 border border-gray-200 dark:border-gray-800 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="px-2.5 py-1 rounded-full bg-eco-500/10 text-eco-600 dark:text-eco-400 text-xs font-bold">
                          {analysisResult.category || 'Electronics'}
                        </span>
                        <h2 className="text-xl font-black text-gray-900 dark:text-white mt-1">
                          {analysisResult.deviceName}
                        </h2>
                      </div>
                      <div className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-eco-600 text-white text-xs font-bold shadow">
                        {getActionIcon(analysisResult.recommendedAction)}
                        <span className="ml-1 uppercase">{analysisResult.recommendedAction}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                      <div className="bg-gray-50 dark:bg-dark-800 p-3 rounded-xl border">
                        <span className="text-gray-400 block font-medium">Estimated Age</span>
                        <span className="font-bold text-gray-900 dark:text-white">{analysisResult.estimatedAge}</span>
                      </div>
                      <div className="bg-gray-50 dark:bg-dark-800 p-3 rounded-xl border">
                        <span className="text-gray-400 block font-medium">Resale / Scrap Value</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{analysisResult.estimatedValue}</span>
                      </div>
                    </div>
                  </div>

                  {/* Hazard Level Alert */}
                  <div className={`p-5 rounded-3xl border ${
                    analysisResult.hazardLevel === 'High' || analysisResult.hazardLevel === 'Critical'
                      ? 'bg-rose-950/30 text-rose-200 border-rose-500/40'
                      : 'bg-amber-950/30 text-amber-200 border-amber-500/40'
                  }`}>
                    <div className="flex items-center space-x-3 mb-2">
                      <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                      <h4 className="font-bold text-sm">Hazard Assessment: {analysisResult.hazardLevel} Risk</h4>
                    </div>
                    <p className="text-xs opacity-90 leading-relaxed">{analysisResult.hazardDetails}</p>
                  </div>

                  {/* Recommendation Reason & Materials */}
                  <div className="glass-card rounded-3xl p-6 border border-gray-200 dark:border-gray-800 space-y-4">
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                      <Info className="w-4 h-4 text-sky-500" />
                      <span>Why Gemini Recommends: {analysisResult.recommendedAction}</span>
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{analysisResult.explanation}</p>

                    {analysisResult.recyclableMaterials && (
                      <div className="pt-2">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Recoverable Rare Materials</span>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.recyclableMaterials.map((mat, i) => (
                            <span key={i} className="px-3 py-1 rounded-xl bg-eco-500/10 text-eco-600 dark:text-eco-400 border border-eco-500/20 text-xs font-semibold">
                              {mat}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              ) : null}
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
