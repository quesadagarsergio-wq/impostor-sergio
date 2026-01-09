
import React, { useState } from 'react';
import { Button } from './Button';
import { generateImageWithGemini } from '../services/geminiService';
// Fixed: Replaced non-existent 'AspectRatio' with 'Scaling' from lucide-react
import { ArrowLeft, Sparkles, Download, Loader2, Key, AlertCircle, Maximize, Scaling } from 'lucide-react';

interface ImageGeneratorProps {
  onBack: () => void;
}

export const ImageGenerator: React.FC<ImageGeneratorProps> = ({ onBack }) => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [ratio, setRatio] = useState<'1:1' | '16:9' | '9:16'>('1:1');
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    // Verificar API Key (Requisito para modelos Pro/Veo)
    const hasKey = await (window as any).aistudio?.hasSelectedApiKey();
    if (!hasKey) {
      await (window as any).aistudio?.openSelectKey();
      // Proceder después de abrir el diálogo (asumiendo éxito según reglas)
    }

    setLoading(true);
    setError(null);
    try {
      const imageUrl = await generateImageWithGemini(prompt, size, ratio);
      setResultImage(imageUrl);
    } catch (err: any) {
      if (err.message === "KEY_NOT_FOUND") {
        setError("Se requiere una API Key válida de un proyecto con facturación habilitada.");
        await (window as any).aistudio?.openSelectKey();
      } else {
        setError("Error al generar la imagen. Intenta con un prompt diferente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `ia-impostor-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-4 animate-fade-in overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} className="!p-2">
          <ArrowLeft size={24} />
        </Button>
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
          Laboratorio de Arte IA
        </h2>
        <div className="w-10"></div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl shadow-2xl mb-6">
        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Descripción (Prompt)</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ej: Un impostor con máscara de Anonymous en un callejón de neón futurista, estilo cinematográfico, 4k..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white placeholder:text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none min-h-[100px] resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">
              <Maximize size={12} /> Resolución
            </label>
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
              {(['1K', '2K', '4K'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${size === s ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">
              {/* Fixed: Changed non-existent AspectRatio icon to Scaling */}
              <Scaling size={12} /> Formato
            </label>
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
              {(['1:1', '16:9', '9:16'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRatio(r)}
                  className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${ratio === r ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button 
          fullWidth 
          onClick={handleGenerate} 
          disabled={loading || !prompt.trim()}
          className="py-4 bg-gradient-to-r from-emerald-600 to-indigo-600 border-none shadow-emerald-900/20"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
          {loading ? 'Generando Obra Maestra...' : 'Generar con Gemini 3 Pro'}
        </Button>

        <div className="mt-4 flex items-center justify-center gap-2">
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] text-slate-500 hover:text-emerald-400 flex items-center gap-1 underline underline-offset-2 transition-colors"
            >
              <Key size={10} /> Requiere API Key (Billing enabled)
            </a>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-900/20 border border-red-900/50 p-4 rounded-xl flex items-start gap-3 text-red-400 text-sm animate-shake">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {resultImage && (
        <div className="space-y-4 animate-scale-in pb-10">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
             <img src={resultImage} alt="IA Generated" className="w-full h-auto block" />
             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button variant="secondary" onClick={handleDownload} className="bg-white/10 backdrop-blur-md border-white/20">
                    <Download size={20} /> Descargar Imagen
                </Button>
             </div>
          </div>
          <Button variant="ghost" fullWidth onClick={() => setResultImage(null)} className="text-slate-500">
            Limpiar y crear otra
          </Button>
        </div>
      )}

      {!resultImage && !loading && (
        <div className="flex-1 flex flex-col items-center justify-center py-10 opacity-30">
            <Sparkles size={64} className="text-slate-600 mb-4" />
            <p className="text-slate-500 text-center text-sm font-medium">El lienzo está esperando tu comando...</p>
        </div>
      )}
    </div>
  );
};
