const express = require('express');
const router = express.Router();
const Url = require('../models/Url')
const generateCode = require('../utils/generateCode')

router.post('/shorten', async (req, res) => {
    try {
        const raw = req.body.originalUrl;
        if (!raw || typeof raw !== 'string') {
            return res.status(400).json({ error: "Url is required" });
        }
        const originalUrl = raw.trim();

        let parsed;
        try {
            parsed = new URL(originalUrl);
        } catch (e) {
            return res.status(400).json({ error: 'Invalid URL format' });
        }

        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
            return res.status(400).json({ error: 'Only http and https URLs are allowed' });
        }

        for (let i = 0; i < 5; i++) {
            const shortCode = generateCode();
            try {
                const result = await Url.create({
                    originalUrl: originalUrl,
                    shortCode,
                });
                return res.status(201).json({
                    shortCode: result.shortCode,
                    shortUrl: `${process.env.BASE_URL}/${result.shortCode}`,
                    originalUrl: result.originalUrl,
                });
            } catch (err) {
                if (err.code !== 11000) throw err;
            }
        }
        return res.status(500).json({ error: 'Could not generate a unique code, try again' });
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;