
import React, { useState, useRef, useEffect } from 'react';
import { Settings, Plus, Trash2, Loader, Activity, Upload, Image as ImageIcon } from 'lucide-react';
import { CABLE_TYPES } from '../utils/constants';
import { callGeminiVision } from '../utils/common';

const DeviceEditorModal = ({ device, isOpen, onClose, onSave }) => {
    const [data, setData] = useState(null);
    const [activeTab, setActiveTab] = useState('front');
    const [loadingScan, setLoadingScan] = useState(false);
    const imageRef = useRef(null);

    useEffect(() => { if (device) setData(JSON.parse(JSON.stringify(device))); }, [device]);

    if (!isOpen || !data) return null;

    const containerWidth = 600;
    const deviceWidthRatio = data.width || 1;
    const rackUnits = data.uHeight || 1;
    const aspectRatio = (19 * deviceWidthRatio) / (1.75 * rackUnits);
    const containerHeight = Math.min(600, containerWidth / aspectRatio);

    const handleImageUpload = (e, side) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setData(prev => ({ ...prev, images: { ...prev.images, [side]: ev.target.result } }));
            reader.readAsDataURL(file);
        }
    };



    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!imageRef.current) return;

        const portId = e.dataTransfer.getData('portId');

        const rect = imageRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        const clampedX = Math.max(0, Math.min(100, x));
        const clampedY = Math.max(0, Math.min(100, y));

        setData(prev => ({
            ...prev,
            portMap: {
                ...prev.portMap,
                [activeTab]: {
                    ...prev.portMap?.[activeTab],
                    [portId]: { x: clampedX, y: clampedY }
                }
            }
        }));
    };

    const getNextLabel = (list, type) => {
        const existing = list.filter(p => p.type === type);
        const numbers = existing.map(p => {
            const match = p.label.match(/(\d+)$/);
            return match ? parseInt(match[1]) : 0;
        });
        const max = Math.max(0, ...numbers);
        return `${type} ${max + 1}`;
    };

    const handleAddNewPort = (isOutput) => {
        const prefix = isOutput ? 'custom-out' : 'custom-in';
        const newId = `${prefix}-${Date.now()}`;
        const list = isOutput ? data.outputs : data.inputs;
        const type = 'HDMI';
        const label = getNextLabel(list, type);
        const newPort = { id: newId, label, type };

        setData(prev => ({
            ...prev,
            [isOutput ? 'outputs' : 'inputs']: [...prev[isOutput ? 'outputs' : 'inputs'], newPort]
        }));
    };

    const handleRemovePort = (isOutput, idx) => {
        const listKey = isOutput ? 'outputs' : 'inputs';
        const portId = data[listKey][idx].id;

        const newList = data[listKey].filter((_, i) => i !== idx);

        const newPortMap = { ...data.portMap };
        ['front', 'back'].forEach(view => {
            if (newPortMap[view] && newPortMap[view][portId]) {
                const newViewMap = { ...newPortMap[view] };
                delete newViewMap[portId];
                newPortMap[view] = newViewMap;
            }
        });

        setData(prev => ({ ...prev, [listKey]: newList, portMap: newPortMap }));
    };

    // Remove port mapping ONLY (keeping port in list) via right click
    const handleUnmapPort = (e, portId) => {
        e.preventDefault(); // Prevent context menu
        const newPortMap = { ...data.portMap };
        if (newPortMap[activeTab]) {
            const newViewMap = { ...newPortMap[activeTab] };
            delete newViewMap[portId];
            newPortMap[activeTab] = newViewMap;
            setData(prev => ({ ...prev, portMap: newPortMap }));
        }
    };

    const handlePortLabelChange = (isOutput, idx, newVal) => {
        const list = isOutput ? 'outputs' : 'inputs';
        const newList = [...data[list]];
        newList[idx].label = newVal;
        setData(prev => ({ ...prev, [list]: newList }));
    };

    const handlePortTypeChange = (isOutput, idx, newVal) => {
        const listName = isOutput ? 'outputs' : 'inputs';
        const newList = [...data[listName]];

        // Update label only if type changed
        if (newList[idx].type !== newVal) {
            newList[idx].label = getNextLabel(data[listName], newVal);
            newList[idx].type = newVal;
        }

        setData(prev => ({ ...prev, [listName]: newList }));
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[3000] backdrop-blur-md">
            <div className="bg-gray-900 w-[1000px] h-[85vh] flex flex-col rounded-xl border border-gray-700 shadow-2xl overflow-hidden">
                <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-950 shrink-0">
                    <h2 className="text-sm font-bold text-white flex items-center gap-2"><Settings size={16} className="text-blue-500" /> Editing: {data.name}</h2>
                    <div className="flex gap-2">
                        <button onClick={onClose} className="px-3 py-1 text-xs text-gray-400 hover:text-white">Cancel</button>
                        <button onClick={() => { onSave(data); onClose(); }} className="px-4 py-1 text-xs bg-blue-600 rounded text-white font-bold">Save</button>
                    </div>
                </div>

                <div className="flex bg-gray-800 border-b border-gray-700 shrink-0">
                    {['front', 'back'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2 text-xs font-bold uppercase ${activeTab === tab ? 'bg-gray-700 text-white border-b-2 border-blue-500' : 'text-gray-500'}`}>{tab} Panel</button>
                    ))}
                </div>

                <div className="flex-1 flex overflow-hidden">
                    <div className="flex-1 bg-[#111] relative flex flex-col items-center justify-center p-8 overflow-auto">
                        <div className="mb-4 text-xs text-gray-500">
                            Proportional Rack View ({data.width * 100}% Width, {data.uHeight}U Height)
                        </div>

                        <div
                            ref={imageRef}
                            className="relative shadow-2xl border border-gray-700 bg-gray-800 transition-all"
                            style={{
                                width: `${containerWidth}px`,
                                height: `${containerHeight}px`
                            }}
                            onDragOver={e => e.preventDefault()}
                            onDrop={handleDrop}
                        >
                            {data.images?.[activeTab] ? (
                                <img src={data.images[activeTab]} className="w-full h-full block select-none pointer-events-none" alt="device panel" style={{ objectFit: 'stretch' }} />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-2">
                                    <ImageIcon size={32} />
                                    <span className="text-xs">No Image</span>
                                </div>
                            )}

                            {/* Render Mapped Ports */}
                            {[...data.inputs, ...data.outputs].map(port => {
                                const pos = data.portMap?.[activeTab]?.[port.id];
                                if (!pos) return null;
                                const typeColor = CABLE_TYPES[port.type]?.color || '#9ca3af';

                                return (
                                    <div
                                        key={port.id}
                                        draggable
                                        onDragStart={(e) => {
                                            e.dataTransfer.setData('portId', port.id);
                                            e.dataTransfer.setData('type', 'move');
                                        }}
                                        onContextMenu={(e) => handleUnmapPort(e, port.id)}
                                        className="absolute w-4 h-4 -ml-2 -mt-2 rounded-[1px] shadow-sm text-[8px] flex items-center justify-center font-bold z-10 cursor-move hover:scale-125 transition-transform border border-white/30"
                                        style={{
                                            left: `${pos.x}%`,
                                            top: `${pos.y}%`,
                                            backgroundColor: typeColor,
                                            color: '#000'
                                        }}
                                        title={`${port.label} (Right-click to unmap)`}
                                    >
                                        {port.label.replace(/[^0-9]/g, '')}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-8 flex gap-3 p-3 bg-gray-900/80 rounded-lg border border-gray-800">

                            <label className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded text-xs font-bold flex items-center gap-2 cursor-pointer">
                                <Upload size={14} /> Upload
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, activeTab)} />
                            </label>
                        </div>
                    </div>

                    <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col z-10 h-full">
                        {/* FIXED HEIGHT SETTINGS PANEL */}
                        <div className="p-4 bg-gray-900 border-b border-gray-800 flex flex-col gap-3 shrink-0">
                            <h3 className="text-xs font-bold text-gray-400 uppercase">Device Settings</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="col-span-2">
                                    <label className="block text-[10px] text-gray-500 uppercase mb-1">Name</label>
                                    <input className="w-full bg-[#111] border border-gray-700 rounded p-1 text-xs text-gray-300 focus:border-blue-500 outline-none" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-500 uppercase mb-1">Height (U)</label>
                                    <input type="number" min="1" max="42" className="w-full bg-[#111] border border-gray-700 rounded p-1 text-xs text-gray-300 focus:border-blue-500 outline-none" value={data.uHeight} onChange={(e) => setData({ ...data, uHeight: Math.max(1, parseInt(e.target.value) || 1) })} />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-500 uppercase mb-1">Width</label>
                                    <select className="w-full bg-[#111] border border-gray-700 rounded p-1 text-xs text-gray-300 focus:border-blue-500 outline-none" value={data.width || 1} onChange={(e) => setData({ ...data, width: parseFloat(e.target.value) })}>
                                        <option value={1}>Full (19")</option>
                                        <option value={0.5}>1/2 Width</option>
                                        <option value={0.33}>1/3 Width</option>
                                        <option value={0.25}>1/4 Width</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-500 uppercase mb-1">IP Address</label>
                                    <input className="w-full bg-[#111] border border-gray-700 rounded p-1 text-xs text-gray-300 focus:border-blue-500 outline-none" value={data.ipAddress || ''} onChange={(e) => setData({ ...data, ipAddress: e.target.value })} placeholder="0.0.0.0" />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-500 uppercase mb-1">MAC Address</label>
                                    <input className="w-full bg-[#111] border border-gray-700 rounded p-1 text-xs text-gray-300 focus:border-blue-500 outline-none" value={data.macAddress || ''} onChange={(e) => setData({ ...data, macAddress: e.target.value })} placeholder="00:00:..." />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-[10px] text-gray-500 uppercase mb-1">System</label>
                                    <input className="w-full bg-[#111] border border-gray-700 rounded p-1 text-xs text-gray-300 focus:border-blue-500 outline-none" value={data.system || ''} onChange={(e) => setData({ ...data, system: e.target.value })} placeholder="e.g. Audio Distribution" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-[10px] text-gray-500 uppercase mb-1">Sidebar Category</label>
                                    <input
                                        className="w-full bg-[#111] border border-gray-700 rounded p-1 text-xs text-gray-300 focus:border-blue-500 outline-none"
                                        value={data.subcat || ''}
                                        onChange={(e) => setData({ ...data, subcat: e.target.value })}
                                        placeholder="e.g. Network, Sources..."
                                        list="category-suggestions"
                                    />
                                    <datalist id="category-suggestions">
                                        <option value="Network" />
                                        <option value="Power" />
                                        <option value="Source" />
                                        <option value="Processor" />
                                        <option value="Amp" />
                                        <option value="accessory" />
                                    </datalist>
                                </div>
                            </div>
                        </div>

                        <div className="p-3 bg-gray-900 border-b border-gray-800 shrink-0">
                            <h3 className="text-xs font-bold text-gray-400 uppercase">Port Manager</h3>
                            <p className="text-[10px] text-gray-500 mt-1">Drag ports to image. Right-click on image to unmap.</p>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                            {/* INPUTS SECTION */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-bold text-green-400 uppercase">Inputs</span>
                                    <button onClick={() => handleAddNewPort(false)} className="text-[10px] bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded flex items-center gap-1"><Plus size={10} /> Add</button>
                                </div>
                                <div className="space-y-1">
                                    {data.inputs.map((p, idx) => {
                                        const isMapped = !!data.portMap?.[activeTab]?.[p.id];
                                        const typeColor = CABLE_TYPES[p.type]?.color || '#22c55e';
                                        const portNum = p.label.replace(/[^0-9]/g, '') || (idx + 1);
                                        return (
                                            <div key={p.id} className="flex items-center gap-2 bg-gray-900 p-1 rounded border border-gray-700">
                                                <div
                                                    draggable
                                                    onDragStart={(e) => { e.dataTransfer.setData('portId', p.id); e.dataTransfer.setData('type', 'new'); }}
                                                    className={`w-6 h-6 flex items-center justify-center rounded text-[10px] font-bold cursor-move shrink-0 ${isMapped ? 'bg-gray-700 text-gray-500' : 'text-white'}`}
                                                    style={!isMapped ? { backgroundColor: typeColor } : {}}
                                                    title="Drag to image"
                                                >
                                                    {portNum}
                                                </div>
                                                <input
                                                    className="bg-transparent border-none text-[10px] text-gray-300 w-full focus:outline-none"
                                                    value={p.label}
                                                    onChange={(e) => handlePortLabelChange(false, idx, e.target.value)}
                                                />
                                                <select
                                                    className="bg-[#111] text-[9px] text-gray-400 rounded border-none w-16"
                                                    value={p.type}
                                                    onChange={(e) => handlePortTypeChange(false, idx, e.target.value)}
                                                >
                                                    {Object.keys(CABLE_TYPES).map(t => <option key={t} value={t}>{t}</option>)}
                                                </select>
                                                <button onClick={() => handleRemovePort(false, idx)} className="text-red-500 hover:text-red-400"><Trash2 size={10} /></button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* OUTPUTS SECTION */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-bold text-blue-400 uppercase">Outputs</span>
                                    <button onClick={() => handleAddNewPort(true)} className="text-[10px] bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded flex items-center gap-1"><Plus size={10} /> Add</button>
                                </div>
                                <div className="space-y-1">
                                    {data.outputs.map((p, idx) => {
                                        const isMapped = !!data.portMap?.[activeTab]?.[p.id];
                                        const typeColor = CABLE_TYPES[p.type]?.color || '#3b82f6';
                                        const portNum = p.label.replace(/[^0-9]/g, '') || (idx + 1);
                                        return (
                                            <div key={p.id} className="flex items-center gap-2 bg-gray-900 p-1 rounded border border-gray-700">
                                                <div
                                                    draggable
                                                    onDragStart={(e) => { e.dataTransfer.setData('portId', p.id); e.dataTransfer.setData('type', 'new'); }}
                                                    className={`w-6 h-6 flex items-center justify-center rounded text-[10px] font-bold cursor-move shrink-0 ${isMapped ? 'bg-gray-700 text-gray-500' : 'text-white'}`}
                                                    style={!isMapped ? { backgroundColor: typeColor } : {}}
                                                    title="Drag to image"
                                                >
                                                    {portNum}
                                                </div>
                                                <input
                                                    className="bg-transparent border-none text-[10px] text-gray-300 w-full focus:outline-none"
                                                    value={p.label}
                                                    onChange={(e) => handlePortLabelChange(true, idx, e.target.value)}
                                                />
                                                <select
                                                    className="bg-[#111] text-[9px] text-gray-400 rounded border-none w-16"
                                                    value={p.type}
                                                    onChange={(e) => handlePortTypeChange(true, idx, e.target.value)}
                                                >
                                                    {Object.keys(CABLE_TYPES).map(t => <option key={t} value={t}>{t}</option>)}
                                                </select>
                                                <button onClick={() => handleRemovePort(true, idx)} className="text-red-500 hover:text-red-400"><Trash2 size={10} /></button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeviceEditorModal;
