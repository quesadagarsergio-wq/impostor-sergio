import React, { useState, useEffect } from 'react';
import { WordPair } from '../types';
import { getStoredWords, saveWordPair, deleteWordPair } from '../services/storage';
import { generateWordPack } from '../services/geminiService';
import { Button } from './Button';
import { Trash2, Plus, Sparkles, ArrowLeft, Save, Loader2 } from 'lucide-react';

interface WordManagerProps {
  onBack: () => void;
}

export const WordManager: React.FC<WordManagerProps> = ({ onBack }) => {
  const [words, setWords] = useState<WordPair[]>([]);
  const [newWord, setNewWord] = useState('');
  const [newHint, setNewHint] = useState('');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

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

  const handleGenerateAI = async () => {
    setGenerating(true);
    try {
      const newPairs = await generateWordPack();
      let currentWords = getStoredWords();
      
      for (const pair of newPairs) {
        const wordPair: WordPair = {
            id: Date.now().toString() + Math.random().toString().slice(2, 5),
            word: pair.word,
            hint: pair.hint
        };
        saveWordPair(wordPair);
        currentWords.push(wordPair);
      }
      setWords([...currentWords]);
    } catch (error) {
      alert("Error generando palabras. Intenta de nuevo.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} className="!p-2">
          <ArrowLeft size={24} />
        </Button>
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
          Biblioteca
        </h2>
        <div className="w-10"></div> {/* Spacer for balance */}
      </div>

      {/* Input Form */}
      <div className="bg-slate-800 p-4 rounded-2xl shadow-xl mb-6 border border-slate-700">
        <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Añadir Nueva</h3>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Palabra (ej: Pizza)"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <input
            type="text"
            placeholder="Pista para impostor (ej: Comida redonda)"
            value={newHint}
            onChange={(e) => setNewHint(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <Button onClick={handleAdd} disabled={!newWord || !newHint}>
            <Plus size={18} /> Añadir Manualmente
          </Button>
          
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-700"></div>
            <span className="flex-shrink mx-4 text-slate-500 text-xs">O AUTOMÁTICO</span>
            <div className="flex-grow border-t border-slate-700"></div>
          </div>

          <Button 
            variant="secondary" 
            onClick={handleGenerateAI} 
            disabled={generating}
            className="bg-gradient-to-r from-purple-600 to-blue-600 border-none hover:from-purple-700 hover:to-blue-700"
          >
            {generating ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            {generating ? 'Generando...' : 'Generar Pack con IA'}
          </Button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-8">
        {words.length === 0 ? (
          <div className="text-center text-slate-500 mt-10">No hay palabras guardadas.</div>
        ) : (
          words.map((w) => (
            <div key={w.id} className="bg-slate-800/50 p-4 rounded-xl flex justify-between items-center border border-slate-700/50">
              <div>
                <div className="font-bold text-lg text-white">{w.word}</div>
                <div className="text-sm text-indigo-300">Pista: {w.hint}</div>
              </div>
              <button 
                onClick={() => handleDelete(w.id)}
                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
