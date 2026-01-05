import React, { useState, useLayoutEffect, useRef } from 'react';
import { useRackStack } from '../../context/RackContext';
import { Network, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import clsx from 'clsx';

// Cable Layer for Line View
const LineViewCableLayer = ({ connections, containerRef, zoom }) => {
    const [paths, setPaths] = useState([]);

    useLayoutEffect(() => {
        if (!containerRef.current) return;

        // Debounce or just run? For now just run. 
        // We need to wait for layout to settle if data just changed, but useLayoutEffect should handle this render cycle.

        const updatePaths = () => {
            const newPaths = connections.map(conn => {
                const fromEl = containerRef.current.querySelector(
                    `[data-rack-id="${conn.from.rackId}"][data-u-index="${conn.from.uIndex}"][data-port-id="${conn.from.portId}"]`
                );
                const toEl = containerRef.current.querySelector(
                    `[data-rack-id="${conn.to.rackId}"][data-u-index="${conn.to.uIndex}"][data-port-id="${conn.to.portId}"]`
                );

                if (!fromEl || !toEl) return null;

                const containerRect = containerRef.current.getBoundingClientRect();
                const fromRect = fromEl.getBoundingClientRect();
                const toRect = toEl.getBoundingClientRect();

                const makeRelative = (rect) => ({
                    x: (rect.left - containerRect.left + rect.width / 2) / zoom,
                    y: (rect.top - containerRect.top + rect.height / 2) / zoom
                });

                const start = makeRelative(fromRect);
                const end = makeRelative(toRect);

                // Determine directionality based on port type
                const isFromOutput = fromEl.getAttribute('data-port-type') === 'output';
                const isToInput = toEl.getAttribute('data-port-type') === 'input';

                const tension = 60;
                const cp1x = isFromOutput ? start.x + tension : start.x - tension;
                const cp2x = isToInput ? end.x - tension : end.x + tension;

                return (
                    <path
                        key={conn.id}
                        d={`M ${start.x} ${start.y} C ${cp1x} ${start.y}, ${cp2x} ${end.y}, ${end.x} ${end.y}`}
                        stroke="#60a5fa"
                        strokeWidth="2"
                        fill="none"
                        className="opacity-60 transition-all duration-300"
                    />
                );
            });
            setPaths(newPaths);
        };

        // Initial calc
        updatePaths();

        // Optional: Resize observer could go here

    }, [connections, zoom, containerRef]);

    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-30 overflow-visible">
            <defs>
                <marker id="arrowhead-line" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#60a5fa" />
                </marker>
            </defs>
            {paths}
        </svg>
    );
};

const LineViewDevice = ({ device, rackId, uIndex }) => {
    return (
        <div className="bg-[#18181b] border border-[#27272a] rounded p-2 mb-2 w-full flex items-center justify-between shadow-sm cursor-grab active:cursor-grabbing hover:border-zinc-500 transition-colors pointer-events-auto relative">
            <div className="flex-1">
                <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">{device.subcat}</div>
                <div className="text-xs font-medium text-white">{device.name}</div>
            </div>

            {/* Ports (Simplified Visualization) */}
            <div className="flex gap-1">
                {/* Input Ports */}
                <div className="flex flex-col gap-1 items-end mr-2 border-r border-[#27272a] pr-2">
                    {(device.inputs || []).map((port, i) => (
                        <div
                            key={i}
                            className="w-2 h-2 rounded-full bg-zinc-700 hover:bg-zinc-500"
                            title={port.label}
                            data-port-id={port.id}
                            data-rack-id={rackId}
                            data-u-index={uIndex}
                            data-port-type="input"
                        ></div>
                    ))}
                </div>
                {/* Output Ports */}
                <div className="flex flex-col gap-1">
                    {(device.outputs || []).map((port, i) => (
                        <div
                            key={i}
                            className="w-2 h-2 rounded-full bg-blue-600 hover:bg-blue-400"
                            title={port.label}
                            data-port-id={port.id}
                            data-rack-id={rackId}
                            data-u-index={uIndex}
                            data-port-type="output"
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const LineView = () => {
    const { racks, connections } = useRackStack();
    const [zoom, setZoom] = useState(1);
    const containerRef = useRef(null);

    return (
        <div className="flex flex-col h-full bg-[#0c0c0e]">
            {/* Top Bar (Consistent with RackView) */}
            <div className="flex-none h-12 px-4 border-b border-[#27272a] bg-[#09090b] flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400 flex items-center gap-2">
                    <Network size={16} />
                    LINE SCHEMATIC
                </span>

                <div className="flex bg-[#18181b] rounded p-1 border border-[#27272a]">
                    <button onClick={() => setZoom(Math.max(0.5, zoom - 0.1))} className="p-1 text-zinc-500 hover:text-zinc-300"><ZoomOut size={14} /></button>
                    <span className="px-2 text-[10px] font-mono text-zinc-400 flex items-center">{Math.round(zoom * 100)}%</span>
                    <button onClick={() => setZoom(Math.min(2, zoom + 0.1))} className="p-1 text-zinc-500 hover:text-zinc-300"><ZoomIn size={14} /></button>
                </div>
            </div>

            {/* Schematic Canvas */}
            <div className="flex-1 overflow-auto bg-[url('https://grainy-gradients.vercel.app/noise.svg')] relative">
                <div
                    ref={containerRef}
                    className="min-h-full p-8 flex gap-8 transition-transform origin-top-left relative"
                    style={{ transform: `scale(${zoom})`, width: `${Math.max(racks.length * 400, 100)}px`, minWidth: '100%' }}
                >
                    <LineViewCableLayer connections={connections} containerRef={containerRef} zoom={zoom} />

                    {racks.map(rack => (
                        <div key={rack.id} className="flex-none w-[320px] bg-[#09090b]/50 border border-[#27272a] rounded h-[80vh] flex flex-col pointer-events-auto backdrop-blur-sm relative z-10">
                            {/* Swimlane Header */}
                            <div className="p-3 border-b border-[#27272a] bg-[#18181b] text-center sticky top-0 z-20">
                                <h3 className="text-xs font-bold text-zinc-200">{rack.name}</h3>
                                <span className="text-[10px] text-zinc-500">{rack.units.filter(u => u).length} Devices</span>
                            </div>

                            {/* Device Stack (Collision Prevention: Just simple stack for now) */}
                            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                                {rack.units.slice().reverse().map((device, idx) => {
                                    if (!device) return null;
                                    // Calculate actual U-index (41 down to 0)
                                    const uIndex = rack.units.length - 1 - idx;
                                    return (
                                        <LineViewDevice
                                            key={`${rack.id}-${uIndex}`}
                                            device={device}
                                            rackId={rack.id}
                                            uIndex={uIndex}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LineView;
