import React, { useState } from 'react';
import MainLayout from './layouts/MainLayout';
import LibraryPanel from './features/Library/LibraryPanel';
import RackView from './features/RackBuilder/RackView';
import LineView from './features/LineDiagram/Wrapper';
import { Server, Bot } from 'lucide-react';

export default function App() {
    const [activeTab, setActiveTab] = useState('library');

    const SidebarContent = (
        <div className="flex flex-col h-full">
            <div className="flex border-b border-[#e5e7eb] dark:border-[#222] h-[40px] flex-none">
                <button
                    onClick={() => setActiveTab('library')}
                    className={`flex-1 text-xs font-bold uppercase flex items-center justify-center gap-2 ${activeTab === 'library' ? 'bg-[#1a1a1a] text-white border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    <Server size={14} /> Rack View
                </button>
                <button
                    onClick={() => setActiveTab('line_view')}
                    className={`flex-1 text-xs font-bold uppercase flex items-center justify-center gap-2 ${activeTab === 'line_view' ? 'bg-[#1a1a1a] text-purple-400 border-b-2 border-purple-500' : 'text-gray-500 hover:text-purple-300'}`}
                >
                    <Bot size={14} /> Line View
                </button>
            </div>
            <div className="flex-1 overflow-hidden">
                <LibraryPanel />
            </div>
        </div>
    );

    return (
        <MainLayout sidebar={SidebarContent}>
            {activeTab === 'library' && <RackView />}
            {activeTab === 'line_view' && <LineView />}
        </MainLayout>
    );
}
