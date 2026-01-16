import React, { useState, useEffect } from 'react';
import { GamePhase, Player, WordPair, WordPack } from '../types';
import { getStoredWords } from '../services/storage';
import { OFFICIAL_PACKS } from '../constants';
import { Button } from './Button';
import { Users, Eye, EyeOff, UserCheck, RefreshCw, Home, Play, Pencil, Skull, Minus, Plus, Lightbulb, LightbulbOff, Book, FolderOpen, ChevronRight } from 'lucide-react';

interface GameFlowProps {
  onExit: () => void;
}

export const GameFlow: React.FC<GameFlowProps> = ({ onExit }) => {
  const [phase, setPhase] = useState<GamePhase>(GamePhase.SETUP);
  const [playerCount, setPlayerCount] = useState(3);
  const [impostorCount, setImpostorCount] = useState(1);
  const [useHints, setUseHints] = useState(true);
  const [wordSource, setWordSource] = useState<'MY_LIBRARY' | string>('MY_LIBRARY');
  const [customNames, setCustomNames] = useState<string[]>(
    Array.from({ length: 3 }, (_, i) => `Jugador ${i + 1}`)
  );
  
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentWord, setCurrentWord] = useState<WordPair | null>(null);
  const [turnIndex, setTurnIndex] = useState(0);
  const [revealing, setRevealing] = useState(false);

  // Handle player count slider change and sync names array
  const handlePlayerCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value);
    setPlayerCount(count);
    
    const maxImpostors = Math.max(1, Math.floor((count - 1) / 2));
    if (impostorCount > maxImpostors) {
        setImpostorCount(maxImpostors);
    }

    setCustomNames(prev => {
      const newNames = [...prev];
      if (count > prev.length) {
        for (let i = prev.length; i < count; i++) {
           newNames.push(`Jugador ${i + 1}`);
        }
      } else {
        return newNames.slice(0, count);
      }
      return newNames;
    });
  };

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...customNames];
    newNames[index] = value;
    setCustomNames(newNames);
  };
  
  const handleStartGame = () => {
    let pool: WordPair[] = [];
    
    if (wordSource === 'MY_LIBRARY') {
      pool = getStoredWords();
    } else {
      const pack = OFFICIAL_PACKS.find(p => p.id === wordSource);
      pool = pack ? pack.words : [];
    }

    if (pool.length === 0) {
      alert("No hay palabras en esta fuente. Elige otra o añade palabras a tu biblioteca.");
      return;
    }

    // Pick random word
    const randomWord = pool[Math.floor(Math.random() * pool.length)];
    setCurrentWord(randomWord);

    // Setup players
    const newPlayers: Player[] = customNames.map((name, i) => ({
      id: i + 1,
      name: name.trim() || `Jugador ${i + 1}`,
      isImpostor: false,
      votesReceived: 0
    }));

    // Assign Impostors randomly
    const indices = Array.from({ length: playerCount }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    
    for (let i = 0; i < impostorCount; i++) {
        newPlayers[indices[i]].isImpostor = true;
    }

    setPlayers(newPlayers);
    setTurnIndex(0);
    setPhase(GamePhase.REVEAL);
  };

  const handleNextTurn = () => {
    setRevealing(false);
    if (turnIndex < players.length - 1) {
      setTurnIndex(prev => prev + 1);
    } else {
      setPhase(GamePhase.PLAYING);
    }
  };

  const handleVote = (playerId: number) => {
    const updatedPlayers = players.map(p => 
      p.id === playerId ? { ...p, votesReceived: p.votesReceived + 1 } : p
    );
    setPlayers(updatedPlayers);
  };

  const finishVoting = () => {
    setPhase(GamePhase.RESULT);
  };

  const maxImpostors = Math.max(1, Math.floor((playerCount - 1) / 2));

  if (phase === GamePhase.SETUP) {
    return (
      <div className="flex flex-col h-full p-6 animate-fade-in max-w-md mx-auto w-full overflow-y-auto custom-scrollbar">
        <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Configuración</h2>
        
        {/* Source Selection */}
        <div className="w-full bg-slate-800 p-5 rounded-2xl mb-4 border border-slate-700 shadow-xl">
           <label className="block text-slate-500 mb-4 text-[10px] font-bold tracking-widest uppercase">
            Fuente de Palabras
          </label>
          <div className="space-y-2">
            <button
              onClick={() => setWordSource('MY_LIBRARY')}
              className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${wordSource === 'MY_LIBRARY' ? 'bg-indigo-600/20 border-indigo-500' : 'bg-slate-900/50 border-slate-700 hover:border-slate-600'}`}
            >
              <div className="flex items-center gap-3">
                <Book size={18} className={wordSource === 'MY_LIBRARY' ? 'text-indigo-400' : 'text-slate-500'} />
                <div className="text-left">
                   <p className="text-sm font-bold text-white leading-none mb-1">Mi Biblioteca Personal</p>
                   <p className="text-[10px] text-slate-500 italic">Palabras que tú has creado</p>
                </div>
              </div>
              {wordSource === 'MY_LIBRARY' && <ChevronRight size={16} className="text-indigo-400" />}
            </button>
            
            <div className="h-px bg-slate-700/50 my-1"></div>

            {OFFICIAL_PACKS.map(pack => (
              <button
                key={pack.id}
                onClick={() => setWordSource(pack.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${wordSource === pack.id ? 'bg-purple-600/20 border-purple-500' : 'bg-slate-900/50 border-slate-700 hover:border-slate-600'}`}
              >
                <div className="flex items-center gap-3">
                  <FolderOpen size={18} className={wordSource === pack.id ? 'text-purple-400' : 'text-slate-500'} />
                  <div className="text-left">
                     <p className="text-sm font-bold text-white leading-none mb-1">{pack.name}</p>
                     <p className="text-[10px] text-slate-500 italic">Pack oficial • {pack.difficulty}</p>
                  </div>
                </div>
                {wordSource === pack.id && <ChevronRight size={16} className="text-purple-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* Player Count Card */}
        <div className="w-full bg-slate-800 p-6 rounded-2xl mb-4 shadow-lg border border-slate-700">
          <label className="block text-slate-400 mb-4 text-center font-semibold text-xs tracking-widest uppercase">
            Cantidad de Jugadores
          </label>
          <div className="flex justify-center mb-6">
             <span className="text-4xl font-bold text-white bg-slate-900 px-8 py-2 rounded-xl border border-slate-600 shadow-inner">
               {playerCount}
             </span>
          </div>
          <input 
            type="range" 
            min="3" 
            max="20" 
            value={playerCount} 
            onChange={handlePlayerCountChange}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-indigo-500 mb-2"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mb-6">
            <span>3</span>
            <span>20</span>
          </div>
          
          <div className="h-px bg-slate-700 w-full mb-6"></div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <label className="text-slate-400 font-semibold text-xs tracking-widest uppercase flex items-center gap-2">
                <Skull size={16} className="text-red-400" />
                Impostores
                </label>
                <div className="flex items-center gap-3 bg-slate-900 p-1 rounded-lg border border-slate-600">
                    <button 
                        onClick={() => setImpostorCount(Math.max(1, impostorCount - 1))}
                        disabled={impostorCount <= 1}
                        className="p-2 hover:bg-slate-700 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <Minus size={16} />
                    </button>
                    <span className="font-bold w-4 text-center">{impostorCount}</span>
                    <button 
                        onClick={() => setImpostorCount(Math.min(maxImpostors, impostorCount + 1))}
                        disabled={impostorCount >= maxImpostors}
                        className="p-2 hover:bg-slate-700 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <Plus size={16} />
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <label className="text-slate-400 font-semibold text-xs tracking-widest uppercase flex items-center gap-2">
                {useHints ? <Lightbulb size={16} className="text-yellow-400" /> : <LightbulbOff size={16} className="text-slate-500" />}
                Pistas para Impostor
                </label>
                <button
                    onClick={() => setUseHints(!useHints)}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${useHints ? 'bg-indigo-600' : 'bg-slate-700'}`}
                >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${useHints ? 'translate-x-7' : 'translate-x-1.5'}`} />
                </button>
            </div>
          </div>
        </div>

        {/* Names List */}
        <div className="w-full mb-6">
            <h3 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider ml-1">Editar Nombres</h3>
            <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                {customNames.map((name, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-slate-800/50 p-2 rounded-lg border border-slate-700/50">
                        <span className="text-slate-500 text-xs font-mono w-4 text-right">{idx + 1}</span>
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => handleNameChange(idx, e.target.value)}
                                className="w-full bg-transparent text-sm text-white focus:outline-none font-medium placeholder-slate-600"
                                placeholder={`Jugador ${idx + 1}`}
                            />
                            <Pencil size={12} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="flex flex-col w-full gap-3 mt-auto pb-4">
          <Button onClick={handleStartGame} fullWidth className="py-4 text-lg bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-900/40">
            <Play size={20} fill="currentColor" /> Comenzar Partida
          </Button>
          <Button variant="ghost" onClick={onExit} fullWidth className="py-2 text-sm text-slate-500 hover:text-white">
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  // Rest of the phases remain the same as they use the selected pool/word...
  if (phase === GamePhase.REVEAL) {
    const currentPlayer = players[turnIndex];
    
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 animate-fade-in max-w-md mx-auto w-full">
        <div className="text-center mb-6">
          <span className="bg-indigo-900 text-indigo-200 px-3 py-1 rounded-full text-sm font-bold shadow-lg shadow-indigo-900/50">
             TURNO {turnIndex + 1} / {players.length}
          </span>
        </div>

        <div className="bg-slate-800 border-2 border-slate-700 w-full rounded-3xl p-8 flex flex-col items-center min-h-[340px] justify-center shadow-2xl relative overflow-hidden">
          
          {!revealing ? (
            <>
              <div className="bg-slate-700/50 p-6 rounded-full mb-6">
                <Users size={48} className="text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-300 mb-1">Pasa el dispositivo a:</h3>
              <h2 className="text-3xl font-black text-indigo-400 mb-8 text-center leading-tight">{currentPlayer.name}</h2>
              <p className="text-slate-500 text-center mb-8 text-xs max-w-[200px]">
                Asegúrate de que nadie más esté mirando la pantalla.
              </p>
              <Button onClick={() => setRevealing(true)} className="w-full animate-pulse shadow-xl">
                <Eye size={20} /> Ver mi Rol
              </Button>
            </>
          ) : (
            <>
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>
              <h3 className="text-xs text-slate-500 mb-6 uppercase tracking-widest font-bold">Tu secreto</h3>
              
              {currentPlayer.isImpostor ? (
                <div className="text-center w-full animate-bounce-in">
                  <p className="text-red-400 font-bold text-2xl mb-4 tracking-tight">ERES IMPOSTOR</p>
                  
                  {useHints ? (
                    <div className="bg-slate-900/80 p-6 rounded-2xl border border-red-900/30 mb-6 shadow-inner">
                        <p className="text-slate-400 text-[10px] uppercase mb-2 tracking-widest">Tu pista es</p>
                        <p className="text-xl font-bold text-white leading-relaxed">"{currentWord?.hint}"</p>
                    </div>
                  ) : (
                    <div className="bg-slate-900/80 p-6 rounded-2xl border border-red-900/30 mb-6 shadow-inner border-dashed">
                        <p className="text-slate-400 text-[10px] uppercase mb-2 tracking-widest">Sin Pista</p>
                        <p className="text-xl font-bold text-white leading-relaxed tracking-wider">???</p>
                    </div>
                  )}

                  <p className="text-xs text-slate-500">
                      {useHints ? "Finge que sabes la palabra." : "¡No tienes pista! Intenta deducir la palabra."}
                  </p>
                </div>
              ) : (
                <div className="text-center w-full animate-bounce-in">
                  <p className="text-emerald-400 font-bold text-2xl mb-4 tracking-tight">ERES CIUDADANO</p>
                  <div className="bg-slate-900/80 p-6 rounded-2xl border border-emerald-900/30 mb-6 shadow-inner">
                    <p className="text-slate-400 text-[10px] uppercase mb-2 tracking-widest">La palabra es</p>
                    <p className="text-3xl font-bold text-white uppercase tracking-wide">{currentWord?.word}</p>
                  </div>
                  <p className="text-xs text-slate-500">Encuentra a los impostores.</p>
                </div>
              )}

              <div className="mt-8 w-full">
                 <Button variant="secondary" onClick={handleNextTurn} fullWidth className="bg-slate-700 hover:bg-slate-600">
                  <EyeOff size={20} /> Ocultar y Pasar
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  if (phase === GamePhase.PLAYING) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center max-w-md mx-auto animate-fade-in">
        <div className="mb-10 relative">
            <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-10 rounded-full"></div>
            <div className="inline-block p-6 bg-slate-800 rounded-full mb-6 shadow-2xl border border-slate-700 relative z-10">
                <Users size={48} className="text-indigo-400" />
            </div>
            <h2 className="text-4xl font-black text-white mb-4 tracking-tight">¡A Debatir!</h2>
            <p className="text-slate-400 leading-relaxed text-sm max-w-xs mx-auto">
                Cada jugador debe decir una palabra relacionada con su secreto. <br/>
                <span className="text-indigo-400 font-semibold block mt-2">
                    {impostorCount > 1 
                        ? `Hay ${impostorCount} impostores entre nosotros.` 
                        : (useHints ? "El impostor tiene la pista." : "El impostor NO tiene pista.")}
                </span>
            </p>
        </div>

        <div className="w-full space-y-4 mt-auto mb-8">
            <Button onClick={() => setPhase(GamePhase.VOTE)} fullWidth className="py-4 text-xl bg-gradient-to-r from-indigo-600 to-purple-600 border-none shadow-lg shadow-purple-900/20">
                <UserCheck size={24} /> ¡Vamos a Votar!
            </Button>
        </div>
      </div>
    );
  }

  if (phase === GamePhase.VOTE) {
    return (
      <div className="flex flex-col h-full p-6 max-w-md mx-auto animate-fade-in">
        <h2 className="text-2xl font-bold text-center mb-2 text-white">¿Quién es el Impostor?</h2>
        <p className="text-slate-400 text-center mb-6 text-sm">Vota por el más sospechoso.</p>
        
        <div className="grid grid-cols-2 gap-3 mb-6 overflow-y-auto pb-4 custom-scrollbar">
            {players.map(p => (
                <button
                    key={p.id}
                    onClick={() => handleVote(p.id)}
                    className={`relative p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center min-h-[100px] ${
                        p.votesReceived > 0 
                        ? 'bg-red-900/20 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                        : 'bg-slate-800 border-slate-700 hover:border-indigo-500 hover:bg-slate-750'
                    }`}
                >
                    <div className="font-bold text-md text-white mb-1 break-all w-full text-center leading-tight">{p.name}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Votos</div>
                    
                    {p.votesReceived > 0 && (
                        <div className="absolute -top-3 -right-3 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg border-2 border-slate-900 scale-100 animate-bounce-short">
                            {p.votesReceived}
                        </div>
                    )}
                </button>
            ))}
        </div>

        <div className="mt-auto pt-4">
             <Button variant="danger" onClick={finishVoting} fullWidth className="mb-2 py-4 shadow-red-900/30">
                Ver Resultados
             </Button>
        </div>
      </div>
    );
  }

  if (phase === GamePhase.RESULT) {
    const impostors = players.filter(p => p.isImpostor);
    const mostVoted = players.reduce((prev, current) => (prev.votesReceived > current.votesReceived) ? prev : current);
    const impostorCaught = mostVoted.isImpostor && mostVoted.votesReceived > 0;
    
    const totalVotes = players.reduce((acc, p) => acc + p.votesReceived, 0);

    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center max-w-md mx-auto animate-fade-in w-full">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-8">Fin de la Partida</h2>

        <div className="mb-8 relative">
            <div className={`absolute inset-0 blur-[50px] opacity-20 rounded-full ${impostorCaught ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
            {impostorCaught ? (
                <div className="bg-emerald-500/10 p-8 rounded-full border-4 border-emerald-500 mb-4 relative z-10 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                   <UserCheck size={64} className="text-emerald-400" />
                </div>
            ) : (
                <div className="bg-red-500/10 p-8 rounded-full border-4 border-red-500 mb-4 relative z-10 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                   <Skull size={64} className="text-red-400" />
                </div>
            )}
        </div>

        <h1 className="text-3xl font-black text-white mb-3 tracking-tight">
            {impostorCaught ? "¡IMPOSTOR CAZADO!" : "¡IMPOSTORES GANAN!"}
        </h1>
        
        <p className="text-slate-400 mb-8 max-w-xs text-sm leading-relaxed">
            {impostorCaught 
                ? <span>La mayoría votó por <strong className="text-white">{mostVoted.name}</strong>, que era un impostor.</span> 
                : <span>Se escaparon. La mayoría sospechó de <strong className="text-white">{mostVoted.name === impostors[0]?.name && totalVotes === 0 ? "nadie" : mostVoted.name}</strong>.</span>
            }
        </p>

        <div className="bg-slate-800 rounded-2xl p-6 w-full mb-8 border border-slate-700 shadow-xl">
            <div className="flex justify-between items-start mb-3 border-b border-slate-700/50 pb-3">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-1">Impostor(es)</span>
                <div className="text-right flex flex-col">
                  {impostors.map(imp => (
                    <span key={imp.id} className="text-red-400 font-bold text-lg leading-tight">{imp.name}</span>
                  ))}
                </div>
            </div>
            <div className="flex justify-between items-center mb-3 border-b border-slate-700/50 pb-3">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Palabra Secreta</span>
                <span className="text-emerald-400 font-bold text-lg">{currentWord?.word}</span>
            </div>
             <div className="flex justify-between items-center">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Pista</span>
                <span className="text-indigo-400 font-bold text-sm text-right">{currentWord?.hint}</span>
            </div>
        </div>

        <div className="flex flex-col gap-3 w-full mt-auto">
            <Button onClick={() => setPhase(GamePhase.SETUP)} fullWidth className="py-4">
                <RefreshCw size={20} /> Jugar Otra Vez
            </Button>
            <Button variant="ghost" onClick={onExit} fullWidth className="text-slate-400 hover:text-white">
                <Home size={20} /> Menú Principal
            </Button>
        </div>
      </div>
    );
  }

  return <div>Estado desconocido</div>;
};