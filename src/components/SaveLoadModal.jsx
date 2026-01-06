
import React, { useState, useEffect } from 'react';
import { X, Save, Download, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function SaveLoadModal({ isOpen, onClose, mode, currentData, onLoad }) {
    const [name, setName] = useState('');
    const [configs, setConfigs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && mode === 'load') {
            fetchConfigs();
        } else if (isOpen && mode === 'save') {
            setName(''); // Reset name on open
        }
        setError(null);
    }, [isOpen, mode]);

    const fetchConfigs = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('rack_configurations')
                .select('id, name, description, created_at')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setConfigs(data || []);
        } catch (err) {
            console.error('Error fetching configs:', err);
            setError('Failed to load configurations.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!name.trim()) return;
        setLoading(true);
        try {
            // Check if name exists to confirm overwrite? 
            // For simplicity, just insert new for now, or update if we had an ID.
            // But we don't track current ID yet. Let's just insert new.
            const { error } = await supabase
                .from('rack_configurations')
                .insert([
                    {
                        name: name,
                        data: currentData,
                        description: `Saved on ${new Date().toLocaleDateString()}`
                    }
                ]);

            if (error) throw error;
            onClose();
            alert('Configuration saved successfully!');
        } catch (err) {
            console.error('Error saving config:', err);
            setError('Failed to save configuration.');
        } finally {
            setLoading(false);
        }
    };

    const handleLoad = async (id) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('rack_configurations')
                .select('data')
                .eq('id', id)
                .single();

            if (error) throw error;
            if (data && data.data) {
                onLoad(data.data);
                onClose();
            }
        } catch (err) {
            console.error('Error loading config:', err);
            setError('Failed to load configuration data.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this configuration?')) return;

        try {
            const { error } = await supabase
                .from('rack_configurations')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchConfigs(); // Refresh list
        } catch (err) {
            console.error('Error deleting config:', err);
            setError('Failed to delete configuration.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-[#1a1a1a] border border-[#333] rounded-lg shadow-2xl w-[500px] flex flex-col max-h-[80vh] text-gray-200 font-sans">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-[#333] bg-[#222] rounded-t-lg">
                    <h3 className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        {mode === 'save' ? <Save size={18} className="text-blue-500" /> : <Download size={18} className="text-green-500" />}
                        {mode === 'save' ? 'Save Configuration' : 'Load Configuration'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    {error && (
                        <div className="mb-4 p-3 bg-red-900/30 border border-red-800 text-red-200 text-sm rounded flex items-center gap-2">
                            <span className="font-bold">Error:</span> {error}
                        </div>
                    )}

                    {loading && (
                        <div className="flex justify-center items-center py-8 text-gray-400">
                            <Loader2 className="animate-spin mr-2" /> Processing...
                        </div>
                    )}

                    {!loading && mode === 'save' && (
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Configuration Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="e.g., Main Rack Setup v1"
                                    className="w-full bg-[#111] border border-[#333] text-white px-3 py-2 rounded focus:outline-none focus:border-blue-500 transition-colors"
                                    autoFocus
                                />
                            </div>
                            <div className="text-xs text-gray-500">
                                This will save your current racks, devices, and connections to the cloud.
                            </div>
                            <button
                                onClick={handleSave}
                                disabled={!name.trim()}
                                className={`mt-2 py-2 px-4 rounded font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${name.trim()
                                        ? 'bg-blue-600 hover:bg-blue-500 text-white'
                                        : 'bg-[#333] text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                <Save size={16} /> Save Now
                            </button>
                        </div>
                    )}

                    {!loading && mode === 'load' && (
                        <div className="flex flex-col gap-2">
                            {configs.length === 0 ? (
                                <div className="text-center text-gray-500 py-8 italic">
                                    No saved configurations found.
                                </div>
                            ) : (
                                configs.map(cfg => (
                                    <div
                                        key={cfg.id}
                                        onClick={() => handleLoad(cfg.id)}
                                        className="group p-3 bg-[#111] border border-[#333] rounded hover:border-blue-500 hover:bg-[#222] cursor-pointer transition-all flex justify-between items-center"
                                    >
                                        <div>
                                            <div className="font-bold text-gray-200 group-hover:text-white transition-colors">
                                                {cfg.name}
                                            </div>
                                            <div className="text-[10px] text-gray-500 mt-1">
                                                {new Date(cfg.created_at).toLocaleString()}
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => handleDelete(cfg.id, e)}
                                            className="p-2 text-gray-600 hover:text-red-500 hover:bg-[#111] rounded transition-colors opacity-0 group-hover:opacity-100"
                                            title="Delete Configuration"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
