import React, { useState } from 'react';
import { Server, Settings } from 'lucide-react';

const MainLayout = ({ sidebar, children }) => {
    return (
        <div className="flex h-screen bg-[#09090b] text-zinc-100 font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-80 flex-none border-r border-[#27272a] bg-[#18181b] flex flex-col">
                <div className="h-14 px-4 border-b border-[#27272a] flex items-center gap-2">
                    <div className="p-1.5 bg-blue-600 rounded-md">
                        <Server size={18} className="text-white" />
                    </div>
                    <span className="font-bold text-sm tracking-wide text-zinc-100">RACKSTACK2</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-[#27272a] text-zinc-400 rounded-full border border-[#3f3f46]">v2.0</span>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col">
                    {sidebar}
                </div>

                <div className="h-10 border-t border-[#27272a] flex items-center px-4 justify-between bg-[#09090b]">
                    <span className="text-[10px] text-zinc-500">© 2026 Antigravity</span>
                    <Settings size={14} className="text-zinc-500 hover:text-zinc-300 cursor-pointer" />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative overflow-hidden bg-zinc-950">
                {children}
            </main>
        </div>
    );
};

export default MainLayout;
