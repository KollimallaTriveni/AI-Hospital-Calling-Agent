import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Mic } from 'lucide-react';

const VoiceWave = ({ isLive = true, status = 'Listening', active = true }) => {
  const [muted, setMuted] = useState(false);
  const [bars, setBars] = useState([20, 45, 80, 50, 95, 60, 40, 75, 90, 30, 65, 85, 40, 70, 50]);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setBars(prev => prev.map(() => Math.floor(Math.random() * 75) + 15));
    }, 150);
    return () => clearInterval(interval);
  }, [active]);

  const getStatusColor = () => {
    switch (status) {
      case 'Listening': return 'bg-cyan-500 text-cyan-500';
      case 'Processing': return 'bg-amber-500 text-amber-500';
      case 'Responding': return 'bg-emerald-500 text-emerald-500';
      default: return 'bg-blue-500 text-blue-500';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-900/90 dark:bg-slate-950/90 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden backdrop-blur-xl">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-blue-600/10 animate-pulse pointer-events-none" />

      {/* Header bar */}
      <div className="flex items-center justify-between w-full mb-6 z-10">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full animate-ping ${getStatusColor().split(' ')[0]}`} />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            MedPulse AI Voice Neural Engine
          </span>
        </div>
        <button
          onClick={() => setMuted(!muted)}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          title={muted ? 'Unmute Audio Synthesis' : 'Mute Audio Synthesis'}
        >
          {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>
      </div>

      {/* Voice Wave Visualizer Bars */}
      <div className="flex items-center justify-center gap-1.5 h-24 my-4 px-8 z-10 w-full">
        {bars.map((height, i) => (
          <div
            key={i}
            className={`w-2.5 rounded-full transition-all duration-150 ${
              muted
                ? 'bg-slate-700'
                : 'bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.5)]'
            }`}
            style={{ height: muted ? '6px' : `${height}%` }}
          />
        ))}
      </div>

      {/* Status indicator badge */}
      <div className="flex items-center gap-3 mt-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 z-10">
        <Mic className={`w-4 h-4 ${status === 'Listening' ? 'text-cyan-400 animate-bounce' : 'text-slate-400'}`} />
        <span className="text-sm font-medium text-slate-200">
          AI Status: <strong className={getStatusColor().split(' ')[1]}>{status}</strong>
        </span>
        <span className="text-xs text-slate-400 font-mono border-l border-slate-700 pl-3">
          Latency: 140ms | 24kHz HD Voice
        </span>
      </div>
    </div>
  );
};

export default VoiceWave;
