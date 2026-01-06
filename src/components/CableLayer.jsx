
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CABLE_TYPES } from '../utils/constants';

const CableLayer = ({ connections, viewMode, onDeleteConn, racks, rackWidth, rackHeight }) => {
    if (viewMode === 'front') return null;
    const [paths, setPaths] = useState([]);
    const containerRef = useRef(null);

    const getPos = (devId, portId) => {
        const el = document.getElementById(`port-${devId}-${portId}`);
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    };

    const calc = useCallback(() => {
        if (!containerRef.current) return;
        const contRect = containerRef.current.getBoundingClientRect();

        const newPaths = connections.map(conn => {
            const p1 = getPos(conn.fromDev, conn.fromPort);
            const p2 = getPos(conn.toDev, conn.toPort);

            if (!p1 || !p2) return null;

            const x1 = p1.x - contRect.left;
            const y1 = p1.y - contRect.top;
            const x2 = p2.x - contRect.left;
            const y2 = p2.y - contRect.top;

            const dist = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            const slack = Math.min(dist * 0.5, 200);

            // Color from type
            const typeColor = CABLE_TYPES[conn.type]?.color || '#fff';

            // Realistic Catenary/Bezier Sway
            // Control points pull down based on gravity (slack)
            return {
                id: conn.id,
                d: `M ${x1} ${y1} C ${x1} ${y1 + slack}, ${x2} ${y2 + slack}, ${x2} ${y2}`,
                color: typeColor,
                width: CABLE_TYPES[conn.type]?.width || 3,
                cx: (x1 + x2) / 2, cy: (y1 + y2) / 2 + (slack * 0.6) // Midpoint for delete button, slightly lower
            };
        }).filter(Boolean);
        setPaths(newPaths);
    }, [connections]);

    useEffect(() => {
        calc();
        const interval = setInterval(calc, 50);
        window.addEventListener('resize', calc);
        window.addEventListener('scroll', calc, true);
        return () => { clearInterval(interval); window.removeEventListener('resize', calc); window.removeEventListener('scroll', calc, true); };
    }, [calc]);

    return (
        <svg ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none z-50 overflow-visible drop-shadow-md">
            {paths.map(p => (
                <g key={p.id} className="pointer-events-auto group">
                    {/* Invisible thicker path for easier hovering */}
                    <path d={p.d} stroke="transparent" strokeWidth="20" fill="none" />

                    {/* Visible Cable */}
                    <path d={p.d} stroke={p.color} strokeWidth={p.width} fill="none" strokeLinecap="round" className="opacity-80 group-hover:opacity-100 group-hover:stroke-white transition-colors" />

                    {/* Delete Button on Hover - Improved Size and Position */}
                    <g
                        className="opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-red-500"
                        onClick={(e) => { e.stopPropagation(); onDeleteConn(p.id); }}
                    >
                        <title>Click to Delete Connection</title>
                        {/* Larger background circle for easy clicking */}
                        <circle cx="0" cy="0" r="12" fill="#ef4444" stroke="white" strokeWidth="2">
                            <animateMotion dur="0s" fill="freeze" keyPoints="0.5" keyTimes="0" calcMode="linear"><mpath href={`#path-${p.id}`} /></animateMotion>
                        </circle>
                        {/* X icon approximated with path to follow motion */}
                        <g style={{ pointerEvents: 'none' }}>
                            <path d="M-4 -4 L4 4 M-4 4 L4 -4" stroke="white" strokeWidth="2.5">
                                <animateMotion dur="0s" fill="freeze" keyPoints="0.5" keyTimes="0" calcMode="linear"><mpath href={`#path-${p.id}`} /></animateMotion>
                            </path>
                        </g>
                    </g>

                    {/* Hidden path for motion ref */}
                    <path id={`path-${p.id}`} d={p.d} fill="none" stroke="none" />
                </g>
            ))}
        </svg>
    );
};

export default CableLayer;
