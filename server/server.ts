// Import necessary modules using TypeScript syntax
import express, { Request, Response } from 'express';
import fetch from 'node-fetch';

const app = express();

interface ApiResponse {
    data: {
        url: string;
    }[];
}

// Define a route to handle image fetching
app.get('/fetch-image', async (req: Request, res: Response) => {
    const { prompt } = req.query;

    // Validate the prompt
    if (typeof prompt !== 'string' || prompt.length === 0) {
        return res.status(400).send('Prompt is required');
    }

    // Define the OpenAI API endpoint
    const endpoint = "https://api.openai.com/v1/images/generations";

    // Fetch the image from the OpenAI API
    try {
        const apiResponse = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer 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`
            },
            body: JSON.stringify({
                prompt: prompt,
                model: "dall-e-3",
                n: 1,
                size: "1024x1024",
                quality: "hd",
                response_format: "url"
            })
        });

        const apiData = (await apiResponse.json()) as ApiResponse;

        // Send the URL back to the frontend
        res.json({ imageUrl: apiData.data[0].url });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching image from OpenAI');
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
