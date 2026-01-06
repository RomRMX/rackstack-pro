
import React from 'react';
import { CABLE_TYPES } from '../utils/constants';

const PortHotspot = ({ deviceId, port, isOutput, x, y, onClick, isSelected, isConnected, onHover }) => {
    const typeColor = CABLE_TYPES[port.type]?.color || '#9ca3af';

    // Simple heuristic to extract a number from the label (e.g., "HDMI 1" -> "1")
    const portNumber = port.label.replace(/[^0-9]/g, '');

    return (
        <div
            id={`port-${deviceId}-${port.id}`}
            className={`absolute w-4 h-4 -ml-2 -mt-2 rounded-[1px] cursor-pointer transition-transform hover:scale-150 z-50 flex items-center justify-center
                ${isSelected ? 'animate-pulse scale-125 ring-2 ring-white' : ''}
            `}
            style={{
                left: `${x}%`, top: `${y}%`,
                backgroundColor: isConnected ? typeColor : 'transparent',
                filter: isOutput ? 'brightness(0.7)' : 'brightness(1.1)',
                border: `1.5px solid ${typeColor}`,
                boxShadow: isSelected ? `0 0 8px ${typeColor}` : 'none'
            }}
            onMouseDown={(e) => e.stopPropagation()} // CRITICAL FIX: Prevent drag start on parent
            onClick={(e) => {
                e.stopPropagation();
                onClick(deviceId, port.id, isOutput, port.type);
            }}
            onMouseEnter={() => onHover(`${port.label} (${port.type})`)}
            onMouseLeave={() => onHover(null)}
        >
            <span className="text-[8px] font-bold text-white drop-shadow-md select-none pointer-events-none scale-50">{portNumber}</span>
        </div>
    );
};

export default PortHotspot;
