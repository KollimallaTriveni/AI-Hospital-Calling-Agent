import React, { useState } from 'react';
import { SYSTEM_ARCHITECTURE_STEPS } from '../../data/mockData';
import {
  GitMerge,
  PhoneIncoming,
  Bot,
  Mic,
  Brain,
  Database,
  Stethoscope,
  UserCheck,
  Calendar,
  CheckCircle2,
  BellRing,
  LayoutDashboard,
  ArrowDown,
  Sparkles,
  Zap,
  Cpu
} from 'lucide-react';

const iconMap = {
  PhoneIncoming,
  Bot,
  Mic,
  Brain,
  Database,
  Stethoscope,
  UserCheck,
  Calendar,
  CheckCircle2,
  BellRing,
  LayoutDashboard
};

const ArchitectureScreen = () => {
  const [selectedStep, setSelectedStep] = useState(SYSTEM_ARCHITECTURE_STEPS[3]); // Default LLM step

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold mb-2">
            <GitMerge className="w-3.5 h-3.5" />
            Enterprise Infrastructure Topology
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            System Architecture Workflow (Screen 14)
          </h1>
          <p className="text-xs text-slate-500">
            End-to-end technical pipeline tracing SIP telephony, STT, LLM reasoning, RAG vector retrieval, slot engine, and real-time dashboard sockets.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-mono">
          <Zap className="w-4 h-4 text-cyan-400 animate-bounce" />
          End-to-End Latency: &lt; 280ms
        </div>
      </div>

      {/* Main Grid: Visual Interactive Workflow Diagram & Detailed Node Spec */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: Interactive Animated Step Cards Stream */}
        <div className="lg:col-span-7 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2">
            Click any architectural component to view technical specifications:
          </h3>

          <div className="space-y-3">
            {SYSTEM_ARCHITECTURE_STEPS.map((step, idx) => {
              const Icon = iconMap[step.icon] || GitMerge;
              const isSelected = selectedStep.id === step.id;

              return (
                <div key={step.id} className="space-y-3">
                  <div
                    onClick={() => setSelectedStep(step)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center justify-between group ${
                      isSelected
                        ? 'border-blue-500 bg-blue-600/10 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/30'
                        : 'border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 hover:border-blue-500/40'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-xl ${step.color} text-white flex items-center justify-center font-bold shadow-md`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold uppercase text-slate-400 font-mono">
                            STEP {step.id}
                          </span>
                          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                            {step.name}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {step.desc}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 pl-2">
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 font-mono">
                        {step.tech.split(' ')[0]}
                      </span>
                    </div>
                  </div>

                  {/* Down arrow connecting line */}
                  {idx < SYSTEM_ARCHITECTURE_STEPS.length - 1 && (
                    <div className="flex justify-center my-1">
                      <ArrowDown className="w-4 h-4 text-blue-500/50 animate-bounce" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 5 Cols: Selected Node Detailed Technical Inspector */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 sticky top-24 space-y-6 shadow-xl">
            
            <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className={`w-12 h-12 rounded-2xl ${selectedStep.color} text-white flex items-center justify-center font-bold shadow-lg`}>
                {React.createElement(iconMap[selectedStep.icon] || GitMerge, { className: 'w-6 h-6' })}
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase text-slate-400">Component Spec Node</span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Step {selectedStep.id}: {selectedStep.name}
                </h3>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Technology Stack</span>
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs font-mono font-bold text-blue-600 dark:text-blue-400 mt-1 border border-slate-200 dark:border-slate-800">
                  {selectedStep.tech}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Functional Description</span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mt-1 p-3 rounded-xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                  {selectedStep.desc}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                  <span className="flex items-center gap-1.5">
                    <Cpu className="w-4 h-4" /> Hardware / Cluster Load
                  </span>
                  <span>Optimal</span>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-300">
                  Fully decoupled microservices event bus with automatic failover fallback to emergency human queue.
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default ArchitectureScreen;
