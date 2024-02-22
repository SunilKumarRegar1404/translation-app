const express = require('express');
const axios = require('axios');

const app = express();
const port = 7000;

app.use(express.json());

app.post('/translate', async (req, res) => {
    const { text } = req.body;

    // Target language (French)
    const targetLanguage = 'fr';

    // Checking if 'text' key exists in the request body
    if (!text) {
        return res.status(400).json({ error: "Missing key 'text' in request body" });
    }

    const encodedParams = new URLSearchParams();
    encodedParams.set('source_language', 'en');
    encodedParams.set('target_language', targetLanguage);
    encodedParams.set('text', text);

    const options = {
        method: 'POST',
        url: 'https://text-translator2.p.rapidapi.com/translate',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': '720f5878cdmsh75b3ac0d939ac89p16b3a7jsn93d30602bd68',
            'X-RapidAPI-Host': 'text-translator2.p.rapidapi.com'
        },
        data: encodedParams,
    };

    try {
        const response = await axios.request(options);

        // Simplified response
        const customResponse = {
            translation: response.data.data.translatedText
        };

        res.json(customResponse);
    } catch (error) {
        console.error('Translation error:', error.response ? error.response.data : error.message);
        
        // Error handling
        let errorMessage = 'Translation error occurred';
        if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
        }

        res.status(500).json({ error: errorMessage });
    }
});

app.listen(port, () => {
    console.log(`Translation API listening at http://localhost:${port}`);
});
