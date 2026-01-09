
import React, { useState } from 'react';
import { WordManager } from './components/WordManager';
import { GameFlow } from './components/GameFlow';
import { Button } from './components/Button';
import { ImageGenerator } from './components/ImageGenerator';
import { BrainCircuit, BookOpen, Ghost, Palette } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'HOME' | 'GAME' | 'MANAGE' | 'IMAGE'>('HOME');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 relative">
      
      {/* Header */}
      <header className="p-4 flex justify-center items-center border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
           <Ghost className="text-indigo-500" size={28} />
           <h1 className="text-xl font-bold tracking-tight">Quién es el <span className="text-indigo-400">Impostor</span></h1>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden">
        {view === 'HOME' && (
          <div className="flex flex-col items-center justify-center h-full p-8 animate-fade-in max-w-md mx-auto">
            
            <div className="relative mb-14 group">
              {/* Efecto de resplandor de fondo */}
              <div className="absolute inset-0 bg-indigo-600 blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>
              
              {/* Imagen Cinemática - Persona con máscara tras la espalda */}
              <div className="relative z-10 p-1 bg-gradient-to-b from-slate-700 to-black rounded-[2.5rem] shadow-2xl transition-all duration-700 group-hover:scale-105 border border-white/10 overflow-hidden bg-slate-900 w-64 h-64">
                <img 
                  src="https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=800" 
                  alt="Impostor holding mask" 
                  className="w-full h-full object-cover rounded-[2.3rem] grayscale-[20%] contrast-110 group-hover:grayscale-0 transition-all duration-700"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.classList.add('flex', 'items-center', 'justify-center');
                    e.currentTarget.parentElement!.innerHTML = '<div class="text-indigo-500 text-6xl">🎭</div>';
                  }}
                />
              </div>
              
              {/* Etiqueta Flotante "TRUST NO ONE" */}
              <div className="absolute -bottom-4 -right-4 z-20 bg-red-700 text-[11px] font-black px-5 py-2 rounded-lg shadow-2xl border-2 border-slate-950 animate-bounce-short tracking-tighter uppercase transform rotate-6">
                TRUST NO ONE
              </div>
            </div>

            <div className="w-full space-y-4">
              <Button 
                onClick={() => setView('GAME')} 
                fullWidth 
                className="py-5 text-xl shadow-indigo-500/20 group overflow-hidden relative border border-indigo-500/30"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <BrainCircuit size={24} className="group-hover:rotate-12 transition-transform" /> JUGAR
              </Button>
              
              <Button 
                variant="secondary" 
                onClick={() => setView('MANAGE')} 
                fullWidth
                className="py-4 border border-slate-700 hover:border-slate-500 bg-slate-900/40 backdrop-blur-sm"
              >
                <BookOpen size={20} /> Biblioteca de Palabras
              </Button>

              {/* Added: Navigation button for AI Image Laboratory */}
              <Button 
                variant="secondary" 
                onClick={() => setView('IMAGE')} 
                fullWidth
                className="py-4 border border-slate-700 hover:border-slate-500 bg-slate-900/40 backdrop-blur-sm bg-gradient-to-r from-indigo-900/10 to-emerald-900/10"
              >
                <Palette size={20} className="text-emerald-400" /> Laboratorio de Arte IA
              </Button>
            </div>

            <p className="mt-12 text-slate-500 text-[10px] text-center font-bold tracking-[0.3em] uppercase opacity-40">
              Infiltración • Engaño • Supervivencia
            </p>
          </div>
        )}

        {view === 'MANAGE' && (
          <WordManager onBack={() => setView('HOME')} />
        )}

        {view === 'GAME' && (
          <GameFlow onExit={() => setView('HOME')} />
        )}

        {/* Added: View for AI Image Generation */}
        {view === 'IMAGE' && (
          <ImageGenerator onBack={() => setView('HOME')} />
        )}
      </main>

      {/* Marca de agua permanente - Sergio Quesada */}
      <div className="fixed bottom-4 right-4 z-[9999] pointer-events-none select-none">
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-mono tracking-[0.25em] text-indigo-400/90 uppercase font-bold drop-shadow-md">
            By Sergio Quesada
          </span>
          <div className="h-0.5 w-10 bg-indigo-500/60 rounded-full mt-0.5 shadow-sm"></div>
        </div>
      </div>
    </div>
  );
}
