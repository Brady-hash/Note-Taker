const router = require('express').Router();
const fs = require('fs').promises; // Import the fs promises API
const { v4: uuidv4 } = require('uuid');

// GET route to retrieve all stored notes
router.get('/', async (req, res) => {
    try {
        const data = await fs.readFile('db/db.json', 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error reading data" });
    }
});

router.post('/', async (req, res) => {
    const { title, text } = req.body;

    if (title && text) {
        const newNote = { title, text, id: uuidv4() };

        try {
            const data = await fs.readFile('db/db.json', 'utf8');
            const parsedData = JSON.parse(data);
            parsedData.push(newNote);

            await fs.writeFile('db/db.json', JSON.stringify(parsedData, null, 4));
            res.json(newNote);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error writing data" });
        }
    } else {
        res.status(400).json({ error: "Please provide title and text for the note" });
    }
});

module.exports = router;