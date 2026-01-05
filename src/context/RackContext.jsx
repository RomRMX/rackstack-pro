import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_LIBRARY } from '../data/inventory';

const RackContext = createContext();

export const useRackStack = () => {
    const context = useContext(RackContext);
    if (!context) {
        throw new Error('useRackStack must be used within a RackProvider');
    }
    return context;
};

export const RackProvider = ({ children }) => {
    const [library] = useState(INITIAL_LIBRARY);
    const [racks, setRacks] = useState(() => {
        // Load from local storage or default to one rack
        const saved = localStorage.getItem('rackstack_v2_racks');
        return saved ? JSON.parse(saved) : [{ id: 1, name: 'Main Rack', units: Array(42).fill(null) }];
    });

    useEffect(() => {
        localStorage.setItem('rackstack_v2_racks', JSON.stringify(racks));
    }, [racks]);

    const addRack = () => {
        setRacks(prev => [
            ...prev,
            { id: Date.now(), name: `Rack ${prev.length + 1}`, units: Array(42).fill(null) }
        ]);
    };

    const deleteRack = (rackId) => {
        if (racks.length <= 1) return; // Prevent deleting the last rack
        setRacks(prev => prev.filter(r => r.id !== rackId));
    };

    // Simplified placement logic (will be enhanced with DnD)
    const updateRackUnit = (rackId, unitIndex, device) => {
        setRacks(prev => prev.map(rack => {
            if (rack.id !== rackId) return rack;
            const newUnits = [...rack.units];

            // Handle multi-U devices
            if (device) {
                // Clear previous implementation if needed, for now just simple placement
                // Logic to be refined in components
            }
            newUnits[unitIndex] = device;
            return { ...rack, units: newUnits };
        }));
    };

    const updateDevice = (rackId, unitIndex, updatedDevice) => {
        setRacks(prev => prev.map(rack => {
            if (rack.id !== rackId) return rack;
            const newUnits = [...rack.units];
            newUnits[unitIndex] = updatedDevice;
            return { ...rack, units: newUnits };
        }));
    };

    // Connections State: Array of { id, from: { rackId, uIndex, portId }, to: { rackId, uIndex, portId }, type }
    const [connections, setConnections] = useState(() => {
        const saved = localStorage.getItem('rackstack_connections');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('rackstack_connections', JSON.stringify(connections));
    }, [connections]);

    const addConnection = (newConnection) => {
        const id = crypto.randomUUID();
        setConnections(prev => [...prev, { ...newConnection, id }]);
    };

    const removeConnection = (connectionId) => {
        setConnections(prev => prev.filter(c => c.id !== connectionId));
    };

    const value = {
        library,
        racks,
        setRacks,
        addRack,
        deleteRack,
        updateRackUnit,
        updateDevice,
        connections,
        addConnection,
        removeConnection
    };

    return (
        <RackContext.Provider value={value}>
            {children}
        </RackContext.Provider>
    );
};
