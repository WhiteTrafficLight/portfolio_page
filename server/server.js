const express = require('express');
const cors = require('cors');
let fetch;

import('node-fetch').then(module => {
    fetch = module.default;
}).catch(err => {
    console.error('Failed to load node-fetch:', err);
});
const OpenAI = require('openai');

require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI();

// Endpoint to generate an image URL based on a prompt
app.post('/generate-image', async (req, res) => {
    const prompt = req.body.prompt;

    if (!prompt) {
        console.log("Prompt is missing");
        return res.status(400).send('Prompt is required');
    } else {
        console.log("Received prompt");
    }

    try {
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
            quality:"hd"
        });

        if (response.data && response.data.length > 0) {
            res.json({ imageUrl: response.data[0].url });
        } else {
            res.status(400).json({ error: "No images returned from the API." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Proxy endpoint to fetch the image
app.get('/fetch-image', async (req, res) => {
    const imageUrl = req.query.url;

    if (!imageUrl) {
        return res.status(400).send('Image URL is required');
    }

    try {
        const imageResponse = await fetch(imageUrl);
        const buffer = await imageResponse.buffer();

        res.set('Content-Type', imageResponse.headers.get('content-type'));
        res.send(buffer);
    } catch (error) {
        console.error('Failed to fetch image:', error);
        res.status(500).send('Failed to fetch image');
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
