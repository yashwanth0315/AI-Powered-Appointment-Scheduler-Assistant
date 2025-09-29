const ocrService = require('../services/ocrService');
const nlpService = require('../services/nlpService');
const fs = require('fs');

exports.createAppointment = async (req, res) => {
    try {
        let rawText = '';

        if (req.file) {
            // If an image is uploaded, use the OCR service
            const ocrResult = await ocrService.getTextFromImage(req.file.path);
            rawText = ocrResult.raw_text;
            // Clean up the uploaded file after processing
            fs.unlinkSync(req.file.path);
        } else if (req.body.text) {
            // If text is provided in the body, use it directly
            rawText = req.body.text;
        } else {
            return res.status(400).json({ error: 'Please provide either text or an image file.' });
        }

        if (!rawText) {
            return res.status(400).json({ error: 'Could not extract text from the provided input.' });
        }

        // Process the extracted text through the NLP service
        const appointmentData = nlpService.processText(rawText);
        
        // If the NLP service flags ambiguity, send a 422 status
        if (appointmentData.status === 'needs clarification') {
            return res.status(422).json(appointmentData);
        }

        res.status(200).json(appointmentData);

    } catch (error) {
        console.error('Error processing appointment request:', error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
};