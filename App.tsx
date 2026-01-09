import React, { useState } from 'react';
import { WordManager } from './components/WordManager';
import { GameFlow } from './components/GameFlow';
import { Button } from './components/Button';
import { GamePhase } from './types';
import { BrainCircuit, BookOpen, Ghost } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'HOME' | 'GAME' | 'MANAGE'>('HOME');

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
              <div className="absolute inset-0 bg-indigo-500 blur-[80px] opacity-20 rounded-full group-hover:opacity-30 transition-opacity duration-700"></div>
              
              {/* Imagen Cinemática (Estilo Deceit Club / Guy Fawkes) */}
              <div className="relative z-10 p-1 bg-gradient-to-tr from-slate-800 to-indigo-900 rounded-[2.5rem] shadow-2xl rotate-2 transition-transform duration-500 group-hover:rotate-0 group-hover:scale-105">
                <img 
                  src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=600&h=600&auto=format&fit=crop" 
                  alt="The Impostor" 
                  className="w-56 h-56 object-cover rounded-[2.2rem] grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 border-2 border-white/5"
                />
              </div>
              
              {/* Etiqueta Flotante "TRUST NO ONE" */}
              <div className="absolute -bottom-4 -right-4 z-20 bg-red-600 text-[10px] font-black px-4 py-1.5 rounded-full shadow-xl border-2 border-slate-900 animate-bounce-short tracking-tighter">
                TRUST NO ONE
              </div>
            </div>

            <div className="w-full space-y-4">
              <Button 
                onClick={() => setView('GAME')} 
                fullWidth 
                className="py-5 text-xl shadow-indigo-500/20 group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <BrainCircuit size={24} className="group-hover:rotate-12 transition-transform" /> JUGAR
              </Button>
              
              <Button 
                variant="secondary" 
                onClick={() => setView('MANAGE')} 
                fullWidth
                className="py-4 border border-slate-700 hover:border-slate-500 bg-slate-900/50"
              >
                <BookOpen size={20} /> Gestión de Palabras
              </Button>
            </div>

            <p className="mt-12 text-slate-500 text-xs text-center font-medium tracking-widest uppercase opacity-60">
              Bienvenido al Club del Engaño
            </p>
          </div>
        )}

        {view === 'MANAGE' && (
          <WordManager onBack={() => setView('HOME')} />
        )}

        {view === 'GAME' && (
          <GameFlow onExit={() => setView('HOME')} />
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
