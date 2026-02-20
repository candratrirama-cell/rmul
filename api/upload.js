const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');

const upload = multer({ storage: multer.memoryStorage() });
const KEY = "4e4078cc0bc45e87278962e00b183fd8";

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.method !== 'POST') return res.status(405).json({ message: 'Use POST' });

    upload.single('image')(req, res, async (err) => {
        if (err || !req.file) return res.status(400).json({ status: false, message: "No image" });

        try {
            const form = new FormData();
            form.append('image', req.file.buffer.toString('base64'));
            
            const response = await axios.post(`https://api.imgbb.com/1/upload?key=${KEY}`, form, {
                headers: form.getHeaders()
            });

            res.status(200).json({
                status: true,
                creator: "Romash AI Gen 2",
                data: { url: response.data.data.url }
            });
        } catch (e) {
            res.status(500).json({ status: false, message: "Error" });
        }
    });
}

export const config = { api: { bodyParser: false } };
