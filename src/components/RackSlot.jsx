
import React from 'react';
import RackDevice from './RackDevice';
import { RACK_UNIT_COUNT, RACK_UNIT_HEIGHT } from '../utils/constants';

const RackSlot = ({ uNumber, devicesInSlot, onDrop, viewMode, selectedDeviceIds, onSelectDevice, onPortClick, selectedPort, connections, onHoverInfo, draggingItem, onDragStart, onDragEnd }) => {
    // Calculate if slot is full
    const occupiedWidth = devicesInSlot.reduce((acc, d) => acc + (d.width || 1), 0);
    const isFull = occupiedWidth >= 0.99; // Tolerance

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isFull && occupiedWidth >= 1) return; // Full slot

        // Highlight Calculation
        // Highlight Calculation
        const height = draggingItem?.uHeight || 1;
        const slotsToHighlight = [];
        let current = e.currentTarget;
        for (let i = 0; i < height; i++) {
            if (current) {
                slotsToHighlight.push(current);
                // Flex-col-reverse: DOM order is 1 (bottom) -> 42 (top). 
                // Next sibling is physically ABOVE the current slot (next higher unit).
                current = current.nextElementSibling;
            }
        }

        // Apply visual class
        slotsToHighlight.forEach(el => el.classList.add('bg-blue-600/30'));
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Remove from this and potential neighbors (safe cleanup)
        // A wider cleanup might be needed if mouse moves fast
        const parent = e.currentTarget.parentElement;
        if (parent) {
            Array.from(parent.children).forEach(child => child.classList.remove('bg-blue-600/30'));
        }
    };

    const handleDropLocal = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const parent = e.currentTarget.parentElement;
        if (parent) {
            Array.from(parent.children).forEach(child => child.classList.remove('bg-blue-600/30'));
        }
        onDrop(e, uNumber);
    };

    return (
        <div
            className={`relative flex items-end border-b border-gray-800 group/slot ${viewMode === 'back' ? 'flex-row-reverse' : 'flex-row'}`}
            style={{
                height: `${RACK_UNIT_HEIGHT}px`,
                zIndex: RACK_UNIT_COUNT - uNumber
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDropLocal}
        >
            <div className={`flex-1 h-full flex items-end relative ${viewMode === 'back' ? 'flex-row-reverse' : 'flex-row'}`}>
                {devicesInSlot.map((device) => (
                    <RackDevice
                        key={device.id}
                        device={device}
                        viewMode={viewMode}
                        isSelected={selectedDeviceIds.includes(device.id)}
                        onSelect={(multi) => onSelectDevice(device.id, multi)}
                        onPortClick={onPortClick}
                        selectedPort={selectedPort}
                        connections={connections}
                        onHoverInfo={onHoverInfo}
                    />
                ))}
                {!isFull && <div className="flex-1 h-full bg-transparent hover:bg-white/5 transition-colors" title="Empty Space" />}
            </div>
        </div>
    );
};

export default RackSlot;
