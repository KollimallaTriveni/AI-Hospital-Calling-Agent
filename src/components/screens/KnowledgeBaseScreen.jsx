import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  UploadCloud,
  Database,
  Search,
  CheckCircle2,
  FileText,
  Plus,
  Brain,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

const KnowledgeBaseScreen = () => {
  const { knowledgeBase, addKnowledgeItem, showToast } = useApp();
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState('Emergency Triage');
  const [docContent, setDocContent] = useState('');

  // Interactive RAG Query Test State
  const [ragQuery, setRagQuery] = useState('What is the protocol for sudden chest pain?');
  const [ragResult, setRagResult] = useState(null);

  const handleUploadDoc = (e) => {
    e.preventDefault();
    if (!docTitle || !docContent) return;

    const newItem = {
      id: `kb-${Date.now()}`,
      title: docTitle,
      category: docCategory,
      department: 'General',
      updatedAt: '2026-09-23',
      chunks: Math.floor(Math.random() * 20) + 10,
      status: 'Indexed in Vector DB',
      content: docContent
    };

    addKnowledgeItem(newItem);
    setDocTitle('');
    setDocContent('');
  };

  const handleTestRagQuery = (e) => {
    e.preventDefault();
    setRagResult({
      topMatchChunk: 'Cardiology Emergency Triage Protocol (Chunk #402)',
      similarityScore: 0.942,
      retrievedContext: 'Chest pain radiating to left arm or neck must be tagged HIGH URGENCY and routed to Dr. Kumar or ER Duty Officer.',
      matchedVectorId: 'vec_89410_cardio_04'
    });
    showToast('Pinecone Vector Search executed in 16ms', 'info');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold mb-2">
            <Database className="w-3.5 h-3.5" />
            RAG Vector Neural Knowledge Engine
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            AI Knowledge Base & RAG Status (Screen 12)
          </h1>
          <p className="text-xs text-slate-500">
            Vectorized hospital protocols, doctor OPD schedules, triage guidelines, and insurance policies for real-time AI retrieval.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Vector DB: 14,280 Chunks Active
          </span>
        </div>
      </div>

      {/* RAG Status Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Embedding Model</span>
          <div className="text-base font-black text-slate-900 dark:text-white mt-1">Text-Embedding-3-Large</div>
          <div className="text-[10px] text-emerald-600 font-bold mt-0.5">3,072 Dimensions</div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Vector Search Latency</span>
          <div className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-1">16.4 ms</div>
          <div className="text-[10px] text-slate-400 font-semibold mt-0.5">Pinecone Serverless</div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Indexed Knowledge Files</span>
          <div className="text-base font-black text-blue-600 dark:text-blue-400 mt-1">{knowledgeBase.length} Core Policy Files</div>
          <div className="text-[10px] text-blue-600 font-bold mt-0.5">Auto-chunked 512 tokens</div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">RAG Precision Score</span>
          <div className="text-base font-black text-purple-600 dark:text-purple-400 mt-1">98.6% Accuracy</div>
          <div className="text-[10px] text-slate-400 font-semibold mt-0.5">Hybrid Dense+Sparse</div>
        </div>
      </div>

      {/* Main Grid: Upload & Document Roster + Interactive RAG Tester */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: Upload Form & Indexed Knowledge Documents */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Upload Document Form */}
          <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-blue-500" />
              Upload & Vectorize New Hospital Document
            </h3>

            <form onSubmit={handleUploadDoc} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Document Title
                  </label>
                  <input
                    type="text"
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    placeholder="e.g. ICU Visiting Hours & Hygiene Policy"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Category
                  </label>
                  <select
                    value={docCategory}
                    onChange={(e) => setDocCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Emergency Triage">Emergency Triage</option>
                    <option value="Billing & Policies">Billing & Policies</option>
                    <option value="Schedules">Schedules</option>
                    <option value="Patient Instructions">Patient Instructions</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Document Content Text
                </label>
                <textarea
                  rows={3}
                  value={docContent}
                  onChange={(e) => setDocContent(e.target.value)}
                  placeholder="Paste hospital policy or guidelines text here..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Vectorize & Index to RAG Engine
              </button>
            </form>
          </div>

          {/* Indexed Knowledge Documents List */}
          <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Indexed Vector Knowledge Base Files
            </h3>

            <div className="space-y-3">
              {knowledgeBase.map(item => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      {item.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                    "{item.content}"
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                    <span>Category: {item.category}</span>
                    <span>Chunks: {item.chunks} Vector Embeddings</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 5 Cols: RAG Query Tester */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Brain className="w-4 h-4 text-cyan-500" />
              Interactive RAG Vector Search Simulator
            </h3>

            <form onSubmit={handleTestRagQuery} className="space-y-3 text-xs">
              <label className="block font-bold text-slate-700 dark:text-slate-300">
                Ask AI Knowledge Base Question:
              </label>
              <input
                type="text"
                value={ragQuery}
                onChange={(e) => setRagQuery(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-cyan-500"
              />
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold shadow-md shadow-cyan-500/20 transition-all"
              >
                <Search className="w-4 h-4" />
                Query Vector Database
              </button>
            </form>

            {ragResult && (
              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-cyan-700 dark:text-cyan-300">
                  <span>Top Match Vector Chunk</span>
                  <span>Score: {ragResult.similarityScore}</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  {ragResult.topMatchChunk}
                </div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 bg-white/50 dark:bg-slate-900/50 p-3 rounded-xl border border-cyan-500/30">
                  "{ragResult.retrievedContext}"
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default KnowledgeBaseScreen;
