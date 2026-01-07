
export const PPI = 25;
export const RACK_UNIT_COUNT = 42;
export const RACK_UNIT_HEIGHT = 1.75 * PPI;
export const RACK_WIDTH_PX = 23.5 * PPI;
export const RACK_FRAME_PAD_TOP = 52;
export const RACK_FRAME_PAD_BOTTOM = 53;
export const RACK_CONTENT_HEIGHT = RACK_UNIT_COUNT * RACK_UNIT_HEIGHT;
// Total height = content + padding, ensuring perfect alignment
export const RACK_TOTAL_HEIGHT_PX = RACK_CONTENT_HEIGHT + RACK_FRAME_PAD_TOP + RACK_FRAME_PAD_BOTTOM;

export const CABLE_TYPES = {
    XLR: { color: '#ef4444', label: 'XLR Audio', width: 4 },
    HDMI: { color: '#3b82f6', label: 'HDMI Video', width: 6 },
    DATA: { color: '#22c55e', label: 'Data', width: 3 },
    SPEAKER: { color: '#eab308', label: 'Speaker Wire', width: 5 },
    POWER: { color: '#9ca3af', label: 'Power (IEC)', width: 5 },
    RCA: { color: '#f97316', label: 'RCA', width: 3 },
    OPTICAL: { color: '#d946ef', label: 'Optical', width: 2 },
    COAX: { color: '#8B4513', label: 'Coax/SPDIF', width: 3 },
};

export const USW_STYLE = { background: '#333333', color: '#e5e5e5', border: '1px solid #404040' };

export const INITIAL_LIBRARY = [
    // --- GEAR: Network & Power ---
    {
        type: 'switch_ui', name: 'UniFi Pro Max 48 PoE', uHeight: 1, width: 1, category: 'gear', subcat: 'Network',
        style: USW_STYLE,
        images: { back: 'assets/Unifi-Rear.png' },
        inputs: [],
        outputs: []
    },
    {
        type: 'pdu', name: 'Rack PDU 6-Outlet', uHeight: 1, width: 1, category: 'gear', subcat: 'Power',
        style: USW_STYLE,
        images: { front: 'assets/pdu_front.png' },
        inputs: [],
        outputs: [
            { id: 'pdu-out-1', label: 'Outlet 1', type: 'POWER' },
            { id: 'pdu-out-2', label: 'Outlet 2', type: 'POWER' },
            { id: 'pdu-out-3', label: 'Outlet 3', type: 'POWER' },
            { id: 'pdu-out-4', label: 'Outlet 4', type: 'POWER' },
            { id: 'pdu-out-5', label: 'Outlet 5', type: 'POWER' },
            { id: 'pdu-out-6', label: 'Outlet 6', type: 'POWER' }
        ]
    },
    // --- GEAR: Sources ---
    {
        type: 'wiim', name: 'WiiM Pro', uHeight: 1, width: 0.33, category: 'gear', subcat: 'Source',
        style: USW_STYLE,
        images: { front: 'assets/Wiim_Front.png', back: 'assets/Wiim_Rear.png' },
        inputs: [],
        outputs: []
    },
    {
        type: 'bluesound', name: 'Bluesound NODE', uHeight: 1, width: 0.5, category: 'gear', subcat: 'Source',
        style: USW_STYLE,
        images: { front: 'assets/bluesound_front.png', back: 'assets/bluesound_rear.png' },
        inputs: [],
        outputs: []
    },
    {
        type: 'appletv', name: 'Apple TV 4K', uHeight: 1, width: 0.25, category: 'gear', subcat: 'Source',
        style: USW_STYLE,
        images: { back: 'assets/appletv_rear.png' },
        inputs: [],
        outputs: []
    },
    // --- GEAR: Processing ---
    {
        type: 'trinnov', name: 'Trinnov Altitude 32', uHeight: 4, width: 1, category: 'gear', subcat: 'Processor',
        style: USW_STYLE,
        images: {},
        inputs: [],
        outputs: []
    },
    {
        type: 'madvr', name: 'MadVR Envy Extreme', uHeight: 4, width: 1, category: 'gear', subcat: 'Video',
        style: USW_STYLE,
        images: {},
        inputs: [],
        outputs: []
    },
    // --- GEAR: Amplification (1U) ---
    {
        type: 'origin_proa125_1', name: 'Origin PROA125.1', uHeight: 1, width: 0.5, category: 'gear', subcat: 'Amp',
        style: USW_STYLE,
        images: { front: 'assets/PROA125-1.png' },
        inputs: [], outputs: []
    },
    {
        type: 'origin_proa125_2', name: 'Origin PROA125.2', uHeight: 1, width: 0.5, category: 'gear', subcat: 'Amp',
        style: USW_STYLE,
        images: { front: 'assets/PROA125-2.png' },
        inputs: [], outputs: []
    },
    {
        type: 'origin_proa125_4', name: 'Origin PROA125.4', uHeight: 1, width: 0.5, category: 'gear', subcat: 'Amp',
        style: USW_STYLE,
        images: { front: 'assets/PROA-125-4.png' },
        inputs: [], outputs: []
    },
    {
        type: 'origin_proa250_1', name: 'Origin PROA250.1', uHeight: 1, width: 0.5, category: 'gear', subcat: 'Amp',
        style: USW_STYLE,
        images: { front: 'assets/PROA 250-1.png' },
        inputs: [], outputs: []
    },
    {
        type: 'origin_proa250_2', name: 'Origin PROA250.2', uHeight: 1, width: 0.5, category: 'gear', subcat: 'Amp',
        style: USW_STYLE,
        images: { front: 'assets/PROA-250-2.png', back: 'assets/PROA-250-2R.png' },
        inputs: [], outputs: []
    },
    // --- GEAR: Amplification (2U) ---
    {
        type: 'origin_proa1000_1', name: 'Origin PROA1000.1', uHeight: 2, width: 1, category: 'gear', subcat: 'Amp',
        style: USW_STYLE,
        images: { front: 'assets/PROA1000-1_2.png', back: 'assets/Origin_ProAmp_2U_Rear.png' },
        inputs: [], outputs: []
    },
    {
        type: 'origin_proa1000_2', name: 'Origin PROA1000.2', uHeight: 2, width: 1, category: 'gear', subcat: 'Amp',
        style: USW_STYLE,
        images: { front: 'assets/PROA_1000-2.png', back: 'assets/Origin_ProAmp_2U_Rear.png' },
        inputs: [], outputs: []
    },
    {
        type: 'origin_proa1200_1', name: 'Origin PROA1200.1', uHeight: 2, width: 1, category: 'gear', subcat: 'Amp',
        style: USW_STYLE,
        images: { front: 'assets/PROA1200-1.png', back: 'assets/Origin_ProAmp_2U_Rear.png' },
        inputs: [], outputs: []
    },
    {
        type: 'origin_proa1200_2', name: 'Origin PROA1200.2', uHeight: 2, width: 1, category: 'gear', subcat: 'Amp',
        style: USW_STYLE,
        images: { front: 'assets/PROA_1200-2.png', back: 'assets/Origin_ProAmp_2U_Rear.png' },
        inputs: [], outputs: []
    },
    {
        type: 'origin_proa1200_4', name: 'Origin PROA1200.4', uHeight: 2, width: 1, category: 'gear', subcat: 'Amp',
        style: USW_STYLE,
        images: { front: 'assets/PROA-1200-4.png', back: 'assets/Origin_ProAmp_2U_Rear.png' },
        inputs: [], outputs: []
    },
    // --- ACCESSORIES ---
    {
        type: 'vented_panel_1u', name: 'Vented Panel (1U)', uHeight: 1, width: 1, category: 'accessory', inputs: [], outputs: [],
        style: {
            background: 'repeating-linear-gradient(90deg, #1a1a1a 0px, #1a1a1a 4px, #0a0a0a 5px, #0a0a0a 6px)',
            border: '1px solid #333'
        }
    },
    { type: 'blank_panel_1u', name: 'Blank Panel (1U)', uHeight: 1, width: 1, category: 'accessory', inputs: [], outputs: [], style: { background: '#1a1a1a', border: '1px solid #333' } },
    { type: 'blank_panel_2u', name: 'Blank Panel (2U)', uHeight: 2, width: 1, category: 'accessory', inputs: [], outputs: [], style: { background: '#1a1a1a', border: '1px solid #333' } },
    { type: 'blank_panel_half', name: 'Blank Panel (.5U)', uHeight: 1, width: 0.5, category: 'accessory', inputs: [], outputs: [], style: { background: '#1a1a1a', border: '1px solid #333' } },
    { type: 'drawer_3u', name: 'Drawer (3U)', uHeight: 3, width: 1, category: 'accessory', inputs: [], outputs: [], style: { background: '#1a1a1a', border: '1px solid #333' } },
    { type: 'drawer_4u', name: 'Drawer (4U)', uHeight: 4, width: 1, category: 'accessory', inputs: [], outputs: [], style: { background: '#1a1a1a', border: '1px solid #333' } },
    // --- GEAR: Media Servers ---
    {
        type: 'kaleidescape_strato', name: 'Kaleidescape Strato V', uHeight: 1, width: 0.5, category: 'gear', subcat: 'Video',
        style: USW_STYLE,
        images: {},
        inputs: [], outputs: []
    },
    {
        type: 'kaleidescape_terra', name: 'Kaleidescape Terra Prime', uHeight: 1, width: 0.5, category: 'gear', subcat: 'Video',
        style: USW_STYLE,
        images: {},
        inputs: [], outputs: []
    },
    // --- GEAR: Audio ---
    {
        type: 'shure_sldx4', name: 'Shure SLDX4 Mic Receiver', uHeight: 1, width: 0.5, category: 'gear', subcat: 'Source',
        style: USW_STYLE,
        images: {},
        inputs: [], outputs: []
    },
];
