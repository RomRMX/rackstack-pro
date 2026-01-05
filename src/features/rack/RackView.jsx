import React from 'react';
import { useRackStack } from '../../context/RackContext';
import RackUnit from '../../components/rack/RackUnit';
import { Plus } from 'lucide-react';

import DeviceSettingsModal from '../../components/rack/DeviceSettingsModal';
import { useState } from 'react';

const SingleRack = ({ rack, viewMode, onDelete, onEditDevice }) => {
    return (
        <div className="flex flex-col flex-none w-[350px] h-full p-4">
            {/* Rack Header */}
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold text-zinc-300">{rack.name}</h2>
                <button
                    onClick={() => onDelete(rack.id)}
                    className="text-[10px] text-red-500 hover:text-red-400"
                >
                    Delete
                </button>
            </div>

            {/* Rack Frame */}
            <div className="flex-1 bg-[#1a1a1a] border border-[#333] rounded-sm overflow-hidden flex flex-col relative shadow-2xl">
                <div className="absolute inset-0 overflow-y-auto custom-scrollbar">
                    <div className="flex flex-col">
                        {/* Render 42 Units */}
                        {rack.units.map((device, idx) => (
                            <RackUnit
                                key={idx}
                                rackId={rack.id}
                                uIndex={idx}
                                device={device}
                                viewMode={viewMode}
                                onEdit={() => device && onEditDevice(rack.id, idx, device)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const RackView = () => {
    const { racks, addRack, deleteRack, connections, addConnection, removeConnection } = useRackStack();
    const [editingDevice, setEditingDevice] = useState(null);
    const [viewMode, setViewMode] = useState('front');

    // Cabling State
    const [dragStart, setDragStart] = useState(null); // { portId, rackId, uIndex, x, y }
    const [dragCurrent, setDragCurrent] = useState(null); // { x, y }
    const containerRef = React.useRef(null);

    const handleEditDevice = (rackId, uIndex, device) => {
        setEditingDevice({ rackId, uIndex, device });
    };

    // --- CABLE INTERACTION ---
    const getRelativePos = (clientX, clientY) => {
        if (!containerRef.current) return { x: 0, y: 0 };
        const rect = containerRef.current.getBoundingClientRect();
        return {
            x: clientX - rect.left + containerRef.current.scrollLeft, // Account for scroll
            y: clientY - rect.top
        };
    };

    const handleMouseDown = (e) => {
        // Check if we clicked a port
        const portEl = e.target.closest('[data-port-id]');
        if (portEl && viewMode === 'rear') {
            e.stopPropagation();
            const rect = portEl.getBoundingClientRect();
            const containerRect = containerRef.current.getBoundingClientRect();

            // Center of the port, relative to container
            const startX = (rect.left + rect.width / 2) - containerRect.left + containerRef.current.scrollLeft;
            const startY = (rect.top + rect.height / 2) - containerRect.top;

            setDragStart({
                portId: portEl.dataset.portId,
                rackId: parseInt(portEl.dataset.rackId),
                uIndex: parseInt(portEl.dataset.uIndex),
                type: portEl.dataset.portType,
                x: startX,
                y: startY
            });
            setDragCurrent({ x: startX, y: startY });
        }
    };

    const handleMouseMove = (e) => {
        if (dragStart) {
            const pos = getRelativePos(e.clientX, e.clientY);
            setDragCurrent(pos);
        }
    };

    const handleMouseUp = (e) => {
        if (dragStart) {
            const portEl = e.target.closest('[data-port-id]');
            if (portEl) {
                const targetId = portEl.dataset.portId;
                const targetRackId = parseInt(portEl.dataset.rackId);
                const targetUIndex = parseInt(portEl.dataset.uIndex);

                // Prevent self-connection or same-port connection
                if (targetId !== dragStart.portId) {
                    addConnection({
                        from: { rackId: dragStart.rackId, uIndex: dragStart.uIndex, portId: dragStart.portId },
                        to: { rackId: targetRackId, uIndex: targetUIndex, portId: targetId },
                        type: 'DATA' // Default for now
                    });
                }
            }
            setDragStart(null);
            setDragCurrent(null);
        }
    };

    // --- RENDER VISUALS ---
    // Helper to find coords for existing connections
    const getConnectionCoords = (conn) => {
        if (!containerRef.current || viewMode !== 'rear') return null;

        // Find DOM elements
        // This is a bit heavy for render loop, but effective for prototype
        // Selectors must match RackUnit output
        const fromEl = containerRef.current.querySelector(`[data-port-id="${conn.from.portId}"][data-rack-id="${conn.from.rackId}"]`);
        const toEl = containerRef.current.querySelector(`[data-port-id="${conn.to.portId}"][data-rack-id="${conn.to.rackId}"]`);

        if (!fromEl || !toEl) return null;

        const containerRect = containerRef.current.getBoundingClientRect();
        const fromRect = fromEl.getBoundingClientRect();
        const toRect = toEl.getBoundingClientRect();

        return {
            x1: (fromRect.left + fromRect.width / 2) - containerRect.left + containerRef.current.scrollLeft,
            y1: (fromRect.top + fromRect.height / 2) - containerRect.top,
            x2: (toRect.left + toRect.width / 2) - containerRect.left + containerRef.current.scrollLeft,
            y2: (toRect.top + toRect.height / 2) - containerRect.top
        };
    };

    return (
        <div className="flex flex-col h-full bg-[#0c0c0e]">
            {/* Rack View Toolbar */}
            <div className="flex-none h-12 px-4 border-b border-[#27272a] bg-[#09090b] flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400">RACK WORKSPACE</span>

                <div className="flex bg-[#18181b] rounded p-1 border border-[#27272a]">
                    <button
                        onClick={() => setViewMode('front')}
                        className={`px-3 py-1 text-[10px] font-bold rounded transition-all ${viewMode === 'front' ? 'bg-[#27272a] text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        FRONT
                    </button>
                    <button
                        onClick={() => setViewMode('rear')}
                        className={`px-3 py-1 text-[10px] font-bold rounded transition-all ${viewMode === 'rear' ? 'bg-[#27272a] text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        REAR
                    </button>
                </div>
            </div>

            <div
                ref={containerRef}
                className="flex-1 overflow-x-auto p-4 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={() => { setDragStart(null); }}
            >
                <div className="relative flex flex-row gap-4 min-w-max h-full">
                    {/* Cable Layer (SVG Overlay) */}
                    {viewMode === 'rear' && (
                        <svg className="absolute inset-0 w-full h-full pointer-events-none z-50 overflow-visible">
                            <defs>
                                <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                                    <polygon points="0 0, 6 2, 0 4" fill="#60a5fa" />
                                </marker>
                            </defs>

                            {/* Existing Connections */}
                            {connections.map(conn => {
                                const coords = getConnectionCoords(conn);
                                if (!coords) return null;
                                return (
                                    <g key={conn.id} onClick={(e) => { e.stopPropagation(); removeConnection(conn.id); }} className="cursor-pointer pointer-events-auto hover:opacity-50">
                                        <path
                                            d={`M ${coords.x1} ${coords.y1} C ${coords.x1 + 50} ${coords.y1}, ${coords.x2 - 50} ${coords.y2}, ${coords.x2} ${coords.y2}`}
                                            fill="none"
                                            stroke="#3b82f6"
                                            strokeWidth="2"
                                            opacity="0.6"
                                        />
                                    </g>
                                );
                            })}

                            {/* Drag Line */}
                            {dragStart && dragCurrent && (
                                <path
                                    d={`M ${dragStart.x} ${dragStart.y} C ${dragStart.x + 50} ${dragStart.y}, ${dragCurrent.x - 50} ${dragCurrent.y}, ${dragCurrent.x} ${dragCurrent.y}`}
                                    fill="none"
                                    stroke="#ec4899"
                                    strokeWidth="2"
                                    strokeDasharray="4"
                                    markerEnd="url(#arrowhead)"
                                />
                            )}
                        </svg>
                    )}

                    {racks.map(rack => (
                        <SingleRack
                            key={rack.id}
                            rack={rack}
                            viewMode={viewMode}
                            onDelete={deleteRack}
                            onEditDevice={handleEditDevice}
                        />
                    ))}

                    {/* Add Rack Button */}
                    <div className="flex-none w-[100px] flex items-center justify-center">
                        <button
                            onClick={addRack}
                            className="flex flex-col items-center gap-2 text-zinc-600 hover:text-zinc-400 transition-colors"
                        >
                            <div className="w-12 h-12 rounded-full border-2 border-dashed border-zinc-700 flex items-center justify-center hover:border-zinc-500 hover:bg-zinc-900">
                                <Plus size={20} />
                            </div>
                            <span className="text-xs font-semibold">Add Rack</span>
                        </button>
                    </div>
                </div>
            </div>

            {editingDevice && (
                <DeviceSettingsModal
                    device={editingDevice.device}
                    rackId={editingDevice.rackId}
                    uIndex={editingDevice.uIndex}
                    onClose={() => setEditingDevice(null)}
                />
            )}
        </div>
    );
};

export default RackView;
