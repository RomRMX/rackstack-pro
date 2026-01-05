import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import clsx from 'clsx';

const RackUnit = ({ rackId, uIndex, device, viewMode = 'front', onEdit }) => {
    // uIndex is 0-41 (0 is top U42, 41 is bottom U1)
    const unitNumber = 42 - uIndex;
    const isOccupied = !!device;
    const activeImage = device?.images?.[viewMode];

    const { setNodeRef, isOver } = useDroppable({
        id: `rack-${rackId}-u${uIndex}`,
        data: { rackId, uIndex, type: 'slot' }
    });

    return (
        <div
            ref={setNodeRef}
            className={clsx(
                "relative flex w-full border-b border-[#27272a] transition-colors",
                "h-[30px]",
                isOver && !isOccupied && "bg-blue-500/10",
                "group"
            )}
        >
            {/* Rack Rail / Scale */}
            <div className="w-8 flex-none border-r border-[#27272a] bg-[#09090b] flex items-center justify-center text-[9px] text-zinc-600 font-mono select-none">
                {unitNumber}
            </div>

            {/* Content Area */}
            <div className="flex-1 relative bg-[#090910]">
                {device && (
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit && onEdit();
                        }}
                        className="absolute inset-x-0 top-0 z-10 bg-[#262626] border border-[#404040] flex items-center justify-center overflow-hidden cursor-pointer hover:border-blue-500/50 transition-colors"
                        style={{ height: `${device.uHeight * 100}%` }}
                    >
                        {/* Image or Fallback Text Box */}
                        {activeImage ? (
                            <img src={activeImage} alt={device.name} className="h-full object-contain max-w-full pointer-events-none" />
                        ) : (
                            <div className="flex flex-col items-center justify-center w-full h-full p-2">
                                <span className={clsx(
                                    "text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border",
                                    viewMode === 'rear' ? "text-zinc-500 border-zinc-700 bg-zinc-900/50" : "text-zinc-300 border-zinc-600 bg-zinc-800/50"
                                )}>
                                    {device.name}
                                </span>
                                {viewMode === 'rear' && (
                                    <span className="text-[8px] text-zinc-600 mt-0.5">REAR VIEW</span>
                                )}
                            </div>
                        )}

                        {/* Connection Points (Rear View Only) */}
                        {viewMode === 'rear' && (
                            <div className="absolute inset-0 pointer-events-none">
                                {/* Inputs (Left) */}
                                <div className="absolute left-1 top-0 bottom-0 flex flex-col justify-center gap-1 pointer-events-auto">
                                    {(device.inputs || []).map((port, i) => (
                                        <div
                                            key={port.id}
                                            className="group/port relative w-3 h-3 rounded-full bg-zinc-700 border border-zinc-500 hover:bg-green-500 hover:border-green-400 transition-colors cursor-crosshair z-20"
                                            title={port.label}
                                            data-port-id={port.id}
                                            data-rack-id={rackId}
                                            data-u-index={uIndex}
                                            data-port-type="input"
                                        >
                                            {/* Tooltip */}
                                            <div className="absolute left-full ml-1 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-black text-[9px] text-white rounded opacity-0 group-hover/port:opacity-100 whitespace-nowrap z-30 pointer-events-none">
                                                {port.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Outputs (Right) */}
                                <div className="absolute right-1 top-0 bottom-0 flex flex-col justify-center gap-1 pointer-events-auto">
                                    {(device.outputs || []).map((port, i) => (
                                        <div
                                            key={port.id}
                                            className="group/port relative w-3 h-3 rounded-full bg-zinc-700 border border-zinc-500 hover:bg-blue-500 hover:border-blue-400 transition-colors cursor-crosshair z-20"
                                            title={port.label}
                                            data-port-id={port.id}
                                            data-rack-id={rackId}
                                            data-u-index={uIndex}
                                            data-port-type="output"
                                        >
                                            {/* Tooltip */}
                                            <div className="absolute right-full mr-1 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-black text-[9px] text-white rounded opacity-0 group-hover/port:opacity-100 whitespace-nowrap z-30 pointer-events-none">
                                                {port.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RackUnit;
