import React from 'react';
import { Radio } from 'lucide-react';

export default function MainLayout({ sidebar, topBar, children }) {
    return (
        <div className="flex h-screen w-full bg-[var(--bg-main)] text-[var(--text-primary)] overflow-hidden font-sans select-none relative transition-colors duration-300">
            {/* Sidebar */}
            <div className="w-80 bg-[var(--bg-sidebar)] border-r border-[var(--border-color)] flex flex-col z-20 shrink-0 transition-colors duration-300" onClick={e => e.stopPropagation()}>
                <div className="h-[72px] px-4 border-b border-[var(--border-color)] flex justify-between items-center flex-none">
                    <div>
                        <h1 className="font-bold text-[var(--text-primary)] tracking-widest uppercase flex items-center gap-2">
                            <Radio size={20} className="text-orange-600" /> RACKSTACK PRO <span className="text-[10px] text-gray-600 ml-1">BY RMXLABS</span>
                        </h1>
                        <p className="text-[10px] text-gray-500 mt-1">Virtual Layout & Cabling</p>
                    </div>
                </div>
                {/* Dynamic Sidebar Content */}
                {sidebar}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-[var(--bg-main)] relative z-0">
                {/* Optional TopBar area if needed later */}
                {topBar && <div className="h-12 border-b border-[var(--border-color)] flex items-center px-4 bg-[var(--bg-panel)]">{topBar}</div>}

                <div className="flex-1 overflow-hidden relative">
                    {children}
                </div>
            </div>
        </div>
    );
}
