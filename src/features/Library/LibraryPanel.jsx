import React, { useState } from 'react';
import { Layers, Plus, Search } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { generateId } from '../../utils/common';

export default function LibraryPanel() {
    const { library, addToLibrary, setDraggingItem } = useProject();
    const [searchTerm, setSearchTerm] = useState('');

    // Dynamic Categories
    const defaultCats = ['Network', 'Power', 'Source', 'Processor', 'Amp', 'accessory'];
    const usedCats = [...new Set(library.map(d => d.subcat || (d.category === 'accessory' ? 'accessory' : 'Other')))];
    const allCats = [...new Set([...defaultCats, ...usedCats])];

    const sortedCats = allCats.sort((a, b) => {
        const idxA = defaultCats.indexOf(a);
        const idxB = defaultCats.indexOf(b);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return a.localeCompare(b);
    });

    const filteredLibrary = library.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateTemplate = (catLabel) => {
        addToLibrary({
            isTemplate: true,
            id: generateId(),
            name: 'New Device',
            uHeight: 1,
            width: 1,
            category: catLabel === 'accessory' ? 'accessory' : 'gear',
            subcat: catLabel === 'accessory' ? 'accessory' : catLabel,
            inputs: [],
            outputs: [],
            images: {},
            style: { background: '#262626' }
        });
    };

    return (
        <div className="flex flex-col h-full bg-[var(--bg-sidebar)]">
            <div className="p-2 border-b border-[var(--border-color)]">
                <div className="relative">
                    <Search size={14} className="absolute left-2 top-2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search devices..."
                        className="w-full bg-[var(--bg-panel)] text-xs text-white border border-[var(--border-color)] rounded pl-8 pr-2 py-1.5 focus:outline-none focus:border-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {sortedCats.map(catLabel => {
                    const items = filteredLibrary.filter(d => (d.subcat === catLabel) || (catLabel === 'accessory' && d.category === 'accessory' && !d.subcat) || (catLabel === 'Other' && !d.subcat && d.category !== 'accessory'));
                    if (items.length === 0 && searchTerm) return null;

                    return (
                        <div key={catLabel} className="p-4 pb-0">
                            <div className="flex justify-between items-center mb-2 group">
                                <h3 className="text-[10px] font-bold text-blue-500 uppercase tracking-wider flex items-center gap-2">
                                    <Layers size={12} /> {catLabel === 'accessory' ? 'ACCESSORIES' : catLabel.toUpperCase()}
                                </h3>
                                <button
                                    onClick={() => handleCreateTemplate(catLabel)}
                                    className="text-gray-600 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                    title={`Add to ${catLabel}`}
                                >
                                    <Plus size={12} />
                                </button>
                            </div>
                            <div className="space-y-1">
                                {items.map((t, i) => (
                                    <div
                                        key={t.id || i}
                                        draggable
                                        onDragStart={(e) => {
                                            e.dataTransfer.setData('templateIdx', library.indexOf(t));
                                            setDraggingItem({ uHeight: t.uHeight, type: 'new' });
                                        }}
                                        onDragEnd={() => setDraggingItem(null)}
                                        className="bg-[#1a1a1a] p-1 rounded border border-[#333] hover:bg-[#222] cursor-grab flex items-center gap-2 group transition-colors shadow-sm active:cursor-grabbing"
                                    >
                                        <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-gray-500 font-bold text-[9px] border border-[#222]">
                                            {t.width < 1 ? `1/${Math.round(1 / t.width)}U` : `${t.uHeight}U`}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-bold text-gray-300 truncate group-hover:text-white">{t.name}</div>
                                            <div className="text-[9px] text-gray-500">{t.subcat || t.category}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
