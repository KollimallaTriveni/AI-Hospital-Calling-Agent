import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Brain,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Stethoscope,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  FileCheck2,
  Cpu
} from 'lucide-react';

const IssueAnalysisScreen = () => {
  const { activeCall, setActiveScreen } = useApp();

  const issueData = {
    detectedIssue: activeCall?.issue || 'Chest Pain & Discomfort',
    department: activeCall?.department || 'Cardiology',
    urgency: activeCall?.urgency || 'High',
    reasoning: 'Patient presented acute pressure-like chest tightness with radiation to left upper limb. Symptoms align with acute coronary syndrome triage criteria.',
    confidence: activeCall?.confidenceScore || 94,
    icd10Code: 'R07.9 (Chest pain, unspecified)',
    triageLevel: 'Level 2 (Emergency / High Priority)',
    matchingRules: [
      'Keyword "chest pain" mapped to Cardiology vector chunk #402',
      'Radiation to arm triggered urgent OPD routing rule',
      'Age 45M risk factor multiplier applied'
    ]
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Page Title */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold mb-2">
            <Cpu className="w-3.5 h-3.5" />
            AI Clinical Analysis Engine
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Patient Issue Analysis (Screen 4)
          </h1>
          <p className="text-xs text-slate-500">
            Natural language symptom extraction, ICD-10 coding, and automated clinical triage classification.
          </p>
        </div>

        <button
          onClick={() => setActiveScreen('doctor-recommendation')}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all"
        >
          View Doctor Recommendations
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main AI Analysis Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left 7 cols: Key Medical Indicators */}
        <div className="md:col-span-7 space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Chief Detected Issue</span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                  {issueData.detectedIssue}
                </h2>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">AI Confidence</span>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {issueData.confidence}%
                </div>
              </div>
            </div>

            {/* Department & Urgency Badges */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                <span className="text-[10px] font-extrabold uppercase text-blue-600 dark:text-blue-400">Recommended Department</span>
                <div className="text-lg font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  {issueData.department}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                <span className="text-[10px] font-extrabold uppercase text-rose-600 dark:text-rose-400">Clinical Urgency Level</span>
                <div className="text-lg font-black text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  {issueData.urgency} Urgency
                </div>
              </div>
            </div>

            {/* AI Reasoning Block */}
            <div className="p-5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                <Brain className="w-4 h-4 text-cyan-500" />
                AI Triage Reasoning & Justification
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                "{issueData.reasoning}"
              </p>
            </div>

            {/* ICD-10 Code & Protocol */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 font-medium">ICD-10 Code:</span>
                <div className="font-mono font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                  {issueData.icd10Code}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 font-medium">Protocol Tag:</span>
                <div className="font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                  {issueData.triageLevel}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right 5 cols: Knowledge Base Matches & Next Step */}
        <div className="md:col-span-5 space-y-6">
          
          <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-500" />
              Vector DB Knowledge Match Rules
            </h3>

            <div className="space-y-2.5">
              {issueData.matchingRules.map((rule, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{rule}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setActiveScreen('doctor-recommendation')}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 transition-all"
              >
                Proceed to Doctor Selection
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default IssueAnalysisScreen;
