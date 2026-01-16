import React, { useState, useEffect } from 'react';
import { WordPair, WordPack } from '../types';
import { getStoredWords, saveWordPair, deleteWordPair } from '../services/storage';
import { OFFICIAL_PACKS, DEFAULT_WORDS, STORAGE_KEY } from '../constants';
import { Button } from './Button';
import { Trash2, Plus, ArrowLeft, FolderOpen, Book, Info, RefreshCcw } from 'lucide-react';

interface WordManagerProps {
  onBack: () => void;
}

export const WordManager: React.FC<WordManagerProps> = ({ onBack }) => {
  const [words, setWords] = useState<WordPair[]>([]);
  const [newWord, setNewWord] = useState('');
  const [newHint, setNewHint] = useState('');
  const [activeTab, setActiveTab] = useState<'my_words' | 'official_packs'>('my_words');

  useEffect(() => {
    setWords(getStoredWords());
  }, []);

  const handleAdd = () => {
    if (!newWord.trim() || !newHint.trim()) return;
    const pair: WordPair = {
      id: Date.now().toString(),
      word: newWord.trim(),
      hint: newHint.trim()
    };
    const updated = saveWordPair(pair);
    setWords(updated);
    setNewWord('');
    setNewHint('');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Eliminar esta palabra?')) {
      const updated = deleteWordPair(id);
      setWords(updated);
    }
  };

  const handleRestoreDefaults = () => {
    if (window.confirm('¿Quieres restaurar las palabras predeterminadas? Se mantendrán tus palabras actuales.')) {
      let currentWords = [...words];
      DEFAULT_WORDS.forEach(dw => {
        const exists = currentWords.some(cw => cw.word.toLowerCase() === dw.word.toLowerCase());
        if (!exists) {
          const pair = { ...dw, id: Date.now().toString() + Math.random() };
          currentWords.push(pair);
        }
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentWords));
      setWords(currentWords);
    }
  };

  const handleAddPackToLibrary = (pack: WordPack) => {
    if (window.confirm(`¿Añadir las ${pack.words.length} palabras del pack "${pack.name}" a tu biblioteca personal?`)) {
      let currentWords = [...words];
      pack.words.forEach(pw => {
        const exists = currentWords.some(cw => cw.word.toLowerCase() === pw.word.toLowerCase());
        if (!exists) {
          const newPair = { ...pw, id: Date.now().toString() + Math.random() };
          currentWords.push(newPair);
        }
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentWords));
      setWords(currentWords);
      setActiveTab('my_words');
    }
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-4 animate-fade-in overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} className="!p-2">
          <ArrowLeft size={24} />
        </Button>
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
          Biblioteca
        </h2>
        <Button variant="ghost" onClick={handleRestoreDefaults} className="!p-2 text-indigo-400">
          <RefreshCcw size={20} />
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-900 p-1 rounded-xl mb-6 border border-slate-800">
        <button
          onClick={() => setActiveTab('my_words')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'my_words' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Book size={16} /> Mis Palabras
        </button>
        <button
          onClick={() => setActiveTab('official_packs')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'official_packs' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <FolderOpen size={16} /> Packs Temáticos
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-8">
        {activeTab === 'my_words' ? (
          <div className="space-y-6">
            {/* Input Form */}
            <div className="bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-700">
              <h3 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Añadir Manualmente</h3>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Palabra (ej: Astiz)"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Pista para impostor (ej: epa)"
                  value={newHint}
                  onChange={(e) => setNewHint(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <Button onClick={handleAdd} disabled={!newWord || !newHint} fullWidth>
                  <Plus size={18} /> Guardar Palabra
                </Button>
              </div>
            </div>

            {/* List */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Tu Colección ({words.length})</h3>
              {words.length === 0 ? (
                <div className="bg-slate-900/50 p-10 rounded-2xl text-center border-2 border-dashed border-slate-800">
                  <Book size={40} className="mx-auto text-slate-700 mb-4" />
                  <p className="text-slate-500">Aún no hay palabras en tu biblioteca.</p>
                </div>
              ) : (
                words.map((w) => (
                  <div key={w.id} className="bg-slate-800/50 p-4 rounded-xl flex justify-between items-center border border-slate-700/50 group hover:border-indigo-500/50 transition-colors">
                    <div>
                      <div className="font-bold text-lg text-white group-hover:text-indigo-300 transition-colors capitalize">{w.word}</div>
                      <div className="text-sm text-slate-400 italic">Pista: {w.hint}</div>
                    </div>
                    <button 
                      onClick={() => handleDelete(w.id)}
                      className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
             <div className="bg-indigo-900/20 border border-indigo-500/30 p-4 rounded-xl flex gap-3 mb-6">
                <Info size={20} className="text-indigo-400 shrink-0 mt-0.5" />
                <p className="text-xs text-indigo-200 leading-relaxed">
                  Packs con palabras y pistas difíciles. Selecciona uno para jugar directamente o expándelos.
                </p>
             </div>

             <div className="grid grid-cols-1 gap-4">
                {OFFICIAL_PACKS.map(pack => (
                  <div key={pack.id} className="bg-slate-800 rounded-2xl p-5 border border-slate-700 hover:border-indigo-500/50 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                      <FolderOpen size={64} />
                    </div>
                    
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="text-xl font-black text-white">{pack.name}</h3>
                       <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter ${
                         pack.difficulty === 'Dificil' ? 'bg-red-900/40 text-red-400 border border-red-500/30' : 
                         'bg-emerald-900/40 text-emerald-400 border border-emerald-500/30'
                       }`}>
                         {pack.difficulty}
                       </span>
                    </div>
                    
                    <p className="text-slate-400 text-sm mb-4 leading-snug">{pack.description}</p>
                    <div className="text-[10px] text-slate-500 mb-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                       {pack.words.slice(0, 3).map(w => (
                         <span key={w.id} className="bg-slate-900 px-2 py-1 rounded border border-slate-700 whitespace-nowrap">
                            {w.word}
                         </span>
                       ))}
                       <span className="bg-slate-900 px-2 py-1 rounded border border-slate-700 text-indigo-400">
                          +{pack.words.length - 3} más
                       </span>
                    </div>

                    <Button variant="secondary" fullWidth onClick={() => handleAddPackToLibrary(pack)} className="py-2.5 text-xs">
                      <Plus size={14} /> Importar pack
                    </Button>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};