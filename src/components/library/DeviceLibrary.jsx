import React, { useState } from 'react';
import { useRackStack } from '../../context/RackContext';
import { useDraggable } from '@dnd-kit/core';
import { GripVertical } from 'lucide-react';

const DraggableDeviceItem = ({ device }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: `lib-${device.type}`,
        data: { device, source: 'library' }
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={style}
            className="flex items-center gap-2 p-2 mb-1 bg-[#18181b] border border-[#27272a] rounded cursor-grab hover:bg-[#27272a] group"
        >
            <div className="text-zinc-600 group-hover:text-zinc-400">
                <GripVertical size={14} />
            </div>
            <div className="flex-1">
                <div className="text-xs font-medium text-zinc-200">{device.name}</div>
                <div className="text-[10px] text-zinc-500">{device.uHeight}U • {device.subcat}</div>
            </div>
        </div>
    );
}

const DeviceLibrary = () => {
    const { library } = useRackStack();
    const [filter, setFilter] = useState('');

    // Grouping logic could go here
    const filteredLibrary = library.filter(d =>
        d.name.toLowerCase().includes(filter.toLowerCase()) ||
        d.subcat.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-[#09090b]">
            <div className="p-2 border-b border-[#27272a]">
                <input
                    type="text"
                    placeholder="Search devices..."
                    className="w-full bg-[#18181b] border border-[#27272a] rounded px-2 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-600"
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                />
            </div>
            <div className="flex-1 overflow-y-auto p-2">
                {filteredLibrary.map((device, idx) => (
                    <DraggableDeviceItem key={`${device.type}-${idx}`} device={device} />
                ))}
            </div>
        </div>
    );
};

export default DeviceLibrary;
