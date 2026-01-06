import React from 'react';
import { Printer, Download } from 'lucide-react';

export default function ExportControls() {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={handlePrint}
                className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#222] text-gray-300 hover:text-white rounded-md text-xs font-bold uppercase tracking-wider transition-colors border border-[#333] h-[36px]"
                title="Export as PDF (via Print)"
            >
                EXPORT
            </button>
        </div>
    );
}
