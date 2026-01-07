
import React from 'react';
import PortHotspot from './PortHotspot';
import { CABLE_TYPES } from '../utils/constants';

const RackDevice = ({ device, viewMode, isSelected, onSelect, onPortClick, selectedPort, connections, onHoverInfo, onDragStart, onDragEnd }) => {
    const isBack = viewMode === 'back';
    // Use user image if available for the current view
    const userImage = isBack ? device.images?.back : device.images?.front;
    const style = device.style || {};

    const getPortPosition = (portId, isOutput) => {
        if (device.portMap?.[viewMode]?.[portId]) {
            return device.portMap[viewMode][portId];
        }
        const ports = isOutput ? device.outputs : device.inputs;
        const idx = ports.findIndex(p => p.id === portId);
        const count = ports.length;
        // Distribute unmapped ports along bottom edge
        return { x: ((idx + 1) / (count + 1)) * 100, y: 90 };
    };

    // Always start with a solid background color for fallback
    const computedStyle = {
        width: `${(device.width || 1) * 100}%`,
        height: `${(device.uHeight || 1) * 100}%`,
        color: style.color || '#ccc',
        backgroundColor: style.background || '#262626',
        ...style
    };

    if (userImage) {
        // Properly join BASE_URL and image path, avoiding double slashes
        const baseUrl = import.meta.env.BASE_URL || '/';
        const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        const cleanPath = userImage.startsWith('/') ? userImage : '/' + userImage;
        const fullPath = `${cleanBase}${cleanPath}`;

        computedStyle.background = `url("${fullPath}") center/100% 100% no-repeat`;
        computedStyle.border = 'none';
        computedStyle.borderLeft = 'none';
        computedStyle.borderRight = 'none';
        computedStyle.borderTop = 'none';
        computedStyle.borderBottom = 'none';
    }

    if (isSelected) {
        computedStyle.boxShadow = '0 0 0 2px #3b82f6, 0 0 15px rgba(59, 130, 246, 0.5)';
        computedStyle.zIndex = 50;
    }

    return (
        <div
            draggable={true}
            onDragStart={(e) => {
                e.dataTransfer.setData('deviceId', device.id);
                e.dataTransfer.effectAllowed = 'move';
                if (!isSelected) onSelect(e.metaKey || e.ctrlKey);
                if (navigator.userAgent.includes('Firefox')) {
                    // Firefox hack for drag image if needed
                }
                if (onDragStart) onDragStart({ uHeight: device.uHeight, type: 'move' });
            }}
            onDragEnd={() => {
                if (onDragEnd) onDragEnd();
            }}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(e.metaKey || e.ctrlKey);
            }}
            className={`relative group box-border border-r border-black last:border-r-0 transition-all cursor-grab active:cursor-grabbing ${isSelected ? 'brightness-110' : 'hover:brightness-105'}`}
            style={computedStyle}
        >
            {!userImage && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-1 overflow-hidden">
                    <span className={`font-bold uppercase tracking-wider text-[10px] text-center leading-tight text-white drop-shadow-md`}>
                        {device.name}
                    </span>
                </div>
            )}

            {/* Ports Area */}
            {((isBack) || (!isBack && device.portMap?.front)) && device.category !== 'accessory' && (
                <>
                    {device.inputs.map(p => {
                        const pos = getPortPosition(p.id, false);
                        const mappedToOther = device.portMap?.[isBack ? 'front' : 'back']?.[p.id];
                        if (mappedToOther && !device.portMap?.[viewMode]?.[p.id]) return null;
                        if (!isBack && !device.portMap?.front?.[p.id]) return null;

                        const isConn = connections.some(c => c.toDev === device.id && c.toPort === p.id);
                        const isSel = selectedPort?.deviceId === device.id && selectedPort?.portId === p.id;

                        return (
                            <PortHotspot
                                key={p.id} deviceId={device.id} port={p} isOutput={false}
                                x={pos.x} y={pos.y}
                                onClick={onPortClick} isSelected={isSel} isConnected={isConn}
                                onHover={(info) => onHoverInfo(info ? `${device.name}: ${info}` : null)}
                            />
                        );
                    })}
                    {device.outputs.map(p => {
                        const pos = getPortPosition(p.id, true);
                        const mappedToOther = device.portMap?.[isBack ? 'front' : 'back']?.[p.id];
                        if (mappedToOther && !device.portMap?.[viewMode]?.[p.id]) return null;
                        if (!isBack && !device.portMap?.front?.[p.id]) return null;

                        const isConn = connections.some(c => c.fromDev === device.id && c.fromPort === p.id);
                        const isSel = selectedPort?.deviceId === device.id && selectedPort?.portId === p.id;

                        return (
                            <PortHotspot
                                key={p.id} deviceId={device.id} port={p} isOutput={true}
                                x={pos.x} y={pos.y}
                                onClick={onPortClick} isSelected={isSel} isConnected={isConn}
                                onHover={(info) => onHoverInfo(info ? `${device.name}: ${info}` : null)}
                            />
                        );
                    })}
                </>
            )}
        </div>
    );
};

export default RackDevice;
