require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const urlRoutes = require('./routes/urlRoutes');
const Url = require('./models/Url')


const app = express();

app.use(express.json())
app.use(cors({ origin: process.env.FRONTEND_URL }))

app.use('/api', urlRoutes);

app.get('/:shortCode', async (req, res) => {
    try {
        console.log('GET route chala', req.params.shortCode)
        const shortCode  = req.params.shortCode;
        const doc = await Url.findOne({ shortCode });

        if (!doc) {
            return res.status(404).json({ error: 'Link not found' });
        }

        await Url.updateOne({ _id: doc._id }, { $inc: { clicks: 1 } });
        return res.redirect(302, doc.originalUrl);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ error: 'Server error' });
    }
});



mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected');
        app.listen(process.env.PORT || 5000, () => console.log('server run successfully'));
    })
    .catch(err => {
        console.log(err);
        process.exit(1);
    });