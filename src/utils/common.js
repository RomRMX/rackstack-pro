
export const generateId = () => Math.random().toString(36).substr(2, 9);

// --- AI Services ---

export const callGeminiText = async (prompt) => {
    const apiKey = "";
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            }
        );
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text;
    } catch (error) {
        console.error("AI Text Error:", error);
        return null;
    }
};

export const callGeminiVision = async (base64Image, prompt) => {
    const apiKey = "";
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: prompt },
                            { inlineData: { mimeType: "image/png", data: base64Image.split(',')[1] } }
                        ]
                    }],
                    generationConfig: { responseMimeType: "application/json" }
                })
            }
        );
        const data = await response.json();
        return JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text);
    } catch (error) {
        console.error("AI Vision Error:", error);
        return null;
    }
};
