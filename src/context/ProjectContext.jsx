import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_LIBRARY } from '../utils/constants';
import { generateId } from '../utils/common';

const ProjectContext = createContext();

export const useProject = () => {
    return useContext(ProjectContext);
};

export const ProjectProvider = ({ children }) => {
    // --- PERSISTENCE HELPERS ---
    const loadState = (key, defaultVal) => {
        try {
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : defaultVal;
        } catch (e) {
            console.error("Load failed", e);
            return defaultVal;
        }
    };

    // --- STATE ---
    const [library, setLibrary] = useState(() => loadState('prb_library', INITIAL_LIBRARY));
    const [racks, setRacks] = useState(() => loadState('prb_racks', [
        { id: 'rack-1', name: 'Rack 1', uHeight: 42, locked: false }
    ]));
    const [devices, setDevices] = useState(() => loadState('prb_devices', []));
    const [connections, setConnections] = useState(() => loadState('prb_connections', []));

    // UI State that needs to be global
    const [selectedDeviceIds, setSelectedDeviceIds] = useState([]);
    const [draggingItem, setDraggingItem] = useState(null);

    // --- PERSISTENCE EFFECTS ---
    useEffect(() => { localStorage.setItem('prb_library', JSON.stringify(library)); }, [library]);
    useEffect(() => { localStorage.setItem('prb_racks', JSON.stringify(racks)); }, [racks]);
    useEffect(() => { localStorage.setItem('prb_devices', JSON.stringify(devices)); }, [devices]);
    useEffect(() => { localStorage.setItem('prb_connections', JSON.stringify(connections)); }, [connections]);

    // --- ACTIONS ---

    // Rack Actions
    const addRack = () => {
        const newId = `rack-${Date.now()}`;
        setRacks([...racks, { id: newId, name: `Rack ${racks.length + 1}`, uHeight: 42, locked: false }]);
    };

    const removeRack = (id) => {
        setRacks(prev => {
            const rack = prev.find(r => r.id === id);
            if (rack && rack.locked) {
                alert("Rack is locked.");
                return prev;
            }
            setDevices(prevDevices => prevDevices.filter(d => d.rackId !== id));
            return prev.filter(r => r.id !== id);
        });
    };

    const updateRack = (id, updates) => {
        setRacks(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    };

    // Device Actions
    const addDevice = (device) => {
        setDevices(prev => [...prev, device]);
    };

    const updateDevice = (updatedDev) => {
        setDevices(prev => prev.map(d => d.id === updatedDev.id ? updatedDev : d));
    };

    const removeDevices = (ids) => {
        if (!ids || ids.length === 0) return;
        setDevices(prev => prev.filter(d => !ids.includes(d.id)));
        setConnections(prev => prev.filter(c => !ids.includes(c.fromDev) && !ids.includes(c.toDev)));
        setSelectedDeviceIds(prev => prev.filter(id => !ids.includes(id)));
    };

    const moveDevice = (deviceId, direction) => {
        const dev = devices.find(d => d.id === deviceId);
        if (!dev) return;

        const uNum = dev.uPosition;
        const rId = dev.rackId;

        const slotDevices = devices.filter(d => d.uPosition === uNum && d.rackId === rId);
        const sortedSlotDevices = slotDevices.sort((a, b) => devices.indexOf(a) - devices.indexOf(b));

        const indexInSlot = sortedSlotDevices.indexOf(dev);
        const targetIndex = indexInSlot + direction;

        if (targetIndex >= 0 && targetIndex < sortedSlotDevices.length) {
            const neighbor = sortedSlotDevices[targetIndex];
            const devIdx = devices.indexOf(dev);
            const neighborIdx = devices.indexOf(neighbor);
            const newDevices = [...devices];
            newDevices[devIdx] = neighbor;
            newDevices[neighborIdx] = dev;
            setDevices(newDevices);
        }
    };

    // Connection Actions
    const addConnection = (connection) => {
        setConnections(prev => [...prev, connection]);
    };

    const removeConnections = (ids) => {
        setConnections(prev => prev.filter(c => !ids.includes(c.id)));
    };

    // Library Actions
    const addToLibrary = (item) => {
        setLibrary(prev => [...prev, item]);
    };

    // Global Reset
    const resetAllData = () => {
        if (confirm('Reset all data to defaults? This cannot be undone.')) {
            localStorage.clear();
            window.location.reload();
        }
    };

    const value = {
        library,
        racks,
        devices,
        connections,
        selectedDeviceIds,
        setSelectedDeviceIds,
        draggingItem,
        setDraggingItem,
        addRack,
        removeRack,
        updateRack,
        addDevice,
        updateDevice,
        removeDevices,
        moveDevice,
        addConnection,
        removeConnections,
        addToLibrary,
        resetAllData,
        setDevices, // Exposed for advanced ops like drag-drop reordering
        setConnections,
        setRacks
    };

    return (
        <ProjectContext.Provider value={value}>
            {children}
        </ProjectContext.Provider>
    );
};
