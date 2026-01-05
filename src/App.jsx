import React, { useState } from 'react';
import { RackProvider, useRackStack } from './context/RackContext';
import MainLayout from './layouts/MainLayout';
import DeviceLibrary from './components/library/DeviceLibrary';
import RackView from './features/rack/RackView';
import LineView from './features/line/LineView';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('library');
  const [view, setView] = useState('rack');
  const { updateRackUnit } = useRackStack();
  const [activeDragDevice, setActiveDragDevice] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragStart = (event) => {
    if (event.active.data.current?.device) {
      setActiveDragDevice(event.active.data.current.device);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveDragDevice(null);

    if (!over) return;

    // Dropping from Library to Rack Place
    if (active.data.current?.source === 'library' && over.data.current?.type === 'slot') {
      const device = active.data.current.device;
      const { rackId, uIndex } = over.data.current;
      updateRackUnit(rackId, uIndex, device);
    }
  };

  const SidebarContent = (
    <>
      <div className="flex border-b border-[#27272a] bg-[#09090b]">
        <button
          className={`flex-1 py-3 text-xs font-medium transition-colors ${activeTab === 'library' ? 'text-blue-400 border-b-2 border-blue-500 bg-[#18181b]' : 'text-zinc-500 hover:text-zinc-300'}`}
          onClick={() => setActiveTab('library')}
        >
          DEVICES
        </button>
        <button
          className={`flex-1 py-3 text-xs font-medium transition-colors ${activeTab === 'racks' ? 'text-blue-400 border-b-2 border-blue-500 bg-[#18181b]' : 'text-zinc-500 hover:text-zinc-300'}`}
          onClick={() => setActiveTab('racks')}
        >
          RACKS
        </button>
      </div>
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'library' ? <DeviceLibrary /> : (
          <div className="p-4 space-y-2 overflow-y-auto">
            <button
              onClick={() => setView('rack')}
              className={`w-full py-2 text-xs font-bold rounded border ${view === 'rack' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-[#18181b] border-[#27272a] text-zinc-400 hover:border-zinc-500'}`}
            >
              RACK BUILDER
            </button>
            <button
              onClick={() => setView('line')}
              className={`w-full py-2 text-xs font-bold rounded border ${view === 'line' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-[#18181b] border-[#27272a] text-zinc-400 hover:border-zinc-500'}`}
            >
              LINE SCHEMATIC
            </button>
          </div>
        )}
      </div>
    </>
  );

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <MainLayout sidebar={SidebarContent}>
        {view === 'rack' ? <RackView /> : <LineView />}
      </MainLayout>
      <DragOverlay>
        {activeDragDevice ? (
          <div className="p-2 bg-zinc-800 rounded shadow-xl border border-zinc-600 opacity-80 w-48 pointer-events-none">
            <div className="text-xs font-bold text-white">{activeDragDevice.name}</div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

function App() {
  return (
    <RackProvider>
      <AppContent />
    </RackProvider>
  );
}

export default App;
