import React, { useState, useRef } from 'react';
import { X, Upload, Plus, Copy, Trash2 } from 'lucide-react';
import { useRackStack } from '../../context/RackContext';
import { CABLE_TYPES } from '../../data/inventory';

const DeviceSettingsModal = ({ device, rackId, uIndex, onClose }) => {
    const { updateDevice } = useRackStack();
    const [localDevice, setLocalDevice] = useState({ ...device });
    const fileInputRef = useRef(null);
    const [activeSide, setActiveSide] = useState('front'); // 'front' or 'back'

    // --- Metadata Handlers ---
    const handleSave = () => {
        updateDevice(rackId, uIndex, localDevice);
        onClose();
    };

    // --- Image Handlers ---
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLocalDevice(prev => ({
                    ...prev,
                    images: { ...prev.images, [activeSide]: reader.result }
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setLocalDevice(prev => {
            const newImages = { ...prev.images };
            delete newImages[activeSide];
            return { ...prev, images: newImages };
        });
    };

    // --- Port Manager Handlers ---
    const addPort = () => {
        const newPort = { id: `port-${Date.now()}`, type: 'DATA', label: 'New Port' };
        setLocalDevice(prev => ({
            ...prev,
            outputs: [...(prev.outputs || []), newPort]
        }));
    };

    const duplicatePort = (port) => {
        // Logic to increment number in label (e.g., "LAN 1" -> "LAN 2")
        const labelMatch = port.label.match(/(\d+)$/);
        let newLabel = port.label;
        if (labelMatch) {
            const num = parseInt(labelMatch[1]) + 1;
            newLabel = port.label.replace(/\d+$/, num);
        } else {
            newLabel = `${port.label} copy`;
        }

        const newPort = { ...port, id: `port-${Date.now()}`, label: newLabel };
        setLocalDevice(prev => ({
            ...prev,
            outputs: [...(prev.outputs || []), newPort]
        }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-[800px] h-[600px] bg-[#18181b] border border-[#27272a] rounded-lg shadow-2xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[#27272a] bg-[#09090b]">
                    <div>
                        <h2 className="text-sm font-bold text-white">Device Settings</h2>
                        <span className="text-xs text-zinc-500">{localDevice.name}</span>
                    </div>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white"><X size={18} /></button>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Left: General Settings & Image */}
                    <div className="w-1/2 p-6 border-r border-[#27272a] overflow-y-auto">

                        {/* Zone & Category */}
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Zone</label>
                                <input
                                    type="text"
                                    value={localDevice.zone || ''}
                                    onChange={e => setLocalDevice({ ...localDevice, zone: e.target.value })}
                                    className="w-full bg-[#09090b] border border-[#27272a] rounded p-2 text-xs text-white focus:border-blue-600 outline-none"
                                    placeholder="Enter Zone..."
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Category</label>
                                <select
                                    value={localDevice.subcat || ''}
                                    onChange={e => setLocalDevice({ ...localDevice, subcat: e.target.value })}
                                    className="w-full bg-[#09090b] border border-[#27272a] rounded p-2 text-xs text-white focus:border-blue-600 outline-none"
                                >
                                    <option value="Network">Network</option>
                                    <option value="Power">Power</option>
                                    <option value="Source">Source</option>
                                    <option value="Processor">Processor</option>
                                    <option value="Video">Video</option>
                                    <option value="Amp">Amplification</option>
                                    <option value="Accessory">Accessory</option>
                                    <option value="custom">+ New Category...</option>
                                </select>
                            </div>
                        </div>

                        {/* Image Manager */}
                        <div className="mb-6">
                            <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-2">Device Image</label>
                            <div className="flex bg-[#09090b] rounded p-1 mb-2 border border-[#27272a]">
                                <button
                                    onClick={() => setActiveSide('front')}
                                    className={`flex-1 text-xs py-1 rounded ${activeSide === 'front' ? 'bg-[#27272a] text-white' : 'text-zinc-500'}`}
                                >Front</button>
                                <button
                                    onClick={() => setActiveSide('back')}
                                    className={`flex-1 text-xs py-1 rounded ${activeSide === 'back' ? 'bg-[#27272a] text-white' : 'text-zinc-500'}`}
                                >Rear</button>
                            </div>

                            <div className="relative w-full aspect-[4/1] bg-[#09090b] border border-dashed border-[#27272a] rounded flex items-center justify-center group">
                                {localDevice.images?.[activeSide] ? (
                                    <>
                                        <img src={localDevice.images[activeSide]} alt="Device" className="max-h-full object-contain" />
                                        <div className="absolute top-2 right-2 flex gap-1">
                                            <button onClick={removeImage} className="p-1 bg-red-900/80 rounded text-red-200 hover:bg-red-700 shadow-md border border-red-800" title="Remove Image">
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center">
                                        <p className="text-[10px] text-zinc-500 mb-2">No image uploaded</p>
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="px-3 py-1 bg-[#27272a] text-xs text-zinc-300 rounded hover:bg-[#3f3f46] flex items-center gap-1 mx-auto"
                                        >
                                            <Upload size={12} /> Upload
                                        </button>
                                    </div>
                                )}
                                <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                            </div>
                        </div>
                    </div>

                    {/* Right: Port Manager */}
                    <div className="w-1/2 bg-[#0c0c0e] flex flex-col border-l border-[#27272a]">
                        <div className="p-4 border-b border-[#27272a] flex justify-between items-center bg-[#18181b]">
                            <h3 className="text-xs font-bold text-zinc-300">Port Configuration</h3>
                            <button onClick={addPort} className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1">
                                <Plus size={12} /> Add Port
                            </button>
                        </div>

                        <div className="flex-1 p-4 overflow-y-auto space-y-2">
                            {(localDevice.outputs || []).map((port, idx) => (
                                <div
                                    key={port.id || idx}
                                    className="p-2 bg-[#18181b] border border-[#27272a] rounded flex items-center gap-3 group relative hover:border-zinc-600 transition-colors cursor-move"
                                    onMouseDown={(e) => {
                                        if (e.ctrlKey || e.metaKey) {
                                            e.preventDefault();
                                            duplicatePort(port); // Instant duplication for now, drag logic requires more setup
                                        }
                                    }}
                                >
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CABLE_TYPES[port.type]?.color || '#666' }}></div>
                                    <input
                                        type="text"
                                        value={port.label}
                                        onChange={(e) => {
                                            const newOutputs = [...localDevice.outputs];
                                            newOutputs[idx] = { ...port, label: e.target.value };
                                            setLocalDevice({ ...localDevice, outputs: newOutputs });
                                        }}
                                        className="bg-transparent text-xs text-zinc-200 outline-none border-b border-transparent focus:border-blue-500 w-full"
                                    />
                                    <span className="text-[10px] text-zinc-600 items-center hidden group-hover:flex">
                                        Cmd+Click to Clone
                                    </span>
                                </div>
                            ))}
                            {(!localDevice.outputs || localDevice.outputs.length === 0) && (
                                <div className="text-center py-10 text-zinc-600 text-xs">
                                    No ports configured.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-[#27272a] bg-[#09090b] flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 rounded text-xs text-zinc-400 hover:text-white">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-blue-600 rounded text-xs text-white hover:bg-blue-500 font-bold">Save Changes</button>
                </div>
            </div>
        </div>
    );
};

export default DeviceSettingsModal;
