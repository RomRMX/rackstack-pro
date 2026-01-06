import React, { useState, useEffect } from 'react';
import {
    Server, Cable, Bot, Layout, Award, Zap, ArrowRight, CheckCircle,
    ChevronRight, Play, Terminal, Cpu, Share2, Layers, Shield
} from 'lucide-react';

const LandingPage = ({ onLaunch }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className={`min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-orange-500/30 selection:text-orange-200 overflow-x-hidden transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>

            {/* BACKGROUND EFFECTS */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[120px] rounded-full animate-pulse-slow"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-orange-900/10 blur-[120px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150 mix-blend-overlay"></div>
            </div>

            {/* NAVBAR */}
            <nav className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-900/20">
                        <Server size={18} className="text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                        RACKSTACK <span className="text-orange-500">PRO</span>
                    </span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
                    <a href="#features" className="hover:text-white transition-colors">Features</a>
                    <a href="#workflow" className="hover:text-white transition-colors">Workflow</a>
                    <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                </div>
                <button
                    onClick={onLaunch}
                    className="group relative px-6 py-2 bg-white/5 border border-white/10 hover:border-orange-500/50 rounded-full text-sm font-bold tracking-wide transition-all overflow-hidden hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <span className="relative group-hover:text-white transition-colors flex items-center gap-2">
                        LAUNCH APP <ArrowRight size={14} />
                    </span>
                </button>
            </nav>

            {/* HERO SECTION */}
            <header className="relative z-10 pt-20 pb-32 px-6 text-center max-w-5xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-orange-400 text-xs font-bold tracking-wider mb-8 animate-fade-in-up">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                    V2.0 NOW LIVE
                </div>

                <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-tight animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    Visualizing Racks <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 via-white to-gray-500">Just Got Intelligent.</span>
                </h1>

                <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    The ultimate tool for AV Integrators. Design active rack layouts, visualize signal paths, and generate instant documentation. No CAD required.
                </p>

                <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                    <button
                        onClick={onLaunch}
                        className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl font-bold text-lg hover:scale-105 active:scale-95 transition-transform shadow-[0_0_40px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2"
                    >
                        <Play size={20} fill="currentColor" /> Start Building Now
                    </button>
                    <button className="w-full md:w-auto px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 backdrop-blur-sm">
                        <Terminal size={20} /> Watch Demo
                    </button>
                </div>

                {/* HERO UI PREVIEW */}
                <div className="mt-20 relative animate-fade-in-up opacity-0" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10"></div>
                    <div className="bg-[#151515] border border-white/10 rounded-xl p-2 shadow-2xl transform rotate-x-12 perspective-1000 max-w-4xl mx-auto">
                        <div className="bg-[#0f0f0f] rounded-lg border border-white/5 overflow-hidden">
                            <div className="h-8 bg-[#1a1a1a] border-b border-white/5 flex items-center px-4 gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                                </div>
                            </div>
                            {/* MOCK UI CONTENT */}
                            <div className="h-[400px] flex">
                                <div className="w-64 bg-[#111] border-r border-[#222] p-4 hidden md:block">
                                    <div className="h-2 bg-[#222] rounded w-1/2 mb-4"></div>
                                    <div className="space-y-2">
                                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-8 bg-[#1a1a1a] rounded border border-[#222]"></div>)}
                                    </div>
                                </div>
                                <div className="flex-1 bg-[#151515] p-6 flex items-center justify-center">
                                    <div className="grid grid-cols-3 gap-4 w-full h-full max-w-2xl">
                                        <div className="col-span-1 bg-[#0a0a0a] border border-[#333] rounded-lg flex flex-col items-center justify-center gap-2">
                                            <div className="w-12 h-1 bg-[#222] rounded"></div>
                                            {Array(10).fill(0).map((_, i) => <div key={i} className="w-full h-2 bg-[#1a1a1a] my-0.5"></div>)}
                                        </div>
                                        <div className="col-span-1 bg-[#0a0a0a] border border-[#333] rounded-lg flex flex-col items-center justify-center gap-2 scale-110 shadow-xl border-orange-500/30">
                                            <div className="w-12 h-1 bg-orange-500/50 rounded"></div>
                                            {Array(10).fill(0).map((_, i) => <div key={i} className="w-full h-2 bg-[#1a1a1a] my-0.5 border-l-2 border-orange-500"></div>)}
                                        </div>
                                        <div className="col-span-1 bg-[#0a0a0a] border border-[#333] rounded-lg flex flex-col items-center justify-center gap-2">
                                            <div className="w-12 h-1 bg-[#222] rounded"></div>
                                            {Array(10).fill(0).map((_, i) => <div key={i} className="w-full h-2 bg-[#1a1a1a] my-0.5"></div>)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* FEATURES GRID */}
            <section id="features" className="py-24 px-6 relative z-10 bg-[#0c0c0c]/50 backdrop-blur-lg border-y border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Built for <span className="text-orange-500">Integrators</span></h2>
                        <p className="text-gray-400">Everything you need to plan complex systems.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={<Layout className="text-blue-400" />}
                            title="Smart Rack Builders"
                            desc="Drag & drop interface with intelligent collision detection and auto-alignment."
                        />
                        <FeatureCard
                            icon={<Cable className="text-purple-400" />}
                            title="Signal Path Visualization"
                            desc="Trace specific signal paths (Audio, Video, Data) through your entire system."
                        />
                        <FeatureCard
                            icon={<Bot className="text-green-400" />}
                            title="AI-Assisted Wiring"
                            desc="Ask our AI assistant about compatibility, pinouts, and device specs instantly."
                        />
                        <FeatureCard
                            icon={<Layers className="text-orange-400" />}
                            title="Multi-Rack Support"
                            desc="Manage massive deployments across multiple racks with unified inventory."
                        />
                        <FeatureCard
                            icon={<Shield className="text-red-400" />}
                            title="Secure & Private"
                            desc="All sensitive project data stays local. No cloud leaks. Enterprise ready."
                        />
                        <FeatureCard
                            icon={<Share2 className="text-cyan-400" />}
                            title="Instant Documentation"
                            desc="Export beautiful rack elevations and BOMs in one click."
                        />
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-12 border-t border-white/5 bg-[#050505] text-center">
                <div className="flex items-center justify-center gap-2 mb-4 opacity-50 grayscale hover:grayscale-0 transition-all">
                    <Server size={18} />
                    <span className="font-bold tracking-widest">RACKSTACK PRO</span>
                </div>
                <p className="text-gray-600 text-sm">© 2024 RMX Labs. Built for the Future of AV.</p>
            </footer>

            {/* CSS ANIMATIONS */}
            <style>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.1; }
          50% { transform: scale(1.1); opacity: 0.2; }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-pulse-slow { animation: pulse-slow 8s infinite ease-in-out; }
        .animate-fade-in-up { animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .perspective-1000 { perspective: 1000px; }
        .rotate-x-12 { transform: rotateX(12deg); }
      `}</style>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.07] transition-all group cursor-default">
        <div className="w-12 h-12 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h3 className="text-lg font-bold mb-2 text-gray-200 group-hover:text-white transition-colors">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed max-w-[90%]">{desc}</p>
    </div>
);

export default LandingPage;
