const { createWorker } = require('tesseract.js');

const getTextFromImage = async (filePath) => {
    const worker = await createWorker('eng');
    const ret = await worker.recognize(filePath);
    await worker.terminate();
    
    // Format the output as specified in the problem statement
    return {
        raw_text: ret.data.text.trim().replace(/\n/g, ' '),
        confidence: ret.data.confidence / 100, // Convert confidence to a 0-1 scale
    };
};

module.exports = { getTextFromImage };