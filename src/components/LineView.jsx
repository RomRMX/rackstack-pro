import React, { useState, useRef, useEffect } from 'react';
import { Network, Power, Monitor, Cpu, Speaker, Settings, X, Plus } from 'lucide-react';
import { generateId } from '../utils/common';

const HEADER_HEIGHT = 32;
const PORT_HEIGHT = 24;
const LANE_HEIGHT = 300;
const RACK_HEADER_WIDTH = 200;

export default function LineView({ devices, setDevices, connections, setConnections, racks, library, onLink, selectedPort, setEditingDevice }) {
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [draggingDevice, setDraggingDevice] = useState(null);
    const [hoveredConnection, setHoveredConnection] = useState(null);

    const containerRef = useRef(null);
    const dragStartRef = useRef({ x: 0, y: 0 });

    // Initialize positions relative to Rack Lanes if missing or if rack changed
    useEffect(() => {
        let changed = false;
        const newDevices = devices.map((d, i) => {
            const rackIndex = racks.findIndex(r => r.id === d.rackId);
            const rackY = rackIndex >= 0 ? rackIndex * LANE_HEIGHT : -1;

            if (!d.schematicPosition || (rackIndex >= 0 && Math.abs(d.schematicPosition.y - (rackY + 50)) > LANE_HEIGHT)) {
                if (rackIndex >= 0) {
                    return {
                        ...d,
                        schematicPosition: {
                            x: d.schematicPosition?.x || (100 + (i % 5) * 220),
                            y: rackIndex * LANE_HEIGHT + 50
                        }
                    };
                }
            }
            return d;
        });

        if (JSON.stringify(newDevices) !== JSON.stringify(devices)) {
            setDevices(newDevices);
        }
    }, [devices.length, racks]);


    // --- EVENT HANDLERS ---
    const handleMouseDown = (e) => {
        if (e.button === 1 || e.code === 'Space' || e.altKey || (e.button === 0 && e.shiftKey)) {
            e.preventDefault();
            setIsPanning(true);
            dragStartRef.current = { x: e.clientX, y: e.clientY };
        }
    };

    const handleMouseMove = (e) => {
        if (isPanning) {
            const dx = e.clientX - dragStartRef.current.x;
            const dy = e.clientY - dragStartRef.current.y;
            setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
            dragStartRef.current = { x: e.clientX, y: e.clientY };
        } else if (draggingDevice) {
            const scale = zoom;
            const dx = (e.clientX - dragStartRef.current.x) / scale;
            const dy = (e.clientY - dragStartRef.current.y) / scale;

            setDevices(prev => prev.map(d => {
                if (d.id === draggingDevice.id) {
                    return {
                        ...d,
                        schematicPosition: {
                            x: (d.schematicPosition?.x || 0) + dx,
                            y: (d.schematicPosition?.y || 0) + dy
                        }
                    };
                }
                return d;
            }));
            dragStartRef.current = { x: e.clientX, y: e.clientY };
        }
    };

    const handleMouseUp = (e) => {
        if (draggingDevice) {
            const dev = devices.find(d => d.id === draggingDevice.id);
            if (dev && dev.schematicPosition) {
                const laneIndex = Math.floor(dev.schematicPosition.y / LANE_HEIGHT);
                if (laneIndex >= 0 && laneIndex < racks.length) {
                    const newRackId = racks[laneIndex].id;
                    if (newRackId !== dev.rackId) {
                        setDevices(prev => prev.map(d => d.id === dev.id ? { ...d, rackId: newRackId } : d));
                    }
                }
            }
        }
        setIsPanning(false);
        setDraggingDevice(null);
    };

    const handleWheel = (e) => {
        if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            const delta = e.deltaY * -0.001;
            setZoom(prev => Math.min(Math.max(0.1, prev + delta), 4));
        }
    };

    // --- DROP NEW DEVICE ---
    const onDrop = (e) => {
        e.preventDefault();
        const templateIdx = e.dataTransfer.getData('templateIdx');
        if (templateIdx && library) {
            const t = library[templateIdx];
            const rect = containerRef.current.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const worldX = (mouseX - pan.x) / zoom;
            const worldY = (mouseY - pan.y) / zoom;

            const laneIndex = Math.floor(worldY / LANE_HEIGHT);
            if (laneIndex >= 0 && laneIndex < racks.length) {
                const targetRack = racks[laneIndex];
                const newDev = {
                    ...t,
                    id: generateId(),
                    uPosition: 1,
                    rackId: targetRack.id,
                    images: t.images || {},
                    portMap: t.portMap || {},
                    schematicPosition: { x: worldX, y: worldY }
                };
                setDevices(prev => [...prev, newDev]);
            } else {
                alert("Please drop onto a Rack Lane.");
            }
        }
    };

    const onDragOver = (e) => e.preventDefault();

    // RENDER HELPERS
    const getIcon = (cat) => {
        if (cat === 'Network') return <Network size={14} />;
        if (cat === 'Power') return <Power size={14} />;
        if (cat === 'Source') return <Monitor size={14} />;
        if (cat === 'Processor') return <Cpu size={14} />;
        if (cat === 'Amp') return <Speaker size={14} />;
        return <Settings size={14} />;
    };

    const getConnectionColor = (type) => {
        // CABLE_TYPES should ideally be passed in or imported, duplicating here for speed as it's small or matching constant
        const map = { 'HDMI': '#ef4444', 'Data': '#3b82f6', 'Power': '#71717a', 'Speaker': '#10b981', 'Audio': '#a855f7', 'COAX': '#78350f' };
        return map[type] || '#555';
    };

    const getPortCoords = (deviceId, portId, isOutput) => {
        const dev = devices.find(d => d.id === deviceId);
        if (!dev || !dev.schematicPosition) return null;

        const { x, y } = dev.schematicPosition;
        const ports = isOutput ? dev.outputs : dev.inputs;
        const idx = ports.findIndex(p => p.id === portId);
        if (idx === -1) return null;

        const px = isOutput ? x + 200 : x;
        const py = y + HEADER_HEIGHT + (idx * PORT_HEIGHT) + (PORT_HEIGHT / 2);
        return { x: px, y: py };
    };

    const deleteConnection = (id) => {
        setConnections(prev => prev.filter(c => c.id !== id));
    };

    return (
        <div ref={containerRef} className="w-full h-full bg-[#111] overflow-hidden relative"
            onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}
            onWheel={handleWheel} onDrop={onDrop} onDragOver={onDragOver}>

            {/* Infinite Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
                    backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
                    backgroundPosition: `${pan.x}px ${pan.y}px`
                }} />

            {/* CONTENT */}
            <div className="absolute inset-0 origin-top-left" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>

                {/* RACK SWIMLANES */}
                {racks.map((r, i) => (
                    <div key={r.id} className="absolute left-[-5000px] right-[-5000px] border-b border-[#333] border-dashed flex items-start"
                        style={{ top: i * LANE_HEIGHT, height: LANE_HEIGHT }}>
                        <div className="absolute left-[5000px] top-2 bg-[#1a1a1a] px-4 py-1 rounded-r border border-[#333] text-gray-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                            <Server size={14} /> {r.name}
                        </div>
                    </div>
                ))}

                {/* CONNECTIONS (Render First) */}
                <svg className="absolute top-0 left-0 overflow-visible w-full h-full pointer-events-none">
                    {connections.map(c => {
                        const start = getPortCoords(c.fromDev, c.fromPort, true);
                        const end = getPortCoords(c.toDev, c.toPort, false);
                        if (!start || !end) return null;
                        const color = getConnectionColor(c.type);
                        const dist = Math.abs(end.x - start.x);
                        const cp1x = start.x + Math.max(dist * 0.5, 50);
                        const cp2x = end.x - Math.max(dist * 0.5, 50);
                        const d = `M ${start.x} ${start.y} C ${cp1x} ${start.y} ${cp2x} ${end.y} ${end.x} ${end.y}`;

                        const isHovered = hoveredConnection === c.id;

                        return (
                            <g key={c.id}
                                onMouseEnter={() => setHoveredConnection(c.id)}
                                onMouseLeave={() => setHoveredConnection(null)}
                                onDoubleClick={(e) => { e.stopPropagation(); deleteConnection(c.id); }} // Delete on double click
                                style={{ pointerEvents: 'stroke' }}
                            >
                                {/* Invisible wide stroke for easier selection */}
                                <path d={d} stroke="transparent" strokeWidth="15" fill="none" className="cursor-pointer" />
                                {/* Visible stroke */}
                                <path d={d} stroke={isHovered ? '#fff' : color} strokeWidth={isHovered ? "5" : "3"} fill="none" opacity={isHovered ? "1" : "0.6"} className="transition-colors" />
                            </g>
                        );
                    })}
                </svg>

                {/* DEVICES */}
                {devices.map(dev => {
                    if (!dev.schematicPosition) return null;
                    return (
                        <div key={dev.id}
                            className="absolute bg-[#1a1a1a] border border-[#333] rounded shadow-lg flex flex-col w-[200px]"
                            style={{ left: dev.schematicPosition.x, top: dev.schematicPosition.y }}>

                            <div className="h-8 bg-[#222] border-b border-[#333] flex items-center px-2 gap-2 cursor-grab active:cursor-grabbing hover:bg-[#2a2a2a] transition-colors"
                                onMouseDown={(e) => {
                                    e.stopPropagation();
                                    // If distinct click vs drag needed, can check movement. For now, dragging is fine.
                                    setDraggingDevice({ id: dev.id });
                                    dragStartRef.current = { x: e.clientX, y: e.clientY };
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (!isPanning) setEditingDevice(dev); // Click to Edit
                                }}
                            >
                                <div className="text-gray-500">{getIcon(dev.subcat)}</div>
                                <span className="text-xs font-bold text-gray-200 truncate select-none flex-1">{dev.name}</span>
                                <Settings size={12} className="text-gray-600 hover:text-white cursor-pointer" />
                            </div>

                            <div className="flex">
                                {/* Inputs */}
                                <div className="w-1/2 py-1">
                                    {(dev.inputs || []).map(p => (
                                        <div key={p.id} className="h-[24px] flex items-center px-1 gap-1 hover:bg-[#252525] group cursor-pointer"
                                            onClick={(e) => { e.stopPropagation(); onLink(dev.id, p.id, false, p.type); }}>
                                            <div className={`w-2 h-2 rounded-full border ${selectedPort?.portId === p.id && selectedPort?.deviceId === dev.id ? 'bg-white blink' : 'bg-[#111] border-gray-600 group-hover:bg-green-500'}`} />
                                            <span className="text-[9px] text-gray-500 font-mono truncate">{p.label}</span>
                                        </div>
                                    ))}
                                </div>
                                {/* Outputs */}
                                <div className="w-1/2 py-1 items-end flex flex-col">
                                    {(dev.outputs || []).map(p => (
                                        <div key={p.id} className="h-[24px] flex items-center px-1 gap-1 hover:bg-[#252525] group justify-end cursor-pointer w-full"
                                            onClick={(e) => { e.stopPropagation(); onLink(dev.id, p.id, true, p.type); }}>
                                            <span className="text-[9px] text-gray-500 font-mono truncate">{p.label}</span>
                                            <div className={`w-2 h-2 rounded-full border ${selectedPort?.portId === p.id && selectedPort?.deviceId === dev.id ? 'bg-white blink' : 'bg-[#111] border-gray-600 group-hover:bg-blue-500'}`} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}

            </div>

            {/* Zoom Controls */}
            <div className="absolute top-4 right-4 bg-[#222] border border-[#333] rounded p-2 flex gap-2">
                <button onClick={() => setZoom(z => Math.max(0.1, z - 0.1))} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white bg-[#1a1a1a] rounded">-</button>
                <div className="flex items-center justify-center w-12 text-xs font-mono text-gray-500">{Math.round(zoom * 100)}%</div>
                <button onClick={() => setZoom(z => Math.min(4, z + 0.1))} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white bg-[#1a1a1a] rounded">+</button>
            </div>

            {/* Legend / Tip for deleting */}
            <div className="absolute bottom-4 left-4 bg-[#222] text-xs text-gray-400 px-2 py-1 rounded border border-[#333] opacity-50 hover:opacity-100 transition-opacity pointer-events-none">
                Double-click a cable to delete it.
            </div>
        </div>
    );
}

// Add Server icon import if not present
function Server({ size }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2" /><rect width="20" height="8" x="2" y="14" rx="2" ry="2" /><line x1="6" x2="6.01" y1="6" y2="6" /><line x1="6" x2="6.01" y1="18" y2="18" /></svg>
}
